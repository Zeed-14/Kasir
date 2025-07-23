import React from 'react';

const TransactionsView = ({ transactions, onViewDetails }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Riwayat Transaksi</h2>
      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        
        {/* PENAMBAHAN LOGIKA: Cek jika transaksi kosong atau belum terdefinisi */}
        {(!transactions || transactions.length === 0) ? (
          <div className="text-center text-gray-500 mt-16">
            <p>Tidak ada riwayat transaksi.</p>
            <p className="text-sm mt-2">Silakan selesaikan penjualan di halaman kasir.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {transactions.map(tx => (
              <li 
                key={tx.local_id} 
                onClick={() => onViewDetails(tx)}
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold">Transaksi #{tx.local_id}</p>
                  <p className="text-sm text-gray-600">{new Date(tx.transaction_time).toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">Rp {Number(tx.total_amount).toLocaleString('id-ID')}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${tx.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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