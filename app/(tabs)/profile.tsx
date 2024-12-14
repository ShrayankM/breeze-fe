import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { signOut } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { getEnvironment } from '@/constants/environment';

type UserData = {
  code: string;
  userName: string;
  emailAddress: string;
  readingBookCount: number;
  completedBookCount: number;
  wishlistedBookCount: number;
  totalBooksInLibrary: number;
};

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/(auth)/sign-in');
  };

  const getUserProfileUsingCode = async () => {
    const { baseUrl } = getEnvironment();
    try {
      const response = await fetch(`${baseUrl}/v1/breeze/user/${user.userCode}/fetch-user-profile`);
      const jsonData = await response.json();
      setUserInfo(jsonData.data || null);
    } catch (error) {
      console.error('Error while fetching user-information', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
    return initials.slice(0, 2); // Only the first 2 initials
  };

  useEffect(() => {
    getUserProfileUsingCode();
  }, []);

  // Helper to calculate percentages
  const calculatePercentage = (count: number, total: number) =>
    total > 0 ? ((count / total) * 100).toFixed(1) : '0';

  if (!userInfo) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No user information found</Text>
      </View>
    );
  }

  const { readingBookCount, completedBookCount, wishlistedBookCount, totalBooksInLibrary } = userInfo;

  return (
    <SafeAreaView style={styles.container}>

      {/* Profile Image Placeholder */}
      <View style={styles.profileImageContainer}>
        <Text style={styles.profileInitials}>
          {getInitials(userInfo.userName)}
        </Text>
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.userName}>{userInfo.userName}</Text>
        <Text style={styles.email}>{userInfo.emailAddress}</Text>
      </View>

      {/* Book Stats with Percentages */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#FFB6C1' }]}>
          <Text style={styles.statNumber}>{`${calculatePercentage(readingBookCount, totalBooksInLibrary)}%`}</Text>
          <Text style={styles.statLabel}>Reading</Text>
          <Text style={styles.statCount}>{`${readingBookCount} Books`}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#87CEFA' }]}>
          <Text style={styles.statNumber}>{`${calculatePercentage(completedBookCount, totalBooksInLibrary)}%`}</Text>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statCount}>{`${completedBookCount} Books`}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#90EE90' }]}>
          <Text style={styles.statNumber}>{`${calculatePercentage(wishlistedBookCount, totalBooksInLibrary + wishlistedBookCount)}%`}</Text>
          <Text style={styles.statLabel}>Wishlisted</Text>
          <Text style={styles.statCount}>{`${wishlistedBookCount} Books`}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FFD700' }]}>
        <Text style={styles.statNumber}>{`${calculatePercentage(totalBooksInLibrary, totalBooksInLibrary + wishlistedBookCount)}%`}</Text>
          <Text style={styles.statLabel}>In Library</Text>
          <Text style={styles.statCount}>{`${totalBooksInLibrary} Books`}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <CustomButton
            title="Logout"
            handlePress={logout}
            containerStyles={styles.buttonContainer}
            textStyles={styles.buttonText}
            color="#eb3467" // Optional: Override default color
          />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 15,
    marginVertical: 10, // Reduced vertical margin
    backgroundColor: '#6200EE',
    elevation: 4,
    width: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  profileImageContainer: {
    width: 100, // Slightly smaller
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10, // Reduced margin
    marginTop: 10, // Reduced top margin
  },
  profileInitials: {
    fontSize: 32, // Slightly smaller font size
    fontWeight: 'bold',
    color: '#FFF',
  },
  header: {
    alignItems: 'center',
    marginVertical: 10, // Reduced margin
  },
  userName: {
    fontSize: 24, // Adjusted for balance
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, // Added slight spacing under username
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10, // Reduced spacing below email
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10, // Reduced vertical padding
  },
  statBox: {
    width: '48%',
    marginVertical: 8, // Reduced margin
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15, // Reduced padding
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 22, // Slightly smaller
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  statCount: {
    fontSize: 12,
    color: '#333',
    marginTop: 1,
  },
  logoutContainer: {
    marginTop: 20, // Reduced spacing above logout button
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
  },
});