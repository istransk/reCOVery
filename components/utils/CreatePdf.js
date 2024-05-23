import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useContext, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { fetchDataDailySymptoms } from '../database/DailySymptomsDatabase';
import { fetchAllDataDailyActivities } from '../database/DailyActivitiesDatabase';
import { fetchDataCrash } from '../database/CrashDatabase';
import { decryption } from './encryption';
import { KeyContext } from '../contexts/KeyContext';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/style';

function formatDate(dateString) {
    const months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    const [year, month, day] = dateString.split("-");
    const monthName = months[parseInt(month) - 1];

    return `${day} ${monthName} ${year}`;
}


export default function CreatePdf() {
    const key = useContext(KeyContext);
    const sharePdf = () => {
        fetchDataDailySymptoms((resultSymptom) => {
            const decryptedData = resultSymptom.map(symptom => ({
                ...symptom,
                symptom: decryption(symptom.symptom, key),
                intensity: decryption(symptom.intensity, key),
                comment: decryption(symptom.comment, key),
                date: decryption(symptom.date, key)
            }));
            fetchAllDataDailyActivities((resultActivity) => {
                const decryptedDataActivity = resultActivity.map(activity => ({
                    ...activity,
                    activity: decryption(activity.activity, key),
                    duration: decryption(activity.duration, key),
                    category: decryption(activity.category, key),
                    comment: decryption(activity.comment, key),
                    date: decryption(activity.date, key)
                }));
                fetchDataCrash((resultCrash) => {
                    const decryptedDataCrash = resultCrash.map(crash => ({
                        ...crash,
                        dateStart: decryption(crash.dateStart, key),
                        dateEnd: decryption(crash.dateEnd, key),
                    }));

                    // Group symptoms by date
                    const groupedSymptoms = decryptedData.reduce((acc, symptom) => {
                        const date = new Date(symptom.date).toISOString().split('T')[0];
                        if (!acc[date]) {
                            acc[date] = [];
                        }
                        acc[date].push(symptom);
                        return acc;
                    }, {});

                    const groupedActivities = decryptedDataActivity.reduce((acc, activity) => {
                        const dateActivity = new Date(activity.date).toISOString().split('T')[0];
                        if (!acc[dateActivity]) {
                            acc[dateActivity] = [];
                        }
                        acc[dateActivity].push(activity);
                        return acc;
                    }, {});

                    // create a date range of 14 days
                    const endDate = new Date();
                    const startDate = new Date(endDate.getTime() - (13 * 24 * 60 * 60 * 1000));

                    const filteredCrashes = decryptedDataCrash.filter(crash => {
                        const crashDate = new Date(crash.dateStart);
                        return crashDate >= startDate && crashDate <= endDate;
                    });

                    // Generate HTML content after symptoms data has been fetched and state updated
                    let htmlContent = `
                    <html>
                        <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                            <style>
                            body {
                                font-family: Helvetica Neue, Arial, sans-serif;
                            }
                            .container {
                                width: calc(100% - 10px); /* Adjust this value for the right margin */
                                margin: 0 auto;
                                padding: 20px;
                                box-sizing: border-box;
                            }
                            .date-title {
                                font-size: 18px;
                                font-weight: bold;
                                margin-top: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 10px;
                                vertical-align: top;
                            }
                            th {
                                font-size: 16px;
                                font-weight: bold;
                                text-align: center;
                            }
                            .sub-header {
                                font-size: 14px;
                                text-align: center;
                                margin-top: 10px;
                            }
                            ul {
                                list-style-type: none;
                                padding: 0;
                            }
                            li {
                                margin-bottom: 10px;
                            }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div style="text-align: center;">
                                    <h1 style="font-size: 25px; font-weight: normal;">
                                        Données du ${formatDate(startDate.toISOString().split('T')[0])} au ${formatDate(endDate.toISOString().split('T')[0])}
                                    </h1>
                                </div>
                                <div>
                                Nombre de crash sur cette période: ${filteredCrashes.length}
                                <ul>

                `;
                // Generate crash information HTML
                filteredCrashes.forEach((crash, index) => {
                    htmlContent += `<li>${index + 1}) du ${formatDate(crash.dateStart)} au ${formatDate(crash.dateEnd)}</li>`;
                });
                htmlContent += `</ul>`;

                    
                    

                    // Initialize the loop date to the start date
                    let loopDate = startDate;

                    // Loop through each date between startDate and endDate
                    while (loopDate <= new Date(endDate)) {
                        
                        const currentDate = loopDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
                        htmlContent += `
                        <div class="date-title">${formatDate(currentDate)}</div>
                        <table>
                        <tr>
                        <th>Symptômes</th>
                        <th colspan="2">Activités</th>
                    </tr>
                    <tr>
                        <td rowspan="2">
                            <ul>
                    `;

                    // Append symptoms for the current date
                    if (groupedSymptoms[currentDate]) {
                        groupedSymptoms[currentDate].forEach(symptom => {
                            htmlContent += `
                                <li>
                                    <div><strong>${symptom.symptom}</strong></div>
                                    <div>Intensité: ${symptom.intensity}</div>
                                    <div>Commentaire: ${symptom.comment || 'N/A'}</div>
                                </li>
                            `;
                        });
                    } else {
                        htmlContent += `
                            <li>Aucun symptôme enregistré pour cette date.</li>
                        `;
                    }

                    htmlContent += `
                    </ul>
                    </td>
                        <th>Régénérantes</th>
                        <th>Fatigantes</th>
                    </tr>
                    <tr>
                    <td>
                        <ul>
                    `;

                    // Append regénérant activities for the current date
                    if (groupedActivities[currentDate]) {
                        groupedActivities[currentDate].forEach(activity => {
                            if (activity.category === 'Régénérant') {
                                htmlContent += `
                                    <li>
                                        <div><strong>${activity.activity}</strong></div>
                                        <div>Durée: ${activity.duration} minutes</div>
                                        <div>Commentaire: ${activity.comment || 'N/A'}</div>
                                    </li>
                                `;
                            }
                        });
                    } else {
                        htmlContent += `
                            <li>Aucune activité régénérante enregistrée pour cette date.</li>
                        `;
                    }

                    htmlContent += `
                    </ul>
                    </td>
                    <td>
                        <ul>
                    `;

                    // Append fatigant activities for the current date
                    if (groupedActivities[currentDate]) {
                        groupedActivities[currentDate].forEach(activity => {
                            if (activity.category === 'Fatigant') {
                                htmlContent += `
                                    <li>
                                        <div><strong>${activity.activity}</strong></div>
                                        <div>Durée: ${activity.duration} minutes</div>
                                        <div>Commentaire: ${activity.comment || 'N/A'}</div>
                                    </li>
                                `;
                            }
                        });
                    } else {
                        htmlContent += `
                            <li>Aucune activité fatigante enregistrée pour cette date.</li>
                        `;
                    }

                    htmlContent += `
                            </ul>
                            </td>
                        </tr>
                    </table>
                    `;

                        // Move to the next day
                        loopDate.setDate(loopDate.getDate() + 1);
                    }

                    // Close the HTML tags
                    htmlContent += `
                    </div>
                    </body>
                </html>
                    `;

                    // Generate and share PDF
                    execute(htmlContent);
                }
                );
            });
        });
    };

    


    async function execute(html) {
        const { uri } = await Print.printToFileAsync({html, width:595, height:842}); //A4 format 595×842 dots (PostScript points)
        Sharing.shareAsync(uri);
    }
    
    return (
        <View style={styles.iconSendContainer} >
            <TouchableOpacity onPress={() => sharePdf()}>
                <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}