import { Text, View, StyleSheet, FlatList, TouchableOpacity, Platform} from 'react-native';
import { useEffect, useState } from 'react';
import {fetchDataDailyActivities} from '../../database/DailyActivitiesDatabase';
import styles from '../../styles/Style';

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
          <View style={styles.contentContainer}>
            <View style={styles.contentList}>
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
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddActivities')}>
                <Text style={styles.buttonText}>Ajouter une activité</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.bottomButtonText}>ACCUEIL</Text>
            </TouchableOpacity>
          </View>
          {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
        </View>
    );
}
