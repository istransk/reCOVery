import {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Results from './screens/Results';
import Questionnaire from './screens/Questionnaire';
import Activities from './screens/activities/Activities';
import AddActivities from './screens/activities/AddDailyActivity';
import Loading from './screens/Loading';
import Initializing from './screens/Initializing';
import {fetchDataSymptoms} from './database/SymptomsDatabase';
import { KeyProvider } from './contexts/KeyContext';

const Tab = createBottomTabNavigator();

export default function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    <KeyProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{headerShown: false,tabBarStyle: {display:"none"}}}>
          {symptoms.length === 0 && (<Tab.Screen name="Initializing" component={Initializing} />)}
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Questionnaire" component={Questionnaire} />
              <Tab.Screen name="Results" component={Results} />
              <Tab.Screen name="Activities" component={Activities} />
              <Tab.Screen name="AddActivities" component={AddActivities} />  
        </Tab.Navigator>
      </NavigationContainer>
    </KeyProvider>
  );
}
