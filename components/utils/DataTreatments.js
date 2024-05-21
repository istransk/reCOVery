import { categories } from "../database/Symptoms";

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
        
        if (!dataTreated[year][month][categories[0]]) {
            dataTreated[year][month][categories[0]] = 0;
        }
        if (!dataTreated[year][month][categories[1]]) {
            dataTreated[year][month][categories[1]] = 0;
        }

        dataTreated[year][month][category] += duration;

        if (!dataTreated[year][month][day]) {
            dataTreated[year][month][day] = {};
        }

        if (!dataTreated[year][month][day][categories[0]]) {
            dataTreated[year][month][day][categories[0]] = 0;
        }
        if (!dataTreated[year][month][day][categories[1]]) {
            dataTreated[year][month][day][categories[1]] = 0;
        }

        dataTreated[year][month][day][category] += duration;
    });
    return dataTreated;
}

const dataDailySymptomsTreatment = (data) => {
    const transformedData = {};

    data.forEach(({ date, intensity }) => {
        const [year, month, day] = date.split('-');
        transformedData[year] = transformedData[year] || {};
        transformedData[year][month] = transformedData[year][month] || {};
        transformedData[year][month][day] = transformedData[year][month][day] || { totalIntensity: 0, count: 0 };
        transformedData[year][month][day].totalIntensity += intensity;
        transformedData[year][month][day].count++;
    });

    Object.entries(transformedData).forEach(([year, months]) => {
        Object.entries(months).forEach(([month, days]) => {
            let totalIntensityMonth = 0;
            let countMonth = 0;
            Object.entries(days).forEach(([day, data]) => {
                const averageIntensityDay = data.totalIntensity / data.count;
                transformedData[year][month][day].averageIntensity = averageIntensityDay;
                totalIntensityMonth += averageIntensityDay;
                countMonth++;
                delete transformedData[year][month][day].totalIntensity;
                delete transformedData[year][month][day].count;
            });
            const averageIntensityMonth = totalIntensityMonth / countMonth;
            transformedData[year][month].averageIntensity = averageIntensityMonth;
        });
    });

    return transformedData;
};

const dataEachSymptomTreatment = (data, yearWanted, monthWanted) => {
    const listData = [];
    data.forEach(({ symptom, date, intensity }) => {
        let month = date.split('-')[1];
        let year = date.split('-')[0];
        if (symptom && year == yearWanted && month == monthWanted){
          listData.push({symptom: symptom, intensity: intensity, date: date});
        } 
    });

    return listData;

}

  



  export { dataDailyActivitiesTreatment, dataDailySymptomsTreatment, dataEachSymptomTreatment}