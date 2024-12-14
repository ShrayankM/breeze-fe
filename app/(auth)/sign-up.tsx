import { View, Text, ScrollView, StyleSheet, Alert, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getEnvironment } from '../../constants/environment';
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import images from '../../constants/images';
import icons from '../../constants/icons';

const SignUp = () => {
  const [showPassword, setshowPassword] = useState(false);

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
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <View className='items-center justify-center px-6 py-10 min-h-[85vh]'>

        <View style={styles.thumbnailContainer}>
            <Image
              source={images.breezeImage}
              resizeMode="contain"
              style={styles.thumbnail}
            />
          </View>

          {/* Sign-In Text */}
          <Text className="text-3xl font-bold text-gray-700 mb-6">Breeze</Text>
          {/* <Text className="text-xl font-bold text-gray-700 mb-6">(Personal Book Library)</Text> */}

          {/* <FormField 
            value={form.username}
            placeholder='Username'
            handleChangeText={(event) => (setForm({...form, username: event}))}
            otherStyles='mt-7'
          /> */}

          {/* Username Field */}
          <View className="w-full mb-4">
            <Text className="text-sm text-gray-900 mb-2 font-bold">Username</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-1.5">
            <TextInput
              value={form.username}
              onChangeText={(event) => setForm({ ...form, username: event })}
              placeholder="Enter your username"
               className="flex-1 text-gray-700"
            />
            </View>
          </View>

          {/* Email Field */}
          <View className="w-full mb-4">
            <Text className="text-sm text-gray-900 mb-2 font-bold">Email address</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-1.5">
            <TextInput
              value={form.email}
              onChangeText={(event) => setForm({ ...form, email: event })}
              placeholder="Enter your email"
              keyboardType="email-address"
              className="flex-1 text-gray-700"
            />
            </View>
          </View>

          {/* Password Field */}
          <View className="w-full mb-4">
            <Text className="text-sm text-gray-900 mb-2 font-bold">Your password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-1.5">
              <TextInput
                value={form.password}
                onChangeText={(event) => setForm({ ...form, password: event })}
                placeholder="Enter your password"
                secureTextEntry={!showPassword} // Toggles password visibility
                className="flex-1 text-gray-700"
              />
              <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                <Image
                  source={!showPassword ? icons.view : icons.hide} // Toggles icon based on state
                  className="w-6 h-6 ml-2"
                />
              </TouchableOpacity>
            </View>
          </View>

        {/* <CustomButton
          title="Sign-Up"
          handlePress={submitForm}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#ce640b" // Optional: Override default color
          isLoading={isSubmitting}
        /> */}

        {/* Sign-In Button */}
        <CustomButton
            title="Create Account"
            handlePress={submitForm}
            containerStyles={styles.loginButton}
            textStyles={styles.loginButtonText}
            isLoading={isSubmitting}
            color="#159638"
          />

          {/* Links */}
          <Text className="text-center text-gray-500 text-xs mt-2">
            By continuing, you agree to the{' '}
            <Text className="text-blue-500">Terms of use</Text> and{' '}
            <Text className="text-blue-500">Privacy Policy</Text>.
          </Text>

          {/* Divider */}
          <View className="flex-row items-center my-6 w-full">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-2 text-gray-500 text-sm">Already part of our community ?</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Create Account Button */}
          <CustomButton
            title="Log In to Account"
            handlePress={() => router.push('/sign-in')}
            containerStyles={styles.createAccountButton}
            textStyles={styles.createAccountText}
            color="#e1e6ed"
          />

        {/* <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg text-gray-100 font-pregular'>
            Have an account ?
          </Text>
          <Link href="/sign-in" className='text-lg text-secondary'>Sign-In</Link>
        </View> */}
          
        </View>
      </ScrollView> 
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  createAccountButton: {
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 80,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  createAccountText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#D1D1D1',
    borderRadius: 80,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  thumbnailContainer: {
    width: 108, // w-16
    height: 108, // h-16
    margin: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  }
});