// api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.7:5000",
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      if (token) {
        config.headers.Authorization = `Barier ${token}`;
      } else {
        console.log("No token found");
      }
    } catch (error) {
        console.log("Error while fetching token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;