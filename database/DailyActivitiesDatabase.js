import db from './DefineDatabase';


const initializeDailyActivitiesDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS DailyActivities (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                activityid INTEGER NOT NULL, 
                date STRING NOT NULL, 
                duration STRING NOT NULL, 
                comment STRING,
                FOREIGN KEY (activityid) REFERENCES Activities(id)
            );`,
            [], null, (tx, error) => console.error('Error initializing DailySymptoms table:', error)
            );
        });
    }

const clearDailyActivitiesDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS DailyActivities;'
        );
    }, null, console.log('Table DailyActivities cleared'));
}

const insertDataDailyActivities = (activityid, duration, date, comment) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO DailyActivities (activityid, duration, date, comment) VALUES (?, ?, ?, ?);',
            [activityid, duration, date, comment],
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
            `SELECT d.id, a.activity, a.category, d.duration, d.comment 
            FROM DailyActivities d INNER JOIN Activities a ON d.activityid = a.id
            WHERE d.date = ?;`,
            [date],
            (_, { rows }) => {
                rollback(rows._array);
            },
                (_, error) => {
                console.log('Error fetching activities', error);
            }
        );
    });
}

const fetchAllDataDailyActivities = (rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT d.id, d.date, a.activity, a.category, d.duration, d.comment 
            FROM DailyActivities d INNER JOIN Activities a ON d.activityid = a.id;`,
            [],
            (_, { rows }) => {
                rollback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching all activities', error);
            }
        );
    });
}

const fetchDataDailyActivitiesDateRange = (dateStart, dateEnd, rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT d.id, a.activity, a.category, d.duration, d.date, d.comment 
            FROM DailyActivities d INNER JOIN Activities a ON d.activityid = a.id
            WHERE d.date > ? AND d.date <= ?;`,
            [dateStart, dateEnd],
            (_, { rows }) => {
                rollback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching daily activities', error);
            }
        );
    });
}



export {initializeDailyActivitiesDatabase, insertDataDailyActivities, fetchDataDailyActivities, fetchAllDataDailyActivities, clearDailyActivitiesDatabase, fetchDataDailyActivitiesDateRange }
