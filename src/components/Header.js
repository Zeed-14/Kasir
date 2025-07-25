import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Sun, Moon, LogOut, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Komponen kecil untuk ikon sinkronisasi
const SyncStatusIcon = ({ status, onManualSync }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'Syncing from cloud...':
      case 'Syncing to cloud...':
        return { Icon: RefreshCw, color: 'text-yellow-400', title: 'Sinkronisasi...', animate: true };
      case 'Synced':
        return { Icon: CheckCircle, color: 'text-green-400', title: 'Tersinkronisasi', animate: false };
      case 'Offline (Sync Error)':
      case 'Sync Failed':
        return { Icon: AlertCircle, color: 'text-red-400', title: 'Gagal Sinkronisasi', animate: false };
      default:
        return { Icon: CheckCircle, color: 'text-gray-500', title: 'Idle', animate: false };
    }
  };

  const { Icon, color, title, animate } = getStatusInfo();

  return (
    <button
      onClick={onManualSync}
      className={`p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${color}`}
      title={`Status: ${title} (Klik untuk sinkronisasi manual)`}
    >
      <motion.div animate={animate ? { rotate: 360 } : {}} transition={animate ? { repeat: Infinity, duration: 2, ease: 'linear' } : {}}>
        <Icon size={22} />
      </motion.div>
    </button>
  );
};


const Header = ({ currentView, user, onLogout, syncStatus, onManualSync, onOpenConsole }) => {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const viewTitles = {
    dashboard: 'Dashboard',
    kasir: 'Kasir',
    laporan: 'Laporan',
    suplier: 'Suplier',
    pengaturan: 'Pengaturan',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between z-10 dark:border-b dark:border-gray-700"
      onDoubleClick={onOpenConsole}
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">KasirKu</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 lg:hidden">{viewTitles[currentView]}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <SyncStatusIcon status={syncStatus} onManualSync={onManualSync} />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={theme === 'light' ? 'Aktifkan Mode Gelap' : 'Aktifkan Mode Terang'}
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-lg text-gray-700 dark:text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-transparent hover:ring-blue-500 transition-all"
          >
            {user?.email ? user.email[0].toUpperCase() : '?'}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">Masuk sebagai</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-3"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
