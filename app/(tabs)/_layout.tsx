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
              className='w-7 h-7 mb-2'
          />
          <Text className ='text-xs' style={{ color : color }}>{name}</Text>
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
                  borderTopWidth: 1,
                  borderTopColor: '#0d0d0d',
                  height: 84
                }
          }}
      >

        <Tabs.Screen 
            name = "books"
            options={{
                title: "Books",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.books}
                      color={color}
                      name="Books"
                      focused={focused}
                  />
                )
            }}
        />

        <Tabs.Screen 
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
        />

        <Tabs.Screen 
            name = "userBooks"
            options={{
                title: "User Books",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon 
                      icon={icons.user}
                      color={color}
                      name="User Books"
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
        
      </Tabs>
    </>
  );

};

export default TabsLayout;

const styles = StyleSheet.create({});