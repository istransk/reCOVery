import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useEffect, useState} from 'react';
import { fetchDataSymptoms } from '../database/SymptomsDatabase';
import styles from '../styles/Style';
import { insertDataDailySymptoms, fetchDataDailySymptoms } from '../database/DailySymptomsDatabase';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  if (month < 10 && date < 10) {
    return `${year}-0${month}-0${date}`;
  } else if (month < 10) {
    return `${year}-0${month}-${date}`;
  } else if (date < 10) {
    return `${year}-${month}-0${date}`;
  } else {
    return `${year}-${month}-${date}`;
  }
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

  const handleBackgroundPress = () => {
    if (textInputFocus) {
      Keyboard.dismiss();
      setTextInputFocus(false);
    }
    console.log('Background pressed');
  };

  const goToNextSymptom = () => {
    if (currentSymptomIndex < sortedSymptoms.length - 1) {
      setCurrentSymptomIndex(currentSymptomIndex + 1);
      console.log(Object.keys(symptomsIntensity).length === 0);
    }
  };

  const goToPreviousSymptom = () => {
    if (currentSymptomIndex > 0) {
      setCurrentSymptomIndex(currentSymptomIndex - 1);
    }
  };

  const handleIntensityChange = (symptom, intensity) => {
    setHasAnswered(true);
    setSymptomsIntensity(prevState => ({
        ...prevState,
        [symptom]: intensity
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
            style={{ padding: 20, backgroundColor: symptomsIntensity[item.symptom] === intensity ? '#171412' : '#72665A', borderRadius: 5, margin: 10 }}
            onPress={() => handleIntensityChange(item.symptom, intensity)}
        >
            <Text style={styles.buttonText}>{intensity}</Text>
        </TouchableOpacity>
    ));

    return (
      <View >
        <Text style={styles.symptomText}>{item.symptom}</Text>
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

  const saveAnswersToDatabase = () => {
    Object.keys(symptomsIntensity).forEach(symptom => {
      insertDataDailySymptoms(symptom, symptomsIntensity[symptom], date, symptomComments[symptom]);
    });
  };

  

  return (
    <View style={styles.container}>
       <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View 
          style={styles.contentContainer}
          onPress={handleBackgroundPress}
        >
          {renderQuestion(sortedSymptoms[currentSymptomIndex])}
              
          <View style={styles.buttonRow}>    
              <TouchableOpacity 
                onPress={goToPreviousSymptom}
                disabled={currentSymptomIndex === 0}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Précédent</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={goToNextSymptom}
                disabled={Object.keys(symptomsIntensity).length === currentSymptomIndex || (currentSymptomIndex === sortedSymptoms.length - 1)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
              
          </View>
          <TouchableOpacity style={styles.button} onPress={saveAnswersToDatabase}>
                <Text style={styles.buttonText}>Terminer</Text>
              </TouchableOpacity>
              {currentSymptomIndex === sortedSymptoms.length - 1 && (
              <TouchableOpacity style={styles.button} onPress={saveAnswersToDatabase}>
                <Text style={styles.buttonText}>Terminer</Text>
              </TouchableOpacity>
          )}      
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.bottomButtonText}>HOME</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
    </View>
  );
}


