import React from 'react';
import { LayoutGrid, ScrollText, Package, BarChart3, List, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
  >
    <Icon size={24} />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNavbar = ({ currentView, setCurrentView, user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'pos', label: 'Kasir', icon: LayoutGrid },
    { id: 'transactions', label: 'Riwayat', icon: ScrollText },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'categories', label: 'Kategori', icon: List },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 dark:border-t dark:border-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center z-40 lg:hidden">
      {navItems.map(item => (
        <NavButton 
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={currentView === item.id}
          onClick={() => setCurrentView(item.id)}
        />
      ))}
      <NavButton 
        icon={theme === 'light' ? Moon : Sun}
        label={theme === 'light' ? 'Gelap' : 'Terang'}
        onClick={toggleTheme}
      />
      <NavButton icon={LogOut} label="Keluar" onClick={onLogout} />
    </nav>
  );
};

export default BottomNavbar;