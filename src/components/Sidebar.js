// src/components/Sidebar.js

import React from 'react';
import { LayoutDashboard, ShoppingCart, BarChart3, Truck, Settings, ShoppingBag } from 'lucide-react';

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

const Sidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kasir', label: 'Kasir', icon: ShoppingCart },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'suplier', label: 'Suplier', icon: Truck },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
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
      {/* Tombol logout dan tema akan dipindahkan ke header nanti */}
    </nav>
  );
};

export default Sidebar;
