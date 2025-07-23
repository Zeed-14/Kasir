import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Receipt from './Receipt'; // Import komponen struk kita

const TransactionDetailModal = ({ transaction, onClose }) => {
  const receiptRef = useRef(); // Buat ref untuk komponen struk

  // Hook dari library react-to-print
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current, // Memberitahu apa yang harus dicetak
  });

  if (!transaction) return null;

  return (
    <>
      {/* Komponen struk kita render di sini, tapi kita sembunyikan dari tampilan biasa */}
      <div style={{ display: 'none' }}>
        <Receipt ref={receiptRef} transaction={transaction} />
      </div>

      {/* Modal yang terlihat oleh pengguna */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detail Transaksi #{transaction.id.substring(0, 8)}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
          </div>
          
          <div className="mb-6 text-sm text-gray-600">
            <p><strong>Waktu:</strong> {new Date(transaction.transaction_time).toLocaleString('id-ID')}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${transaction.synced ? 'text-green-600' : 'text-yellow-600'}`}>{transaction.synced ? 'Synced' : 'Pending Sync'}</span></p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Item yang Dibeli:</h3>
          <div className="overflow-y-auto max-h-64 border rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3 text-center">Jumlah</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transaction.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3">{item.productName}</td>
                    <td className="p-3 text-center">x {item.quantity}</td>
                    <td className="p-3 text-right">Rp {(item.price_at_transaction * item.quantity).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between items-center">
            <div className='text-right'>
              <p className="text-lg">Total Transaksi:</p>
              <p className="text-2xl font-bold">Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</p>
            </div>
            {/* TOMBOL CETAK BARU */}
            <button onClick={handlePrint} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Cetak Struk
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetailModal;