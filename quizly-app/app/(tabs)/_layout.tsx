import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React,{useEffect,useState} from "react";
import { useTheme } from "../../context/ThemeContext";
import { registerForPushNotificationsAsync } from "../../components/registerForPushNotificationsAsync";
import api from "@/utils/Api";
import { useMutation } from "@tanstack/react-query";
export default function TabLayout() {
    const theme = useTheme();
    const [isRegistered, setIsRegistered] = useState(false);
    
    const mutation = useMutation({
      mutationFn: async (token) => {
        const response = await api.put("/user/pushnotification", {
          pushToken: token,
        });
        return response.data;
      },
      onSuccess: (data) => {},
      onError: (error) => {},
    });
    useEffect(() => {
      initializeSocket();
    }, []);
    useEffect(() => {
      const registerPushNotifications = async () => {
        if (!isRegistered) {
          const token = await registerForPushNotificationsAsync(mutation.mutate);
  
          if (token) {
            setIsRegistered(true);
          }
        }
      };
      registerPushNotifications();
    }, [isRegistered, mutation]);
  
    
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
          left: theme.metrics.spacing.comfortable,
          right: theme.metrics.spacing.comfortable,
          elevation: 0,
          paddingBottom: theme.metrics.spacing.comfortable,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: 0,
          height: 60,
          borderRadius: theme.metrics.borderRadius.medium,
          shadowColor: theme.isDarkMode ? '#FFFFFF' : '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDarkMode ? 0.1 : 0.05,
          shadowRadius: 8,
          borderColor: theme.colors.border,
          borderWidth: 0.5,
          backgroundColor: 'transparent',
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
              icon={<MaterialCommunityIcons name="home" />}
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
              icon={<MaterialCommunityIcons name="trophy" />}
              focused={focused}
            />
          ),
        }}
      />


      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              iscenter={true}
              icon={<MaterialCommunityIcons name="plus" />}
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
              icon={<MaterialCommunityIcons name="magnify" />}
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
              icon={<MaterialCommunityIcons name="account" />}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const TabIcon = ({ icon, focused, iscenter }) => {
  const theme = useTheme();

  return (
    <View
      style={{ 
        alignItems: 'center',
        justifyContent: 'center',
        width: iscenter ? 80 : 60,  // Set explicit width
        height: 60,                  // Match tab bar height
        marginBottom: iscenter ? 20 : 0,
      }}
      
    >
      <LinearGradient
        colors={iscenter 
          ? theme.colors.highlight 
          : focused 
            ? theme.colors.accent 
            : ['transparent', 'transparent']}
        style={{
          width: iscenter ? 60 : 40,
          height: iscenter ? 60 : 40,
          borderRadius: iscenter ? theme.metrics.borderRadius.pill : theme.metrics.borderRadius.soft,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: focused ? 0 : 0.5,
          borderColor: theme.colors.border,
          ...theme.effects.neumorphism
        }}
      >
        <View style={{ borderRadius: 100 }}>
          {React.cloneElement(icon, {
            color: iscenter 
              ? theme.colors.contrastText 
              : focused 
                ? theme.colors.text 
                : theme.colors.secondaryText,
            size: theme.metrics.iconSize.medium,
          })}
        </View>
      </LinearGradient>
    </View>
  );
};
