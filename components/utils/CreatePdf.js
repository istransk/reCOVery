import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { fetchDataDailySymptoms, fetchDataDailySymptomsDateRange } from '../database/DailySymptomsDatabase';
import { fetchAllDataDailyActivities } from '../database/DailyActivitiesDatabase';

function formatDate(dateString) {
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const [year, month, day] = dateString.split("-");
    const monthName = months[parseInt(month) - 1];

    return `${day} ${monthName} ${year}`;
}


export default function CreatePdf({dateStart, dateEnd}) {
    const [dailySymptomsList, setDailySymptomsList] = useState([]);
    const [dailyActivitiesList, setDailyActivitiesList] = useState([]);

    const data = [
        {"comment": "Zzzzzzzzz", "date": "2024-04-24", "id": 1, "intensity": 2, "symptom": "Fatigue"},
        {"comment": null, "date": "2024-04-24", "id": 2, "intensity": 2, "symptom": "Palpitations/étourdissements"},
        {"comment": null, "date": "2024-04-24", "id": 3, "intensity": 2, "symptom": "Sommeil"},
        {"comment": null, "date": "2024-04-24", "id": 4, "intensity": 2, "symptom": "Éssouflement"},
        {"comment": "Sniff", "date": "2024-04-24", "id": 5, "intensity": 2, "symptom": "Odeur/goût"},
        {"comment": "Aïe", "date": "2024-04-24", "id": 6, "intensity": 2, "symptom": "Douleurs"},
        {"comment": null, "date": "2024-04-24", "id": 7, "intensity": 2, "symptom": "Cognition"},
        {"comment": null, "date": "2024-04-25", "id": 8, "intensity": 3, "symptom": "Éssouflement"},
        {"comment": null, "date": "2024-04-25", "id": 9, "intensity": 2, "symptom": "Odeur/goût"},
        {"comment": null, "date": "2024-04-25", "id": 10, "intensity": 1, "symptom": "Douleurs"},
        {"comment": "De quoi?", "date": "2024-04-25", "id": 11, "intensity": 0, "symptom": "Cognition"},
        {"comment": "Yawn", "date": "2024-04-26", "id": 12, "intensity": 1, "symptom": "Fatigue"},
        {"comment": null, "date": "2024-04-26", "id": 13, "intensity": 1, "symptom": "Palpitations/étourdissements"},
        {"comment": null, "date": "2024-04-26", "id": 14, "intensity": 0, "symptom": "Sommeil"},
        {"comment": "Hard to breathe", "date": "2024-04-26", "id": 15, "intensity": 3, "symptom": "Éssouflement"},
        {"comment": "Tasteless", "date": "2024-04-26", "id": 16, "intensity": 2, "symptom": "Odeur/goût"},
        {"comment": null, "date": "2024-04-26", "id": 17, "intensity": 1, "symptom": "Douleurs"},
        {"comment": null, "date": "2024-04-26", "id": 18, "intensity": 1, "symptom": "Cognition"},
        {"comment": null, "date": "2024-04-27", "id": 19, "intensity": 2, "symptom": "Fatigue"},
        {"comment": null, "date": "2024-04-27", "id": 20, "intensity": 2, "symptom": "Palpitations/étourdissements"},
        {"comment": "Trouble sleeping", "date": "2024-04-27", "id": 21, "intensity": 2, "symptom": "Sommeil"},
        {"comment": null, "date": "2024-04-27", "id": 22, "intensity": 2, "symptom": "Éssouflement"},
        {"comment": "No smell", "date": "2024-04-27", "id": 23, "intensity": 1, "symptom": "Odeur/goût"},
        {"comment": null, "date": "2024-04-27", "id": 24, "intensity": 1, "symptom": "Douleurs"},
        {"comment": null, "date": "2024-04-27", "id": 25, "intensity": 2, "symptom": "Cognition"},
        
    ];
    

    
    const fetchSymptoms = () => {
        fetchDataDailySymptomsDateRange(dateStart, dateEnd, (result) => {
            console.log(dateStart, dateEnd);
            setDailySymptomsList(result);
            console.log("résultat fetch par date",result);
            
           // Group symptoms by date
            const groupedSymptoms = result.reduce((acc, symptom) => {
                if (!acc[symptom.date]) {
                    acc[symptom.date] = [];
                }
                acc[symptom.date].push(symptom);
                return acc;
            }, {});

            // Generate HTML content after symptoms data has been fetched and state updated
            let htmlContent = `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body>
                <div style="text-align: center;">
                    <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
                    Liste des Symptômes
                    </h1>
                </div>
            `;

            // Loop through grouped symptoms and append to HTML content
            for (const date in groupedSymptoms) {
                htmlContent += `
                <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                ${formatDate(date)}
                </h2>
                <ul style="list-style-type: none; padding: 0;">
                `;
                groupedSymptoms[date].forEach(symptom => {
                    htmlContent += `
                    <li style="margin-bottom: 10px;">
                    <div style="font-size: 16px; font-weight: bold;">${symptom.symptom}</div>
                    <div style="font-size: 14px;">Intensité: ${symptom.intensity}</div>
                    <div style="font-size: 14px;">Commentaire: ${symptom.comment}</div>
                    </li>
                    `;
                });
                htmlContent += `
                </ul>
                `;
            }

            // Close the HTML tags
            htmlContent += `
            </body>
            </html>
            `;

            // Generate and share PDF
            execute(htmlContent);
        });
    };



    async function execute(html) {
        const { uri } = await Print.printToFileAsync({ html });
        Sharing.shareAsync(uri);
    }
    
    return (
        <View >
            <Button
                title="Print and Share"
                onPress={() => fetchSymptoms()}
            />
        </View>
    );
}

    
