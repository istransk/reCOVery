import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('symptomQuestions.db');

export default function Database() {
    const [isCrash, setIsCrash] = useState(false);

    const initializeDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Crash (id INTEGER PRIMARY KEY AUTOINCREMENT, dateStart STRING NOT NULL, dateEnd STRING, isCrash BOOLEAN DEFAULT TRUE);'
            );
        }, null, console.log('Table Crash initialized'));
    };


    const insertDataCrash = (dateStart) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Crash (dateStart) VALUES (?);',
                [dateStart],
                (_, { insertId }) => {
                    console.log(`Inserted crash with ID: ${insertId}`);
                    setIsCrash(true);
                },
                (_, error) => {
                    console.log('Error inserting crash', error);
                }
            );
        });
    };

    const updateDataCrash = (dateEnd) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE Crash SET dateEnd = ?, isCrash = FALSE WHERE isCrash = TRUE;',
                [dateEnd],
                (_, { rowsAffected }) => {
                    console.log(`Updated crash`);
                    setIsCrash(false);
                },
                (_, error) => {
                    console.log('Error updating crash', error);
                }
            );
        }, null, fetchDataIsCrash());
    };

    const fetchDataIsCrash = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Crash WHERE isCrash = TRUE;',
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        setIsCrash(true);
                    } else {
                        setIsCrash(false);
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


    return { insertDataCrash, fetchDataIsCrash, isCrash, fetchDataCrash, initializeDatabase, updateDataCrash, cleanDatabase };

}
