import { Ionicons, Foundation } from "@expo/vector-icons"; // Importing icon libraries
import { Tabs } from "expo-router"; // Tab navigation from expo-router
import { View } from "react-native"; // For layout and styling

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index" // Set initial screen route
      screenOptions={{
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is visible
        tabBarStyle: {
          display: "flex",
          position: "absolute",
          flexDirection: "row",
          left: 0,
          width: "98%",
         // Set shadow opacity for the tab bar
          marginHorizontal:5,
          borderTopColor: "transparent", // Hide top border of the tab bar
          backgroundColor: "white", // Set background color for the tab bar
         
          height: 55, // Set height for the tab bar
      
        },
        tabBarShowLabel: false, // Hide labels of tabs
        headerShown: false, // Hide header for each screen
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
               
              }}
            >
              <Ionicons
                size={23}
                name="home-outline"
                color={focused ? "#0B71A8" : "black"} // Static light/dark icon color
              />
            </View>
          ),
        }}
      />

      {/* Rank Screen */}
      <Tabs.Screen
        name="rank"
        options={{
          title: "rank",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
               
              }}
            >
              <Ionicons
                size={23}
                name="trophy-outline"
              />
            </View>
          ),
        }}
      />

      {/* Add Screen */}
      <Tabs.Screen
        name="add"
        options={{
          title: "add",
          tabBarIcon: ({ focused }) => (
            <View
            
              className="h-[60px] w-[60px] flex justify-center bg-black ..  shadow-md  border-[5px] border-zinc-200 rounded-full items-center  z-[300] mb-5"
            >
              <Ionicons
                size={23}
                name="add-circle-outline"
                color={focused ? "#0B71A8" : "white"} // Static light/dark icon color
              />
            </View>
          ),
        }}
      />

      {/* Search Screen */}
      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
               
              }}
            >
              <Ionicons
                size={23}
                name="search-outline"
                color={focused ? "#0B71A8" : "black"} // Static light/dark icon color
              />
            </View>
          ),
        }}
      />

      {/* User Screen */}
      <Tabs.Screen
        name="user"
        options={{
          title: "user",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
               
              }}
            >
              <Ionicons
                size={23}
                name="person-outline"
                color={focused ? "#0B71A8" : "black"} // Static light/dark icon color
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
