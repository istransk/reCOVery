import db from './DefineDatabase';

const initializeDailySymptomsDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS DailySymptoms (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            symptomid INTEGER NOT NULL, 
            intensity INTEGER NOT NULL, 
            date DATE NOT NULL, 
            comment STRING DEFAULT NULL, 
            FOREIGN KEY (symptomid) REFERENCES Symptoms(id));`,
            [], null, (tx, error) => console.error('Error initializing DailySymptoms table:', error)
        );
    });
}

const insertDataDailySymptoms = (symptom, intensity, date, comment) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO DailySymptoms (symptomid, intensity, date, comment) VALUES (?, ?, ?, ?);',
            [symptom, intensity, date, comment],
            (_, { insertId }) => {
                console.log(`Inserted symptom with ID: ${insertId}`);
            },
            (_, error) => {
                console.log('Error inserting symptom', error);
            }
        );
    });
}

const fetchDataDailySymptoms = (rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT d.id, s.symptom, d.intensity, d.comment, d.date FROM DailySymptoms d INNER JOIN Symptoms s ON d.symptomid = s.id ;',
            [],
            (_, { rows }) => {
                rollback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching daily symptoms', error);
            }
        );
    });
}

const fetchDataDailySymptomsDateRange = (dateStart, dateEnd, rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT d.id, s.symptom, d.intensity, d.comment, d.date FROM DailySymptoms d 
            INNER JOIN Symptoms s ON d.symptomid = s.id 
            WHERE d.date BETWEEN ? AND ?;`,
            [dateStart, dateEnd],
            (_, { rows }) => {
                rollback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching daily symptoms', error);
            }
        );
    });
}

const clearDailySymptomsDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS DailySymptoms;'
        );
    }, null, console.log('Table DailySymptoms cleared'));
}

export {initializeDailySymptomsDatabase, insertDataDailySymptoms, fetchDataDailySymptoms, clearDailySymptomsDatabase, fetchDataDailySymptomsDateRange}