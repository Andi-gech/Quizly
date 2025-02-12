import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background gradients
      background: isDarkMode 
        ? ['#0f0c29', '#302b63', '#24243e']  // Deep space
        : ['white', 'white'],            // Soft cyan
      
      // Card gradients
      card: isDarkMode 
        ? ['#2A2A4A', '#1A1A2E'] 
        : ['#D4F4EF', '#B9EFE5'],            // Mint freshness
      
      // Text colors
      text: isDarkMode ? '#F0F2FC' : '#1A5F7A',
      secondaryText: isDarkMode ? '#A0A4D9' : '#3A7B85',
      
      // Accent gradients
      accent: ['#FF6B6B', '#FF8E53'],        // Warm sunset
      border: isDarkMode ? '#3D3D6B' : '#B9EFE5',
      
      // Highlight gradients
      highlight: isDarkMode 
        ? ['#43e97b', '#38f9d7']             // Cyber neon
        : ['#00E3CC', '#00B4A0'],            // Fresh mint
      
      // Status gradients
      success: ['#00C9A7', '#00B894'],       // Tropical teal
      warning: ['#FF9F45', '#FF7F50'],       // Coral reef
      info: ['#48C6EF', '#6F86D6'],          // Sky transition
      danger: ['#FF6B6B', '#FF4757'],        // Vibrant rouge
      
      // Text gradients
      textGradient: isDarkMode 
        ? ['#F0F2FC', '#4facfe'] 
        : ['#1A5F7A', '#FF8E53'],
      
      // Universal gradients
      gradient: isDarkMode 
        ? ['#0f0c29', '#302b63'] 
        : ['#FFDEE9', '#CBF1F5']
    },
    effects: {
      shadow: isDarkMode 
        ? '0 4px 16px rgba(79, 172, 254, 0.2)' 
        : '0 4px 16px rgba(0, 184, 148, 0.15)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      gradientBorder: isDarkMode 
        ? ['#3D3D6B', '#4facfe'] 
        : ['#B9EFE5', '#00E3CC']
    },
    metrics: {
      borderRadius: '14px',
      padding: '18px',
      margin: '12px',
      iconSize: '24px'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);