import React from 'react';

const ReportsView = ({ stats, topProducts }) => {

  // Tampilkan pesan loading jika data belum siap
  if (!stats) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">Laporan Penjualan Hari Ini</h2>
        <p>Menghitung laporan...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h2 className="text-3xl font-bold mb-6">Laporan Penjualan Hari Ini</h2>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <p className="text-blue-800 font-semibold">Total Pendapatan</p>
          <p className="text-4xl font-bold text-blue-900">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <p className="text-green-800 font-semibold">Jumlah Transaksi</p>
          <p className="text-4xl font-bold text-green-900">{stats.transactionCount}</p>
        </div>
      </div>

      {/* Produk Terlaris */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Produk Terlaris</h3>
        {topProducts.length > 0 ? (
          <ol className="list-decimal list-inside space-y-3">
            {topProducts.map((product) => (
              <li key={product.id} className="text-lg p-3 bg-gray-50 rounded-md">
                <span className="font-semibold">{product.name}</span> - Terjual {product.quantity} unit
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">Belum ada produk yang terjual hari ini.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsView;