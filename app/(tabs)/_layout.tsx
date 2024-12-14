import { StyleSheet, View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import icons from '../../constants/icons';

interface TabIconProps {
  icon: any,
  color: string,
  name: string,
  focused: boolean
}

const TabIcon: React.FC<TabIconProps> = ({icon, color, name, focused}) => {
  return(
      <View className="items-center justify-center tab-2">
          <Image 
              source={icon}
              resizeMode='contain'
              tintColor={color}
              className='w-6 h-6 mt-6'
          />
          <Text
          className="text-xs font-medium w-20 text-center whitespace-nowrap mt-1"
          style={{ color }}
          >
          {name}
          </Text>
      </View>
  )
}

const TabsLayout = () => {
  
  return (
    <>
      <Tabs 
          screenOptions = {{
              tabBarShowLabel: false,
              tabBarActiveTintColor: "#ffffff",
              tabBarInactiveTintColor: "#969595",
              tabBarStyle: {
                  backgroundColor: '#0d0d0d',
                  borderTopWidth: 0,
                  borderTopColor: '#0d0d0d',
                  height: 70
                }
          }}
      >

        <Tabs.Screen 
            name = "books"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.home}
                      color={color}
                      name="Home"
                      focused={focused}
                  />
                )
            }}
        />

        {/* <Tabs.Screen 
            name = "search"
            options={{
                title: "Search",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.search}
                      color={color}
                      name="Search"
                      focused={focused}
                  />
                )
            }}
        /> */}

        <Tabs.Screen 
            name = "userBooks"
            options={{
                title: "Library",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.agenda}
                      color={color}
                      name="Library"
                      focused={focused}
                  />
                )
            }}
        />

        <Tabs.Screen 
            name = "wishlist"
            options={{
                title: "Wishlist",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.wishlist}
                      color={color}
                      name="Wishlist"
                      focused={focused}
                  />
                )
            }}
        />

          <Tabs.Screen 
            name = "profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.user}
                      color={color}
                      name="Profile"
                      focused={focused}
                  />
                )
            }}
        />
        
      </Tabs>
    </>
  );

};

export default TabsLayout;

const styles = StyleSheet.create({});