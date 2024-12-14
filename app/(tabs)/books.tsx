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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1a',
  },
  input: {
    margin: 15,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Books;
