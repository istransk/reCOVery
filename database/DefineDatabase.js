import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('symptomQuestions.db');

export default db;