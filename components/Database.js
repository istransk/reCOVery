import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('symptomQuestions.db');

export default function Database() {
    const [isCrash, setIsCrash] = useState(false);

    useEffect(() => {
        console.log("isCrash:", isCrash);
    }, [isCrash]);


    const initializeDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Crash (id INTEGER PRIMARY KEY AUTOINCREMENT, dateStart DATETIME NOT NULL, dateEnd DATETIME, isCrash BOOLEAN DEFAULT TRUE);'
            );
        }, null, fetchDataIsCrash);
    };


    const insertDataCrash = (dateStart) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Crash (dateStart) VALUES (?);',
                [dateStart],
                (_, { insertId }) => {
                    console.log(`Inserted crash with ID: ${insertId}`);
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
                'UPDATE Crash SET dateEnd = ?, isCrash = FALSE WHERE is Crash = TRUE;',
                [dateEnd],
                (_, { rowsAffected }) => {
                    console.log(`Updated crash`);
                },
                (_, error) => {
                    console.log('Error updating crash', error);
                }
            );
        });
        setIsCrash(false);
    };

    const fetchDataIsCrash = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Crash WHERE isCrash = TRUE;',
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        setIsCrash(true);
                        console.log(rows.length);
                    } else {
                        setIsCrash(false);
                        console.log(rows.length);
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

    return { insertDataCrash, fetchDataIsCrash, isCrash, fetchDataCrash, initializeDatabase, updateDataCrash };

}
