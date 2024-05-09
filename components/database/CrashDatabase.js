import db from './DefineDatabase';

const initializeCrashDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Crash (id INTEGER PRIMARY KEY AUTOINCREMENT, dateStart STRING NOT NULL, dateEnd STRING DEFAULT NULL, isCrash BOOLEAN DEFAULT TRUE);'
        );
    }, null, console.log('Table Crash initialized'));
};

const insertCrashData = (dateStart, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Crash (dateStart) VALUES (?);',
            [dateStart],
            (_, { insertId }) => {
                console.log(`Inserted crash with ID: ${insertId}`);
                callback(true);
            },
            (_, error) => {
                console.log('Error inserting crash', error);
                callback(false);
            }
        );
    });
};

const updateCrashData = (dateEnd, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE Crash SET dateEnd = ? WHERE dateEnd IS NULL;',
            [dateEnd],
            (_, { rowsAffected }) => {
                console.log(`Updated crash`);
                callback(false);
            },
            (_, error) => {
                console.log('Error updating crash', error);
                callback(true);
            }
        );
    });
};

const fetchDataIsCrash = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM Crash WHERE dateEnd IS NULL;',
            [],
            (_, { rows }) => {
                if (rows.length > 0) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        );
    }); 
};

const fetchDataCrash = () => {
    console.log('Fetching crash data');
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM Crash;',
            [],
            (_, { rows }) => {
                console.log('Crash data', rows._array);
            }
        );
    });
};

const cleanDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS Crash;'
        );
    }, null, console.log('Database cleaned'));
};

export { insertCrashData, fetchDataIsCrash, fetchDataCrash, initializeCrashDatabase, updateCrashData, cleanDatabase };
