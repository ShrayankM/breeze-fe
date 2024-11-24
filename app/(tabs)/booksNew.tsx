import { StyleSheet, View, Text, ActivityIndicator, FlatList, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
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
  thumbnail: string;
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
    router.push({ pathname: '/(pages)/bookDetails', params: bookDetails });
  };

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard
      name={item.name}
      author={item.author}
      category={item.category}
      isbnSmall={item.isbnSmall}
      thumbnail={item.thumbnail}
      onPress={() => handlePress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ code }) => code}
          renderItem={renderBook}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  featuredSection: {
    marginVertical: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  featuredList: {
    paddingLeft: 10,
  },
  featuredCard: {
    marginRight: 10,
    alignItems: 'center',
    width: 100,
  },
  featuredImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default Books;
