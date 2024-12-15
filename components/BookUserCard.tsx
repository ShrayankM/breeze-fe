import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'

interface BookUserCardProps {
    name: string;
    author: string;
    category: string;
    isbnSmall: string;
    thumbnail: string;
    bookStatus: string;
    statusColor: string;
    onPress: () => void;
  }

  const BookUserCard: React.FC<BookUserCardProps> = ({
    name,
    author,
    category,
    isbnSmall,
    thumbnail,
    bookStatus,
    statusColor,
    onPress,
  }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: thumbnail }}
            resizeMode="contain"
            style={styles.thumbnail}
          />
        </View>
  
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          {/* <Text style={styles.author}>Author: {author}</Text>
          <Text style={styles.category}>{category}</Text>
          <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{bookStatus}</Text>
          </View> */}

          <View style={styles.rowContainer}>
            <View style={styles.authorCategoryContainer}>
              <Text style={styles.author}>Author: {author}</Text>
              <Text style={styles.category}>Category: {category}</Text>
            </View>
            
            <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{bookStatus}</Text>
            </View>
        </View>


        </View>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      // marginHorizontal: 8,
      // width: '100%',
      // backgroundColor: 'red'
    },
    authorCategoryContainer: {
      flexShrink: 1,
    },

    card: {
      flexDirection: 'row',
      height: 94,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    thumbnailContainer: {
      width: 64,
      height: 64,
      margin: 8,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 6,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 8,
    },
    title: {
      fontSize: 15,
      fontWeight: 'bold',
      marginTop: 4,
      marginHorizontal: 8,
      color: '#111827',
    },
    author: {
      fontSize: 12,
      marginHorizontal: 8,
      color: '#4B5563',
    },
    category: {
      fontSize: 12,
      fontWeight: 'bold',
      marginHorizontal: 8,
      marginBottom: 4,
      color: '#6B7280',
    },
    statusCard: {
      width: 80,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
      marginRight: 20,
      borderRadius: 14,
      shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    statusText: {
      fontSize: 10,
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
export default BookUserCard;
