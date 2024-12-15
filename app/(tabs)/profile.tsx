import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { signOut } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { getEnvironment } from '@/constants/environment';
import { LinearGradient } from 'expo-linear-gradient';

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
      console.error('Error while fetching user information', error);
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

  const stats = [
    {
      label: 'Reading',
      count: readingBookCount,
      total: totalBooksInLibrary,
      color: '#FFB6C1',
    },
    {
      label: 'Completed',
      count: completedBookCount,
      total: totalBooksInLibrary,
      color: '#87CEFA',
    },
    {
      label: 'Wishlisted',
      count: wishlistedBookCount,
      total: totalBooksInLibrary + wishlistedBookCount,
      color: '#90EE90',
    },
    {
      label: 'In Library',
      count: totalBooksInLibrary,
      total: totalBooksInLibrary + wishlistedBookCount,
      color: '#FFD700',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Image Placeholder */}
      <View style={styles.profileImageContainer}>
        <Text style={styles.profileInitials}>{getInitials(userInfo.userName)}</Text>
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.userName}>{userInfo.userName}</Text>
        <Text style={styles.email}>{userInfo.emailAddress}</Text>
      </View>

      {/* Book Stats with Gradients */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <LinearGradient
            key={index}
            colors={[stat.color, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: Math.min(Number(calculatePercentage(stat.count, stat.total)) / 100, 1), y: 0 }}
            style={styles.statCard}
          >
            <View style={styles.statContent}>
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{`${calculatePercentage(stat.count, stat.total)}%`}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {/* <Text style={styles.statLabel}>{stat.label}</Text> */}
              <Text style={styles.statCount}>{`${stat.count}`}</Text>
            </View>
          </LinearGradient>
        ))}
      </View>


      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <CustomButton
          title="Logout"
          handlePress={logout}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#57161f"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  statCard: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statContent: {
    flexDirection: 'row', // Align data side by side
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Space between percentage and label
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d9f095',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  statsContainer: {
    flex: 1,
    marginTop: 10,
  },
  statBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15
  },
  statNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontStyle: "italic"
  },
  statCount: {
    fontSize: 20,
    color: '#333',
    fontWeight: "bold",
    marginRight: 15,
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: 'center',
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
    backgroundColor: '#520914',
    elevation: 4,
    width: '100%',
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
