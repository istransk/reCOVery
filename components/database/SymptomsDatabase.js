import db from './DefineDatabase';


const initializeDatabaseSymptoms = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Symptoms (id INTEGER PRIMARY KEY AUTOINCREMENT, symptom STRING NOT NULL UNIQUE, intensity INTEGER NOT NULL);'
        );
    }, null, console.log('Table Symptoms initialized'));
}

const clearDatabaseSymptoms = () => {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS Symptoms;'
        );
    }, null, console.log('Table Symptoms cleared'));
}

const insertDataSymptoms = (symptom, intensity) => {
    console.log('Inserting symptom');
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Symptoms (symptom, intensity) VALUES (?, ?);',
            [symptom, intensity],
            (_, { insertId }) => {
                console.log(`Inserted symptom with ID: ${insertId}`);
            },
            (_, error) => {
                console.log('Error inserting symptom', error);
            }
        );
    });
}

const updateDataSymptoms = (symptom, intensity) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE Symptoms SET intensity = ? WHERE symptom = ?;',
            [intensity, symptom],
            (_, { rowsAffected }) => {
                console.log(`Updated symptom`);
            },
            (_, error) => {
                console.log('Error updating symptom', error);
            }
        );
    });
}

const fetchDataSymptoms = (rollback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT symptom, intensity FROM Symptoms;',
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

export {initializeDatabaseSymptoms, insertDataSymptoms, updateDataSymptoms, fetchDataSymptoms, clearDatabaseSymptoms};
