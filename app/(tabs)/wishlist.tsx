import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import { signOut } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'

const WishList = () => {
  const {user, setUser, setIsLoggedIn } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/(auth)/sign-in');
  }

  return (
    <View className='flex-1 justify-center items-center'>
      <Text>WishList Books</Text>

      <CustomButton
          title="Logout"
          handlePress={logout}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#eb3467" // Optional: Override default color
        />
    </View>
  )
}

export default WishList

// set of books that user adds which he is not reading or not read yet (future reading)

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});