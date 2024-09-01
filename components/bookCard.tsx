import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import React from 'react'
import images from '../constants/images';

interface BookCardProps {
    name: string,
    authorName: string;
    genre: string;
    isbn: string;
}


const BookCard: React.FC<BookCardProps> = ({ name, authorName, genre, isbn }) => {
    return (
        <TouchableOpacity className='flex-row h-26 bg-white rounded-lg overflow-hidden mb-2'>
        <Image 
              source={images.bookImage}
              resizeMode='contain'
              className='w-13 h-13 mb-2 mt-2'
          />

          <View className='flex-1 justify-center ml-2'>
            <Text className="text-lg font-bold mt-2 mx-2">{name}</Text>
            <Text className="text-sm mx-2 text-gray-500">{authorName}</Text>
            <Text className="text-xs mx-2 mb-2 text-gray-400">{genre}</Text>
            <Text className="text-xs mx-2 mb-2 text-gray-400">{isbn}</Text>
          </View>
        </TouchableOpacity>
      );
}

export default BookCard;