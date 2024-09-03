import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import React from 'react'
import images from '../constants/images';

interface BookCardProps {
    name: string,
    authorName: string;
    genre: string;
    isbn: string;
    onPress: () => void;
}


const BookCard: React.FC<BookCardProps> = ({ name, authorName, genre, isbn, onPress }) => {
    return (
        <TouchableOpacity onPress= {onPress} className='flex-row h-26 bg-white rounded-lg overflow-hidden mb-2 justify-center items-center'>
        <View className='w-16 h-16 m-2'>
                <Image 
                    source={images.bookImage}
                    resizeMode='cover'
                    className='w-full h-full rounded-md'
                />
          </View>

          <View className='flex-1 justify-center ml-2'>
            <Text className="text-[15px] font-bold mt-2 mx-2">{name}</Text>
            <Text className="text-[12px] mx-2 text-gray-900">Author: {authorName}</Text>
            <Text className="text-[12px] font-bold mx-2 mb-2 text-gray-600">{genre}</Text>
            <Text className="text-[10px] mx-2 mb-2 text-gray-600">ISBN: {isbn}</Text>
          </View>
        </TouchableOpacity>
      );
}

export default BookCard;