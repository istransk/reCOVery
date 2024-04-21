import { StyleSheet } from 'react-native';
import {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/screens/Home';
import Results from './components/screens/Results';
import Questionnaire from './components/screens/Questionnaire';
import Activities from './components/screens/Activities';
import AddActivities from './components/screens/AddActivities';
import Loading from './components/screens/Loading';
import Database from './components/Database';
import Initializing from './components/screens/Initializing';
import ActivitiesDatabase from './components/database/ActivitiesDatabase';
import SymptomsDatabase from './components/database/SymptomsDatabase';
import DailyActivitiesDatabase from './components/database/DailyActivitiesDatabase';

const Tab = createBottomTabNavigator();

export default function App() {
  const {initializeDatabase,cleanDatabase} = Database();
  const {initializeDatabaseActivities} = ActivitiesDatabase();
  const {initializeDatabaseSymptoms, insertDataSymptoms, fetchDataSymptoms, clearDatabaseSymptoms, symptoms} = SymptomsDatabase();
  const {initializeDailyActivitiesDatabase} = DailyActivitiesDatabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDailyActivitiesDatabase();
    try {
      fetchDataSymptoms();
    } catch (error) {
      console.log('Error fetching symptoms', error);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 700); 

  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false,tabBarStyle: {display:"none"}}}>
        {symptoms.length > 0 ?
          (<>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Questionnaire" component={Questionnaire} />
            <Tab.Screen name="Results" component={Results} />
            <Tab.Screen name="Activities" component={Activities} />
            <Tab.Screen name="AddActivities" component={AddActivities} />
          </>)
          : 
          (<Tab.Screen name="Initializing" component={Initializing} />) 
        }
          
      </Tab.Navigator>
    </NavigationContainer>
  );
}
