import { StyleSheet, Text, View, Button, Animated, TouchableWithoutFeedback, TouchableOpacity, FlatList, Platform } from 'react-native';
import {useEffect, useState, useContext} from 'react';
import {fetchDataIsCrash, insertCrashData, updateCrashData, fetchDataCrash, isCrash} from '../database/CrashDatabase';
import { insertDataDailySymptoms } from '../database/DailySymptomsDatabase';
import styles from '../styles/Style';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  if (month < 10 && date < 10) {
    return `${year}-0${month}-0${date}-${hours}:${minutes}`;
  } else if (month < 10) {
    return `${year}-0${month}-${date}-${hours}:${minutes}`;
  } else if (date < 10) {
    return `${year}-${month}-0${date}-${hours}:${minutes}`;
  } else {
    return `${year}-${month}-${date}-${hours}:${minutes}`;
  }
}

export default function Home({ navigation }) {
  const [pressAction] = useState(new Animated.Value(0)); // State variable for the animated value
  const ACTION_TIMER = 1000; // Duration of the action
  const [buttonWidth, setButtonWidth] = useState(0); // State variable for buttonWidth
  const [buttonHeight, setButtonHeight] = useState(0); // State variable for buttonHeight
  const [value, setValue] = useState(0); // State variable for _value
  const [hasCrashed, setHasCrashed] = useState(false);
  
  // Effect to fetch initial data
  useEffect(() => {
    fetchDataIsCrash((result) => {
      setHasCrashed(result);
      console.log('This is a hasCrashed', result);
    });
  }, []);

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
      outputRange: [hasCrashed ? 'white' : '#8B0000', hasCrashed ? 'white' : '#8B0000'],
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
      alert("Vous n'êtes plus en crash");
      updateCrashData(date, (success) => {
        setHasCrashed(success);
      });
    } else {
      alert('CRASH!');
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
      <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={[styles.crashButton, hasCrashed ? styles.hasCrashed : null]} onLayout={getButtonWidthLayout}>
          <Animated.View style={[styles.bgFill, getProgressStyles()]} />
          <Text style={styles.crashButtonText}>CRASH</Text>
        </View>
      </TouchableWithoutFeedback>
      
      <TouchableOpacity style={styles.buttonMenu} onPress={navigateToQuestion}>
        <Text style={styles.buttonText}>Questionnaire</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonMenu} onPress={() => navigation.navigate('Activities')}>
        <Text style={styles.buttonText}>Activités</Text>
      </TouchableOpacity>
      
      
  
      <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Results')}>
        <Text style={styles.bottomButtonText}>RÉSULTATS</Text>
      </TouchableOpacity>
      </View>
      {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
    </View>
  );
}

