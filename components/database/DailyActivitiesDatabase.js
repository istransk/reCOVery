import db from './DefineDatabase';


const initializeDailyActivitiesDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS DailyActivities (id INTEGER PRIMARY KEY AUTOINCREMENT, activity STRING NOT NULL, category STRING NOT NULL, date STRING NOT NULL, duration INTEGER NOT NULL, comment STRING);'
        );
    }, null, console.log('Table DailyActivities initialized'));
}

const insertDataDailyActivities = (activity, category, duration, date, comment) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO DailyActivities (activity, category, duration, date, comment) VALUES (?, ?, ?, ?, ?);',
            [activity, category, duration, date, comment],
            (_, { insertId }) => {
                console.log(`Inserted activity with ID: ${insertId}`);
            },
            (_, error) => {
                console.log('Error inserting activity', error);
            }
        );
    });
}

const fetchDataDailyActivities = (date, rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT id, activity, category, duration, comment FROM DailyActivities WHERE date = ?;',
            [date],
            (_, { rows }) => {
                rollback(rows._array);
                console.log('Fetched activities', rows._array);
            },
                (_, error) => {
                console.log('Error fetching activities', error);
            }
        );
    });
}


export {initializeDailyActivitiesDatabase, insertDataDailyActivities, fetchDataDailyActivities}
