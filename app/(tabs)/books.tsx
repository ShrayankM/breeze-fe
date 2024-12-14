import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEnvironment } from '@/constants/environment';
import BookCard from '@/components/BookCard';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

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
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state

  const { baseUrl } = getEnvironment();

  const searchBooks = async (query = '') => {
    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${baseUrl}/v1/breeze/book/${encodedQuery}/search-books`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const jsonData = await response.json();
      const books = jsonData.data?.list || [];
      setData(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/get-books`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode: user.userCode,
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

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    if (debouncedQuery) {
      await searchBooks(debouncedQuery);
    } else {
      await getBooks();
    }
    setRefreshing(false); // Set refreshing state back to false
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      searchBooks(debouncedQuery);
    } else {
      getBooks();
    }
  }, [debouncedQuery]);

  const handlePress = (bookDetails: Book) => {
    router.push({ pathname: '/(pages)/bookDetailsGlobal', params: bookDetails });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search books..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        style={styles.flatList}
        data={data}
        numColumns={1}
        keyExtractor={({ code }) => code}
        renderItem={({ item }) => (
          <BookCard
            name={item.name}
            author={item.author}
            category={item.category}
            isbnSmall={item.isbnSmall}
            thumbnail={item.thumbnail}
            onPress={() => handlePress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing} // Pass refreshing state
        onRefresh={onRefresh} // Pass onRefresh function
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#1b1b1a" style={styles.loader} /> : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1d1d1', // Lighter background for a more modern look
    paddingHorizontal: 15, // Padding around the entire screen for better spacing
  },
  input: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 15, // Slightly more rounded corners for a modern touch
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#cacac9',
    fontSize: 16,
    color: '#333333', // Darker text for better readability
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  flatList: {
    flex: 1,
    marginTop: 10
  },
  listContent: {
    paddingBottom: 20, // Extra padding for modern scrolling behavior
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30, // Padding for better loader placement
  },
});

export default Books;
