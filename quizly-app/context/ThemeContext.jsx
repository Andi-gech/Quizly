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
        ? ['#050505', '#1A1A1A', '#0F0F0F']  // Black velvet
        : ['#FAFAFA', '#F0F0F0', '#FFFFFF'], // Pearl white
      
      // Card gradients
      card: isDarkMode 
        ? ['#1C1C1C', '#252525']             // Charcoal layers
        : ['#FFFFFF', '#F8F8F8'],            // Fresh snow
      
      // Text colors
      text: isDarkMode ? '#F0F0F0' : '#1A1A1A',
      secondaryText: isDarkMode ? '#7A7A7A' : '#5A5A5A',
      primaryText: isDarkMode ? '#FFFFFF' : '#000000',
      
      // Accent gradients
      accent: ['#909090', '#707070'],        // Mercury flow
      border: isDarkMode ? '#333333' : '#E5E5E5',
      
      // Highlight gradients
      highlight: isDarkMode 
        ? ['#404040', '#303030']             // Obsidian shine
        : ['#D0D0D0', '#B0B0B0'],            // Silver lining
      
      // Status gradients
      success: ['#808080', '#606060'],       // Graphite
      warning: ['#A0A0A0', '#808080'],       // Aluminum
      info: ['#C0C0C0', '#A0A0A0'],          // Platinum
      danger: ['#505050', '#303030'],        // Onyx
      
      // Text gradients
      textGradient: isDarkMode 
        ? ['#FFFFFF', '#B0B0B0']              // Moonbeam
        : ['#1A1A1A', '#808080'],            // Graphite fade
      
      // Universal gradients
      gradient: isDarkMode 
        ? ['#121212', '#2A2A2A']             // Void depth
        : ['#F5F5F5', '#E0E0E0']             // Mist veil
    },
    effects: {
      shadow: isDarkMode 
        ? `0 8px 32px rgba(255, 255, 255, 0.05),
           0 2px 8px rgba(255, 255, 255, 0.1)` 
        : `0 8px 32px rgba(0, 0, 0, 0.08),
           0 2px 4px rgba(0, 0, 0, 0.04)`,
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      gradientBorder: isDarkMode 
        ? ['#333333', '#4A4A4A']             // Steel edge
        : ['#E5E5E5', '#D0D0D0'],            // Marble border
      textureOverlay: isDarkMode 
        ? 'linear-gradient(rgba(255,255,255,0.02), rgba(0,0,0,0.1))' 
        : 'linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.3))'
    },
    // In your ThemeContext.js
metrics: {
  borderRadius: {
    soft: 12,    // was '12px'
    medium: 24,   // was '24px'
    pill: 40      // was '40px'
  },
  spacing: {
    dense: 16,    // was '16px'
    comfortable: 24,
    expansive: 32
  },
  iconSize: {
    small: 20,
    medium: 24,
    large: 28
  }
},
    typography: {
      fontWeights: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 600
      },
      letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);