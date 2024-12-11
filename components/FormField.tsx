import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import icons from '../constants/icons';

interface FormFieldProps {
    value: string;
    placeholder: string;
    handleChangeText: (input: string) => void;
    otherStyles?: string;
    keyboardType?: string;
}

const FormField: React.FC<FormFieldProps> = ({ value, placeholder, handleChangeText, otherStyles, keyboardType, ...props}) => {
  const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`${otherStyles}`}>

      <View className='border-2 border-black-200 w-full h-16 px-4 bg-gray-100 rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput className='flex-1 text-black font-psemibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={placeholder === 'Password' && !showPassword}
        />

        {placeholder === 'Password' && (
          <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.view : icons.hide} className='w-6 h-6' />
          </TouchableOpacity>
        )}


      </View>
    </View>
  )
}

export default FormField