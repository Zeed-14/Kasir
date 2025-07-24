import React from 'react';
import { LayoutGrid, ScrollText, Package, BarChart3, ShoppingBag } from 'lucide-react';

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

// Sidebar ini hanya akan muncul di layar besar (hidden lg:flex)
const Sidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'pos', label: 'Kasir', icon: LayoutGrid },
    { id: 'transactions', label: 'Riwayat Transaksi', icon: ScrollText },
    { id: 'products', label: 'Manajemen Produk', icon: Package },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <nav className="hidden lg:flex w-24 bg-gray-800 text-white flex-col items-center py-6 space-y-8">
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
    </nav>
  );
};

export default Sidebar;