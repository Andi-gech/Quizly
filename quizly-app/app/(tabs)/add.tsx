import React, { useRef, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/Header';
import RoundedButton from '@/components/RoundedButton';
import { useMutation } from '@tanstack/react-query';
import api from '@/utils/Api';
import { Picker } from '@react-native-picker/picker';

import UseFetchCatagories from '../../hooks/UseFetchCatagories';



export default function Add() {
  const { data } = UseFetchCatagories();
  const [file, setFile] = useState({
    name: '',
    uri: '',
  });
  const [quizName, setQuizName] = useState('');
  const [selectedCatagory, setSelectedCatagory] = useState();
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0);
  

  const [error, setError] = useState('');

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
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
    async (formData) => {
      const response = await api.post('/api/quizzes/generateQuiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setSuccessMessage("Quiz Generated Successfully");
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      },
      onError: (error) => {
       setError(error?.response?.data?.message);
        setTimeout(() => {
          setError('');
        }, 3000);
      },
    }
  );

  const handleGenerateQuiz = () => {
    console.log(file,quizName,selectedCatagory);
    if (file.uri && quizName && selectedCatagory) {
      const formData = new FormData();
      formData.append('title', quizName);
      formData.append('Catagory', selectedCatagory);
      formData.append('file', {
        name: file.name,
        uri: file.uri,
        type: 'application/pdf',
      });
      console.log('Uploading file:', formData);
       uploadFile(formData);
    } else {
     setError('Please fill all the fields');
     setTimeout(() => {
        setError('');
      }
      , 3000);
    }
  };

  const pickerRef = useRef(null);

  return (
    <View className="flex-1 bg-black .. items-center justify-start pt-[20px]">
      <Header name="Create Quiz" showback={false} />
      <View className="flex flex-col items-center bg-white h-[80%] w-[90%] rounded-[30px] p-5">
        <Text className="text-black text-[20px] font-bold mb-[20px] text-center">
          Upload a file to generate a quiz
        </Text>
        {successMessage && (
          <Text className="text-green-500 text-[16px] mt-[20px] text-center">
            {successMessage}
          </Text>
        )}
        {
       error && <Text className="text-red-500 text-[16px] mb-2">{error}</Text>   
        }
        <View className="w-full mb-4">
          <Text className="text-black text-[16px] mb-2">Quiz Name:</Text>
          <TextInput
            placeholder="Enter Quiz Name"
            value={quizName}
            onChangeText={setQuizName}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 8,
              padding: 10,
              color: 'black',
            }}
          />
        </View>
        <View className="w-full mb-4">
          <Text className="text-black text-[16px] mb-2">Select Category:</Text>
          <Picker
            numberOfLines={1}
            mode="dropdown"
            itemStyle={{
              height: 50,

              color: "black",
              fontSize: 18,
            }}
            ref={pickerRef}
            selectedValue={selectedCatagory}
            dropdownIconColor={"black"}
            style={{
              height: 50,
              marginVertical: 10,
              marginTop: 10,
              width: "100%",
              color:  "black",
            }}
            onValueChange={(itemValue) => {
              setSelectedCatagory(itemValue);
            }}
          >
            <Picker.Item
              style={{
                backgroundColor: "white",
                color: "black",
              }}
              label="Select Category"
              value=""
            />
            {data?.data.map((item) => ( <Picker.Item
              style={{
                backgroundColor: "white",
                color: "black",
              }}
              key={item._id}
              label={item.title}
              value={item._id}
            />
            ))
              }
           
         
          </Picker>
        </View>
        <View className="w-full mb-4">
          <Text className="text-black text-[16px] mb-2">Select File:</Text>
          <RoundedButton
            name="Select File"
            onPress={handleFileSelection}
            bgcolor="bg-zinc-100 px-[50px] text-white"
            radius="rounded-lg"
            color="text-black"
          />
        </View>
        <Text className="text-black text-[15px] mb-4">
          Selected file: {file.name || 'None'}
        </Text>
        <RoundedButton
          name={isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
          onPress={handleGenerateQuiz}
          bgcolor="bg-indigo-400 px-[50px] py-[20px] text-white"
          radius="rounded-lg"
          color="text-white"
        />
      
      </View>
    </View>
  );
}
