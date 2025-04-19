import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Switch } from 'react-native'; // Add this import

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questionCount, setQuestionCount] = useState('20');
  const [focusArea, setFocusArea] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error || successMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setError('');
          setSuccessMessage('');
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        types: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-powerpoint'
        ],
      });
      
      if (res.assets) {
        if (res.assets[0].size > 10000000) {
          setError('File size should be less than 10MB');
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
      onSuccess: () => {
        setSuccessMessage("Quiz Generated Successfully");
        setFile({ name: '', uri: '' });
        setQuizName('');
        setSelectedCategory('');
        setQuestionCount('20');
        setFocusArea('');
      },
      onError: (error) => {
        setError(error.response?.data?.message || "Error generating quiz");
      },
    }
  );

  const handleGenerateQuiz = () => {
    if (file.uri && quizName && selectedCategory && questionCount) {
      const formData = new FormData();
      formData.append('title', quizName);
      formData.append('Catagory', selectedCategory);
      formData.append('questionCount', questionCount);
      formData.append('focusArea', focusArea);
      formData.append('private', isPrivate);
      formData.append('file', {
        name: file.name,
        uri: file.uri,
        type: 'application/pdf',
      });
      console.log(formData);
      uploadFile(formData);
    } else {
      setError('Please fill all required fields');
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.background}
      style={{ flex: 1 }}
    >
      <Header name="Create Quiz" showback={false} />
      {isLoading && <LoadingPage quiz={true} />}

      {/* Floating Messages */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 100,
          left: 20,
          right: 20,
          opacity: fadeAnim,
          zIndex: 1,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }]
        }}
      >
        {successMessage && (
          <LinearGradient
            colors={theme.colors.success}
            style={{
              padding: 16,
              borderRadius: theme.metrics.borderRadius.soft,
              marginBottom: theme.metrics.spacing.dense,
            }}
          >
            <Text className='text-green-400' style={{  textAlign: 'center' }}>
              {successMessage}
            </Text>
          </LinearGradient>
        )}
        {error && (
          <LinearGradient
            colors={theme.colors.danger}
            style={{
              padding: 16,
              borderRadius: theme.metrics.borderRadius.soft,
            }}
          >
            <Text className='text-red-400' style={{  textAlign: 'center' }}>
              {error}
            </Text>
          </LinearGradient>
        )}
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ 
            paddingHorizontal: theme.metrics.spacing.comfortable,
            paddingBottom: 100 
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ 
            color: theme.colors.text,
            fontSize: 24,
            fontWeight: theme.typography.fontWeights.bold,
            textAlign: 'center',
            marginVertical: theme.metrics.spacing.comfortable
          }}>
            Upload Learning Material
          </Text>

          {/* Form Fields */}
          <View style={{ gap: theme.metrics.spacing.comfortable }}>
            {/* Quiz Name Input */}
            <View>
              <Text style={{ 
                color: theme.colors.secondaryText,
                marginBottom: theme.metrics.spacing.dense
              }}>
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
                  borderRadius: theme.metrics.borderRadius.soft,
                  padding: theme.metrics.spacing.dense,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              />
            </View>

            {/* Question Count Input */}
            <View>
              <Text style={{ 
                color: theme.colors.secondaryText,
                marginBottom: theme.metrics.spacing.dense
              }}>
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
                  borderRadius: theme.metrics.borderRadius.soft,
                  padding: theme.metrics.spacing.dense,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              />
            </View>

            {/* Focus Area Input */}
            <View>
              <Text style={{ 
                color: theme.colors.secondaryText,
                marginBottom: theme.metrics.spacing.dense
              }}>
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
                  borderRadius: theme.metrics.borderRadius.soft,
                  padding: theme.metrics.spacing.dense,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              />
            </View>

            {/* Category Picker */}
            <View>
              <Text style={{ 
                color: theme.colors.secondaryText,
                marginBottom: theme.metrics.spacing.dense
              }}>
                Category
              </Text>
              <View style={{
                backgroundColor: theme.colors.card[0],
                borderRadius: theme.metrics.borderRadius.soft,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={setSelectedCategory}
                  itemStyle={{
                    color: theme.colors.text,
                  }}
                  style={{
                    color: theme.colors.text,
                  }}
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
            <View>
              <Text style={{ 
                color: theme.colors.secondaryText,
                marginBottom: theme.metrics.spacing.dense
              }}>
                Upload PDF
              </Text>
              <RoundedButton
                label={file.name ? `Selected: ${file.name}` : "Select File"}
                onPress={handleFileSelection}
                icon="attachment"
                bgcolor={theme.colors.card[0]}
                borderColor={theme.colors.border}
                textColor={theme.colors.text}
              />
            </View>
            <View>
  <Text style={{ 
    color: theme.colors.secondaryText,
    marginBottom: theme.metrics.spacing.dense
  }}>
    Quiz Visibility
  </Text>
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card[0],
    borderRadius: theme.metrics.borderRadius.soft,
    padding: theme.metrics.spacing.dense,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }}>
    <Text style={{ color: theme.colors.text }}>
      {isPrivate ? 'Private Quiz' : 'Public Quiz'}
    </Text>
    <Switch
      value={isPrivate}
      onValueChange={setIsPrivate}
      trackColor={{
        true: theme.colors.accent[0],
        false: theme.colors.border
      }}
      thumbColor={theme.colors.contrastText}
    />
  </View>
</View>
            {/* Generate Button & Progress Bar */}
            <View style={{ marginTop: theme.metrics.spacing.comfortable }}>
              <RoundedButton
                label={isLoading ? "Generating..." : "Generate Quiz"}
                onPress={handleGenerateQuiz}
                icon={isLoading ? "refresh" : "rocket"}
                gradient={theme.colors.accent}
                textColor={theme.colors.contrastText}
              />
              
              {progress > 0 && (
                <View style={{
                  backgroundColor: theme.colors.card[0],
                  borderRadius: theme.metrics.borderRadius.pill,
                  height: 8,
                  marginTop: theme.metrics.spacing.comfortable
                }}>
                  <View
                    style={{ 
                      backgroundColor: theme.colors.accent[0],
                      width: `${progress}%`,
                      height: '100%',
                      borderRadius: theme.metrics.borderRadius.pill
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}