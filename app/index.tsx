import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

export default function App() {
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <StatusBar barStyle="dark-content" />
            <View className='flex-1 justify-center items-center'>
                <Text className='text-3xl'>Breeze</Text>
                <Link href="/books" style={{ color: 'blue', marginTop: 16 }}>
                    Go to Books
                </Link>
            </View>
        </SafeAreaView>
    );
}
