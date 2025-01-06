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
import { router } from 'expo-router';

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
  description: string;
  pages: string;
  language: string;
  globalRating: number;
  userRating: number;
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
      bookStatus: "LIBRARY",
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
        router.replace('/(tabs)/userBooks');
        console.log('Book successfully added');
      } else {
        console.error('Failed to add the book');
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  const addBookToWishList = async () => {
    const { baseUrl } = getEnvironment();
    const requestBody = {
      bookCode: bookDetails.code,
      userCode: user.userCode,
      bookStatus: "WISHLIST",
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
        router.replace('/(tabs)/wishlist');
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
    <ScrollView style={styles.scrollArea}>
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
        {/* <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}><Text style={styles.bold}>Category:</Text> {data.category}</Text>
          <Text style={styles.metadataText}><Text style={styles.bold}>Pages:</Text> {data.pages}</Text>
          <Text style={styles.metadataText}><Text style={styles.bold}>ISBN:</Text> {data.isbnLarge}</Text>
        </View> */}

        <View style={styles.metadataContainer}>
          <View style={styles.horizontalRow}>
            {/* Value Row */}
            <View style={styles.headingContainer}>
              <Text style={styles.valueText}>{data.globalRating}</Text>
              <Text style={styles.headingText}>Rating</Text>
            </View>

            <View style={styles.headingContainer}>
              <Text style={[styles.valueText, styles.categoryText]}>{data.category}</Text>
              <Text style={styles.headingText}>Category</Text>
            </View>

            {/* Heading Row */}
            <View style={styles.headingContainer}>
              <Text style={styles.valueText}>{data.pages}</Text>
              <Text style={styles.headingText}>Pages</Text>
            </View>

            <View style={styles.headingContainer}>
              <Text style={styles.valueText}>{data.language}</Text>
              <Text style={styles.headingText}>Language</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.container}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About this book</Text>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <MaterialIcons 
                name={isExpanded ? 'expand-less' : 'expand-more'} 
                size={24} 
                color="#095482" 
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

        <CustomButton
          title="Add to Wishlist"
          handlePress={addBookToWishList}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#45a613" // Optional: Override default color
      />
      </SafeAreaView>
    </ScrollView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  scrollArea: {
    backgroundColor: "#ffffff"
  },
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
    backgroundColor: "#ffffff",
    marginTop: 4
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#353635',
    marginBottom: 5,
  },
  bookDate: {
    fontSize: 16,
    color: '#353635',
  },
  metadataContainer: {
    backgroundColor: '#f2f2f2', borderRadius: 25, marginHorizontal: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  metadataText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginTop: 5,
    paddingHorizontal: 15,
    textAlign: "justify"
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#6200EE',
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },

  horizontalRow: {
    flexDirection: 'row', // Aligns both value and heading rows horizontally
    justifyContent: 'space-around', // Distributes space between items
    alignItems: 'center', // Aligns items in the center vertically
    marginVertical: 10, // Adjust vertical spacing
  },
  
  valueContainer: {
    flexDirection: 'column', // Stack the values vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Custom color for the value
    marginBottom: 5, // Adjust spacing between values
  },
  
  headingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  
  headingText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000000'
  },

  categoryText: {
    flexWrap: 'wrap', // Allow text to wrap to the next line
    textAlign: 'center', // Center align the text
    maxWidth: 120, // Optional: Limit max width for better wrapping
    fontSize: 18,
  }
});
