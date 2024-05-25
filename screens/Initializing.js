import {symptoms, activities} from "../utils/data";
import { useState, useEffect, useContext  } from "react";
import { Text, View, FlatList, TouchableOpacity, Modal, ScrollView} from "react-native";
import {initializeDatabaseSymptoms, insertDataSymptoms,} from "../database/SymptomsDatabase";
import {initializeDatabaseActivities, insertDataActivities} from "../database/ActivitiesDatabase";
import { initializeCrashDatabase } from '../database/CrashDatabase';
import { initializeDailyActivitiesDatabase } from '../database/DailyActivitiesDatabase';
import { initializeDailySymptomsDatabase } from '../database/DailySymptomsDatabase';
import { encryption } from "../utils/encryption";
import { KeyContext } from "../contexts/KeyContext";
import { AntDesign } from '@expo/vector-icons';
import Loading from './Loading';
import styles from '../styles/style';

export default function Initializing({ navigation }) {
    const [symptomsIntensity, setSymptomsIntensity] = useState({});
    const [hasStarted, setHasStarted] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [symptomFinished, setSymptomFinished] = useState(false);
    const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const key = useContext(KeyContext);
    const [isLoading, setIsLoading] = useState(true);
    const buttonStyle = symptomFinished && (Object.keys(symptomsIntensity).length > currentSymptomIndex) ? styles.button : styles.buttonDisabled; 

    useEffect(() => {
        initializeDatabaseSymptoms();
        initializeDatabaseActivities();
        initializeCrashDatabase();
        initializeDailyActivitiesDatabase();
        initializeDailySymptomsDatabase();
        
        setTimeout(() => {
            setIsLoading(false);
          }, 700); 
        
    }, []);

    if (isLoading) {
        return <Loading />;
      }

    const handleIntensityChange = (symptom, intensity) => {
        setSymptomsIntensity(prevState => ({
            ...prevState,
            [symptom]: intensity
        }));
    };

    const goToNextSymptom = () => {
        if (currentSymptomIndex < symptoms.length - 1) {
            setCurrentSymptomIndex(currentSymptomIndex + 1);
            if (currentSymptomIndex === symptoms.length - 2) {
                setSymptomFinished(true);
            }
        }
        
      };
    
    const goToPreviousSymptom = () => {
        if (currentSymptomIndex > 0) {
          setCurrentSymptomIndex(currentSymptomIndex - 1);
        }
    };

    const ProgressIndicator = () => {
        return (
          <View style={styles.progressContainer}>
            {symptoms.map((symptom, index) => {
              const isAnswered = symptomsIntensity.hasOwnProperty(symptom);
              const isActive = index === currentSymptomIndex;
              const dotSize = isActive ? 13 : 6;
              const dotColor = isAnswered ? '#171412' : 'rgba(128, 128, 128, 0.5)';
      
              return (
                <View
                  key={index}
                  style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: dotColor }]}
                />
              );
            })}
          </View>
        );
    };

    const renderSymptomItem = (item) => {
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
            <View style={{flex: 15, justifyContent: 'space-evenly',}}>
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
                    disabled={Object.keys(symptomsIntensity).length === currentSymptomIndex || (currentSymptomIndex === symptoms.length - 1)}
                >
                    {currentSymptomIndex === symptoms.length -1 ? 
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
            <View style={styles.activityContainer}>
                <Text style={styles.durationText}>{item.symptom}: {item.intensity }</Text>
            </View>
        );
    };

    const saveAnswersToDatabase = () => {
        symptomGradesIntensity.forEach(({ symptom, intensity }) => {
            try {
                insertDataSymptoms(encryption(symptom, key), encryption(intensity.toString(), key));
            } catch (error) {
                console.log(error);
            }
        });
        navigation.navigate('Home');
    }

    const start = () => {
        try {
            activities.forEach(activity => {
                const cryptedActivity = encryption(activity.name, key);
                const cryptedCategory = encryption(activity.category, key);
                insertDataActivities(cryptedActivity, cryptedCategory);
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
                    <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
                        <AntDesign name="questioncircleo" size={24} color="black" />
                    </TouchableOpacity>
                    <Modal 
                        visible={modalVisible}
                        transparent={true}
                    >
                        <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ScrollView>
                                <Text style={styles.text}>
                                Note chaque symptôme de 0 à 3{"\n"}
                                0 = Aucun symptôme, {"\n"}
                                1 = Symptôme léger (n'affecte pas la vie quotidienne) {"\n"}
                                2 = Symptôme modéré (affecte la vie quotidienne dans une certaine mesure) {"\n"}
                                3 = Symptôme sévère (affecte tous les aspects de la vie quotidienne ; perturbe la vie) {"\n"}
                                {"\n"}
                                {<AntDesign name="arrowleft" size={18} color={'black'} />}{<AntDesign name="arrowright" size={18} color={'black'} />}
                                Te permet de passer d'un symptôme à l'autre. {"\n"}
                                Attention, tu ne peux passer au symptôme suivant qu'une fois que tu as noté le sympôme.{"\n"}
                                {"\n"}
                                Lorsque tu as noté tous les symptômes, le bouton "Terminer" apparaît en bas. Appuie dessus pour le terminer{"\n"}
                                </Text>
                            </ScrollView>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Fermer</Text>
                        </TouchableOpacity>
                        </View>
                        </View>
                    </Modal>
                    <ProgressIndicator />
                    {renderSymptomItem(symptoms[currentSymptomIndex])}
                
                    
                    <View style={styles.savedButtonContainer}>
                        <TouchableOpacity 
                            style={buttonStyle}
                            disabled={!symptomFinished || (Object.keys(symptomsIntensity).length <= currentSymptomIndex)} 
                            onPress={() => setIsDone(true)}
                        >
                            <Text style={styles.buttonText}>Terminer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {isDone && (
                <View style={styles.contentContainer}> 
                    <Text style={styles.welcomeText}>Récapitulatif </Text>
                    <View style={styles.contentList}>
                        <FlatList
                                data={symptomGradesIntensity}
                                renderItem={renderSymptomWithIntensity}
                                keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => {setIsDone(false)}}>
                            <Text style={styles.buttonText}>Modifier</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={saveAnswersToDatabase}>
                            <Text style={styles.buttonText}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}