import {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/screens/Home';
import Results from './components/screens/Results';
import Questionnaire from './components/screens/Questionnaire';
import Activities from './components/screens/activities/Activities';
import AddActivities from './components/screens/activities/AddDailyActivity';
import AddNewActivity from './components/screens/activities/AddNewActivity';
import Loading from './components/screens/Loading';
import Initializing from './components/screens/Initializing';
import {fetchDataSymptoms} from './components/database/SymptomsDatabase';
import {initializeDailyActivitiesDatabase} from './components/database/DailyActivitiesDatabase';
import { initializeDailySymptomsDatabase } from './components/database/DailySymptomsDatabase';

const Tab = createBottomTabNavigator();

export default function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDailyActivitiesDatabase();
    initializeDailySymptomsDatabase();
    try {
      fetchDataSymptoms(results => setSymptoms(results));
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
        {symptoms.length === 0 && (<Tab.Screen name="Initializing" component={Initializing} />)}
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Questionnaire" component={Questionnaire} />
            <Tab.Screen name="Results" component={Results} />
            <Tab.Screen name="Activities" component={Activities} />
            <Tab.Screen name="AddActivities" component={AddActivities} />
            <Tab.Screen name="AddNewActivity" component={AddNewActivity} />
          
      </Tab.Navigator>
    </NavigationContainer>
  );
}
