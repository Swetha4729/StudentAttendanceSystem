import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const colors = {
    background: isDarkTheme ? '#121212' : '#f5f9ff',
    cardBackground: isDarkTheme ? '#1e1e2e' : '#ffffff',
    text: isDarkTheme ? '#ffffff' : '#333333',
    primary: isDarkTheme ? '#BB86FC' : '#4e7eff',
    secondary: isDarkTheme ? '#03DAC6' : '#6a8eff',
    success: isDarkTheme ? '#4ade80' : '#16a34a',
    error: isDarkTheme ? '#f87171' : '#dc2626',
    warning: isDarkTheme ? '#fbbf24' : '#d97706',
    divider: isDarkTheme ? '#333333' : '#e0e0e0',
    headerGradient: isDarkTheme ? ['#2c3e50', '#4ca1af'] : ['#4e7eff', '#6a8eff'],
    shadow: isDarkTheme ? '#00000040' : '#4e7eff20',
    inputBackground: isDarkTheme ? '#2d2d2d' : '#ffffff',
    placeholder: isDarkTheme ? '#aaaaaa' : '#888888',
    present: isDarkTheme ? '#4ade80' : '#16a34a',
    absent: isDarkTheme ? '#f87171' : '#dc2626',
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme: () => setIsDarkTheme(!isDarkTheme), colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
