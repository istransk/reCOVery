import { StyleSheet, Text, View, Button, Animated, TouchableWithoutFeedback, TouchableOpacity, FlatList } from 'react-native';
import React, {useEffect, useState} from 'react';
import Database from '../Database';
import ActivitiesDatabase from '../database/ActivitiesDatabase';
import {activities} from '../database/Symptoms.js';
import SymptomsDatabase from '../database/SymptomsDatabase.js';

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
  const { insertDataCrash, fetchDataIsCrash, updateDataCrash, fetchDataCrash, isCrash} = Database();
  const {insertDataActivities} = ActivitiesDatabase();
  const {fetchDataSymptoms} = SymptomsDatabase();
  
  // Effect to fetch initial data
  useEffect(() => {
    fetchDataIsCrash();
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
      outputRange: [isCrash ? 'white' : '#8B0000', isCrash ? 'white' : '#8B0000'],
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
    if (isCrash) {
      alert("Vous n'êtes plus en crash");
      updateDataCrash(date);
    } else {
      alert('CRASH!');
      insertDataCrash(date);
    }
  }
};

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={[styles.crashButton, isCrash ? styles.hasCrashed : null]} onLayout={getButtonWidthLayout}>
          <Animated.View style={[styles.bgFill, getProgressStyles()]} />
          <Text style={styles.buttonText}>CRASH</Text>
        </View>
      </TouchableWithoutFeedback>
      {isCrash && <Text>Crash</Text>}
      <Button title="Data" onPress={fetchDataCrash} />
      <TouchableOpacity onPress={() => navigation.navigate('Questionnaire')}>
        <Text>Questionnaire</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.resultsButton} onPress={() => navigation.navigate('Results')}>
        <Text style={styles.menuText}>RÉSULTATS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    width: '100%',
    color: 'grey',
  },
  crashButton: {
    position: 'absolute',
    top: 100,
    backgroundColor: 'white', // Change background color to white
    borderColor: 'grey', // Add border color
    borderWidth: 1, // Add border width
    borderRadius: 8, // Add border radius for rounded corners
    shadowColor: '#000', // Add shadow color
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset
    shadowOpacity: 0.25, // Add shadow opacity
    shadowRadius: 4, // Add shadow radius
    elevation: 5, // Add elevation for Android shadow
    width: '80%', // Adjust width
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  resultsButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'grey',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  hasCrashed: {
    backgroundColor: '#8B0000', // Change background color to red
  },
  buttonText: {
    fontSize: 20, // Adjust font size
    fontWeight: 'bold', // Add bold font weight
    color: 'black', // Change text color to black
  },
  menuText:{
    color: 'white',
    fontSize: 17,
    fontWeight: '300',
  },
  bgFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 7, // Match border radius
  },
});