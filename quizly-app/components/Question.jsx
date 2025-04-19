// Question.js
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import RoundedButton from './RoundedButton';
import AnswerComponent from './AnswerComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomDark,dark } from 'react-syntax-highlighter/styles/hljs'; // You can choose a different style

export default function Question({
  current,
  question,
  explanation,
  answers,
  id,
  onnext,
  onclose,
  AnswerQuestion,
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  console.log(JSON.stringify(question));
  console.log(JSON.stringify(answers));
  useEffect(() => {
    setSelectedAnswer("");
    setExplanationVisible(false);
  }, [current]);

  const handleAnswerPress = (answerId) => {
    setSelectedAnswer(answerId);
    AnswerQuestion(answerId, id);
  };

  const theme = useTheme();
  const renderWithHighlighting = (text) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const simpleCodeRegex = /(?:\n|^)([a-zA-Z+]+)\n([\s\S]*?)(?=\n{2,}|$)/g;
  
    const parts = [];
    let lastIndex = 0;
    let match;
  
    // First handle triple-backtick code blocks
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const language = match[1] || 'javascript';
      const code = match[2].trim();
      const textBefore = text.substring(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push(<Text key={`text-${lastIndex}`} style={{ color: theme.colors.text, fontSize: 16, marginBottom: 10 }}>{textBefore}</Text>);
      }
      parts.push(
        <View key={`code-${match.index}`} style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden' }}>
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            highlighter="hljs"
          >
            {code}
          </SyntaxHighlighter>
        </View>
      );
      lastIndex = codeBlockRegex.lastIndex;
    }
  
    // If no triple backtick matches, try simple detection
    if (parts.length === 0) {
      let simpleMatch;
      while ((simpleMatch = simpleCodeRegex.exec(text)) !== null) {
        const language = simpleMatch[1] || 'javascript';
        const code = simpleMatch[2].trim();
        const textBefore = text.substring(lastIndex, simpleMatch.index).trim();
        if (textBefore) {
          parts.push(<Text key={`text-${lastIndex}`} style={{ color: theme.colors.text, fontSize: 16, marginBottom: 10 }}>{textBefore}</Text>);
        }
        parts.push(
          <View key={`simple-code-${simpleMatch.index}`} style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden' }}>
            <SyntaxHighlighter
              language={language}
              style={!theme.isDarkMode ? atomDark : dark}
              highlighter="hljs"
            >
              {code}
            </SyntaxHighlighter>
          </View>
        );
        lastIndex = simpleCodeRegex.lastIndex;
      }
    }
  
    // Add remaining text
    const remainingText = text.substring(lastIndex).trim();
    if (remainingText) {
      parts.push(<Text key={`text-${lastIndex}`} style={{ color: theme.colors.text, fontSize: 16,fontWeight:'bold' }}>{remainingText}</Text>);
    }
  
    return parts;
  };
  return (
    <LinearGradient
      colors={theme.colors.background}
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 justify-between px-4">

        <View style={{ flex: 1, marginTop: 16 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="px-4 py-6">
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
              >
                <View>
                  {renderWithHighlighting(`${current + 1}. ${question}`)}
                </View>
              </MotiView>

              {answers.map((answer, index) => (
                <MotiView
                  key={answer._id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 50 }}
                  style={{ marginBottom: 12 }}
                >
                  <AnswerComponent
                    selected={selectedAnswer}
                    id={answer._id}
                    iscorrect={Boolean(answer.isCorrect)}
                    onPress={() => handleAnswerPress(answer._id)}
                    name={answer.text}
                  />
                </MotiView>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Bottom Buttons */}
        <View className="flex-row justify-between px-4 mb-6" style={{ maxHeight: 70 }}>
          <RoundedButton
            name="Close"
            onPress={onclose}
            bgcolor="bg-slate-700 px-6 py-4 rounded-xl"
            color="text-white"
            icon="close"
            style={{ flex: 0.48 }}
          />
          <RoundedButton
            name="Next"
            onPress={onnext}
            bgcolor="bg-amber-400 px-6 py-4 rounded-xl"
            color="text-black font-bold"
            icon="arrow-right"
            style={{ flex: 0.48 }}
          />
        </View>

        {/* Explain Button */}
        <AnimatePresence>
          {selectedAnswer && !explanationVisible && (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 w-full items-center"
            >
              <RoundedButton
                label="Explain Answer"
                bgcolor="bg-amber-400 px-8 py-4 rounded-xl"
                color="text-black font-bold"
                icon="lightbulb-on"
                onPress={() => setExplanationVisible(true)}
              />
            </MotiView>
          )}
        </AnimatePresence>
      </View>

      {/* Explanation Popup */}
      {explanationVisible && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.background[0] + 'CC',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setExplanationVisible(false)}
          >
            <MotiView
              from={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                backgroundColor: theme.colors.card[0],
                borderRadius: theme.metrics.borderRadius.medium,
                padding: theme.metrics.spacing.comfortable,
                ...theme.effects.shadow
              }}
            >
              <View className="flex-row items-center mb-4">
                <MaterialCommunityIcons
                  name="brain"
                  size={theme.metrics.iconSize.medium}
                  color={theme.colors.accent[0]}
                />
                <Text style={{
                  color: theme.colors.accent[0],
                  fontWeight: theme.typography.fontWeights.bold,
                  fontSize: 18,
                  marginLeft: theme.metrics.spacing.dense
                }}>
                  Explanation
                </Text>
              </View>

              <ScrollView>
                <View>
                  {renderWithHighlighting(explanation)}
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => setExplanationVisible(false)}
                style={{
                  backgroundColor: theme.colors.accent[0],
                  borderRadius: theme.metrics.borderRadius.soft,
                  padding: theme.metrics.spacing.dense,
                  marginTop: theme.metrics.spacing.comfortable,
                  alignSelf: 'flex-end'
                }}
              >
                <Text style={{
                  color: theme.colors.contrastText,
                  fontWeight: theme.typography.fontWeights.bold
                }}>
                  Close
                </Text>
              </TouchableOpacity>
            </MotiView>
          </TouchableOpacity>
        </MotiView>
      )}
    </LinearGradient>
  );
}