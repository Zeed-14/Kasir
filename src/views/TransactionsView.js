import React from 'react';

const TransactionsView = ({ transactions }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Riwayat Transaksi</h2>
      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        <ul className="divide-y">
          {transactions?.map(tx => (
            <li key={tx.local_id} className="p-3 flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default TransactionsView;