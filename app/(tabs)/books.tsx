import { StyleSheet, View, Text, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEnvironment } from '../../constants/environment';

type Book = {
  code: string;
  bookName: string;
  isbn: string;
  authorName: string;
  genre: string;
};

const Books = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Book[]>([]);

  const getBooks = async () => {
    const { baseUrl } = getEnvironment();

    try {
      const response = await fetch(`${baseUrl}/v1/breeze/book/get-books`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode: 'USR12345',
        }),
      });

      const jsonData = await response.json();

      console.log(jsonData);

      const books = jsonData.data?.bookDetailsList || [];
      setData(books);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ code }) => code}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                  {item.bookName}, {item.authorName}, {item.genre}, {item.isbn}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  listContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default Books;
