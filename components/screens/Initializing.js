import {symptoms, activities} from "../database/Symptoms";
import { useState, useEffect  } from "react";
import { Text, View, FlatList, TouchableOpacity, Button} from "react-native";
import {initializeDatabaseSymptoms, insertDataSymptoms, fetchDataSymptoms} from "../database/SymptomsDatabase";
import {initializeDatabaseActivities, insertDataActivities} from "../database/ActivitiesDatabase";
import { initializeCrashDatabase } from '../database/CrashDatabase';
import { checkIfValueExists, generateKey, encryption } from "../utils/encryption";
import styles from '../styles/Style';

export default function Initializing({ navigation }) {
    const [symptomsIntensity, setSymptomsIntensity] = useState({});
    const [hasStarted, setHasStarted] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [currentSymptom, setCurrentSymptom] = useState(0);
    const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
    const valueExists = checkIfValueExists('key');

    useEffect(() => {
        initializeDatabaseSymptoms();
        initializeDatabaseActivities();
        initializeCrashDatabase();
        if (!valueExists){
            generateKey();
        }
    }, []);

    const handleIntensityChange = (symptom, intensity) => {
        setSymptomsIntensity(prevState => ({
            ...prevState,
            [symptom]: intensity
        }));
    };

    const goToNextSymptom = () => {
        if (currentSymptomIndex < sortedSymptoms.length - 1) {
          setCurrentSymptomIndex(currentSymptomIndex + 1);
          if (currentSymptomIndex === sortedSymptoms.length - 2) {
            setIsDone(true);
          }
        }
        
      };
    
      const goToPreviousSymptom = () => {
        if (currentSymptomIndex > 0) {
          setCurrentSymptomIndex(currentSymptomIndex - 1);
        }
      };

    const renderSymptomItem = ({ item }) => {
        const gradeButtons = [0, 1, 2, 3].map(intensity => (
            <TouchableOpacity
            key={intensity}
            style={{ padding: 20, backgroundColor: symptomsIntensity[item] === intensity ? '#171412' : '#72665A', borderRadius: 5, margin: 10 }}
            onPress={() => handleIntensityChange(item, intensity)}
            >
                <Text style={styles.buttonText}>{intensity}</Text>
            </TouchableOpacity>
        ));

        return (
            <View style={{flex: 1, marginBottom: 200, justifyContent: 'space-around',}}>
                <View style={styles.containerQuestions}>
                <TouchableOpacity 
                    onPress={goToPreviousSymptom}
                    disabled={currentSymptomIndex === 0}
                >
                    {currentSymptomIndex === 0 ? 
                    <AntDesign name="arrowleft" size={35} color={'#dcc1a7'} /> : 
                    <AntDesign name="arrowleft" size={35} color={"black"} />
                    }
                </TouchableOpacity>
                <View style={{width:'70%'}}>
                    <Text style={styles.symptomText}>{item}</Text>
                </View>
                <TouchableOpacity 
                    onPress={goToNextSymptom}
                    disabled={Object.keys(symptomsIntensity).length === currentSymptomIndex || (currentSymptomIndex === sortedSymptoms.length - 1)}
                >
                    {currentSymptomIndex === sortedSymptoms.length -1 ? 
                    <AntDesign name="arrowright" size={35} color={'#dcc1a7'} /> :
                    <AntDesign name="arrowright" size={35} color={Object.keys(symptomsIntensity).length === currentSymptomIndex ? "rgba(128, 128, 128, 0.4)" :  "black"} />
                    }
                </TouchableOpacity>
                </View>
                <View style={styles.gradeButtonContainer}>
                {gradeButtons}
                </View>
            </View>
        );
    };


    const symptomGradesIntensity = Object.keys(symptomsIntensity).map(symptom => ({ symptom, intensity: symptomsIntensity[symptom] }));

    const renderSymptomWithIntensity = ({ item }) => {
        return (
            <Text>{item.symptom}: {item.intensity }</Text>
        );
    };

    const saveAnswersToDatabase = () => {
        symptomGradesIntensity.forEach(({ symptom, intensity }) => {
            insertDataSymptoms(encryption(symptom, key), encryption(intensity, key));
        });
        navigation.navigate('Home');
    }

    const start = () => {
        try {
            activities.forEach(activity => {
                insertDataActivities(activity.name, activity.category);
            });
        } catch (error) {
            console.log(error);
        }
        setHasStarted(true);
    }

    return (
        <View style={styles.container}>
            {!hasStarted &&
            (<>
                <View style={styles.rectangle}>
                    <Text style={styles.text}>Bienvenue sur l'application reCOVery! Pour commencer, je te laisserai 
                        répondre à quelques questions afin d'évaluer tes symptômes. {"\n"}
                        Pour chaque symptôme, tu devras indiquer son intensité sur une échelle de 0 à 3. {"\n"}
                        {"\n"}
                        0 = Aucun symptôme, {"\n"}
                        1 = Symptôme léger (n'affecte pas la vie quotidienne) {"\n"}
                        2 = Symptôme modéré (affecte la vie quotidienne dans une certaine mesure) {"\n"}
                        3 = Symptôme sévère (affecte tous les aspects de la vie quotidienne ; perturbe la vie) {"\n"}
                        {"\n"}
                        Dès que tu es prêt(e), clique sur le bouton ci-dessous. 
                    </Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={start}>
                <Text style={styles.buttonText}>COMMENCER</Text>
                </TouchableOpacity>
            </>
            )}
            {hasStarted && !isDone && (
                <View style={styles.contentContainer}>
                    <renderSymptomItem item={symptoms[currentSymptomIndex]} />
                
                    {(Object.keys(symptomsIntensity).length > currentSymptomIndex) ? (
                            <View style={styles.savedButtonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={saveAnswersToDatabase}>
                                <Text style={styles.buttonText}>Terminer</Text>
                            </TouchableOpacity>
                            </View>
                        ) : <View style={styles.savedButtonContainer}></View> }
                    
                </View>
            )}
            {isDone && (
                <View>
                <FlatList
                        data={symptomGradesIntensity}
                        renderItem={renderSymptomWithIntensity}
                        keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity onPress={saveAnswersToDatabase}>
                    <Text>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Modifier</Text>
                </TouchableOpacity>
                </View>
            )}
        </View>
    );
}