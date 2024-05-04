import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {useState} from 'react';
import { View, Button } from 'react-native';
import { fetchDataDailySymptomsDateRange } from '../database/DailySymptomsDatabase';
import { fetchDataDailyActivitiesDateRange } from '../database/DailyActivitiesDatabase';

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
        {"comment": "Zzzzzzzzz", "dateSymptoms": "2024-04-24", "id": 1, "intensity": 2, "symptom": "Fatigue"},
        {"comment": null, "dateSymptoms": "2024-04-24", "id": 2, "intensity": 2, "symptom": "Palpitations/étourdissements"},
        {"comment": null, "dateSymptoms": "2024-04-24", "id": 3, "intensity": 2, "symptom": "Sommeil"},
        {"comment": null, "dateSymptoms": "2024-04-24", "id": 4, "intensity": 2, "symptom": "Éssouflement"},
        {"comment": "Sniff", "dateSymptoms": "2024-04-24", "id": 5, "intensity": 2, "symptom": "Odeur/goût"},
        {"comment": "Aïe", "dateSymptoms": "2024-04-24", "id": 6, "intensity": 2, "symptom": "Douleurs"},
        {"comment": null, "dateSymptoms": "2024-04-24", "id": 7, "intensity": 2, "symptom": "Cognition"},
        {"comment": null, "dateSymptoms": "2024-04-25", "id": 8, "intensity": 3, "symptom": "Éssouflement"},
        {"comment": null, "dateSymptoms": "2024-04-25", "id": 9, "intensity": 2, "symptom": "Odeur/goût"},
        {"comment": null, "dateSymptoms": "2024-04-25", "id": 10, "intensity": 1, "symptom": "Douleurs"},
        {"comment": "De quoi?", "dateSymptoms": "2024-04-25", "id": 11, "intensity": 0, "symptom": "Cognition"},
        {"comment": "Yawn", "dateSymptoms": "2024-04-26", "id": 12, "intensity": 1, "symptom": "Fatigue"},
        {"comment": null, "dateSymptoms": "2024-04-26", "id": 13, "intensity": 1, "symptom": "Palpitations/étourdissements"},
        {"comment": null, "dateSymptoms": "2024-04-26", "id": 14, "intensity": 0, "symptom": "Sommeil"},
        {"comment": "Hard to breathe", "dateSymptoms": "2024-04-26", "id": 15, "intensity": 3, "symptom": "Éssouflement"},
        {"comment": "Tasteless", "dateSymptoms": "2024-04-26", "id": 16, "intensity": 2, "symptom": "Odeur/goût"},
        {"comment": null, "dateSymptoms": "2024-04-26", "id": 17, "intensity": 1, "symptom": "Douleurs"},
        {"comment": null, "dateSymptoms": "2024-04-26", "id": 18, "intensity": 1, "symptom": "Cognition"},
        {"comment": null, "dateSymptoms": "2024-04-27", "id": 19, "intensity": 2, "symptom": "Fatigue"},
        {"comment": null, "dateSymptoms": "2024-04-27", "id": 20, "intensity": 2, "symptom": "Palpitations/étourdissements"},
        {"comment": "Trouble sleeping", "dateSymptoms": "2024-04-27", "id": 21, "intensity": 2, "symptom": "Sommeil"},
        {"comment": null, "dateSymptoms": "2024-04-27", "id": 22, "intensity": 2, "symptom": "Éssouflement"},
        {"comment": "No smell", "dateSymptoms": "2024-04-27", "id": 23, "intensity": 1, "symptom": "Odeur/goût"},
        {"comment": null, "dateSymptoms": "2024-04-27", "id": 24, "intensity": 1, "symptom": "Douleurs"},
        {"comment": null, "dateSymptoms": "2024-04-27", "id": 25, "intensity": 2, "symptom": "Cognition"},
        
    ];
    

    
    const fetchSymptoms = () => {
        fetchDataDailySymptomsDateRange(dateStart, dateEnd, (resultSymptom) => {
            fetchDataDailyActivitiesDateRange(dateStart, dateEnd, (resultActivity) => {
                setDailySymptomsList(resultSymptom);
                setDailyActivitiesList(resultActivity);
                // Group symptoms by dateSymptoms
                const groupedSymptoms = resultSymptom.reduce((acc, symptom) => {
                    if (!acc[symptom.date]) {
                        acc[symptom.date] = [];
                    }
                    acc[symptom.date].push(symptom);
                    return acc;
                }, {});

                const groupedActivities = resultActivity.reduce((acc, activity) => {
                    if (!acc[activity.date]) {
                        acc[activity.date] = [];
                    }
                    acc[activity.date].push(activity);
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
                        Données du ${formatDate(dateStart)} au ${formatDate(dateEnd)}
                        </h1>
                    </div>
                `;

                // Convert date strings to Date objects
                const startDate = new Date(dateStart);
                const endDate = new Date(dateEnd);

                // Initialize the loop date to the start date
                let loopDate = new Date(startDate);

                // Loop through each date between startDate and endDate
                while (loopDate <= endDate) {
                    
                    const currentDate = loopDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
                    console.log(groupedActivities);
                    htmlContent += `
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;text-align: center;">
                    ${formatDate(currentDate)}
                    </h2>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="flex-basis: 48%;">
                            <h3 style="font-size: 16px; font-weight: bold;">Symptômes</h3>
                            <ul style="list-style-type: none; padding: 0;">
                            `;
                    // Append symptoms for the current date
                    if (groupedSymptoms[currentDate]) {
                        console.log(groupedSymptoms[currentDate]);
                        groupedSymptoms[currentDate].forEach(symptom => {
                            htmlContent += `
                            <li style="margin-bottom: 10px;">
                            <div style="font-size: 14px; font-weight: bold;">${symptom.symptom}</div>
                            <div style="font-size: 12px;">Intensité: ${symptom.intensity}</div>
                            <div style="font-size: 12px;">Commentaire: ${symptom.comment || 'N/A'}</div>
                            </li>
                            `;
                        });
                    } else {
                        // No symptoms for this date
                        htmlContent += `
                            <li style="font-size: 12px;">Aucun symptôme enregistré pour cette date.</li>
                            `;
                    }
                    htmlContent += `
                            </ul>
                        </div>
                        <div style="flex-basis: 48%;">
                            <h3 style="font-size: 16px; font-weight: bold;">Activités</h3>
                            <ul style="list-style-type: none; padding: 0;">
                            `;
                    // Append activities for the current date
                    if (groupedActivities[currentDate]) {
                        const activitiesByCategory = groupedActivities[currentDate].reduce((acc, activity) => {
                            if (!acc[activity.category]) {
                                acc[activity.category] = [];
                            }
                            acc[activity.category].push(activity);
                            return acc;
                        }, {});
                
                        // Loop through each category
                        for (const category in activitiesByCategory) {
                            htmlContent += `
                            <div>
                                <h4 style="font-size: 14px; text-decoration: underline;">${category}</h4>
                                <ul style="list-style-type: none; padding: 0;">
                                `;
                            // Append activities for the current category
                            activitiesByCategory[category].forEach(activity => {
                                htmlContent += `
                                <li style="margin-bottom: 10px;">
                                <div style="font-size: 14px; font-weight: bold;">${activity.activity}</div>
                                <div style="font-size: 12px;">Durée: ${activity.duration}</div>
                                <div style="font-size: 12px;">Commentaire: ${activity.comment || 'N/A'}</div>
                                </li>
                                `;
                            });
                            htmlContent += `
                                </ul>
                            </div>
                            `;
                        }
                    } else {
                        // No activities for this date
                        htmlContent += `
                            <li style="font-size: 12px;">Aucune activité enregistrée pour cette date.</li>
                            `;
                    }
                    htmlContent += `
                        </ul>
                    </div>
                    </div>
                    `;

                    // Move to the next day
                    loopDate.setDate(loopDate.getDate() + 1);
                }

                // Close the HTML tags
                htmlContent += `
                </body>
                </html>
                `;

                // Generate and share PDF
                execute(htmlContent);
            });
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

    
