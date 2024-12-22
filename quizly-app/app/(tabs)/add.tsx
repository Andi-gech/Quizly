import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/Header';
import RoundedButton from '@/components/RoundedButton';
import { useMutation } from '@tanstack/react-query';
import api from '@/utils/Api';
// @ts-ignore

export default function Add() {
  const [file, setFile] = useState({
    name: '',
    uri: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Accept only PDF files
      });
      if (res.assets) {
        setFile(res.assets[0]);
        console.log('File selected:', res);
      } else {
        console.log('File selection was canceled');
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  const { mutate: uploadFile, isLoading } = useMutation(
    async (formData:any) => {
      const response = await api.post('/api/quizzes/generateQuiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log('Quiz generated successfully:', data);
        setSuccessMessage('Quiz generated successfully!'); 
      },
      onError: (error) => {
        console.error('Error uploading file:', error);
        setSuccessMessage('Failed to generate quiz. Please try again.'); // Set error message
      },
    }
  );


  const handleGenerateQuiz = async () => {
    if (file.uri) {
      try {
        const formData = new FormData();
        
        formData.append('file', { 
          name: file.name,
          uri: file.uri,
          type: 'application/pdf',
        });

        uploadFile(formData);
      } catch (err) {
        console.error('Error preparing file for upload:', err);
      }
    } else {
      console.log('No file selected');
    }
  };

  return (
    <View className="flex relative flex-1 flex-col bg-indigo-500 items-center pt-[20px] justify-start">
      <Header name="Create Quiz" />
      <View className="flex items-center justify-start flex-col bg-white h-[70%] w-[98%] rounded-[30px]">
        <Text className="text-black text-[20px] font-bold mt-[20px]">Upload a file to generate a quiz</Text>
        <RoundedButton
          name="Select File"
          onPress={handleFileSelection}
          bgcolor="bg-indigo-400 px-[50px] py-[20px] text-white"
          radius="rounded-lg"
          color="text-white"
        />
        <Text className="text-black text-[15px] mt-[20px]">
          Selected file: {file.name || 'None'}
        </Text>
        <Button title={isLoading ? 'Generating...' : 'Generate Quiz'} onPress={handleGenerateQuiz} disabled={isLoading} />
        {successMessage && (
          <Text className="text-green-500 text-[16px] mt-[20px]">{successMessage}</Text>
        )}
      </View>
    </View>
  );
}
