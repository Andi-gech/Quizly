import React, { useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import RoundedButton from '@/components/RoundedButton';
import { useMutation } from '@tanstack/react-query';
import api from '@/utils/Api';
import { Picker } from '@react-native-picker/picker';
import UseFetchCatagories from '../../hooks/UseFetchCatagories';
import { useTheme } from '../../context/ThemeContext';
import LoadingPage from '@/components/LoadingPage';

export default function Add() {
  const theme = useTheme();
  const { data } = UseFetchCatagories();
  const [file, setFile] = useState({ name: '', uri: '' });
  const [quizName, setQuizName] = useState('');
  const [selectedCatagory, setSelectedCatagory] = useState();
  const [questionCount, setQuestionCount] = useState('20');
  const [focusArea, setFocusArea] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const pickerRef = useRef(null);
  const handleFileSelection = async () => {
    try {
    const res = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.ms-powerpoint'],
   
    
      });
      if (res.assets) {
        if (res.assets[0].size > 10000000) {
          setError('File size should be less than 10MB');
          setTimeout(() => setError(''), 3000);
        } else {
          setFile(res.assets[0]);
        }
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
    
    };
    
    const { mutate: uploadFile, isLoading } = useMutation(
    async (formData) => {
    const response = await api.post('/api/quizzes/generateQuiz', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
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
    setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
    setError(error.response?.data?.message || "Error generating quiz");
    setTimeout(() => setError(''), 3000);
    },
    }
    );
    
    const handleGenerateQuiz = () => {
    if (file.uri && quizName && selectedCatagory && questionCount) {
    const formData = new FormData();
    formData.append('title', quizName);
    formData.append('Catagory', selectedCatagory);
    formData.append('questionCount', questionCount);
    formData.append('focusArea', focusArea);
    formData.append('file', {
    name: file.name,
    uri: file.uri,
    type: 'application/pdf',
    });
    uploadFile(formData);
    } else {
    setError('Please fill all required fields');
    setTimeout(() => setError(''), 3000);
    }
    };
  return (
    <LinearGradient
      colors={theme.colors.background}
      className="flex-1"
      style={{ height: '100%', paddingTop: 20, flex: 1 }}
      
    >
      <Header name="Create Quiz" showback={false} />
      {
        isLoading && (
          <LoadingPage quiz={true}/>
        )
      }
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-4 mb-[70px]"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollsToTop={error || successMessage?true:false}
        >
          <LinearGradient
            colors={
              ["transparent", "transparent"]
            }
            className="rounded-t-3xl p-6 min-h-[90vh]"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ 
              shadowColor: theme.colors.accent[0],
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
            }}
          >
            <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mb-6 text-center">
              Upload Learning Material
            </Text>

            {/* Messages Container */}
            <View className="">
              {successMessage && (
                <LinearGradient
                  colors={theme.colors.success}
                  className="p-3 rounded-lg mb-4"
                >
                  <Text style={{ color: theme.colors.text }} className="text-center">
                    {successMessage}
                  </Text>
                </LinearGradient>
              )}
              {error && (
                <LinearGradient
                  colors={theme.colors.danger}
                  className="p-3 rounded-lg mb-4"
                >
                  <Text style={{ color: theme.colors.text }} className="text-center">
                    {error}
                  </Text>
                </LinearGradient>
              )}
            </View>

            {/* Form Content */}
            <View className="flex-1 justify-between">
              <View>
                {/* Quiz Name Input */}
                <View className="mb-4">
                  <Text style={{ color: theme.colors.secondaryText }} className="text-sm mb-2">
                    Quiz Name
                  </Text>
                  <TextInput
                    placeholder="Enter Quiz Name"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={quizName}
                    onChangeText={setQuizName}
                    style={{
                      backgroundColor: theme.colors.card[0],
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    }}
                    className="p-4 rounded-xl border"
                  />
                </View>

                {/* Question Count Input */}
                <View className="mb-4">
                  <Text style={{ color: theme.colors.secondaryText }} className="text-sm mb-2">
                    Number of Questions
                  </Text>
                  <TextInput
                    placeholder="Enter number of questions"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={questionCount}
                    onChangeText={setQuestionCount}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: theme.colors.card[0],
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    }}
                    className="p-4 rounded-xl border"
                  />
                </View>

                {/* Focus Area Input */}
                <View className="mb-4">
                  <Text style={{ color: theme.colors.secondaryText }} className="text-sm mb-2">
                    Focus Area (optional)
                  </Text>
                  <TextInput
                    placeholder="e.g., Network Security, Calculus Basics"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={focusArea}
                    onChangeText={setFocusArea}
                    style={{
                      backgroundColor: theme.colors.card[0],
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    }}
                    className="p-4 rounded-xl border"
                  />
                </View>

                {/* Category Picker */}
                <View className="mb-4">
                  <Text style={{ color: theme.colors.secondaryText }} className="text-sm mb-2">
                    Category
                  </Text>
                  <View style={{
                    backgroundColor: theme.colors.card[0],
                  
                    borderColor: theme.colors.border,
                  }} className="rounded-xl border">
                    <Picker
                      ref={pickerRef}
                      selectedValue={selectedCatagory}
                      style={{ color: theme.colors.text }}
                      itemStyle={{ color: theme.colors.text,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.card[0],
                       }}

                      onValueChange={setSelectedCatagory}
                    >
                      <Picker.Item label="Select Category" value="" />
                      {data?.data.map((item) => (
                        <Picker.Item
                          key={item._id}
                          label={item.title}
                          value={item._id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* File Upload Button */}
                <View className="mb-6">
                  <Text style={{ color: theme.colors.secondaryText }} className="text-sm mb-2">
                    Upload PDF
                  </Text>
                  <RoundedButton
                    label={file.name ? `Selected: ${file.name}` : "Select File"}
                    onPress={handleFileSelection}
                    icon="attachment"
                    
                    
                    
                    bgcolor={theme.colors.card[0]}
                    border={`border ${theme.colors.border}`}
                    radius="rounded-xl"
                    color={theme.colors.text}
                    padding="p-4"
                    textWrap={true}
                  />
                </View>
              </View>

              {/* Generate Button & Progress Bar */}
              <View>
                <RoundedButton
                  label={isLoading ? "Generating..." : "Generate Quiz"}
                  onPress={handleGenerateQuiz}
                  icon={isLoading ? "refresh" : "rocket"}
                  othercolor={theme.isDarkMode?['black', 'rgb(96, 80, 139)', 'black']:theme.colors.card}
                  
                  bgcolor={theme.colors.accent}
                  radius="rounded-xl"
                  color={theme.colors.text}
                  padding="p-4"
                  customStyle={{
                    shadowColor: theme.colors.accent[0],
                    marginBottom: 100,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                />
                {progress > 0 && (
                  <View style={{
                    backgroundColor: theme.colors.card[0],
                  }} className="mt-6 rounded-full h-2">
                    <View
                      style={{ 
                        backgroundColor: theme.colors.accent[0],
                        width: `${progress}%`
                      }}
                      className="h-2 rounded-full"
                    />
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}