import { StyleSheet, View, Text, ActivityIndicator, FlatList, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEnvironment } from '../../constants/environment';
import BookCard from '@/components/BookCard';

type BookRequest = {
  code: string;
  bookName: string;
  authorName: string;
  isbn: string;
  noOfPages: string;
  yearPublished: string;
  bookGenre: string;
  description: string;
};

const Request = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BookRequest[]>([]);

  const getBooks = async () => {
    const { baseUrl } = getEnvironment();

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/approval/fetch-request-list`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalStatus : "SUBMITTED"
        }),
      });

      const jsonData = await response.json();
      const books = jsonData.data?.bookApprovalDataList || [];
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

  return (
    <SafeAreaView className='bg-primary h-full'>
          <FlatList className='mt-20'
              data={data}
              numColumns={1}
              keyExtractor={({ code }) => code}
              renderItem={({ item }) => 
                  <BookCard
                      name={item.bookName}
                      authorName={item.authorName}
                      genre={item.bookGenre}
                      isbn={item.isbn}
                  />
              }
              contentContainerStyle={{ paddingLeft: 10, paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
            />
    </SafeAreaView>
  );
};

export default Request;
