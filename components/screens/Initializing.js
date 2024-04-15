import Symptoms from "../database/Symptoms";
import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

export default function Initializing({ navigation }) {
    const [SymptomsIntensity, setSymptomsIntensity] = useState({});
    const [hasStarted, setHasStarted] = useState(false);
    const [currentSymptom, setCurrentSymptom] = useState(0);
    
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

    const handleNext = () => {
        setCurrentSymptom(prevState => prevState + 1);
    };

    const handlePrevious = () => {
        setCurrentSymptom(prevState => prevState - 1);
    };

    const symptomGradesIntensity = Object.keys(SymptomsIntensity).map(symptom => ({ symptom, intensity: SymptomsIntensity[symptom] }));

    const renderSymptomWithIntensity = ({ item }) => {
        return (
            <Text>{item.symptom}: {item.intensity }</Text>
        );
    };

    return (
        <View>
            {!hasStarted &&
            (<View>
            <Text>Bienvenue sur l'application reCOVery! Avant de commencer à aller sur l'application, je te laisserai 
                répondre à quelques questions afin d'évaluer tes symptômes. {"\n"}
                Pour chaque symptôme, tu devras indiquer son intensité sur une échelle de 0 à 3. {"\n"}
                0 = Aucun symptôme, 1 = Symptôme léger (n'affecte pas la vie quotidienne) {"\n"}
                2 = Symptôme modéré (affecte la vie quotidienne dans une certaine mesure) {"\n"}
                3 = Symptôme sévère (affecte tous les aspects de la vie quotidienne ; perturbe la vie) {"\n"}
                Dès que tu es prêt, clique sur le bouton ci-dessous pour commencer. 
            </Text>
            <TouchableOpacity onPress={() => setHasStarted(true)}>
                <Text>Commencer</Text>
            </TouchableOpacity>
            </View>
            )}
            {hasStarted && (
            <View>
            {renderSymptomItem({ item: Symptoms[currentSymptom] })}
            <FlatList
                    data={symptomGradesIntensity}
                    renderItem={renderSymptomWithIntensity}
                    keyExtractor={(item, index) => index.toString()}
                />
                {currentSymptom === Symptoms.length - 1 && (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text>Terminer</Text>
                    </TouchableOpacity>
                )}
                {currentSymptom < Symptoms.length - 1 && (
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
        </View>
    );
}