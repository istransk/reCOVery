import { FlatList, View, TouchableOpacity, Text, TextInput, Modal, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, KeyboardAvoidingView} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import {  useState, useCallback, useContext } from "react"; 
import {insertDataActivities, fetchDataActivities} from "../../database/ActivitiesDatabase";
import {insertDataDailyActivities} from "../../database/DailyActivitiesDatabase";
import { encryption, decryption } from "../../utils/encryption";
import { categories } from "../../utils/data";
import styles from "../../styles/style";
import { KeyContext } from "../../contexts/KeyContext";
import { AntDesign, Fontisto } from '@expo/vector-icons';

function getDate() {
    return new Date().toISOString().split('T')[0];
}

export default function AddActivities({navigation}) {
    const key = useContext(KeyContext);
    const [activitiesList, setActivitiesList] = useState([]);
    const [activitySelected, setActivitySelected] = useState('');
    const [activityId, setActivityId] = useState('');
    const [duration, setDuration] = useState('');
    const [comment, setComment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddActivityVisible, setModalAddActivityVisible] = useState(false);
    const [activity, setActivity] = useState('');
    const [category, setCategory] = useState('');
    const [activityAdded, setActivityAdded] = useState(0);
    const [textInputFocus, setTextInputFocus] = useState(false);
    const date = getDate();
    const buttonStyle = (activityId === '' || duration === '') ? styles.buttonDisabled : styles.button;
    const buttonModalStyle = (activity === '' || category === '') ? styles.buttonDisabled : styles.button; 

    useFocusEffect(
        useCallback(() => {
            fetchDataActivities((result) => {
                result.sort((a, b) => {
                    const activityA = decryption(a.activity, key).toLowerCase();
                    const activityB = decryption(b.activity, key).toLowerCase();
                    if (activityA < activityB) {
                        return -1;
                    }
                    if (activityA > activityB) {
                        return 1;
                    }
                    return 0;
                });
                result.push({id: 'other', activity: encryption('Autre', key)});
                setActivitiesList(result);
            });
        }, [activityAdded])
        
    );

    if (activityId === 'other') {
        setModalAddActivityVisible(true);
        setActivityId('');
    }

    const selectActivity = (id, activity) => {
        setActivityId(id);
        setActivitySelected(activity);
    }

    const saveActivity = (activity, category) => {
        insertDataActivities(encryption(activity, key), encryption(category, key));
        setActivityAdded(activityAdded + 1);
    }
    const handleBackgroundPress = () => {
        if (textInputFocus) {
            Keyboard.dismiss();
            setTextInputFocus(false);
        }
    };

    return (
        <View style={styles.container}>
            <Modal 
                visible={modalAddActivityVisible}
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.welcomeText}>Enregistre une nouvelle activité</Text>
                            <Text style={styles.durationText}>Nom de l'activité: </Text>
                            <TextInput
                                value={activity}
                                onChangeText={setActivity}
                                placeholder="Activité"
                                selectionColor={'#72665A'}
                                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 5, marginTop: 5, width: '80%', marginBottom: 30, backgroundColor: '#F7E9E3',
                                fontSize: 16}}
                                onFocus={() => setTextInputFocus(true)}
                                onBlur={() => setTextInputFocus(false)}
                            />
                            <Text style={styles.durationText}>Type d'activité: </Text>
                            <FlatList
                                data={categories}
                                horizontal={true}
                                style={{width: '100%'}}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => setCategory(item)}>
                                        <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5, alignItems:'center',  width:'100%', alignContent:'flex-start', marginRight:10,  marginTop:10, marginBottom:20}}>
                                            {category === item ? <Fontisto name="radio-btn-active" size={15} color="black" /> : <Fontisto name="radio-btn-passive" size={15} color="black" />}
                                            <Text style={styles.text}> {item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item}
                            />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                            <TouchableOpacity style={styles.button} onPress={() => setModalAddActivityVisible(false)}>
                                <Text style={styles.buttonText}>Fermer</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={buttonModalStyle} 
                                onPress={() => { saveActivity(activity, category);setModalAddActivityVisible(false), setActivity(''), setCategory('')}}
                                disabled={activity === '' || category === ''}
                            >
                                <Text style={styles.buttonText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal 
                visible={modalVisible}
                transparent={true}
                >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.text}>
                            Ici tu ajoutes tes activités de la journée. {"\n"}
                            {"\n"}
                            Appuie sur l'activité que tu as fait dans la lise, si elle n'est pas présente, appuie sur autre.
                            Tu pourras alors ajouter une nouvelle activité à la liste en écrivant son nom et en indiquant si elle est
                            fatigante ou énerhisante.{"\n"}
                            {"\n"}
                            Une fois que tu as indiqué la durée de l'activité, tu peux alors l'enregistrer. {"\n"}
                            {"\n"}
                            Tu peux également mettre un commentaire si besoin.
                            {"\n"}
                            Le bouton Retour te permet de retourner à la liste des activités.{"\n"}
                        </Text>
                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                        <Text style={styles.buttonText}>Fermer</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.KeyboardAvoidingView}>
            <TouchableWithoutFeedback onPress={handleBackgroundPress}>
            <>
                <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
                    <AntDesign name="questioncircleo" size={24} color="black" />
                </TouchableOpacity>
                <View style={{width: '80%'}}>
                <Text style={styles.activityTitleText}>Choisis une activité: </Text>
                </View>
                <FlatList
                    data={activitiesList}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => selectActivity(item.id, decryption(item.activity, key))}>
                            <View style={{marginTop:10, flexDirection: 'row', alignItems: 'center'}}>
                                {activityId === item.id ? <Fontisto name="radio-btn-active" size={15} color="black" /> : <Fontisto name="radio-btn-passive" size={15} color="black" />}
                                <Text style={styles.listText}> {decryption(item.activity, key)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    style={{width: '80%'}}
                />
                <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10, alignItems:'center',  width:'80%', alignContent:'flex-start'}}>
                    <Text style={styles.listText}>Durée de l'activité: </Text>
                    <TextInput
                        value={duration}
                        onChangeText={setDuration}
                        placeholder="0"
                        keyboardType="numeric"
                        style={styles.durationInput}
                        selectionColor={'#72665A'}
                        onFocus={() => setTextInputFocus(true)}
                        onBlur={() => setTextInputFocus(false)} 
                    />
                    <Text style={styles.listText}> minutes</Text>
                </View>

                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Commentaire"
                    multiline={true}
                    style={styles.commentActivityInput}
                    selectionColor={'#72665A'}
                    onFocus={() => setTextInputFocus(true)}
                    onBlur={() => setTextInputFocus(false)}
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Activities')}>
                        <Text style={styles.buttonText}>Retour</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={buttonStyle}
                        disabled={activityId === '' || duration === ''}
                        onPress={() => {insertDataDailyActivities(activityId,encryption(duration, key),encryption(date, key), encryption(comment, key));setDuration("");setComment("");setActivityId("");navigation.navigate('Activities')}}>
                        <Text style={styles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                </View>
            
            </>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
        </View>
    );
}