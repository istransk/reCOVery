import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchDataSymptoms } from '../database/SymptomsDatabase';
import { fetchDataAllDailyActivities } from '../database/DailyActivitiesDatabase';
import { BarChart } from 'react-native-gifted-charts';
import { categories } from '../database/Symptoms';

export default function Results({navigation}) {
  const [listDailyActivities, setListDailyActivities] = useState([]);
  const [listSymptoms, setListSymptoms] = useState([]);
  const [dataActivities, setDataActivities] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDataSymptoms(results => setListSymptoms(results));
    fetchDataAllDailyActivities(results => setListDailyActivities(results));
  }, []);

  const activities = [
    {"activity": "Lecture", "category": "Fatigant", "comment": "No", "date": "2024-04-22", "duration": 20, "id": 1},
    {"activity": "Jardinage", "category": "Fatigant", "comment": "Je ne sais pas ", "date": "2024-04-23", "duration": 30, "id": 2},
    {"activity": "Ménage", "category": "Fatigant", "comment": "C'est du propre ", "date": "2024-04-23", "duration": 45, "id": 3},
    {"activity": "Sport", "category": "Fatigant", "comment": "Mieux que je ne suis pas sûre que tu vas bien Je suis aussi membre de l'équipe ", "date": "2024-04-23", "duration": 30, "id": 4},
    {"activity": "Marche en pleine nature", "category": "Régénérant", "comment": "C'est beau", "date": "2024-04-23", "duration": 50, "id": 5},
    {"activity": "Cuisine", "category": "Fatigant", "comment": "Préparation de dîner", "date": "2024-04-22", "duration": 35, "id": 6},
    {"activity": "Cuisine", "category": "Fatigant", "comment": "Préparation de dîner", "date": "2024-04-22", "duration": 40, "id": 25},
    {"activity": "Yoga", "category": "Régénérant", "comment": "Préparation de dîner", "date": "2024-04-22", "duration": 35, "id": 6},
    {"activity": "Course à pied", "category": "Fatigant", "comment": "Entraînement quotidien", "date": "2024-04-23", "duration": 40, "id": 7},
    {"activity": "Yoga", "category": "Régénérant", "comment": "Séance de relaxation", "date": "2024-04-24", "duration": 60, "id": 8},
    {"activity": "Peinture", "category": "Régénérant", "comment": "Peinture artistique", "date": "2024-04-24", "duration": 45, "id": 9},
    {"activity": "Lecture", "category": "Régénérant", "comment": "Lecture avant le coucher", "date": "2024-04-25", "duration": 30, "id": 10},
    {"activity": "Running", "category": "Fatigant", "comment": "Morning run", "date": "2024-05-15", "duration": 45, "id": 11},
    {"activity": "Hiking", "category": "Fatigant", "comment": "Exploring nature trails", "date": "2024-05-16", "duration": 60, "id": 12},
    {"activity": "Yoga", "category": "Régénérant", "comment": "Morning yoga session", "date": "2024-05-17", "duration": 50, "id": 13},
    {"activity": "Reading", "category": "Régénérant", "comment": "Reading in the garden", "date": "2024-05-18", "duration": 40, "id": 14},
    {"activity": "Cooking", "category": "Fatigant", "comment": "Cooking dinner", "date": "2024-06-10", "duration": 45, "id": 15},
    {"activity": "Gardening", "category": "Fatigant", "comment": "Planting flowers", "date": "2024-06-11", "duration": 60, "id": 16},
    {"activity": "Yoga", "category": "Régénérant", "comment": "Evening yoga practice", "date": "2024-06-12", "duration": 50, "id": 17},
    {"activity": "Reading", "category": "Régénérant", "comment": "Reading before bed", "date": "2024-06-13", "duration": 40, "id": 18}
  ];
  
  

  const dataDailyActivitiesTreatment = (activities) => {
    const dataTreated = {}
    activities.forEach(activity => {
      const { category, date, duration } = activity;
      const [year, month, day] = date.split('-');

      if (!dataTreated[year]) {
        dataTreated[year] = {};
    }
    
    if (!dataTreated[year][month]) {
        dataTreated[year][month] = {};
    }
    
    if (!dataTreated[year][month][category]) {
        dataTreated[year][month][category] = 0;
    }

    dataTreated[year][month][category] += duration;

    if (!dataTreated[year][month][day]) {
        dataTreated[year][month][day] = {};
    }

    if (!dataTreated[year][month][day][category]) {
        dataTreated[year][month][day][category] = 0;
    }

    dataTreated[year][month][day][category] += duration;
    });
    return dataTreated;
  }
  
  const dataChartMonthlyActivitiesPerCategory = (category, data, yearWanted) => {
    const dataChart = [];
    let monthName = '';
    for (const year in data) {
      if (year == yearWanted){
        for (const month in data[year]) {
          switch (month) {
            case '01': monthName = 'Janvier'; break;
            case '02': monthName = 'Février'; break;
            case '03': monthName = 'Mars'; break;
            case '04': monthName = 'Avril'; break;
            case '05': monthName = 'Mai'; break;
            case '06': monthName = 'Juin'; break;
            case '07': monthName = 'Juillet'; break;
            case '08': monthName = 'Août'; break;
            case '09': monthName = 'Septembre'; break;
            case '10': monthName = 'Octobre'; break;
            case '11': monthName = 'Novembre'; break;
            case '12': monthName = 'Décembre'; break;
          }
          const value = data[year][month][category];
          dataChart.push({ label: monthName, value: value });
        }
      }
    }
    return dataChart;
  }
  
  const dataChartDailyActivities = (category, data, yearWanted, monthWanted) => {
    const dataChart = [];
    for (const year in data) {
      if (year == yearWanted){
        for (const month in data[year]) {
          if (month == monthWanted){
            for (const day in data[year][month]) {
              const value = data[year][month][day][category];
              if (day != categories[0] && day != categories[1]){
                dataChart.push({ label: day, value: value });
              }
            }
          }
        }
      }
    }
    return dataChart;

  }

  const dataChartMonthlyActivities = (data, year) => {
    dataChartRegenerating = dataChartMonthlyActivitiesPerCategory(categories[1], data, year);
    dataChartTiring = dataChartMonthlyActivitiesPerCategory(categories[0], data, year);
    const barData = [];
    /*
      {
          value: 40,
          label: 'Jan',
          spacing: 2,
          labelWidth: 30,
          labelTextStyle: {color: 'gray'},
          frontColor: '#177AD5',
        },
        {value: 20, frontColor: '#ED6665'},
    */
    for (let i = 0; i < dataChartRegenerating.length; i++) {
      barData.push({
        value: dataChartRegenerating[i].value, 
        label: dataChartRegenerating[i].label, 
        frontColor: '#177AD5',
        spacing: 2,
        labelWidth: 30,
      });
      barData.push({
        value: dataChartTiring[i].value, 
        frontColor: '#ED6665'});
    }

    const renderTitle = () => {

      return(
        <View >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Activités de {year}
        </Text>
      
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                marginRight: 8,
              }}
            />
            <Text>
              {categories[0]}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#ED6665',
                marginRight: 8,
              }}
            />
            <Text>
              {categories[1]}
            </Text>
          </View>
        </View>
      )
  }

    return (
      <View>
        {renderTitle()}
        <BarChart 
          data={barData} 
          barWidth={15}
          spacing={24}
          xAxisThickness={0}
          yAxisThickness={0}
        />
      </View>
    )
  }

  


  return (
    <View style={styles.container}>
      {console.log(dataChartDailyActivities(categories[0], dataDailyActivitiesTreatment(activities), 2024, '04'))}
     {dataChartMonthlyActivities(dataDailyActivitiesTreatment(activities), 2024)}
      <TouchableOpacity style={styles.resultsButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuText}>HOME</Text>
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
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  menuText:{
    color: 'white',
    fontSize: 17,
    fontWeight: '300',
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
  
});
