import { FlatList, View, TouchableOpacity, Text, TextInput} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useCallback, useContext } from "react"; 
import {insertDataActivities, fetchDataActivities} from "../../database/ActivitiesDatabase";
import {insertDataDailyActivities} from "../../database/DailyActivitiesDatabase";
import { encryption } from "../../utils/encryption";
import styles from "../../styles/Style";
import { KeyContext } from "../../contexts/KeyContext";
import { AntDesign } from '@expo/vector-icons';

function getDate() {
    return new Date().toISOString().split('T')[0];
}

export default function AddActivities({navigation}) {
    const key = useContext(KeyContext);
    const [activitiesList, setActivitiesList] = useState([]); // [activities, setActivities
    const [activityId, setActivityId] = useState('');
    const [duration, setDuration] = useState(null);
    const [comment, setComment] = useState(null);
    const date = getDate();

    useFocusEffect(
        useCallback(() => {
            fetchDataActivities((result) => setActivitiesList(result));
            console.log("Key:",key);
        }, [])
        
    );

    

    const selectActivity = (id) => {
        setActivityId(id);
        console.log(activityId);
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
                <AntDesign name="questioncircleo" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="Durée en minutes"
                    keyboardType="numeric"
                />
                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Commentaire"
                    multiline={true}
                />
                <TouchableOpacity onPress={() => {insertDataDailyActivities(activityId,encryption(duration, key),date, encryption(comment, key));setDuration("");setComment("");setActivityId("");navigation.navigate('Activities')}}>
                    <Text>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Activities')} style={{marginTop:50}}>
                    <Text>Retour</Text>
                </TouchableOpacity>
                <FlatList
                    data={activitiesList}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => selectActivity(item.id)}>
                        <View style={{marginTop:10}}>
                            <Text>{item.activity}</Text>
                        </View>
                        </TouchableOpacity>

                    )}
                    keyExtractor={(item) => item.id}
                />
                <TouchableOpacity onPress={() => navigation.navigate('AddNewActivity')}>
                    <Text>Ajouter une nouvelle activité</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}