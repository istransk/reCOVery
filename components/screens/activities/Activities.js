import { Text, View, FlatList, TouchableOpacity, Platform, SafeAreaView, Modal, ScrollView } from 'react-native';
import { useState, useCallback, Fragment, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {fetchDataDailyActivities, fetchAllDataDailyActivities} from '../../database/DailyActivitiesDatabase';
import { Feather,  AntDesign } from '@expo/vector-icons';
import { decryption, encryption } from '../../utils/encryption';
import styles from '../../styles/style';
import { KeyContext } from '../../contexts/KeyContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function getDate() {
  return new Date().toISOString().split('T')[0];
}

export default function Activities({navigation}) {
    
    const key = useContext(KeyContext);
    const [dailyActivitiesList, setDailyActivitiesList] = useState([]);
    const today = getDate();
    const [showFullComment, setShowFullComment] = useState({});
    const [isTooLong, setIsTooLong] = useState(false);
    const [comment, setComment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleComment = (activity) => {
      setShowFullComment((prevState) => ({
        ...prevState,
        [activity]: !prevState[activity],
      }));
    };

    useFocusEffect(
      useCallback(() => {
        fetchAllDataDailyActivities(result => setDailyActivitiesList(result));
      }, [])
    );

    

    const renderItem = ({ item }) => {
      const duration = decryption(item.duration,key);
      const comment = decryption(item.comment, key);
      const activity = decryption(item.activity, key);
      const date = decryption(item.date, key);
      let truncatedComment = "";
      if (comment !== null) {
        truncatedComment = comment.slice(0, 23);
        if (comment.length > 23) {
          truncatedComment += '...';
        }
      }
      
      if (date === today) {
      return (
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>{activity}</Text>
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
            }
    };

    return (
      <View style={styles.container}>
        <Modal 
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
                <Text style={styles.text}>
                  Voici ta liste des activités de la journée. {"\n"}
                  {"\n"}
                  Appuie sur le bouton {<AntDesign name="pluscircleo" size={20} color="black" />} pour ajouter une nouvelle activité. {"\n"}
                  {"\n"}
                  {<Feather name="chevron-down" size={20} color="black" />} te permet de dérouler le commentaire si besoin. {"\n"}
                  {"\n"}
                  Retourne à l'accueil en appuyant sur le bouton "ACCUEIL". {"\n"}
                </Text>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
          <View style={styles.contentContainer}>
            <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
              <AntDesign name="questioncircleo" size={24} color="black" />
            </TouchableOpacity>
            
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
