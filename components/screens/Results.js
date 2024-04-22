import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { fetchDataSymptoms } from '../database/SymptomsDatabase';
import { fetchAllDataDailyActivities } from '../database/DailyActivitiesDatabase';
import { useEffect, useState } from 'react';

export default function Results({navigation}) {
  const [symptoms, setSymptoms] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDataSymptoms(result => setSymptoms(result));
    fetchAllDataDailyActivities(result => setActivities(result));
  }, []);

  const showData = () => {
    console.log(symptoms);
    console.log(activities);
  } 
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button title="Data" onPress={showData} />
      <TouchableOpacity style={styles.resultsButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuText}>HOME</Text>
      </TouchableOpacity>
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
  menuText:{
    color: 'white',
    fontSize: 17,
    fontWeight: '300',
  },
  resultsButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'grey',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  
});
