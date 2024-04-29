import { Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import {fetchDataDailyActivities} from '../../database/DailyActivitiesDatabase';

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

export default function Activities({navigation}) {
    const [dailyActivitiesList, setDailyActivitiesList] = useState([]);
    const date = getDate();

    useEffect(() => {
      fetchDataDailyActivities(date, (result) => setDailyActivitiesList(result));
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={dailyActivitiesList}
                renderItem={({item}) => (
                    <View>
                        <Text>{item.activity}</Text>
                        <Text>{item.category}</Text>
                        <Text>{item.duration}</Text>
                        <Text>{item.comment}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{marginBottom:50}}>
                <Text>Retour à l'accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddActivities')} style={{marginBottom:50}}>
                <Text>Ajouter une activité</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 50,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      width: '100%',
      color: 'grey',
    },
    crashButton: {
      position: 'absolute',
      top: 100,
      backgroundColor: 'white', // Change background color to white
      borderColor: 'grey', // Add border color
      borderWidth: 1, // Add border width
      borderRadius: 8, // Add border radius for rounded corners
      shadowColor: '#000', // Add shadow color
      shadowOffset: { width: 0, height: 2 }, // Add shadow offset
      shadowOpacity: 0.25, // Add shadow opacity
      shadowRadius: 4, // Add shadow radius
      elevation: 5, // Add elevation for Android shadow
      width: '80%', // Adjust width
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
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
    hasCrashed: {
      backgroundColor: '#8B0000', // Change background color to red
    },
    buttonText: {
      fontSize: 20, // Adjust font size
      fontWeight: 'bold', // Add bold font weight
      color: 'black', // Change text color to black
    },
    menuText:{
      color: 'white',
      fontSize: 17,
      fontWeight: '300',
    },
    bgFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 7, // Match border radius
    },
  });