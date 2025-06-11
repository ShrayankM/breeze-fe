import '../global.css'; // Import the CSS file
import { StyleSheet, View, Text, StatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { GlobalProvider } from '@/context/GlobalProvider';

const RootLayout = () => {
  return (
    <GlobalProvider>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40, // You can adjust this value for more or less space on top
  },
});

export default RootLayout;
