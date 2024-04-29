import { Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import {fetchDataDailyActivities} from '../database/DailyActivitiesDatabase';
import styles from '../styles/style';

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

