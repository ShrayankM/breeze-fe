import { View, Text, TextInput } from 'react-native'
import React from 'react'

interface FormFieldProps {
    value: string;
    placeholder: string;
    handleChangeText: (input: string) => void;
    otherStyles?: string;
    keyboardType?: string;
}

const FormField: React.FC<FormFieldProps> = ({ value, placeholder, handleChangeText, otherStyles, keyboardType, ...props}) => {
  return (
    <View className={`${otherStyles}`}>

      <View className='border-2 border-black-200 w-full h-16 px-4 bg-gray-100 rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput className='flex-1 text-black font-psemibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
        />
      </View>
    </View>
  )
}

export default FormField