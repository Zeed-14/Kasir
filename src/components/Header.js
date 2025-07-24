// src/components/Header.js

import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header = ({ currentView }) => {
  const viewTitles = {
    pos: 'Kasir',
    transactions: 'Riwayat Transaksi',
    products: 'Manajemen Produk',
    categories: 'Manajemen Kategori',
    reports: 'Laporan Penjualan',
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center gap-3 lg:hidden dark:border-b dark:border-gray-700">
      <div className="bg-blue-600 p-2 rounded-lg text-white">
        <ShoppingBag size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">KasirKu</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{viewTitles[currentView]}</p>
      </div>
    </header>
  );
};

export default Header;
