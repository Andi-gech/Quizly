import AsyncStorage from "@react-native-async-storage/async-storage";
//159666388412-07hc4npl8a7qlntd5up7n9gqc1ll15su.apps.googleusercontent.com ios
//159666388412-glsl2lciaqfq28srgieunfso9lla4plq.apps.googleusercontent.com android
//159666388412-n1qqfhmhnnrn4deadkkc6nk7n6vfncje.apps.googleusercontent.com expo
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
