import { View, Text, Image, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '@/components/CustomButton';
import { getEnvironment } from '../../constants/environment';
import { MaterialIcons } from '@expo/vector-icons'; 

type Book = {
  code: string;
  name: string;
  subtitle: string;
  isbnSmall: string;
  isbnLarge: string;
  author: string;
  category: string;
  thumbnail: string;
  publishedDate: string;
  description:string;
  pages: string;
};

const BookDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); 
  const bookDetails = useLocalSearchParams(); // Assuming bookDetails contains `code`

  // Fetch book details using book code
  const getBookUsingCode = async () => {
    const { baseUrl } = getEnvironment();

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
    <ScrollView>
    <SafeAreaView className="flex-1 mt-14">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <View className="w-full items-start flex-row">

      <View className="flex-1 items-center justify-center">
        {data.thumbnail ? (
          <Image 
            source={{ uri: data.thumbnail }}
            resizeMode="contain"
            className="mt-2 mb-2 w-56 h-48"
          />
        ) : (
          <Text>No Image Available</Text>
        )}
        </View>

        <View className="flex-1 items-center justify-center mt-2 mr-5">
          <View className='mt-2 mb-5'>
          <Text className="text-[22px] font-bold">
              {data.name}
          </Text>

            <Text className='text-[15px]'>{data.author}</Text>

            <Text>Released {data.publishedDate}</Text>
          </View>
        </View>
      </View>
      
      <View className="w-full justify-center items-center">
        
      <View className='w-full'>
        <Text className='mt-5 mr-5 ml-5'>
          <Text className='font-bold'>Category:</Text> {data.category}
        </Text>
        <Text className='mr-5 ml-5'>
          <Text className='font-bold'>Pages:</Text> {data.pages}
        </Text>
        <Text className='mb-5 mr-5 ml-5'>
          <Text className='font-bold'>ISBN:</Text> {data.isbnLarge}
        </Text>
      </View>

      <View style={styles.container}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.toggleButton}>
            <MaterialIcons
              name={isExpanded ? 'expand-less' : 'expand-more'}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
      
        <Text
          numberOfLines={isExpanded ? undefined : 5}
          style={styles.descriptionText}
        >
          {data.description}
        </Text>
        </View>

      </View>
      </SafeAreaView>
    </ScrollView>
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
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#007BFF',
  },
  descriptionText: {
    margin: 5,
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  descriptionTitle: {
    marginLeft: 3,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
