import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import React, {useEffect, useState} from 'react';

export default function Home({navigation}) {
    const [pressAction] = useState(new Animated.Value(0)); // State variable for the animated value
    const ACTION_TIMER = 1000; // Duration of the action
    const [buttonWidth, setButtonWidth] = useState(0); // State variable for buttonWidth
    const [buttonHeight, setButtonHeight] = useState(0); // State variable for buttonHeight
    const COLORS = ['#8B0000', '#8B0000']; // Example colors for interpolation
    let _value = 0; // Initialize _value

    // Function to handle layout event and update buttonWidth and buttonHeight
  const getButtonWidthLayout = (e) => {
    setButtonWidth(e.nativeEvent.layout.width-2 );
    setButtonHeight(e.nativeEvent.layout.height-2);
  };

  const getProgressStyles = () => {
    const width = pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: [0, buttonWidth],
    });
    const bgColor = pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: COLORS,
    });
    return {
      width: width,
      height: buttonHeight,
      backgroundColor: bgColor,
    };
  };

  // Effect to add listener when component mounts
  useEffect(() => {
    const listener = pressAction.addListener((v) => {
      _value = v.value; // Update _value when pressAction changes
    });

    // Cleanup function to remove the listener when component unmounts
    return () => pressAction.removeListener(listener);
  }, [pressAction]); // Run effect whenever pressAction changes

  // Function to handle touch event
  const handlePressIn = () => {
    Animated.timing(pressAction, {
      toValue: 1,
      duration: ACTION_TIMER, // Adjust duration as needed
      useNativeDriver: false,
    }).start();
  };

  // Function to handle release event
  const handlePressOut = () => {
    Animated.timing(pressAction, {
      toValue: 0,
      duration: _value * ACTION_TIMER, // Adjust duration as needed
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <View style={styles.crashButton} onLayout={getButtonWidthLayout}>
                <Animated.View style={[styles.bgFill, getProgressStyles()]}/>
                <Text style={styles.buttonText}>CRASH</Text>
            </View>
        </TouchableWithoutFeedback>
      <StatusBar style="auto" />
      <View style={styles.buttonContainer}>
        <Button title="Résultats" onPress={() => navigation.navigate('Results')} color={'grey'} />
        </View>
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
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
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
buttonText: {
    fontSize: 20, // Adjust font size
    fontWeight: 'bold', // Add bold font weight
    color: 'black', // Change text color to black
},
bgFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 7, // Match border radius
}
});
