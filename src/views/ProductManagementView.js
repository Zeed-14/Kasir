import React from 'react';
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { Package } from 'lucide-react';

// Terima prop baru: onShowMore, hasMoreProducts
const ProductManagementView = ({ products, onAdd, onEdit, onDelete, onShowMore, hasMoreProducts }) => {
  return (
    <div className="max-w-7xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-white">Manajemen Produk</h2>
        <button onClick={() => onAdd()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          <span>Tambah Produk</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        {(!products || products.length === 0) ? (
          <EmptyState 
            icon={Package}
            title="Belum Ada Produk"
            message="Silakan tambahkan produk baru."
          />
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3">Nama Produk</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Stok</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 p-1">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* --- TOMBOL MUAT LEBIH BANYAK (BARU) --- */}
        {hasMoreProducts && (
          <div className="mt-6 text-center">
            <button 
              onClick={onShowMore}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <ChevronDown size={20} />
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagementView;