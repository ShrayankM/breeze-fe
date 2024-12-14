import { View, Text, ScrollView, StyleSheet, Alert, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import images from '../../constants/images';
import FormField from '@/components/FormField';
import icons from '../../constants/icons';

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [showPassword, setshowPassword] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill all form details');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();

      setUser(result);
      setIsLoggedIn(true);

      router.replace('/(tabs)/userBooks');
    } catch (error) {
      console.error('Error in POST request', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="items-center justify-center px-6 py-10 min-h-[85vh]">
          {/* Profile Placeholder */}
          {/* <View className="w-16 h-16 bg-gray-300 rounded-full mb-8" /> */}

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

          {/* Sign-In Button */}
          <CustomButton
            title="Log In"
            handlePress={submitForm}
            containerStyles={styles.loginButton}
            textStyles={styles.loginButtonText}
            isLoading={isSubmitting}
            color="#6d9ce8"
          />

          {/* Links */}
          <Text className="text-center text-gray-500 text-xs mt-2">
            By continuing, you agree to the{' '}
            <Text className="text-blue-500">Terms of use</Text> and{' '}
            <Text className="text-blue-500">Privacy Policy</Text>.
          </Text>

          {/* <View className="flex-row justify-between w-full mt-4">
            <Link href="/other-issues" className="text-sm text-blue-500">
              Other issue with sign in
            </Link>
            <Link href="/forgot-password" className="text-sm text-blue-500">
              Forget your password
            </Link>
          </View> */}

          {/* Divider */}
          <View className="flex-row items-center my-6 w-full">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-2 text-gray-500 text-sm">New to our community</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Create Account Button */}
          <CustomButton
            title="Create an account"
            handlePress={() => router.push('/sign-up')}
            containerStyles={styles.createAccountButton}
            textStyles={styles.createAccountText}
            color="#e1e6ed"
          />
        </View>

        {/* Footer */}
        <View className="items-center mt-4 mb-8">
          <Text className="text-gray-400 text-xs">Help Center · Terms of Service · Privacy Policy</Text>
          <Text className="text-gray-400 text-xs mt-1">@2024 breeze-design</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
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
