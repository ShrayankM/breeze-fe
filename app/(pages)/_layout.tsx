import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const PagesLayout = () => {
  return (
    <View className='flex-1'>
      <Slot />
      <StatusBar backgroundColor="#161622" style="light" />
    </View>
  )
}

export default PagesLayout