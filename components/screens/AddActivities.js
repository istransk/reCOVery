import { FlatList, View, TouchableOpacity, Text, TextInput} from "react-native";
import { useEffect, useState } from "react"; 
import ActivitiesDatabase from "../database/ActivitiesDatabase";
import DailyActivitiesDatabase from "../database/DailyActivitiesDatabase";
import { activities } from "../database/Symptoms";

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

export default function AddActivities({navigation}) {
    const {insertDataActivities, fetchDataActivities, activitiesList} = ActivitiesDatabase();
    const {insertDataDailyActivities} = DailyActivitiesDatabase();
    const [activity, setActivity] = useState('');
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState(null);
    const [comment, setComment] = useState(null);
    const date = getDate();

    useEffect(() => {
        fetchDataActivities();
    }, []);

    const selectActivity = (activity, category) => {
        setActivity(activity);
        setCategory(category);
        console.log(activity);
    }

    return (
        <View style={{marginTop:50}}>
            
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
            <TouchableOpacity onPress={() => {insertDataDailyActivities(activity, category, duration,date, comment);console.log(comment); navigation.navigate('Activities')}}>
                <Text>Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Activities')} style={{marginTop:50}}>
                <Text>Retour</Text>
            </TouchableOpacity>
            <FlatList
                data={activitiesList}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => selectActivity(item.activity, item.category)}>
                    <View style={{marginTop:10}}>
                        <Text>{item.activity}</Text>
                    </View>
                    </TouchableOpacity>

                )}
                keyExtractor={(item) => item.id}
            />
           
        </View>
    );
}