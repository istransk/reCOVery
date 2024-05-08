import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput, Platform, TouchableWithoutFeedback, Keyboard, Modal, ScrollView } from 'react-native';
import { useEffect, useState} from 'react';
import { fetchDataSymptoms } from '../database/SymptomsDatabase';
import styles from '../styles/Style';
import { insertDataDailySymptoms, fetchDataDailySymptoms } from '../database/DailySymptomsDatabase';
import { AntDesign } from '@expo/vector-icons';


function getDate() {
  return new Date().toISOString().split('T')[0];
}

export default function Questionnaire({navigation}) {
  const [symptoms, setSymptoms] = useState([]);
  const [sortedSymptoms, setSortedSymptoms] = useState([]);
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [symptomsIntensity, setSymptomsIntensity] = useState({});
  const [symptomComments, setSymptomComments] = useState({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const [data, setData] = useState([]);
  const date = getDate();
  const [textInputFocus, setTextInputFocus] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    fetchDataSymptoms(result => setSymptoms(result));
    fetchDataDailySymptoms(result => setData(result));
  }, []);

  useEffect(() => {
    if (symptoms) {
      console.log(symptoms);
    } else {
      console.log('No symptoms');
    }
    // Filter out symptoms with intensity 0 exept for "Sommeil"
    const filteredSymptoms = symptoms.filter(item => item.intensity !== 0 || item.symptom === "Sommeil");
    // Sort symptoms by intensity in descending order
    setSortedSymptoms(filteredSymptoms.sort((a, b) => b.intensity - a.intensity));
  } , [symptoms]);

  //to dimiss keyboard when clicking outside of text input
  const handleBackgroundPress = () => {
    if (textInputFocus) {
      Keyboard.dismiss();
      setTextInputFocus(false);
    }
  };

  const goToNextSymptom = () => {
    if (currentSymptomIndex < sortedSymptoms.length - 1) {
      setCurrentSymptomIndex(currentSymptomIndex + 1);
      if (currentSymptomIndex === sortedSymptoms.length - 2) {
        setIsDone(true);
      }
    }
    
  };

  const goToPreviousSymptom = () => {
    if (currentSymptomIndex > 0) {
      setCurrentSymptomIndex(currentSymptomIndex - 1);
    }
  };

  const handleIntensityChange = (symptomId, intensity) => {
    setHasAnswered(true);
    setSymptomsIntensity(prevState => ({
        ...prevState,
        [symptomId]: intensity
    }));
  };

  const handleCommentChange = (symptom, comment) => {
    setSymptomComments(prevState => ({
        ...prevState,
        [symptom]: comment
    }));
  };

  renderQuestion = (item) => {
    if (item){
      const gradeButtons = [0, 1, 2, 3].map(intensity => (
        <TouchableOpacity
            key={intensity}
            style={{ padding: 20, backgroundColor: symptomsIntensity[item.id] === intensity ? '#171412' : '#72665A', borderRadius: 5, margin: 10 }}
            onPress={() => handleIntensityChange(item.id, intensity)}
        >
            <Text style={styles.buttonText}>{intensity}</Text>
        </TouchableOpacity>
    ));

    return (
      <View style={{flex: 1, marginBottom: 200, justifyContent: 'space-around',}}>
        <View style={styles.containerQuestions}>
          <TouchableOpacity 
            onPress={goToPreviousSymptom}
            disabled={currentSymptomIndex === 0}
          >
            {currentSymptomIndex === 0 ? 
              <AntDesign name="arrowleft" size={35} color={'#dcc1a7'} /> : 
              <AntDesign name="arrowleft" size={35} color={"black"} />
            }
          </TouchableOpacity>
          <View style={{width:'70%'}}>
            <Text style={styles.symptomText}>{item.symptom}</Text>
          </View>
          <TouchableOpacity 
            onPress={goToNextSymptom}
            disabled={Object.keys(symptomsIntensity).length === currentSymptomIndex || (currentSymptomIndex === sortedSymptoms.length - 1)}
          >
            {currentSymptomIndex === sortedSymptoms.length -1 ? 
            <AntDesign name="arrowright" size={35} color={'#dcc1a7'} /> :
            <AntDesign name="arrowright" size={35} color={Object.keys(symptomsIntensity).length === currentSymptomIndex ? "rgba(128, 128, 128, 0.4)" :  "black"} />
            }
          </TouchableOpacity>
        </View>
        <View style={styles.gradeButtonContainer}>
          {gradeButtons}
        </View>
        <TextInput
                    value={symptomComments[item.symptom] || ''}
                    onChangeText={comment => handleCommentChange(item.symptom, comment)}
                    placeholder="Commentaire"
                    style={styles.commentInput}
                    multiline={true}
                    selectionColor={'#72665A'}
                    onFocus={() => setTextInputFocus(true)}
                    onBlur={() => setTextInputFocus(false)}
        />
      </View>
    );
    }
  };

  const ProgressIndicator = () => {
    return (
      <View style={styles.progressContainer}>
        {sortedSymptoms.map((symptom, index) => {
          const isAnswered = symptomsIntensity.hasOwnProperty(symptom.id);
          const isActive = index === currentSymptomIndex;
          const dotSize = isActive ? 13 : 6;
          const dotColor = isAnswered ? '#171412' : 'rgba(128, 128, 128, 0.5)';
  
          return (
            <View
              key={index}
              style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: dotColor }]}
            />
          );
        })}
      </View>
    );
  };

  const saveAnswersToDatabase = () => {
    Object.keys(symptomsIntensity).forEach(symptomId => {
      insertDataDailySymptoms(symptomId, symptomsIntensity[symptomId], date, symptomComments[symptomId]);
    });
    navigation.navigate('Home');
  };

  

  return (
    <View style={styles.container}>
      <Modal 
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.text}>
                  Note tes symptômes de 0 à 3{"\n"}
                  0 = pas de symptôme, {"\n"}
                  1 = symptôme léger, n'a pas affecté ta journée{"\n"}
                  2 = Symptôme modéré, a affecté ta journée dans une certaine mesure {"\n"}
                  3 = Symptôme sévère, a perturbé ta journée {"\n"}
                  {"\n"}
                  {<AntDesign name="arrowleft" size={18} color={'black'} />}{<AntDesign name="arrowright" size={18} color={'black'} />}
                  Te permet de passer d'une question à l'autre. {"\n"}
                  Attention, tu ne peux passer à la question suivante qu'une fois que tu as indiqué noté la symptôme.{"\n"}
                  {"\n"}
                  Écris un commentaire si tu le souhaites.{"\n"}
                  {"\n"}
                  Lorsque tu as terminé le questionnaire, le bouton "Terminer" apparaît en bas. Appuie dessus pour le terminer{"\n"}
                  {"\n"}
                  Retourne à l'accueil en appuyant sur le bouton "ACCUEIL". {"\n"}
                </Text>
              </ScrollView>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
       <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View 
          style={styles.contentContainer}
          onPress={handleBackgroundPress}
        >
          <ProgressIndicator />
          <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
            <AntDesign name="questioncircleo" size={24} color="black" />
          </TouchableOpacity>
          {renderQuestion(sortedSymptoms[currentSymptomIndex])}
          
          
          {(isDone) && (Object.keys(symptomsIntensity).length > currentSymptomIndex) ? (
            <View style={styles.savedButtonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={saveAnswersToDatabase}>
                  <Text style={styles.buttonText}>Terminer</Text>
              </TouchableOpacity>
            </View>
          ) : <View style={styles.savedButtonContainer}></View> }     
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.bottomButtonText}>ACCUEIL</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
    </View>
  );
}


