import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

const PagesLayout = () => {
  return (
    <View className='flex-1'>
      <Slot />
    </View>
  )
}

export default PagesLayout