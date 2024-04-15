import Symptoms from "../database/Symptoms";
import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

export default function Initializing({ navigation }) {
    const [progress, setProgress] = useState(0);
    const [SymptomsIntensity, setSymptomsIntensity] = useState({});
    const [hasStarted, setHasStarted] = useState(false);

    //Function to initialize Symptoms to SymptomsIntensity object with default intensity 0
    

    const updateSymptomsGrades = (symptom, intensity) => {
        setSymptomsIntensity(prevState => ({
            ...prevState,
            [symptom]: intensity
        }));
    }

    const handleIntensityChange = (symptom, intensity) => {
        setSymptomsIntensity(prevState => ({
            ...prevState,
            [symptom]: intensity
        }));
    };

    const renderSymptomItem = ({ item }) => {
        const gradeButtons = [0, 1, 2, 3, 4, 5].map(intensity => (
            <TouchableOpacity
                key={intensity}
                style={{ padding: 5, backgroundColor: SymptomsIntensity[item] === intensity ? 'blue' : 'grey', borderRadius: 5, margin: 2 }}
                onPress={() => handleIntensityChange(item, intensity)}
            >
                <Text style={{ color: 'white' }}>{intensity}</Text>
            </TouchableOpacity>
        ));

        return (
            <View style={{ marginBottom: 10 }}>
                <Text>{item}</Text>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    {gradeButtons}
                </View>
            </View>
        );
    };

    const symptomGradesIntensity = Object.keys(SymptomsIntensity).map(symptom => ({ symptom, intensity: SymptomsIntensity[symptom] }));

    const renderSymptomWithIntensity = ({ item }) => {
        return (
            <Text>{item.symptom}: {item.intensity || 'Not graded'}</Text>
        );
    };

    const renderSymptom = () => {
        return (
            <Text>{Symptoms[currentSymptom]}</Text>
        );
    };

    return (
        <View>
            {(!hasStarted) &&
            (<View>
            <Text>Bienvenue sur l'application reCOVery! Avant de commencer à aller sur l'application, je te laisserai 
                répondre à quelques questions d'évaluer tes symptômes.
                Pour chaque symptôme, tu devras indiquer son intensité sur une échelle de 0 à 3. 
                0 = Aucun symptôme, 1 = Symptôme léger (n'affecte pas la vie quotidienne), 
                2 = Symptôme modéré (affecte la vie quotidienne dans une certaine mesure), 
                3 = Symptôme sévère (affecte tous les aspects de la vie quotidienne ; perturbe la vie).
                Dès que tu es prêt, clique sur le bouton ci-dessous pour commencer. 
            </Text>
            <TouchableOpacity onPress={setHasStarted(true)}/>
            </View>
            )}
            <FlatList
                data={Symptoms}
                renderItem={renderSymptomItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <FlatList
                    data={symptomGradesIntensity}
                    renderItem={renderSymptomWithIntensity}
                    keyExtractor={(item, index) => index.toString()}
                />
        </View>
    );
}