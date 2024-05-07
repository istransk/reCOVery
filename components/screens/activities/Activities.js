import { Text, View, FlatList, TouchableOpacity, Platform, SafeAreaView} from 'react-native';
import { useState, useCallback, Fragment, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {fetchDataDailyActivities} from '../../database/DailyActivitiesDatabase';
import { Feather,  AntDesign } from '@expo/vector-icons';
import { decryption } from '../../utils/encryption';
import styles from '../../styles/Style';
import { KeyContext } from '../../contexts/KeyContext';

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
    const key = useContext(KeyContext);
    const [dailyActivitiesList, setDailyActivitiesList] = useState([]);
    const date = getDate();
    const [showFullComment, setShowFullComment] = useState({});
    const [isTooLong, setIsTooLong] = useState(false);
    const [comment, setComment] = useState(null);

    const toggleComment = (activity) => {
      setShowFullComment((prevState) => ({
        ...prevState,
        [activity]: !prevState[activity],
      }));
    };

    useFocusEffect(
      useCallback(() => {
        fetchDataDailyActivities(date, (result) => setDailyActivitiesList(result));
        console.log(dailyActivitiesList);
      }, [])
    );

    

    const renderItem = ({ item }) => {
      const duration = decryption(item.duration,key);
      const comment = decryption(item.comment, key);
      let truncatedComment = "";
      if (comment !== null) {
        truncatedComment = comment.slice(0, 23);
        if (comment.length > 23) {
          truncatedComment += '...';
        }
      }
      
      return (
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>{item.activity}</Text>
          <Text style={styles.durationText}>Durée: {duration} minutes</Text>
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>
              Commentaire: {showFullComment[item.activity] ? comment : truncatedComment }
            </Text>
            {(comment !== null) && (comment.length > 23) && (
                <TouchableOpacity style={styles.iconContainer} onPress={() => toggleComment(item.activity)}>
                  {showFullComment[item.activity] ? <Feather name="chevron-up" size={20} color="black" /> : <Feather name="chevron-down" size={20} color="black" />}
                </TouchableOpacity>
              )}
          </View>
        </View>
      );
    };

    return (
      <View style={styles.container}>
          <View style={styles.contentContainer}>
              <View style={styles.contentList}>
              <FlatList
                data={dailyActivitiesList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
              </View>
              <View style={styles.addButtonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddActivities')}>
                  <AntDesign name="pluscircleo" size={30} color="black" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.bottomButtonText}>ACCUEIL</Text>
              </TouchableOpacity>
            </View>
      {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
    </View>
    );
}
