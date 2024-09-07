import { StyleSheet, View, Text, ActivityIndicator, FlatList, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEnvironment } from '../../constants/environment';
import BookCard from '@/components/BookCard';
import { router } from 'expo-router';

type Book = {
  code: string;
  name: string;
  isbnSmall: string;
  isbnLarge: string;
  author: string;
  category: string;
  thumbnail:string;
};

const Books = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book[]>([]);

  const getBooks = async () => {
    const { baseUrl } = getEnvironment();

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/get-books`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode: 'USR12345',
        }),
      });

      const jsonData = await response.json();
      const books = jsonData.data?.list || [];

      console.log(`Books = ${books}`);
      setData(books);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const handlePress = (bookDetails: Book) => {
    router.push({ pathname: '/(pages)/bookDetails', params: bookDetails})
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
          <FlatList className='mt-20'
              data={data}
              numColumns={1}
              keyExtractor={({ code }) => code}
              renderItem={({ item }) => 
                  <BookCard
                      name={item.name}
                      author={item.author}
                      category={item.category}
                      isbnSmall={item.isbnSmall}
                      thumbnail={item.thumbnail}
                      onPress={() => handlePress(item)}
                  />
              }
              contentContainerStyle={{ paddingLeft: 10, paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
            />
    </SafeAreaView>
  );
};

export default Books;
