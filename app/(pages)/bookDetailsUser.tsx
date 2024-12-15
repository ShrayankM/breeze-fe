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
  const [rating, setRating] = useState<number>(0);

  const handleRatingPress = async (star: number) => {
    const { baseUrl } = getEnvironment();
    setRating(star);

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

  const getStatusColor = (bookStatus: string) => {
    switch (bookStatus) {
      case 'LIBRARY':
        return '#0571b1'; // Green for added
      case 'COMPLETED':
        return '#a62c13'; // Red for completed
      case 'READING':
        return '#e69e13'; // Yellow for reading
      default:
        return 'gray';
    }
  };

  useEffect(() => {
    getBookUsingCode();
  }, []);

  useEffect(() => {
    if (rating === 0) {
      if (bookDetails?.userRating) {
        setRating(Number(bookDetails.userRating));
      } else if (data?.globalRating) {
        setRating(data.globalRating);
      }
    }
  }, [bookDetails, data, rating]);

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
            <Text style={styles.bookDate}> Released {data.publishedDate}</Text>
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

        <View style={[styles.container, styles.ratingContainer]}>
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
                    name={starNumber <= rating ? 'star' : 'star-border'}
                    size={32}
                    color="#f5d925"
                    style={styles.star}
                  />
                </TouchableOpacity>
              );
            })}
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

      <CustomButton
          title="Delete From Library"
          handlePress={markAsDeleted}
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
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  errorText: { fontSize: 16, color: 'red' },
  safeArea: { flex: 1 },
  headerContainer: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 0, borderBottomColor: '#e0e0e0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  thumbnail: { width: 130, height: 180, borderRadius: 10, marginRight: 10 },
  bookInfo: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  bookAuthor: { fontSize: 18, color: '#353635', marginBottom: 3 },
  bookDate: { fontSize: 16, color: '#353635' },
  metadataContainer: { backgroundColor: '#dbdbdb', borderRadius: 25, marginHorizontal: 8 },
  metadataText: { fontSize: 16, color: '#555', marginVertical: 3 },
  bold: { fontWeight: 'bold' },
  container: { padding: 15 },
  descriptionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  descriptionText: { fontSize: 16, color: '#333', lineHeight: 20, marginTop: 5, paddingHorizontal: 12 },
  buttonContainer: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginHorizontal: 12, marginTop: 5, marginBottom: 10, backgroundColor: '#6200EE', elevation: 3 },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#fff', textAlign: 'center' },
  tabContainer: { flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 8 },
  statusText: { fontSize: 10, color: '#000000', fontWeight: 'bold' },
  horizontalRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 8 },
  valueContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  valueText: { fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 4 },
  headingContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 8, maxWidth: 150 },
  headingText: { fontSize: 14, fontWeight: 'normal', color: '#000000' },
  categoryText: { flexWrap: 'wrap', textAlign: 'center', maxWidth: 120, fontSize: 18 },
  statusCard: { width: 80, height: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 2, marginHorizontal: 6, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  disabledButtonContainer: { backgroundColor: '#d3d3d3' },
  disabledButtonText: { color: '#a9a9a9' },
  starContainer: { padding: 2 },
  star: { marginHorizontal: 5 },
  ratingContainer: { alignItems: 'flex-start' },
  ratingLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  starsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }
});

