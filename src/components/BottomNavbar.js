import React from 'react';
import { LayoutGrid, ScrollText, Package, BarChart3 } from 'lucide-react';

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
  >
    <Icon size={24} />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNavbar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'pos', label: 'Kasir', icon: LayoutGrid },
    { id: 'transactions', label: 'Riwayat', icon: ScrollText },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    // Navbar ini hanya akan muncul di layar kecil (lg:hidden)
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center z-40 lg:hidden">
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