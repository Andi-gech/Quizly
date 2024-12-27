import AsyncStorage from "@react-native-async-storage/async-storage";

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log(!!token, "checking token");
    return !!token; // Returns true if token exists, false otherwise
  } catch (error) {
    console.error("Error retrieving token:", error);
    return false;
  }
};
