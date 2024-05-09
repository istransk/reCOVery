import { insertDataActivities } from "../../database/ActivitiesDatabase";
import { categories } from "../../database/Symptoms";
import { useState } from "react";
import styles from '../../styles/style';
import { FlatList, TextInput, View, TouchableOpacity, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default function AddNewActivities({ navigation }) {
    const [activity, setActivity] = useState('');
    const [category, setCategory] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
                <AntDesign name="questioncircleo" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    value={activity}
                    onChangeText={setActivity}
                    placeholder="Activité"
                    style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 5, marginTop: 5, width: '80%', marginBottom: 30}}
                />
                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setCategory(item)}>
                            <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                />
                <TouchableOpacity onPress={() => { insertDataActivities(activity, category); navigation.navigate('AddActivities') }}>
                    <Text>Valider</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}