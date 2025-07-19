import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {  // Make sure to use 'export default'
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Link href="/screen/getpage" style={styles.link}>
                Back to Get Started
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    link: {
        marginTop: 20,
        color: 'blue',
        fontSize: 16,
    }
});