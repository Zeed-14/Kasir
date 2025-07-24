import React from 'react';
import { LayoutGrid, ScrollText, Package, BarChart3, List, ShoppingBag, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <div className="group relative">
    <button 
      onClick={onClick} 
      className={`p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
      <Icon size={28} />
    </button>
    <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md scale-0 group-hover:scale-100 transition-transform origin-left whitespace-nowrap z-50">
      {label}
    </span>
  </div>
);

const Sidebar = ({ currentView, setCurrentView, user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'pos', label: 'Kasir', icon: LayoutGrid },
    { id: 'transactions', label: 'Riwayat Transaksi', icon: ScrollText },
    { id: 'products', label: 'Manajemen Produk', icon: Package },
    { id: 'categories', label: 'Manajemen Kategori', icon: List },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <nav className="hidden lg:flex w-24 bg-gray-800 text-white flex-col items-center justify-between py-6">
      <div className="flex flex-col items-center space-y-8">
        <div className="bg-blue-600 p-3 rounded-xl text-white">
          <ShoppingBag size={32} />
        </div>
        <div className="flex flex-col items-center space-y-4">
          {navItems.map(item => (
            <NavButton 
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={currentView === item.id}
              onClick={() => setCurrentView(item.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <NavButton 
          icon={theme === 'light' ? Moon : Sun}
          label={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          onClick={toggleTheme} 
        />
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center font-bold text-lg" title={user?.email}>
          {user?.email ? user.email[0].toUpperCase() : '?'}
        </div>
        <NavButton icon={LogOut} label="Keluar" onClick={onLogout} />
      </div>
    </nav>
  );
};

export default Sidebar;