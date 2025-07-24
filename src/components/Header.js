import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header = ({ currentView }) => {
  const viewTitles = {
    pos: 'Kasir',
    transactions: 'Riwayat Transaksi',
    products: 'Manajemen Produk',
    reports: 'Laporan Penjualan',
  };

  return (
    // Header ini akan disembunyikan di layar besar (lg:hidden)
    <header className="bg-white shadow-md p-4 flex items-center gap-3 lg:hidden">
      <div className="bg-blue-600 p-2 rounded-lg text-white">
        <ShoppingBag size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-800">KasirKu</h1>
        <p className="text-sm text-gray-500">{viewTitles[currentView]}</p>
      </div>
    </header>
  );
};

export default Header;