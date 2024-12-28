import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
    Button,
    TextInput,
  } from "react-native";
  import React, { useEffect, useState, useRef, } from "react";

  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { Feather, Ionicons } from "@expo/vector-icons";
  
  import { StatusBar } from "expo-status-bar";
  import { useMutation } from "@tanstack/react-query";
  import axios from "axios";
  
  import LoadingPage from "../../components/LoadingPage";
import api from "../../utils/Api";
  
  export default function Verification() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [sucess, setSucess] = useState("");
   
    const [resendCooldown, setResendCooldown] = useState(0);
    const colorScheme = useColorScheme();
    const router = useRouter();
    const inputRefs = useRef([]);
    const params = useLocalSearchParams();
  
    
    const handleChange = (text, index) => {
      if (text.length > 1) return;
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
  
      if (text && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    };
  
    const handleKeyPress = (e, index) => {
      if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    };
    useEffect(() => {
      if (resendCooldown > 0) {
        const timer = setInterval(() => {
          setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [resendCooldown]);
    const mutation = useMutation({
      mutationKey: ["verification"],
      mutationFn: (data) =>
        api.post("/api/auth/Verify", data),
      onSuccess: async (response) => {
        const token = response.data.token;
        await AsyncStorage.setItem('token', token);
      router.push("/(tabs)");
      },
      onError: (error) => {
        setError("resend code");
        setTimeout(() => {
          setError("");
        }, 3000);
      },
    });
    const resendCode = useMutation({
      mutationKey: ["resendCode"],
      mutationFn: (data) =>
        axios.post("https://eduapi.senaycreatives.com/auth/resendCode", data),
      onSuccess: async (response) => {
        setSucess("Code sent successfully");
        setResendCooldown(60);
        setTimeout(() => {
          setSucess("");
        }, 3000);
      },
      onError: (error) => {
        setError("Error sending code");
  
        setTimeout(() => {
          setError();
        }, 3000);
      },
    });
  
   
      return (
        <View className="relative flex-1 flex items-center justify-center bg-black   flex-col">
          {(mutation.isPending || resendCode.isPending) && <LoadingPage />}
        
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
  
          <View className="mb-[109px] flex items-center  w-[90%] pt-[30px] h-[374px]   ">
            <Ionicons name="mail" size={50} color="white" />
            <Text className="text-[23.52px]   text-white font-bold">
              Verify Your Email
            </Text>
            <Text className="text-[14px] text-white mt-[10px]">
              We have sent a verification code to your email{" "}
              {params.email.slice(0, 4)}****@gmail.com
            </Text>
            <View className=" mt-[40px] w-full flex items-center justify-center">
              {error && <Text className="text-red-500">{error}</Text>}
              {sucess && <Text className="text-green-500">{sucess}</Text>}
              <View className="flex flex-row justify-between  mx-auto mt-4">
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={{
                      color: digit ? "white" : "black",
                    }}
                    className={`w-10 h-10 flex  border-gray-300 dark:border-gray-700 border-[1px] justify-center items-center text-center rounded-md text-lg mx-1 ${
                      digit
                        ? "bg-yellow-400"
                        : colorScheme === "dark"
                        ? "bg-gray-900"
                        : "bg-gray-200"
                    }`}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                  />
                ))}
              </View>
            </View>
            <View className="mt-[25px] w-[80%] h-[55px] flex items-center justify-center">
              <Button
                title={"Verify"}
                onPress={() => {
                  let codestring = code.join("");
  
                  mutation.mutate({
                 
                    code: codestring,
                  });
                }}
              />
            </View>
            <View className="mt-[30px] w-full flex items-start ml-[45px] justify-center">
              <TouchableOpacity
                onPress={() => {
                  resendCode.mutate({
                    email: params.email,
                  });
                }}
                disabled={resendCooldown > 0}
                className="h-[40px] w-[200px] flex items-center justify-center"
              >
                <Text
                  style={{
                    color:
                      resendCooldown > 0
                        ? "gray"
                        : colorScheme === "dark"
                        ? "orange"
                        : "black",
                  }}
                  className="text-[14px] mt-2  text-white"
                >
                  Resend Verification Code
                  {resendCooldown > 0 && `(${resendCooldown})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    
  }
  const styles = StyleSheet.create({
    pattern: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      right: 0,
    },
    box: {
      position: "absolute",
      width: 50,
      height: 50,
      transform: [{ rotate: "45deg" }],
    },
  });