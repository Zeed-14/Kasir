import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ProductManagementView = ({ products, onAdd, onEdit, onDelete }) => {
  return (
    <div className="max-w-7xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-white">Manajemen Produk</h2>
        <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          <span>Tambah Produk</span>
        </button>
      </div>
      <div className="overflow-x-auto">
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
            {products?.map(p => (
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
      </div>
    </div>
  );
};

export default ProductManagementView;