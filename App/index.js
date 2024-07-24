// Filename: index.js
// Combined code from all files

// File: App.js
import React from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView } from 'react-native';
import WorkoutList from './WorkoutList';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Workout Tracker</Text>
                <WorkoutList />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});

// File: WorkoutList.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const WorkoutList = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://apihub.p.appply.xyz:3300/chatgpt", {
                    messages: [
                        { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
                        { role: "user", content: "Provide a list of workout routines" }
                    ],
                    model: "gpt-4o"
                });
                const resultString = response.data.response;
                const workoutArray = resultString.split('\n').map((workout, index) => ({ id: index.toString(), title: workout }));
                setWorkouts(workoutArray);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.listContainer}>
            {workouts.map((workout) => (
                <View key={workout.id} style={styles.workoutItem}>
                    <Text style={styles.workoutText}>{workout.title}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        marginTop: 20,
    },
    workoutItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    workoutText: {
        fontSize: 18,
        fontWeight: '500',
    },
    loading: {
        marginTop: 50,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default WorkoutList;