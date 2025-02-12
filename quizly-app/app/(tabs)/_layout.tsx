import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function TabLayout() {
    const theme = useTheme();
    
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <LinearGradient
          colors={theme.colors.background}
         
            style={{ height: 60, width: '100%' }}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          
          left: 10,
          right: 10,
          elevation: 0,
          display: 'flex',
          paddingBottom: 20,
         
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: 0,
          height: 60,
          borderRadius: 15,

          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            iscenter={false}
              icon={<MaterialCommunityIcons name="home" size={24} />}
              focused={focused}
            />
          ),
        }}
      />

      {/* Rank Screen */}
      <Tabs.Screen
        name="rank"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            iscenter={false}
              icon={<MaterialCommunityIcons name="trophy" size={24} />}
              focused={focused}
            />
          ),
        }}
      />

      {/* Add Screen - Centered Floating Button */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            iscenter={true}
            
            icon={<MaterialCommunityIcons name="plus" size={24} />}
            focused={focused}
          />
          ),
        }}
      />

      {/* Search Screen */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            iscenter={false}
              icon={<MaterialCommunityIcons name="magnify" size={24} />}
              focused={focused}
            />
          ),
        }}
      />

      {/* User Screen */}
      <Tabs.Screen
        name="user"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            iscenter={false}
              icon={<MaterialCommunityIcons name="account" size={24} />}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const TabIcon = ({ icon, focused,iscenter }) => (
  <View style={{ alignItems: 'center',width:"100%" ,height:"100%",display:"flex",justifyContent: 'center' }}>
    <LinearGradient
      colors={iscenter? ['rgba(245, 158, 11, 0.9)', 'rgba(217, 119, 6, 0.9)']:focused ? ['#1e293b', '#0f172a'] : ['transparent', 'transparent']}
      style={{
        width:iscenter? 60:40,
        height: iscenter? 60:40,
        borderRadius: iscenter? 30:20,
        marginBottom: iscenter? 20:0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View style={{ borderRadius: 100 }}>
        {React.cloneElement(icon, {
          color:iscenter?"white": focused ? '#f59e0b' : '#64748b',
          size: focused||iscenter ? 26 : 24,
        })}
      </View>
    </LinearGradient>
  </View>
);