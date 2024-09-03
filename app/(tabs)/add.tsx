import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { getEnvironment } from '../../constants/environment';

const Add = () => {

const [form, setForm] = useState ({
    bookName: '',
    authorName: '',
    isbn: '',
    noOfPages: '',
    yearPublished: '',
    bookGenre: '',
    description: ''
}) 

const [isSubmitting, setIsSubmitting] = useState(false)

  const submitForm = async () => {

    const { baseUrl } = getEnvironment();

    if (form.bookName === "" || form.authorName === "" || form.isbn === "" || 
        form.noOfPages === "" || form.yearPublished === "" || form.bookGenre === "" || form.description === "") {
        Alert.alert("Error", "Please enter all details for book addition request");
    }

    setIsSubmitting(true);

    try {

        const response = await fetch(`${baseUrl}/v1/breeze/approval/create-request`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userCode: 'USR12345678',
              bookApprovalData: {
                    "bookName": form.bookName,
                    "authorName": form.authorName,
                    "isbn": form.isbn,
                    "noOfPages": form.noOfPages,
                    "yearPublished": form.yearPublished,
                    "bookGenre": form.bookGenre,
                    "description": form.description
                }
            }),
          });

          console.log(`Response for approval request = ${response.json()}`)

    } catch (error: any) {
        Alert.alert("Error", error.message);
    } finally {
        setIsSubmitting(false);
    }
}

  return (
    <SafeAreaView className='bg-primary h-full'>
        <ScrollView>
            <View className="w-full justify-center min-h-[85vh] px-6 my-6">

            <FormField 
                value={form.bookName}
                handleChangeText={(i: string) => setForm({...form, bookName: i})}
                otherStyles="mt-10"
                placeholder={'Bookname'}        
            />  

            <FormField 
                value={form.authorName}
                handleChangeText={(i: string) => setForm({...form, authorName: i})}
                otherStyles="mt-10"
                placeholder={'Author-name'}        
            />  

            <FormField 
                value={form.isbn}
                handleChangeText={(i: string) => setForm({...form, isbn: i})}
                otherStyles="mt-10"
                placeholder={'Isbn'}        
            />  

            <FormField 
                value={form.noOfPages}
                handleChangeText={(i: string) => setForm({...form, noOfPages: i})}
                otherStyles="mt-10"
                placeholder={'No. of pages'}        
            /> 

            <FormField 
                value={form.yearPublished}
                handleChangeText={(i: string) => setForm({...form, yearPublished: i})}
                otherStyles="mt-10"
                placeholder={'Year Published'}        
            /> 

            <FormField 
                value={form.bookGenre}
                handleChangeText={(i: string) => setForm({...form, bookGenre: i})}
                otherStyles="mt-10"
                placeholder={'Genre'}        
            /> 

            <FormField 
                value={form.description}
                handleChangeText={(i: string) => setForm({...form, description: i})}
                otherStyles="mt-10"
                placeholder={'Description'}        
            /> 

            <CustomButton 
                title="Send Request" 
                color='#FF9C01'
                handlePress={submitForm}  
                containerStyles='mt-7' 
                isLoading={isSubmitting}   
            />  
            
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Add;