import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '@/components/CustomButton';
import { getEnvironment } from '../../constants/environment';

type Book = {
  code: string;
  name: string;
  isbnSmall: string;
  isbnLarge: string;
  author: string;
  category: string;
  thumbnail: string;
};

const BookDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book | null>(null);
  const bookDetails = useLocalSearchParams(); // Assuming bookDetails contains `code`

  // Fetch book details using book code
  const getBookUsingCode = async () => {
    const { baseUrl } = getEnvironment();

    console.log(`Code = ${bookDetails.code}`);

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/${bookDetails.code}/get-book-details`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const jsonData = await response.json();
      const book = jsonData.data || {};

      setData(book);  // Set fetched book data

      console.log(`thumbnail = ${book.thumbnail}`);

    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch book details when component loads
  useEffect(() => {
    getBookUsingCode();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No book details found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-5 bg-gray-200">
      
      {/* Image Section */}
      {data.thumbnail ? (
        <Image 
          source={{ uri: data.thumbnail }}
          resizeMode="contain"
          className="mb-5 rounded-md w-64 h-64"
        />
      ) : (
        <Text>No Image Available</Text>
      )}

      {/* Book Details Section */}
      <View className="w-full mb-5 mt-5">
        <Text style={styles.label}>Book Code:</Text>
        <Text style={styles.value}>{bookDetails.code}</Text>

        <Text style={styles.label}>Book Name:</Text>
        <Text style={styles.value}>{data.name}</Text>

        <Text style={styles.label}>Author Name:</Text>
        <Text style={styles.value}>{data.author}</Text>

        <Text style={styles.label}>ISBN:</Text>
        <Text style={styles.value}>{data.isbnSmall}</Text>

        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{data.category}</Text>
      </View>
    </View>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
    marginBottom: 10,
  },
});
