import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface BookStatuCardProps {
    bookStatus: string;
    statusColor: string;
  }

const BookStatusCard: React.FC<BookStatuCardProps> = ({bookStatus, statusColor }) => {
  return (
    <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{bookStatus}</Text>
    </View>
  )
}

export default BookStatusCard

const styles = StyleSheet.create({
    statusCard: {
      width: 90,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 14,
      marginBottom: 2,
      marginHorizontal: 8,
      borderRadius: 14,
      shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    statusText: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 'bold',
    },
  });