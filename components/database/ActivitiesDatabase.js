import db from './DefineDatabase';
import { useState } from 'react';

export default function ActivitiesDatabase() {
    const [activitiesList, setActivitiesList] = useState([]); // [activity, category]
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
        console.log('Inserting activity');
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

    const fetchDataActivities = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT id, activity, category FROM Activities;',
                [],
                (_, { rows }) => {
                    setActivitiesList(rows._array);
                },
                (_, error) => {
                    console.log('Error fetching activitie', error);
                }
            );
        });
    }

    return {initializeDatabaseActivities, insertDataActivities, activitiesList, fetchDataActivities};
}