import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
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
            style={{ padding: 10, backgroundColor: symptomsIntensity[item.symptom] === intensity ? 'blue' : 'grey', borderRadius: 5, margin: 10 }}
            onPress={() => handleIntensityChange(item.symptom, intensity)}
        >
            <Text style={{ color: 'white' }}>{intensity}</Text>
        </TouchableOpacity>
    ));

    return (
      <View>
        <Text>{item.symptom}</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          {gradeButtons}
        </View>
        <TextInput
                    value={symptomComments[item.symptom] || ''}
                    onChangeText={comment => handleCommentChange(item.symptom, comment)}
                    placeholder="Enter comment"
                    style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 5, marginTop: 5 }}
                    multiline={true}
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
      
      {console.log(currentSymptomIndex)}
      {renderQuestion(sortedSymptoms[currentSymptomIndex])}
          
          
          <TouchableOpacity 
            onPress={goToPreviousSymptom}
            disabled={currentSymptomIndex === 0}
            style={[
              {
                  padding: 10,
                  borderRadius: 5,
                  margin: 10,
                  backgroundColor: currentSymptomIndex=== 0 ? 'lightgrey' : 'grey' ,
              },
          ]}
          >
            <Text style={{color: 'white' }}>Précédent</Text>
          </TouchableOpacity>
          {console.log(symptomsIntensity)}
          <TouchableOpacity 
            onPress={goToNextSymptom}
            disabled={Object.keys(symptomsIntensity).length === currentSymptomIndex || (currentSymptomIndex === sortedSymptoms.length - 1)}
            style={[
              {
                  padding: 10,
                  borderRadius: 5,
                  margin: 10,
                  backgroundColor: Object.keys(symptomsIntensity).length === currentSymptomIndex || currentSymptomIndex === sortedSymptoms.length - 1  ? 'lightgrey' : 'grey' ,
              },
          ]}
          >
            <Text style={{ color: 'white' }}>Suivant</Text>
          </TouchableOpacity>
          <Button title="Save" onPress={saveAnswersToDatabase} />
          <Button title="Data" onPress={() => console.log(data)} />

      <FlatList
        data={sortedSymptoms}
        renderItem={({ item }) => (
          <Text>{item.symptom}: {item.intensity}</Text>
        )}
        keyExtractor={(item) => item.symptom}
      />

      
      
   
    
      <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.bottomButtonText}>HOME</Text>
      </TouchableOpacity>
    </View>
  );
}


