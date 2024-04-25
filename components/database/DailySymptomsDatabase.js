import db from './DefineDatabase';

const initializeDailySymptomsDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS DailySymptoms (id INTEGER PRIMARY KEY AUTOINCREMENT, symptom STRING NOT NULL, intensity INTEGER NOT NULL, date STRING NOT NULL, comment STRING DEFAULT NULL);'
        );
    }, null, console.log('Table DailySymptoms initialized'));
}

const insertDataDailySymptoms = (symptom, intensity, date, comment) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO DailySymptoms (symptom, intensity, date, comment) VALUES (?, ?, ?, ?);',
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
            'SELECT id, symptom, intensity, comment, date FROM DailySymptoms;',
            [],
            (_, { rows }) => {
                rollback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching symptoms', error);
            }
        );
    });
}

const fetchDataDailySymptomsByDate = (date, rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT id, symptom, intensity, comment, date FROM DailySymptoms WHERE date = ?;',
            [date],
            (_, { rows }) => {
                rollback(rows._array);
            },
            (_, error) => {
                console.log('Error fetching symptoms', error);
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

export {initializeDailySymptomsDatabase, insertDataDailySymptoms, fetchDataDailySymptoms, clearDailySymptomsDatabase, fetchDataDailySymptomsByDate}