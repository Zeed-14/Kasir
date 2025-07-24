import React from 'react';

const TransactionsView = ({ transactions, onViewDetails }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">Riwayat Transaksi</h2>
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {(!transactions || transactions.length === 0) ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-16">
            <p>Tidak ada riwayat transaksi.</p>
            <p className="text-sm mt-2">Silakan selesaikan penjualan di halaman kasir.</p>
          </div>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {transactions.map(tx => (
              <li 
                key={tx.id} 
                onClick={() => onViewDetails(tx)}
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div>
                  <p className="font-semibold">Transaksi #{tx.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(tx.transaction_time).toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">Rp {Number(tx.total_amount).toLocaleString('id-ID')}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${tx.synced ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>
                    {tx.synced ? 'Synced' : 'Pending'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;