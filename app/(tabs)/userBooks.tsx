import { View, Text, SafeAreaView, FlatList, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEnvironment } from '@/constants/environment';
// import BookCard from '@/components/BookCard';
import BookUserCard from '@/components/BookUserCard';
import { router } from 'expo-router';

type Book = {
  code: string;
  name: string;
  isbnSmall: string;
  isbnLarge: string;
  author: string;
  category: string;
  thumbnail: string;
  bookStatus: string;
};

const UserBooks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state

  const { baseUrl } = getEnvironment();

  const searchBooks = async (query = '') => {
    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${baseUrl}/v1/breeze/book/${encodedQuery}/user/UER644620874/search-books`;

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
    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/get-books-user`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode: 'UER644620874',
          bookStatusList: ['ADDED', 'READING', 'COMPLETED'],
          limit: 2,
          offset: 0,
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
    router.push({ pathname: '/(pages)/bookDetailsUser', params: bookDetails });
  };

  const getStatusColor = (bookStatus: string) => {
    switch (bookStatus) {
      case 'ADDED':
        return '#45a613';
      case 'COMPLETED':
        return '#a62c13';
      case 'READING':
        return '#e69e13';
      default:
        return 'gray';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search user books..."
        placeholderTextColor="#9CA3AF" // Placeholder color
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        style={styles.flatList}
        data={data}
        numColumns={1}
        keyExtractor={({ code }) => code}
        renderItem={({ item }) => (
          <BookUserCard
            name={item.name}
            author={item.author}
            category={item.category}
            isbnSmall={item.isbnSmall}
            thumbnail={item.thumbnail}
            bookStatus={item.bookStatus}
            statusColor={getStatusColor(item.bookStatus)}
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
    backgroundColor: '#1b1b1a', // Tailwind's gray-100 equivalent
  },
  input: {
    margin: 15,
    height: 50,
    backgroundColor: '#FFFFFF', // White
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Tailwind's gray-200 equivalent
    fontSize: 14,
    color: '#111827', // Tailwind's gray-800 equivalent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Android shadow
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default UserBooks;
