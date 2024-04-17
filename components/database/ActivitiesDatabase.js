import db from './DefineDatabase';
import { useState } from 'react';

export default function ActivitiesDatabase() {
    const [activities, setActivities] = useState([]); // [activity, category]
    const initializeDatabaseActivities = () => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Activities (id INTEGER PRIMARY KEY AUTOINCREMENT, activity STRING NOT NULL UNIQUE, category STRING NOT NULL);'
            );
        }, null, console.log('Table Activities initialized'));
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
                'SELECT activity, category FROM Activities;',
                [],
                (_, { rows }) => {
                    setActivities(rows._array);
                },
                (_, error) => {
                    console.log('Error fetching activities', error);
                }
            );
        });
    }

    return {initializeDatabaseActivities, insertDataActivities, activities, fetchDataActivities};
}