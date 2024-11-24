import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useLocalSearchParams } from "expo-router";
  import CustomButtonAdvanced from "@/components/CustomButtonAdvanced";
  import { getEnvironment } from "../../constants/environment";
  import { MaterialIcons } from "@expo/vector-icons";
  
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
    rating: number;
    reviews: Array<{ reviewer: string; comment: string; rating: number }>;
  };
  
  const BookDetails = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Book | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const bookDetails = useLocalSearchParams();
  
    const getBookUsingCode = async () => {
      const { baseUrl } = getEnvironment();
      try {
        const response = await fetch(
          `${baseUrl}/v1/breeze/book/${bookDetails.code}/get-book-details`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
  
        const jsonData = await response.json();
        const book = jsonData.data || {};
        setData(book);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
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
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#161622" />
  
          {/* Top Section */}
          <View style={styles.topSection}>
            <Image
              source={{ uri: data.thumbnail }}
              style={styles.bookCover}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.bookTitle}>{data.name}</Text>
              <Text style={styles.bookAuthor}>{data.author}</Text>
              <Text style={styles.bookRelease}>Released: {data.publishedDate}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Free sample</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.buyButton]}>
                  <Text style={styles.actionButtonText}>Buy ₹{"10.00"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
  
          {/* Metadata Section */}
          <View style={styles.metadataSection}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataValue}>4.2</Text>
              <Text style={styles.metadataLabel}>Rating</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataValue}>{data.pages}</Text>
              <Text style={styles.metadataLabel}>Pages</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataValue}>eBook</Text>
              <Text style={styles.metadataLabel}>Format</Text>
            </View>
          </View>
  
          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.sectionTitle}>About this book</Text>
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <MaterialIcons
                  name={isExpanded ? "expand-less" : "expand-more"}
                  size={24}
                  color="#fff"
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
        </SafeAreaView>
      </ScrollView>
    );
  };
  
  export default BookDetails;
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#161622",
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    topSection: {
      flexDirection: "row",
      padding: 16,
    },
    bookCover: {
      width: 100,
      height: 150,
      borderRadius: 8,
    },
    infoContainer: {
      flex: 1,
      marginLeft: 16,
    },
    bookTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
    bookAuthor: {
      fontSize: 14,
      color: "#ccc",
      marginVertical: 4,
    },
    bookRelease: {
      fontSize: 12,
      color: "#aaa",
    },
    buttonsContainer: {
      flexDirection: "row",
      marginTop: 12,
    },
    actionButton: {
      backgroundColor: "#1a73e8",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 8,
    },
    buyButton: {
      backgroundColor: "#34a853",
    },
    actionButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    metadataSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
      backgroundColor: "#202020",
    },
    metadataItem: {
      alignItems: "center",
    },
    metadataValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
    metadataLabel: {
      fontSize: 12,
      color: "#aaa",
    },
    descriptionSection: {
      padding: 16,
      backgroundColor: "#161622",
    },
    descriptionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
    descriptionText: {
      fontSize: 14,
      color: "#ccc",
      marginTop: 8,
    },
    similarBooksSection: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    similarBookCard: {
      marginRight: 12,
      width: 100,
    },
    similarBookImage: {
      width: "100%",
      height: 140,
      borderRadius: 8,
    },
    similarBookTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#fff",
      marginTop: 4,
    },
    similarBookAuthor: {
      fontSize: 12,
      color: "#ccc",
    },
  });
  