import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import React from 'react'
import images from '../constants/images';

interface BookCardProps {
    name: string,
    author: string;
    category: string;
    isbnSmall: string;
    thumbnail:string;
    onPress: () => void;
}


const BookCard: React.FC<BookCardProps> = ({ name, author, category, isbnSmall, thumbnail, onPress }) => {
    return (
        <TouchableOpacity onPress= {onPress} className='flex-row h-26 bg-white rounded-lg overflow-hidden mb-2 justify-center items-center'>
        <View className='w-16 h-16 m-2'>
                <Image 
                    source={{uri: thumbnail}}
                    resizeMode='contain'
                    className='w-full h-full rounded-md'
                />
          </View>

          <View className='flex-1 justify-center ml-2'>
            <Text className="text-[15px] font-bold mt-2 mx-2">{name}</Text>
            <Text className="text-[12px] mx-2 text-gray-900">Author: {author}</Text>
            <Text className="text-[12px] font-bold mx-2 mb-2 text-gray-600">{category}</Text>
            <Text className="text-[10px] mx-2 mb-2 text-gray-600">ISBN: {isbnSmall}</Text>
          </View>
        </TouchableOpacity>
      );
}

export default BookCard;