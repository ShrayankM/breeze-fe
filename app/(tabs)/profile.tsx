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
  totalBooksInSystem: number;
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

  const { readingBookCount, completedBookCount, wishlistedBookCount, totalBooksInLibrary, totalBooksInSystem } = userInfo;

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
      total: wishlistedBookCount,
      color: '#90EE90',
    },
    {
      label: 'In Library',
      count: totalBooksInLibrary,
      total: totalBooksInLibrary,
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

      <View style={styles.horizontalLine} />

      {/* Book Stats with Gradients */}
      <View style={styles.horizontalRowButtons}>
        <View style={styles.readingContainer}>
          {/* <View style={styles.statTextContainer}>
            <Text style={styles.statLabel}>Reading</Text>
            <Text style={styles.statNumber}>{readingBookCount}</Text>
                  
          </View> */}


          <LinearGradient
              colors={['#fefcc9', '#fef756']}
              style={styles.readingContainer}>

              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Reading</Text>
                <Text style={styles.statNumber}>{readingBookCount}</Text>
                <Text style={styles.statPercentage}>{`${calculatePercentage(readingBookCount, totalBooksInLibrary)}%`}</Text>
                      
              </View>
          </LinearGradient>
        </View>

        <View style={styles.overallStatContainer}>
        <LinearGradient
              colors={['#fee7c9', '#feb14a']}
              style={styles.overallStatContainer}>

              <View style={styles.statTextContainerLibrary}>
                <Text style={styles.statLabel}>Overall</Text>
                <Text style={styles.statNumber}>{totalBooksInLibrary}/{totalBooksInSystem}</Text>
                <Text style={styles.statPercentageOverall}>{`${calculatePercentage(totalBooksInLibrary, totalBooksInSystem)}%`}</Text>
                      
              </View>
          </LinearGradient>
        </View>

        <View style={styles.completedContainer}>
        <LinearGradient
              colors={['#fdbbe3', '#fd78c8']}
              style={styles.completedContainer}>

              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Completed</Text>
                <Text style={styles.statNumber}>{completedBookCount}</Text>
                <Text style={styles.statPercentage}>{`${calculatePercentage(completedBookCount, totalBooksInLibrary)}%`}</Text>
                      
              </View>
          </LinearGradient>
        </View>
      </View>


      <View style={styles.horizontalRowButtonsLower}>

        <View style={styles.wishlistedContainer}>
        <LinearGradient
              colors={['#d4fdce', '#82fd6e']}
              style={styles.wishlistedContainer}>

              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Wishlisted</Text>
                <Text style={styles.statNumber}>{wishlistedBookCount}</Text>
                {/* <Text style={styles.statPercentage}>{`${calculatePercentage(completedBookCount, totalBooksInLibrary)}%`}</Text> */}
                      
              </View>
          </LinearGradient>
        </View>

        <View style={styles.libraryContainer}>
        <LinearGradient
              colors={['#cbfefe', '#6efbfd']}
              style={styles.libraryContainer}>

              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Library</Text>
                {/* <Text style={styles.statNumber}>{`${calculatePercentage(readingBookCount, totalBooksInLibrary)}%`}</Text> */}
                <Text style={styles.statNumberLibrary}>{totalBooksInLibrary}</Text>
                      
              </View>
          </LinearGradient>
        </View>

           
      </View>

      {/* <View style={styles.horizontalLineBottom} /> */}

      {/* Logout Button */}
      {/* <View style={styles.logoutContainer}> */}
        <CustomButton
          title="Logout"
          handlePress={logout}
          containerStyles={styles.buttonContainer}
          textStyles={styles.buttonText}
          color="#aa003c"
        />
      {/* </View> */}

      {/* <CustomButton
          title="Delete From Library"
          handlePress={markAsDeleted}
          containerStyles={styles.buttonContainerDeleted}
          textStyles={styles.buttonText}
          color="#000000" // Optional: Override default color
      /> */}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({

  horizontalLine: {
    borderBottomColor: '#ccc', // Line color
    borderBottomWidth: 1,      // Line thickness
    marginVertical: 10,        // Space above and below the line
    marginHorizontal: 20,
    marginTop: -10
  },

  horizontalLineBottom: {
    borderBottomColor: '#ccc', // Line color
    borderBottomWidth: 1,      // Line thickness
    marginVertical: 10,        // Space above and below the line
    marginHorizontal: 20,
    marginTop: 10
  },

  readingContainer: {
    width: 100,
    height: 110,
    borderRadius: 15, // Softer rounded corners
    overflow: 'hidden', // Prevent content from overflowing
    elevation: 5, // Stronger elevation for a modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
},


  libraryContainer: {
    width: 100,
    height: 110,
    borderRadius: 15, // Softer rounded corners
    overflow: 'hidden', // Prevent content from overflowing
    elevation: 5, // Stronger elevation for a modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  completedContainer: {
    width: 100,
    height: 110,
    borderRadius: 15, // Softer rounded corners
    overflow: 'hidden', // Prevent content from overflowing
    elevation: 5, // Stronger elevation for a modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  horizontalRowButtons: {
    flexDirection: 'row', // Aligns both value and heading rows horizontally
    justifyContent: "space-between",
    alignItems: 'center', // Aligns items in the center vertically
    marginVertical: 5, // Adjust vertical spacing
  },

  horizontalRowButtonsLower: {
    flexDirection: 'row', // Aligns both value and heading rows horizontally
    justifyContent: "space-evenly",
    alignItems: 'center', // Aligns items in the center vertically
    marginVertical: 5, // Adjust vertical spacing
    marginTop: 10
  },

  wishlistedContainer: {
    width: 100,
    height: 110,
    borderRadius: 15, // Softer rounded corners
    overflow: 'hidden', // Prevent content from overflowing
    elevation: 5, // Stronger elevation for a modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginRight: -40
  },

  overallStatContainer: {
    width: 120,
    height: 130,
    borderRadius: 15, // Softer rounded corners
    overflow: 'hidden', // Prevent content from overflowing
    elevation: 5, // Stronger elevation for a modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

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
    flexDirection: 'column',
    alignItems: "center",
    marginTop: 15
  },
  statTextContainerLibrary: {
    flexDirection: 'column',
    alignItems: "center",
    marginTop: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 50,
    backgroundColor: '#d6ff5a',
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
    fontSize: 30,
    marginTop: -10,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#5f5b5b',
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    // marginBottom: 5,
  },
  statNumberLibrary: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    marginTop: -5
    // marginBottom: 5,
  },
  statPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  statPercentageOverall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    marginTop: 5
  },
  statLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 3,
    textAlign: "center"
  },
  statCount: {
    fontSize: 30,
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
    padding: 40,
    borderRadius: 25,
    marginHorizontal: 20,
    backgroundColor: '#520914',
    elevation: 3,
    marginTop: 20,
    marginBottom: 10,
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
