import React from 'react';

const Navbar = ({ currentView, setCurrentView }) => {
  return (
    <nav className="w-20 bg-gray-800 text-white flex flex-col items-center py-4 space-y-6">
      {/* Tombol POS */}
      <button onClick={() => setCurrentView('pos')} className={`p-2 rounded-lg ${currentView === 'pos' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      </button>
      {/* Tombol Transaksi */}
      <button onClick={() => setCurrentView('transactions')} className={`p-2 rounded-lg ${currentView === 'transactions' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </button>
      {/* Tombol Manajemen Produk */}
      <button onClick={() => setCurrentView('products')} className={`p-2 rounded-lg ${currentView === 'products' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      </button>
    </nav>
  );
};

export default Navbar;