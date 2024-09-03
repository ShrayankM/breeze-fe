import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '@/components/CustomButton';
import images from '../../constants/images';

const RequestDetails = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const bookRequest = useLocalSearchParams();

  return (
    <View className='flex-1 justify-center items-center p-5 bg-gray-200'>

     {/** Image section */}
      <Image 
        source={images.bookImage}
        resizeMode="cover"
        className='mb-5 rounded-md w-150 h-150'
      />

      {/* Book Details Section */}
      <View className='w-full mb-5 mt-5'>
        <Text style={styles.label}>Book Name:</Text>
        <Text style={styles.value}>{bookRequest.bookName}</Text>

        <Text style={styles.label}>Author Name:</Text>
        <Text style={styles.value}>{bookRequest.authorName}</Text>

        <Text style={styles.label}>ISBN:</Text>
        <Text style={styles.value}>{bookRequest.isbn}</Text>

        <Text style={styles.label}>Pages:</Text>
        <Text style={styles.value}>{bookRequest.noOfPages}</Text>

        <Text style={styles.label}>Year Published:</Text>
        <Text style={styles.value}>{bookRequest.yearPublished}</Text>

        <Text style={styles.label}>Genre:</Text>
        <Text style={styles.value}>{bookRequest.bookGenre}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{bookRequest.description}</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Approve" 
          color="#43b253"
          handlePress={() => {}}  
          containerStyles="flex-1 ht-50 justify-center items-center mx-1.5" 
          isLoading={isSubmitting}   
        /> 

        <CustomButton
          title="Reject" 
          color="#b24343"
          handlePress={() => {}}  
          containerStyles="flex-1 ht-50 justify-center items-center mx-1.5" 
          isLoading={isSubmitting}   
        /> 
      </View>
    </View>
  );
}

export default RequestDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 30,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});