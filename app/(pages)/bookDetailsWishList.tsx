import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, SafeAreaView, 
  StatusBar, ScrollView, TouchableOpacity 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { getEnvironment } from '../../constants/environment';
import { MaterialIcons } from '@expo/vector-icons'; 
import Toast from 'react-native-toast-message';
import { useGlobalContext } from "@/context/GlobalProvider";

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

  const addToLibrary = async () => {
    const { baseUrl } = getEnvironment();
    const requestBody = {
      bookCode: bookDetails.code,
      userCode: user.userCode,
      bookStatus: "LIBRARY"
    };

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/update-book`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        router.replace('/(tabs)/userBooks');
        console.log('Book successfully marked as Read');
      } else {
        console.error('Failed to update the book status');
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

        <View style={styles.metadataContainer}>
          <View style={styles.horizontalRow}>
            {/* Value Row */}
            <View style={styles.headingContainer}>
              <Text style={styles.valueText}>4.2</Text>
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
              <Text style={styles.valueText}>EN</Text>
              <Text style={styles.headingText}>Language</Text>
            </View>
          </View>
        </View>


        {/* Description Section */}
        <View style={styles.container}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
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
          handlePress={addToLibrary}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#0571b1" // Optional: Override default color
        />

      <CustomButton
          title="Delete From Wishlist"
          handlePress={() => {}}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#000000" // Optional: Override default color
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
    backgroundColor: '#ffffff'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  safeArea: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  thumbnail: {
    width: 130,
    height: 180,
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
    backgroundColor: '#dbdbdb',
    borderRadius: 25,
    marginLeft: 8,
    marginRight: 8
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
    padding: 20
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 5,
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
  tabContainer: {
    flexDirection: 'row', // Ensures items are side by side
    justifyContent: 'flex-start', // Aligns items to the left
    marginVertical: 10, // Adjust vertical spacing as needed
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
    maxWidth: 150,
  },
  
  headingText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000000',
  },

  categoryText: {
    flexWrap: 'wrap', // Allow text to wrap to the next line
    textAlign: 'center', // Center align the text
    maxWidth: 120, // Optional: Limit max width for better wrapping
    fontSize: 18,
  }
  
  
});
