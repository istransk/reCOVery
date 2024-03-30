import { StyleSheet } from 'react-native';
import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/screens/Home';
import Results from './components/screens/Results';
import Questionnaire from './components/screens/Questionnaire';
import Database from './components/Database';

const Tab = createBottomTabNavigator();

export default function App() {
  const {initializeDatabase} = Database();

  useEffect(() => {
    initializeDatabase();
    console.log('Database initialized in App.js');
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false,tabBarStyle: {display:"none"}}}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Questionnaire" component={Questionnaire} />
        <Tab.Screen name="Results" component={Results} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
