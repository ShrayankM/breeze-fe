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
import { routeToScreen } from 'expo-router/build/useScreens';
import BookStatusCard from '@/components/BookStatusCard';
import BookUserCard from '@/components/BookUserCard';

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
  bookStatus: string;
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
  const [userRating, setUserRating] = useState<number>(0);
  const [globalRating, setGlobalRating] = useState<number>(0);

  const handleRatingPress = async (star: number) => {
    const { baseUrl } = getEnvironment();
    setUserRating(star);

    const requestBody = {
      rating: star,
      userCode: user.userCode,
      bookCode: bookDetails.code
    };

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/update-user-rating`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Updated Book rating successfully');
      } else {
        console.error('Failed to update book rating');
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
    

  };

  const getBookUsingCode = async () => {
    const { baseUrl } = getEnvironment();
    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/${bookDetails.code}/user/${user.userCode}/get-book-details-user`);
      const jsonData = await response.json();
      setData(jsonData.data || null);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markBookAsReading = async () => {
    const { baseUrl } = getEnvironment();
    const requestBody = {
      bookCode: bookDetails.code,
      userCode: user.userCode,
      bookStatus: "READING"
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

  const markBookAsCompleted = async () => {
    const { baseUrl } = getEnvironment();
    const requestBody = {
      bookCode: bookDetails.code,
      userCode: user.userCode,
      bookStatus: "COMPLETED",
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
        console.log('Book successfully marked as Completed');
      } else {
        console.error('Failed to update the book status');
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  const markAsDeleted = async () => {
    const { baseUrl } = getEnvironment();
    const requestBody = {
      bookCode: bookDetails.code,
      userCode: user.userCode,
      isDeleted: 1
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
        console.log('Book successfully deleted');
      } else {
        console.error('Failed to delete the book');
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  useEffect(() => {
    getBookUsingCode();
  }, []);

  useEffect(() => {
    if (userRating === 0) {
      if (data?.userRating) {
        setUserRating(Number(data.userRating));
      } else {
        setUserRating(0);
      }
      
      if (data?.globalRating) {
        setGlobalRating(data.globalRating);
      } else {
        setGlobalRating(0);
      }
    }
  }, [bookDetails, data, userRating, globalRating]);

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
            {/* <Text>{data.bookStatus}</Text> */}
            {/* <BookStatusCard 
              bookStatus={data.bookStatus}
              statusColor={getStatusColor(data.bookStatus)}
            /> */}
          </View>

          {/* <View style={[styles.statusCard]}>
            
          </View> */}
        </View>

        <View style={styles.metadataContainer}>
          <View style={styles.horizontalRow}>
            {/* Value Row */}
            <View style={styles.headingContainer}>
              <Text style={styles.valueText}>{data.globalRating ? data.globalRating : "-"}</Text>
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

        {/* <View style={[styles.container, styles.ratingContainer]}>
          <Text style={styles.ratingLabel}>Rating</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }, (_, index) => {
              const starNumber = index + 1;
              return (
                <TouchableOpacity
                  key={starNumber}
                  onPress={() => handleRatingPress(starNumber)}
                >
                  <MaterialIcons
                    name={starNumber <= userRating ? 'star' : 'star-border'}
                    size={32}
                    color="#ffb400"
                    style={styles.star}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      </View> */}


      <View style={styles.horizontalRowButtons}>
      <CustomButton
          title="Reading"
          handlePress={data.bookStatus === 'READING' ? () => {} : markBookAsReading} 
          containerStyles={[
            styles.buttonContainer,
            data.bookStatus === 'READING' ? styles.disabledButtonContainer : styles.buttonContainer,
          ]}
          textStyles={[
            styles.buttonText,
            data.bookStatus === 'READING' ? styles.disabledButtonText : styles.buttonText,
          ]}
          color={data.bookStatus === 'READING' ? '#d3d3d3' : '#e69e13'}
        />

      <CustomButton
          title="Completed"
          handlePress={data.bookStatus === 'COMPLETED' ? () => {} : markBookAsCompleted}
          containerStyles={[
            styles.buttonContainer,
            data.bookStatus === 'READING' ? styles.disabledButtonContainer : styles.buttonContainer,
          ]}
          textStyles={[
            styles.buttonText,
            data.bookStatus === 'COMPLETED' ? styles.disabledButtonText : styles.buttonText,
          ]}
          color={data.bookStatus === 'COMPLETED' ? '#d3d3d3' : '#a62c13'}
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

        {/** Rating Section */}
        <View style={styles.container}>
          <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Rate this ebook</Text>
            </View>
            <View style={[styles.container, styles.ratingContainer]}>
            <View style={styles.starsRow}>
            {Array.from({ length: 5 }, (_, index) => {
              const starNumber = index + 1;
              return (
                <TouchableOpacity
                  key={starNumber}
                  onPress={() => handleRatingPress(starNumber)}
                >
                  <MaterialIcons
                    name={starNumber <= userRating ? 'star' : 'star-border'}
                    size={32}
                    color="#ffb400"
                    style={styles.star}
                  />
                </TouchableOpacity>
              );
            })}
            </View>
          </View>
        </View>

        

      <CustomButton
          title="Delete From Library"
          handlePress={markAsDeleted}
          containerStyles={styles.buttonContainerDeleted}
          textStyles={styles.buttonText}
          color="#000000" // Optional: Override default color
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
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  errorText: { fontSize: 16, color: 'red' },
  safeArea: { flex: 1, backgroundColor: "#ffffff", marginTop: 4 },
  headerContainer: 
  { 
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
  bookInfo: { flex: 1, justifyContent: 'center' },
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
  bold: { fontWeight: 'bold' },
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
  buttonContainerDeleted: {
    padding: 40, borderRadius: 25, marginHorizontal: 20, marginTop: -55, marginBottom: 10, backgroundColor: '#6200EE', elevation: 3 ,
  },
  tabContainer: { flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 8 },
  statusText: { fontSize: 10, color: '#000000', fontWeight: 'bold' },
  horizontalRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 8 },
  valueContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  valueText: { fontSize: 15, fontWeight: 'bold', color: '#000000', marginBottom: 4 },
  headingContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 8, maxWidth: 150 },
  headingText: { fontSize: 13, fontWeight: 'normal', color: '#000000' },  categoryText: { flexWrap: 'wrap', textAlign: 'center', maxWidth: 120, fontSize: 15 },
  statusCard: { width: 80, height: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 2, marginHorizontal: 6, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  disabledButtonContainer: { backgroundColor: '#d3d3d3' },
  disabledButtonText: { color: '#a9a9a9' },
  starContainer: { padding: 2 },
  star: { marginHorizontal: 5 },
  ratingContainer: { alignItems: 'flex-start' },
  ratingLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  starsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },

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

  horizontalRowButtons: {
    flexDirection: 'row', // Aligns both value and heading rows horizontally
    justifyContent: "center",
    alignItems: 'center', // Aligns items in the center vertically
    marginVertical: 10, // Adjust vertical spacing
  },
});

