import React from 'react';
import SalesChart from '../components/SalesChart';

// Terima prop baru: isInitialSyncComplete
const ReportsView = ({ reportData, reportPeriod, setReportPeriod, isInitialSyncComplete }) => {
  const { stats, topProducts, chartData } = reportData;

  const FilterButton = ({ period, label }) => (
    <button
      onClick={() => setReportPeriod(period)}
      className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
        reportPeriod === period
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  // Tampilkan pesan loading yang berbeda jika sinkronisasi awal belum selesai
  if (!isInitialSyncComplete) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">Laporan Penjualan</h2>
        <p>Menyinkronkan data dari cloud untuk pertama kali...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">Laporan Penjualan</h2>
        <p>Menghitung laporan...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">Laporan Penjualan</h2>
        <div className="flex items-center gap-2">
          <FilterButton period="today" label="Hari Ini" />
          <FilterButton period="7days" label="7 Hari" />
          <FilterButton period="30days" label="30 Hari" />
        </div>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <p className="text-blue-800 font-semibold">Total Pendapatan</p>
          <p className="text-4xl font-bold text-blue-900">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <p className="text-green-800 font-semibold">Jumlah Transaksi</p>
          <p className="text-4xl font-bold text-green-900">{stats.transactionCount}</p>
        </div>
      </div>

      {/* Grafik Penjualan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-semibold mb-4">Grafik Pendapatan</h3>
        <SalesChart data={chartData} />
      </div>

      {/* Produk Terlaris */}
      <div className="bg-white rounded-lg shadow p-6">
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
          <p className="text-gray-500">Belum ada produk yang terjual pada periode ini.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsView;