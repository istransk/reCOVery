import db from './DefineDatabase';

let activities = [];
    
const initializeDatabaseActivities = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Activities (id INTEGER PRIMARY KEY AUTOINCREMENT, activity STRING NOT NULL UNIQUE, category STRING NOT NULL);'
        );
    }, null, console.log('Table Activities initialized'));
}

const clearDatabaseActivities = () => {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS Activities;'
        );
    }, null, console.log('Table Activities cleared'));
}

const insertDataActivities = (activity, category) => {
    console.log('Inserting activity:', activity, 'category:', category, 'into database.');
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Activities (activity, category) VALUES (?, ?);',
            [activity, category],
            (_, { insertId }) => {
                console.log(`Inserted activity with ID: ${insertId}`);
            },
            (_, error) => {
                console.log('Error inserting activity', error);
            }
        );
    });
}

const fetchDataActivities = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT id, activity, category FROM Activities;',
            [],
            (_, { rows }) => {
                activities = rows._array;
                //sort activities by activity name
                activities.sort((a, b) => {
                    const activityA = a.activity.toLowerCase();
                    const activityB = b.activity.toLowerCase();
                    if (activityA < activityB) {
                        return -1;
                    }
                    if (activityA > activityB) {
                        return 1;
                    }
                    return 0;
                })
                callback(activities);
            },
            (_, error) => {
                console.log('Error fetching activitie', error);
            }
        );
    });
}

export {initializeDatabaseActivities, insertDataActivities, fetchDataActivities, clearDatabaseActivities};
