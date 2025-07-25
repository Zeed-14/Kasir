import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, DollarSign, ShoppingCart } from 'lucide-react'; // TrendingUp dihapus dari sini

const DashboardView = ({ user, reportData, setCurrentView }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const stats = reportData?.stats || { totalRevenue: 0, transactionCount: 0 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Sambutan */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold dark:text-white">{getGreeting()},</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
      </motion.div>

      {/* Kartu Statistik Cepat */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
            <DollarSign className="text-green-600 dark:text-green-300" size={28} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold">Pendapatan Hari Ini</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
            <ShoppingCart className="text-indigo-600 dark:text-indigo-300" size={28} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold">Transaksi Hari Ini</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.transactionCount}</p>
          </div>
        </div>
      </motion.div>

      {/* Tombol Aksi Cepat */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionButton
          label="Mulai Transaksi Baru"
          onClick={() => setCurrentView('kasir')}
        />
        <ActionButton
          label="Lihat Laporan Lengkap"
          onClick={() => setCurrentView('laporan')}
        />
        <ActionButton
          label="Kelola Produk"
          onClick={() => setCurrentView('kasir')} // Nanti bisa diarahkan ke tab spesifik
        />
      </motion.div>
    </motion.div>
  );
};

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-4 bg-white dark:bg-gray-800 shadow rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
  >
    <span className="font-semibold">{label}</span>
    <ArrowRight size={20} className="text-gray-400" />
  </button>
);

export default DashboardView;