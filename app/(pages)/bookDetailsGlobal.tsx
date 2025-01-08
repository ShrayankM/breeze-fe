import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, SafeAreaView, 
  StatusBar, ScrollView, TouchableOpacity, 
  ImageBackground
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

        <View style={styles.metadataContainer}>
          <View style={styles.horizontalRow}>
            {/* Value Row */}
            <View style={styles.headingContainer}>
              <Text style={styles.valueText}>{data.globalRating == null ? "-": data.globalRating}</Text>
              <Text style={styles.headingText}>Rating</Text>
            </View>

            <View style={styles.headingContainer}>
              <Text style={[styles.valueText, styles.categoryText]} numberOfLines={1} ellipsizeMode="tail">{data.category}</Text>
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

        {/** Button section */}
        <View style={styles.horizontalRowButtons}>
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
            color="#45a100" // Optional: Override default color
          />
        </View>

        <View style={styles.horizontalLine} />

        {/* Description Section */}
        <View style={styles.container}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About this ebook</Text>
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

        <View style={styles.horizontalLineBottom} />


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
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 4
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 110,
    height: 150,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#353635',
    marginBottom: 5,
    textDecorationLine: "underline"
  },
  bookDate: {
    fontSize: 14,
    color: '#353635',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },


  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: '#fff',
    elevation: 2,
    width: 145,
    height: 45,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  horizontalRowButtons: {
    flexDirection: 'row', // Aligns both value and heading rows horizontally
    justifyContent: "center",
    alignItems: 'center', // Aligns items in the center vertically
    marginVertical: 10, // Adjust vertical spacing
  },


  horizontalLine: {
    borderBottomColor: '#ccc', // Line color
    borderBottomWidth: 1,      // Line thickness
    marginVertical: 10,        // Space above and below the line
    marginHorizontal: 20
  },

  horizontalLineBottom: {
    borderBottomColor: '#ccc', // Line color
    borderBottomWidth: 1,      // Line thickness
    marginVertical: 10,        // Space above and below the line
    marginHorizontal: 20,
    marginTop: -15
  },

  container: {
    padding: 40,
    // backgroundColor: "green"
    marginTop: -30
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginTop: 10,
    // paddingHorizontal: 15,
    textAlign: "justify",
  },

  metadataContainer: {
    backgroundColor: '#f2f2f2', 
    borderRadius: 30, 
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: -20
  },
  metadataText: {
    fontSize: 12,
    color: '#555',
    marginVertical: 5,
  },
  horizontalRow: {
    flexDirection: 'row', // Aligns both value and heading rows horizontally
    justifyContent: 'space-around', // Distributes space between items
    alignItems: 'center', // Aligns items in the center vertically
    marginVertical: 10, // Adjust vertical spacing
  },
  valueText: {
    fontSize: 15,
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
    fontSize: 13,
    fontWeight: 'normal',
    color: '#000000'
  },

  categoryText: {
    flexWrap: 'wrap', // Allow text to wrap to the next line
    textAlign: 'center', // Center align the text
    maxWidth: 120, // Optional: Limit max width for better wrapping
    fontSize: 15,
  }
});
