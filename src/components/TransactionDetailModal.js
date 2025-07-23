import React from 'react';

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detail Transaksi #{transaction.local_id}</h2>
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

        <div className="border-t mt-6 pt-4 text-right">
          <p className="text-lg">Total Transaksi:</p>
          <p className="text-2xl font-bold">Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</p>
        </div>

      </div>
    </div>
  );
};

export default TransactionDetailModal;
