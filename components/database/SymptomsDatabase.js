import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import db from './DefineDatabase';

export default function SymptomsDatabase() {
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
                'DROP TABLE Symptoms;'
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

    const fetchDataSymptoms = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Symptoms;',
                [],
                (_, { rows }) => {
                    const data = rows._array;
                    console.log(data);
                },
                (_, error) => {
                    console.log('Error fetching symptoms', error);
                }
            );
        });
    }

    return {initializeDatabaseSymptoms, insertDataSymptoms, updateDataSymptoms, fetchDataSymptoms, clearDatabaseSymptoms};
}