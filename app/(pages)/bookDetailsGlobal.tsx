import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, SafeAreaView, 
  StatusBar, ScrollView, TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { getEnvironment } from '../../constants/environment';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useGlobalContext } from '@/context/GlobalProvider';

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
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); 
  const bookDetails = useLocalSearchParams();

  const getBookUsingCode = async () => {
    const { baseUrl } = getEnvironment();
    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/${bookDetails.code}/get-book-details`);
      const jsonData = await response.json();
      setData(jsonData.data || null);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostRequest = async () => {
    const { baseUrl } = getEnvironment();
    const requestBody = {
      bookCode: bookDetails.code,
      userCode: user.userCode,
      bookStatus: "ADDED",
      currentPage: 10,
      userRating: 4,
      isDeleted: false,
      wishlist: false,
    };

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/add-book`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Book successfully added');
      } else {
        console.error('Failed to add the book');
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  useEffect(() => {
    getBookUsingCode();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>No book details found.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#161622" />
        
        {/* Book Thumbnail and Details */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: data.thumbnail }}
            resizeMode="contain"
            style={styles.thumbnail}
          />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{data.name}</Text>
            <Text style={styles.bookAuthor}>{data.author}</Text>
            <Text style={styles.bookDate}>Released {data.publishedDate}</Text>
          </View>
        </View>

        {/* Book Metadata */}
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}><Text style={styles.bold}>Category:</Text> {data.category}</Text>
          <Text style={styles.metadataText}><Text style={styles.bold}>Pages:</Text> {data.pages}</Text>
          <Text style={styles.metadataText}><Text style={styles.bold}>ISBN:</Text> {data.isbnLarge}</Text>
        </View>

        {/* Description Section */}
        <View style={styles.container}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <MaterialIcons 
                name={isExpanded ? 'expand-less' : 'expand-more'} 
                size={24} 
                color="#6200EE" 
              />
            </TouchableOpacity>
          </View>
          <Text 
            style={styles.descriptionText}
            numberOfLines={isExpanded ? undefined : 5}
          >
            {data.description}
          </Text>
        </View>

        {/* Add Button */}
        <CustomButton
          title="Add to Library"
          handlePress={handlePostRequest}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#0571b1" // Optional: Override default color
        />
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
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  thumbnail: {
    width: 120,
    height: 160,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 5,
  },
  bookDate: {
    fontSize: 14,
    color: '#757575',
  },
  metadataContainer: {
    padding: 10,
  },
  metadataText: {
    fontSize: 14,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  container: {
    padding: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
