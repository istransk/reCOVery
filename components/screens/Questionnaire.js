import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState} from 'react';
import SymptomsDatabase from '../database/SymptomsDatabase';

export default function Questionnaire({navigation}) {
  const {fetchDataSymptoms, symptoms} = SymptomsDatabase();
  const [sortedSymptoms, setSortedSymptoms] = useState([]);
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [symptomsIntensity, setSymptomsIntensity] = useState({});

  useEffect(() => {
    fetchDataSymptoms();
  }, []);

  useEffect(() => {
    if (symptoms) {
      console.log(symptoms);
    }
    // Filter out symptoms with intensity 0 exept for "Sommeil"
    const filteredSymptoms = symptoms.filter(item => item.intensity !== 0 || item.symptom === "Sommeil");
    // Sort symptoms by intensity in descending order
    setSortedSymptoms(filteredSymptoms.sort((a, b) => b.intensity - a.intensity));
  } , [symptoms]);

  

  const goToNextSymptom = () => {
    if (currentSymptomIndex < sortedSymptoms.length - 1) {
      setCurrentSymptomIndex(currentSymptomIndex + 1);
    }
  };

  const goToPreviousSymptom = () => {
    if (currentSymptomIndex > 0) {
      setCurrentSymptomIndex(currentSymptomIndex - 1);
    }
  };

  const handleIntensityChange = (symptom, intensity) => {
    setSymptomsIntensity(prevState => ({
        ...prevState,
        [symptom]: intensity
    }));
  };

  renderQuestion = (item) => {
    if (item){
      const gradeButtons = [0, 1, 2, 3].map(intensity => (
        <TouchableOpacity
            key={intensity}
            style={{ padding: 5, backgroundColor: symptomsIntensity[item.symptom] === intensity ? 'blue' : 'grey', borderRadius: 5, margin: 2 }}
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
      </View>
    );
    }
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={symptoms}
        renderItem={({ item }) => (
          <Text>{item.symptom}: {item.intensity}</Text>
        )}
        keyExtractor={(item) => item.symptom}
      />
      {renderQuestion(sortedSymptoms[currentSymptomIndex])}
          
          <TouchableOpacity onPress={goToPreviousSymptom}>
            <Text>Précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextSymptom}>
            <Text>Suivant</Text>
          </TouchableOpacity>
             
      <FlatList
        data={sortedSymptoms}
        renderItem={({ item }) => (
          <Text>{item.symptom}: {item.intensity}</Text>
        )}
        keyExtractor={(item) => item.symptom}
      />
      
   
      <View style={styles.buttonContainer}>
        <Button title="Retour" onPress={() => navigation.navigate('Home')} color={'grey'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  
});
