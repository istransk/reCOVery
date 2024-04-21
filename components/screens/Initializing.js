import {symptoms, activities} from "../database/Symptoms";
import { useState, useEffect  } from "react";
import { Text, View, FlatList, TouchableOpacity, Button} from "react-native";
import {initializeDatabaseSymptoms, insertDataSymptoms, fetchDataSymptoms} from "../database/SymptomsDatabase";
import {initializeDatabaseActivities, insertDataActivities} from "../database/ActivitiesDatabase";
import { initializeCrashDatabase } from '../database/CrashDatabase';
import styles from '../styles/style';

export default function Initializing({ navigation }) {
    const [symptomsIntensity, setSymptomsIntensity] = useState({});
    const [hasStarted, setHasStarted] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [currentSymptom, setCurrentSymptom] = useState(0);

    useEffect(() => {
        initializeDatabaseSymptoms();
        initializeDatabaseActivities();
        initializeCrashDatabase();
    }, []);
    const handleIntensityChange = (symptom, intensity) => {
        setSymptomsIntensity(prevState => ({
            ...prevState,
            [symptom]: intensity
        }));
    };

    const renderSymptomItem = ({ item }) => {
        const gradeButtons = [0, 1, 2, 3].map(intensity => (
            <TouchableOpacity
                key={intensity}
                style={{ marginHorizontal: '8%', padding: 10, backgroundColor: symptomsIntensity[item] === intensity ? 'blue' : 'grey', borderRadius: 5, margin: 2 }}
                onPress={() => handleIntensityChange(item, intensity)}
            >
                <Text style={styles.buttonText}>{intensity}</Text>
            </TouchableOpacity>
        ));

        return (
            <View >
                <Text style={styles.text}>{item}</Text>
                <View style={styles.buttonGradeContainer}>
                    {gradeButtons}
                </View>
            </View>
        );
    };

    const handleNext = () => {
        setCurrentSymptom(prevState => prevState + 1);
    };

    const handlePrevious = () => {
        setCurrentSymptom(prevState => prevState - 1);
    };

    const symptomGradesIntensity = Object.keys(symptomsIntensity).map(symptom => ({ symptom, intensity: symptomsIntensity[symptom] }));

    const renderSymptomWithIntensity = ({ item }) => {
        return (
            <Text>{item.symptom}: {item.intensity }</Text>
        );
    };

    const saveAnswersToDatabase = () => {
        symptomGradesIntensity.forEach(({ symptom, intensity }) => {
            insertDataSymptoms(symptom, intensity);
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
                        Dès que tu es prêt, clique sur le bouton ci-dessous. 
                    </Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={start}>
                <Text style={styles.buttonText}>COMMENCER</Text>
                </TouchableOpacity>
            </>
            )}
            {hasStarted && !isDone && (
            <View >
                {renderSymptomItem({ item: symptoms[currentSymptom] })}

                
                {currentSymptom === symptoms.length -1 && (
                <TouchableOpacity onPress={() => setIsDone(true)}>
                    <Text>Terminer</Text>
                    </TouchableOpacity>
                )}
            
                {currentSymptom < symptoms.length - 1 && (
                <TouchableOpacity onPress={handleNext}>
                    <Text>Suivant</Text>
                </TouchableOpacity>
                )}

                {currentSymptom > 0 && (
                <TouchableOpacity onPress={handlePrevious}>
                    <Text>Précédent</Text>
                </TouchableOpacity>
                )}
  
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
                    <TouchableOpacity onPress={fetchData}>
                        <Text>Modifier</Text>
                    </TouchableOpacity>
                    </View>
                )}
        </View>
    );
}