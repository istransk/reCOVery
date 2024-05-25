import { Text, View, TouchableOpacity, Platform, ScrollView, FlatList, Modal } from 'react-native';
import {  useState, useContext,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAllDataDailyActivities } from '../database/DailyActivitiesDatabase';
import { fetchDataDailySymptoms } from '../database/DailySymptomsDatabase';
import { fetchDataCrash } from '../database/CrashDatabase';
import { fetchDataSymptoms } from '../database/SymptomsDatabase';
import { dataDailyActivitiesTreatment, dataDailySymptomsTreatment, dataEachSymptomTreatment } from '../utils/DataTreatments';
import { decryption } from '../utils/encryption';
import { KeyContext } from '../contexts/KeyContext';


import { BarChart, LineChart } from 'react-native-gifted-charts';
import { categories } from '../utils/data';
import styles from '../styles/style';
import { AntDesign, Feather } from '@expo/vector-icons';
import CreatePdf from '../components/CreatePdf';

export default function Results({navigation}) {
  const [listSymptoms, setListSymptoms] = useState([]);
  const [listCurrentSymptoms, setListCurrentSymptoms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const backgroundColorEnergizing = '#0D497F';
  const backgroundColorTiring = '#D96B6A';
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = today.split('-')[1];
  const [dailyActivitiesTreated, setDailyActivitiesTreated] = useState([]);
  const [dataCrash, setDataCrash] = useState([]);
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const currentMonthName = months[parseInt(currentMonth) - 1];
  const key = useContext(KeyContext);

  useFocusEffect(
    useCallback(() => {
      fetchDataSymptoms(results => {
        const decryptedData = results.map(item => ({
          ...item,
          symptom: decryption(item.symptom, key),
          intensity: Number(decryption(item.intensity, key)),
        }));
        setListCurrentSymptoms(decryptedData.filter(item => item.intensity > 0));
      });
      fetchDataCrash(results => {
        const decryptedData = results.map(item => ({
          ...item,
          dateStart: decryption(item.dateStart, key),
          dateEnd: item.dateEnd ? decryption(item.dateEnd, key) : null,
        }));
        setDataCrash(decryptedData);

      });
      fetchDataDailySymptoms(results => {
        const decryptedData = results.map(item => ({
          ...item,
          symptom: decryption(item.symptom, key),
          date: decryption(item.date, key),
          intensity: Number(decryption(item.intensity, key)),
          comment: decryption(item.comment, key),
        }));
        setListSymptoms(decryptedData);
      });
      fetchAllDataDailyActivities(results => {
        const decryptedData = results.map(item => ({
          
            ...item,
            activity: decryption(item.activity, key),
            category: decryption(item.category, key),
            comment: decryption(item.comment, key),
            date: decryption(item.date, key),
            duration: Number(decryption(item.duration, key)),
          }));
        setDailyActivitiesTreated(dataDailyActivitiesTreatment(decryptedData));
      });

    }, [])); 
  
  const dataChartMonthlyActivitiesPerCategory = (category, data, yearWanted) => {
    const dataChart = [];
    for (const year in data) {
      if (year == yearWanted){
        for (const month in data[year]) {
          const monthName = months[parseInt(month) - 1];
          const value = data[year][month][category];
          dataChart.push({ label: monthName, value: value });
        }
      }
    }
    return dataChart;
  }
  
  const dataChartDailyActivities = (category, data, yearWanted, monthWanted) => {
    let frontColor;
    switch (category) {
      case categories[0]:
        frontColor = backgroundColorEnergizing;
        break;
      case categories[1]:
        frontColor = backgroundColorTiring;
        break;
    }
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

    dataChart.sort((a, b) => {
      return parseInt(a.label) - parseInt(b.label);
    });
    return (
      <View style={{marginBottom:20}}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
          }}>Activités {category}es</Text>
        <BarChart 
          data={dataChart} 
          frontColor={frontColor}
          barWidth={15}
          spacing={24}
          xAxisThickness={1}
          yAxisThickness={0}
          xAxisColor={'#72665A'}
          rulesColor={'#72665A'}
        />
      </View>
    );

  }

  const dataChartMonthlyActivities = (data, year) => {
    dataChartRegenerating = dataChartMonthlyActivitiesPerCategory(categories[1], data, year);
    dataChartTiring = dataChartMonthlyActivitiesPerCategory(categories[0], data, year);
    const barData = [];
    const monthOrder = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    
    // Sort the dataChartRegenerating array based on the month order
    dataChartRegenerating.sort((a, b) => {
      const monthIndexA = monthOrder.indexOf(a.label);
      const monthIndexB = monthOrder.indexOf(b.label);
      return monthIndexA - monthIndexB;
    });
    dataChartTiring.sort((a, b) => {
      const monthIndexA = monthOrder.indexOf(a.label);
      const monthIndexB = monthOrder.indexOf(b.label);
      return monthIndexA - monthIndexB;
    });

    for (let i = 0; i < dataChartRegenerating.length; i++) {
      barData.push({
        value: dataChartRegenerating[i].value, 
        label: dataChartRegenerating[i].label, 
        frontColor: backgroundColorEnergizing,
        spacing: 2,
        labelWidth: 30,
      });
      barData.push({
        value: dataChartTiring[i].value, 
        frontColor: backgroundColorTiring});
    }

    const renderTitle = () => {

      return(
        <View >
        <Text
          style={{
            fontSize: 20,
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
                backgroundColor: backgroundColorEnergizing,
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
                backgroundColor: backgroundColorTiring,
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
      <View >
        {renderTitle()}
        <BarChart 
          data={barData} 
          barWidth={15}
          spacing={24}
          xAxisThickness={0}
          yAxisThickness={0}
          rulesColor={'#72665A'}
        />
      </View>
    )
  }

  const dataChartSymptoms = (yearWanted, monthWanted) => {
    const data = dataEachSymptomTreatment(listSymptoms, yearWanted, monthWanted);
    return listCurrentSymptoms.map(({ symptom }) => {
      const dataChart = data
        .filter(item => symptom == item.symptom)
        .map(item => ({ label: item.date.split('-')[2], value: item.intensity }));
        
        dataChart.sort((a, b) => {
          return parseInt(a.label) - parseInt(b.label);
        });
      return (
        <View key={symptom} style={{marginBottom: 20}}>
          <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
          }}>{symptom}</Text>
          <BarChart
            data={dataChart}
            frontColor={'black'}
            barWidth={15}
            spacing={24}
            xAxisThickness={1}
            yAxisThickness={0}
            maxValue={3}
            stepValue={1}
            xAxisColor={'#72665A'}
            rulesColor={'#72665A'}
          />
        </View>
      );
    });
  };

  const dataChartDailySymptoms = (data, yearWanted, monthWanted) => {
    const dataChart = [];
    for (const year in data) {
      if (year == yearWanted){
        for (const month in data[year]) {
          if (month == monthWanted){
            for (const day in data[year][month]) {
              if (day !=="averageIntensity"){
                const value = data[year][month][day].averageIntensity;
                dataChart.push({ label: day, value: value });
              }
            }
            break;
          }
        }
      }
    }

    dataChart.sort((a, b) => {
      return parseInt(a.label) - parseInt(b.label);
    });

    return (
      <View style={{marginBottom:20}}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
          }}>Moyenne des symptômes</Text>
        <LineChart
          data={dataChart}
          frontColor={'black'}
          lineThickness={2}
          xAxisThickness={1}
          xAxisColor={'#72665A'}
          yAxisThickness={0}
          maxValue={3}
          stepValue={1}
          rulesColor={'#72665A'}
        />
      </View>
    )

  }

  const numberCrashes = (monthWanted) => {
    let countCrashes = 0;
    const listCrashes = [];
    for (const crash of dataCrash) {
      const month = crash.dateStart.split('-')[1];
      if (month == monthWanted){
        listCrashes.push(crash);
        countCrashes++;
      }
    }
    return (
      <View style={{marginBottom:20}}>
        <Text
          style={{
            margin: 10,
            fontSize: 20,
          }}>Nombre de Crash: {countCrashes}</Text>
        <FlatList
          data={listCrashes}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={{margin: 10}}>
              <Text>{index + 1})  Du {item.dateStart.split('-')[2]} {currentMonthName} {item.dateStart.split('-')[0]} au {item.dateEnd ? `${item.dateEnd.split('-')[2]} ${currentMonthName} ${item.dateEnd.split('-')[0]}` : '-'}</Text>
            </View>
          )}
        />
      </View>
    );
  }

  


  return (
    <View style={styles.container}>
      <Modal 
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.text}>
                  Ici tu peux voir tes résultats du mois sous forme de graphiques. {"\n"}
                  {"\n"}
                  Tu peux également envoyer tes données à ton térapeute en cliquant sur l'icône {<Feather name="send" size={18} color="black" />} en haut à droite. {"\n"}
                  Les données envoyées sont celles des deux semaines précédente. {"\n"}
                </Text>
              </ScrollView>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.contentContainer}>
        <CreatePdf /> 
      <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setModalVisible(true)}>
          <AntDesign name="questioncircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{fontSize: 20}}>{currentMonthName} {currentYear}</Text>
        <View style={{marginBottom:65, width:'95%'}}>
        <ScrollView>     
          {numberCrashes(currentMonth)}
          {dataChartDailyActivities(categories[0], dailyActivitiesTreated, currentYear, currentMonth)}
          {dataChartDailyActivities(categories[1], dailyActivitiesTreated, currentYear, currentMonth)}
          {dataChartDailySymptoms(dataDailySymptomsTreatment(listSymptoms), currentYear, currentMonth)}
          
          {dataChartSymptoms(currentYear, currentMonth)}
        </ScrollView>
        </View>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.bottomButtonText}>ACCUEIL</Text>
        </TouchableOpacity>
        
      </View>
      {Platform.OS === 'ios' ? <View style={styles.iphoneBottom}></View> : null}
    </View>
  );
}
