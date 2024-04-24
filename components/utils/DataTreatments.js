import { categories } from "../database/Symptoms";

const dataDailyActivitiesTreatment = (activities) => {
    const dataTreated = {}
    activities.forEach(activity => {
      const { category, date, duration } = activity;
      const [year, month, day] = date.split('-');

      if (!dataTreated[year]) {
        dataTreated[year] = {};
    }

    // Ensure that dataTreated[year][month] exists
    if (!dataTreated[year][month]) {
        dataTreated[year][month] = {};
    }

    // Ensure that dataTreated[year][month][category] exists
    if (!dataTreated[year][month][category]) {
        dataTreated[year][month][category] = 0;
    }

    // Aggregate duration for category within month
    dataTreated[year][month][category] += duration;

    // Ensure that dataTreated[year][month][day] exists
    if (!dataTreated[year][month][day]) {
        dataTreated[year][month][day] = {};
    }

    // Ensure that dataTreated[year][month][day][category] exists
    if (!dataTreated[year][month][day][category]) {
        dataTreated[year][month][day][category] = 0;
    }
    // Aggregate duration for category within day
    dataTreated[year][month][day][category] += duration;
    });
    return dataTreated;
  }