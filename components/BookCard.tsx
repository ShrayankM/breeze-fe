import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';

interface BookCardProps {
  name: string;
  author: string;
  category: string;
  isbnSmall: string;
  thumbnail: string;
  onPress: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  name,
  author,
  category,
  isbnSmall,
  thumbnail,
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
        <Text style={styles.author}>Author: {author}</Text>
        <Text style={styles.category}>{category}</Text>
        {/* <Text style={styles.isbn}>ISBN: {isbnSmall}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    width: 64, // w-16
    height: 64, // h-16
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
    color: '#111827', // Tailwind's gray-800 equivalent
  },
  author: {
    fontSize: 12,
    marginHorizontal: 8,
    color: '#4B5563', // Tailwind's gray-600 equivalent
  },
  category: {
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 8,
    marginBottom: 4,
    color: '#6B7280', // Tailwind's gray-500 equivalent
  },
  isbn: {
    fontSize: 10,
    marginHorizontal: 8,
    marginBottom: 4,
    color: '#6B7280', // Tailwind's gray-500 equivalent
  },
});

export default BookCard;
