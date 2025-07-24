import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const PaymentModal = ({ total, onConfirm, onClose }) => {
  const [cashReceived, setCashReceived] = useState('');

  const change = useMemo(() => {
    const cash = parseFloat(cashReceived);
    if (isNaN(cash) || cash < total) {
      return 0;
    }
    return cash - total;
  }, [cashReceived, total]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Konfirmasi Pembayaran</h2>
        
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Total Belanja</p>
          <p className="text-4xl font-bold tracking-tight dark:text-white">Rp {total.toLocaleString('id-ID')}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Uang Tunai Diterima</label>
          <input 
            type="number"
            placeholder="Masukkan jumlah uang..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg text-right bg-white dark:bg-gray-700 dark:text-white"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Kembalian</p>
          <p className="text-3xl font-semibold text-green-600 dark:text-green-400">Rp {change.toLocaleString('id-ID')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm} 
            disabled={parseFloat(cashReceived) < total || isNaN(parseFloat(cashReceived))}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-lg font-semibold"
          >
            Selesaikan Transaksi
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;