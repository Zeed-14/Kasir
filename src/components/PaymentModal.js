import React, { useState, useMemo } from 'react';

const PaymentModal = ({ total, onConfirm, onClose }) => {
  const [cashReceived, setCashReceived] = useState('');

  const change = useMemo(() => {
    const cash = parseFloat(cashReceived);
    if (isNaN(cash) || cash < total) {
      return 0;
    }
    return cash - total;
  }, [cashReceived, total]);

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Konfirmasi Pembayaran</h2>
        
        <div className="mb-6 text-center">
          <p className="text-gray-600">Total Belanja</p>
          <p className="text-4xl font-bold tracking-tight">Rp {total.toLocaleString('id-ID')}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Uang Tunai Diterima</label>
          <input 
            type="number"
            placeholder="Masukkan jumlah uang..."
            className="w-full p-3 border rounded-lg text-lg text-right"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mb-8 text-center">
          <p className="text-gray-600">Kembalian</p>
          <p className="text-3xl font-semibold text-green-600">Rp {change.toLocaleString('id-ID')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleConfirm} 
            disabled={parseFloat(cashReceived) < total || isNaN(parseFloat(cashReceived))}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-lg font-semibold"
          >
            Selesaikan Transaksi
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;