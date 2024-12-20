import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/Header';
import * as FileSystem from 'expo-file-system';
import RoundedButton from '@/components/RoundedButton';

export default function Add() {
  const [file, setFile] = useState({
    name: '',
    uri: '',
  });

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      console.log(res)
      if (res.assets) {
        console.log("ss")
        const selectedFile = res.assets[0]; 
        setFile(selectedFile);
        console.log('File selected:', selectedFile);
      } else {
        console.log('File selection was canceled');
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };
  

  const handleGenerateQuiz = async () => {
    if (file) {
      try {
        const fileUri = "file://";
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          // Implement your quiz generation logic here using fileContent
          console.log('File content:', fileContent);
        } else {
          console.log('File does not exist');
        }
      } catch (err) {
        console.error('Error reading file:', err);
      }
    } else {
      console.log('No file selected');
    }
  };
  

  return (
    <View className='flex  relative flex-1 flex-col bg-indigo-500 items-center pt-[20px] justify-start'>
      <Header name={"Create Quiz"} />
    
    
      <View className="flex items-center justify-start flex-col bg-white h-[70%] w-[98%] rounded-[30px]">
       
        <Text className="text-black text-[20px] font-bold mt-[20px]">Upload a file to generate a quiz</Text>
        <RoundedButton name="Select File" onPress={handleFileSelection} bgcolor={"bg-indigo-400 px-[50px] py-[20px]  text-white"} radius={"rounded-lg"} color={" text-white"} />
        <Text className="text-black text-[15px]  mt-[20px]">Selected file: {file ? file.name : 'None'}</Text>
        <Button title="Generate Quiz" onPress={handleGenerateQuiz} />
      </View>
    </View>
  );
}

