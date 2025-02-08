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

export default function Add() {
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
        type: ['application/pdf'], // Restrict to PDF only
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
      colors={['#0f172a', '#1e293b']}
      className="flex-1"
      style={{ height: '100%', paddingTop: 20,flex:1 }}
    >
      <Header name="Create Quiz" showback={false} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="bg-slate-800 rounded-t-3xl p-6 min-h-[90vh]"
            style={{ 
              shadowColor: '#f59e0b',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              
            }}
          >
            <Text className="text-white text-2xl font-bold mb-6 text-center">
              Upload Learning Material
            </Text>

            {/* Messages Container */}
            <View className="">
              {successMessage && (
                <View className="bg-green-800 p-3 rounded-lg mb-4">
                  <Text className="text-green-400 text-center">{successMessage}</Text>
                </View>
              )}
              {error && (
                <View className="bg-red-800 p-3 rounded-lg mb-4">
                  <Text className="text-red-400 text-center">{error}</Text>
                </View>
              )}
            </View>

            {/* Form Content */}
            <View className="flex-1 justify-between">
              <View>
                {/* Quiz Name Input */}
                <View className="mb-4">
                  <Text className="text-slate-300 text-sm mb-2">Quiz Name</Text>
                  <TextInput
                    placeholder="Enter Quiz Name"
                    placeholderTextColor="#64748b"
                    value={quizName}
                    onChangeText={setQuizName}
                    className="bg-slate-700 text-white p-4 rounded-xl border border-slate-600"
                  />
                </View>

                {/* Question Count Input */}
                <View className="mb-4">
                  <Text className="text-slate-300 text-sm mb-2">Number of Questions</Text>
                  <TextInput
                    placeholder="Enter number of questions"
                    placeholderTextColor="#64748b"
                    value={questionCount}
                    onChangeText={setQuestionCount}
                    keyboardType="numeric"
                    className="bg-slate-700 text-white p-4 rounded-xl border border-slate-600"
                  />
                </View>

                {/* Focus Area Input */}
                <View className="mb-4">
                  <Text className="text-slate-300 text-sm mb-2">Focus Area (optional)</Text>
                  <TextInput
                    placeholder="e.g., Network Security, Calculus Basics"
                    placeholderTextColor="#64748b"
                    value={focusArea}
                    onChangeText={setFocusArea}
                    className="bg-slate-700 text-white p-4 rounded-xl border border-slate-600"
                  />
                </View>

                {/* Category Picker */}
                <View className="mb-4">
                  <Text className="text-slate-300 text-sm mb-2">Category</Text>
                  <View className="bg-slate-700 rounded-xl border border-slate-600">
                    <Picker
                      ref={pickerRef}
                      selectedValue={selectedCatagory}
                      style={{ color: "white" }}
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
                  <Text className="text-slate-300 text-sm mb-2">Upload PDF</Text>
                  <RoundedButton
                    name={file.name ? `Selected: ${file.name}` : "Select File"}
                    onPress={handleFileSelection}
                    leftIcon={<Ionicons name="document-attach" size={20} color="#f59e0b" />}
                    bgcolor="bg-slate-700"
                    border="border border-slate-600"
                    radius="rounded-xl"
                    color="text-white"
                    padding="p-4"
                    textWrap={true}
                  />
                </View>
              </View>

              {/* Generate Button & Progress Bar */}
              <View>
                <RoundedButton
                  name={isLoading ? "Generating..." : "Generate Quiz"}
                  onPress={handleGenerateQuiz}
                  leftIcon={<Ionicons name="sparkles" size={20} color="white" />}
                  bgcolor="bg-amber-500"
                  radius="rounded-xl"
                  color="text-white"
                  padding="p-4"
                  customStyle={{
                    shadowColor: '#f59e0b',
                    marginBottom: 100,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                />
                {progress > 0 && (
                  <View className="mt-6 bg-slate-700 rounded-full h-2">
                    <View
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}