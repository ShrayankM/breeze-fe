import { View, Text, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
    const { isLoading, isLoggedIn } = useGlobalContext();

    useEffect(() => {
        // Keep the splash screen visible until the app is ready
        SplashScreen.preventAutoHideAsync();
        
        // Simulate loading (replace with real app logic)
        setTimeout(() => {
          SplashScreen.hideAsync();  // Hide the splash screen after loading
        }, 2000);
      }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (isLoggedIn) {
        return <Redirect href='/(tabs)/books' />;
    } else {
        return <Redirect href='/sign-in' />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    }
});
