import { View, Text, SafeAreaView, FlatList, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEnvironment } from '@/constants/environment';
// import BookCard from '@/components/BookCard';
import BookUserCard from '@/components/BookUserCard';
import { router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";

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

const Wishlist = () => {
  const { user } = useGlobalContext();
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
      const url = `${baseUrl}/v1/breeze/book/wishlist/${encodedQuery}/user/${user.userCode}/search-books`;

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
          userCode: user.userCode,
          bookStatusList: ['WISHLIST'],
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
    router.push({ pathname: '/(pages)/bookDetailsWishList', params: bookDetails });
  };

  const getStatusColor = (bookStatus: string) => {
    switch (bookStatus) {
      case 'WISHLIST':
          return '#45a613';
      case 'COMPLETED':
        return '#a62c13'; // Red for completed
      case 'READING':
        return '#e69e13'; // Yellow for reading
      default:
        return 'gray';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search books in wishlist..."
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
            // bookStatus={getStatusText(item.bookStatus)}
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
    backgroundColor: '#d1d1d1', // Light background for a clean and modern feel
    paddingHorizontal: 15, // Padding around the screen for better spacing
  },
  input: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#FFFFFF', // White background for the search bar
    borderRadius: 15, // More rounded corners for modern design
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#cacac9', // Light gray border
    fontSize: 16,
    color: '#333333', // Darker text for better readability
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4, // Adds shadow for Android
  },
  flatList: {
    flex: 1,
    marginTop: 10
  },
  listContent: {
    paddingBottom: 20, // Added padding to ensure list isn't cramped
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30, // Padding for better loader placement
  },
});

export default Wishlist;
