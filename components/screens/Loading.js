import { View, Text, ActivityIndicator } from "react-native";
import styles from "../styles/Style";


export default function Loading({Navigation}) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#72665A" />
        </View>
    );
}