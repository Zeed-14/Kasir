import React, { createContext, useState, useEffect, useContext } from 'react';

// Buat Context
const ThemeContext = createContext();

// Buat Provider Component
export const ThemeProvider = ({ children }) => {
  // State untuk menyimpan tema, mengambil dari localStorage jika ada
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Cek juga preferensi sistem pengguna
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  // Efek untuk mengubah class di elemen <html> dan menyimpan ke localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Buat custom hook untuk menggunakan context ini dengan mudah
export const useTheme = () => {
  return useContext(ThemeContext);
};
