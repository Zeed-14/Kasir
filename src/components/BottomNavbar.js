// src/components/BottomNavbar.js

import React from 'react';
import { LayoutDashboard, ShoppingCart, BarChart3, Truck, Settings } from 'lucide-react';

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
  >
    <Icon size={24} />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNavbar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kasir', label: 'Kasir', icon: ShoppingCart },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'suplier', label: 'Suplier', icon: Truck },
    { id: 'pengaturan', label: 'Atur', icon: Settings },
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
    </nav>
  );
};

export default BottomNavbar;
