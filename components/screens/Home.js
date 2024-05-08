import { StyleSheet, Text, View, Button, Animated, TouchableWithoutFeedback, TouchableOpacity, FlatList, Platform, Modal, ScrollView } from 'react-native';
import {useEffect, useState, useContext} from 'react';
import {fetchDataIsCrash, insertCrashData, updateCrashData, fetchDataCrash, isCrash} from '../database/CrashDatabase';
import { insertDataDailySymptoms } from '../database/DailySymptomsDatabase';
import styles from '../styles/Style';
import CreatePdf from '../utils/CreatePdf';
import { KeyContext } from '../contexts/KeyContext';
import { getKeyValue } from '../utils/encryption';
import AntDesign from '@expo/vector-icons/AntDesign';
import Loading from './Loading';

function getDate() {
  return new Date().toISOString().split('T')[0];
}

export default function Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(true); 
  const [pressAction] = useState(new Animated.Value(0)); // State variable for the animated value
  const ACTION_TIMER = 1000; // Duration of the action
  const [buttonWidth, setButtonWidth] = useState(0); // State variable for buttonWidth
  const [buttonHeight, setButtonHeight] = useState(0); // State variable for buttonHeight
  const [value, setValue] = useState(0); // State variable for _value
  const [hasCrashed, setHasCrashed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCrashVisible, setModalCrashVisible] = useState(false);
  const key = useContext(KeyContext);
  
  
  // Effect to fetch initial data
  useEffect(() => {
    fetchDataIsCrash((result) => {
      setHasCrashed(result);
      console.log('This is a hasCrashed', result);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 700); 
  }, []);

  if (isLoading) {
    return <Loading />;
  }

 

  // Function to handle layout event and update buttonWidth and buttonHeight
  const getButtonWidthLayout = (e) => {
    setButtonWidth(e.nativeEvent.layout.width - 2);
    setButtonHeight(e.nativeEvent.layout.height - 2);
  };

  const getProgressStyles = () => {
    const width = pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: [0, buttonWidth],
    });

    const bgColor = pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: [hasCrashed ? '#F7E9E3' : '#8B0000', hasCrashed ? '#F7E9E3' : '#8B0000'],
    });

    return {
      width: width,
      height: buttonHeight,
      backgroundColor: bgColor,
    };
  };

  // Function to handle touch event
  const handlePressIn = () => {
    setValue(pressAction._value);
    Animated.timing(pressAction, {
      toValue: 1,
      duration: ACTION_TIMER,
      useNativeDriver: false,
    }).start(pressComplete);
  };

  // Function to handle release event
  const handlePressOut = () => {
    Animated.timing(pressAction, {
      toValue: 0,
      duration: pressAction._value * ACTION_TIMER,
      useNativeDriver: false,
    }).start();
  };

 const pressComplete = () => {
  const value = pressAction._value;
  if (value === 1) {
    const date = getDate();
    if (hasCrashed) {
      setModalCrashVisible(true);
      updateCrashData(date, (success) => {
        setHasCrashed(success);
      });
    } else {
      setModalCrashVisible(true);
      insertCrashData(date, (success) => {
        setHasCrashed(success);
      });
    }
  }
};

const navigateToQuestion = () => {
  
  navigation.navigate('Questionnaire');
}

  return (
    <View style={styles.container}>
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
              <ScrollView showsVerticalScrollIndicator={true}>
                
                <Text style={styles.text}>
                  Bienvenue sur la page d'accueil ! {"\n"}
                  {"\n"}
                  Le bouton CRASH te permet de dire que tu es en crash. Tu l'actives en laissant ton doigt appuyé dessus jusqu'à ce que le bouton soit 
                  complètement rouge. Le processus pour le désactiver est le même. {"\n"} 
                  {"\n"}
                  Tu peux facilement accéder au questionnaire journalier sur tes symptômes en cliquant sur le bouton "Questionnaire journalier". {"\n"}
                  {"\n"}
                  Tu peux également ajouter tes activités journalières au fur et à mesure de ta journée en cliquant sur le bouton "Activités journalières". {"\n"}
                  {"\n"}
                  Et finalement, tu peux consulter tes résultats en cliquant sur le bouton "RÉSULTATS" en bas de l'écran. {"\n"}
                  {"\n"}
                </Text>
              </ScrollView>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalCrashVisible}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          {hasCrashed ?
            <Text style={styles.text}>
              Désolée d'apprendre que tu es en crash {"\n"}
              {"\n"}
              Repose toi bien et reviens dès que tu es plus en forme.
            </Text>
            : 
            <Text style={styles.text}>
              Heureuse de savoir que tu vas mieux {":)"} {"\n"}
              {"\n"}
            </Text>
            }
            <TouchableOpacity style={styles.button} onPress={() => setModalCrashVisible(false)}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={[styles.crashButton, hasCrashed ? styles.hasCrashed : null]} onLayout={getButtonWidthLayout}>
          <Animated.View style={[styles.bgFill, getProgressStyles()]} />
          <Text style={styles.crashButtonText}>CRASH</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonMenu} onPress={navigateToQuestion}>
          <Text style={styles.buttonText}>Questionnaire journalier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonMenu} onPress={() => navigation.navigate('Activities')}>
          <Text style={styles.buttonText}>Activités journalières</Text>
        </TouchableOpacity>
      </View>
      
      
  
      <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Results')}>
        <Text style={styles.bottomButtonText}>RÉSULTATS</Text>
      </TouchableOpacity>
      </View>
      {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
    </View>
  );
}

