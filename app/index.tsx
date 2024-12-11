import { View, Text, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import React from 'react';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function App() {

    const {isLoading, isLoggedIn} = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href='/(tabs)/books' />

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <StatusBar barStyle="dark-content" />
            <View className='flex-1 justify-center items-center'>
                <Text className='text-3xl'>Breeze</Text>
                {/* <Link href="/books" style={{ color: 'blue', marginTop: 16 }}>
                    Go to Books
                </Link> */}

                {/* Go To Books Section */}
                <CustomButton
                    title="Go to Books"
                    handlePress={() => router.push('/books')}
                    containerStyles={styles.buttonContainer}
                    textStyles={styles.buttonText}
                    color="#d6aa31" // Optional: Override default color
                />

                {/* Go to Authentication Section */}
                <CustomButton
                    title="Go to Login"
                    handlePress={() => router.push('/sign-in')}
                    containerStyles={styles.buttonContainer}
                    textStyles={styles.buttonText}
                    color="#45433d" // Optional: Override default color
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginRight: 10,
      marginLeft: 10,
      marginTop: 5,
      marginBottom: 10
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
    }
  });
