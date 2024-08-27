import { View, Text } from 'react-native'
import React from 'react'

const UserBooks = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text>User Books</Text>
    </View>
  )
}

export default UserBooks

// when user switches tabs to his personal books (there will be list of all books that user has read and reading)
// reading will be on top, after that there will be read books