import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getEnvironment } from '../../constants/environment';
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignUp = () => {

  const {setUser, setIsLoggedIn} = useGlobalContext();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setisSubmitting] = useState(false);

  const submitForm = async () => {

    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill all form details');
    }

    setisSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/(tabs)/books');
    } catch( error ) {
      console.error('Error in POST request', error);
    } finally {
      setisSubmitting(false);
    }

  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>

          {/** Image component to show logo of our application (bird) */}

          <Text className = "text-2xl text-white">Breeze</Text>
          <Text className = "text-2xl text-white">Sign-Up to Breeze</Text>

          {/* <Text className = "text-2xl text-white"> Log in to Breeze Application </Text> */}

          <FormField 
            value={form.username}
            placeholder='Username'
            handleChangeText={(event) => (setForm({...form, username: event}))}
            otherStyles='mt-7'
          />

          <FormField 
            value={form.email}
            placeholder='Email'
            handleChangeText={(event) => (setForm({...form, email: event}))}
            otherStyles='mt-7'
            keyboardType='email-address'
          />

          <FormField 
            value={form.password}
            placeholder='Password'
            handleChangeText={(event) => (setForm({...form, password: event}))}
            otherStyles='mt-7'
          />

        <CustomButton
          title="Sign-Up"
          handlePress={submitForm}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#ce640b" // Optional: Override default color
          isLoading={isSubmitting}
        />

        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg text-gray-100 font-pregular'>
            Have an account ?
          </Text>
          <Link href="/sign-in" className='text-lg text-secondary'>Sign-In</Link>
        </View>
          
        </View>
      </ScrollView> 
    </SafeAreaView>
  )
}

export default SignUp

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