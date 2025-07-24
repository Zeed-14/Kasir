import React from 'react';
import EmptyState from '../components/EmptyState';
import { Plus, Edit, Trash2, List } from 'lucide-react';

const CategoryManagementView = ({ categories, onAdd, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-white">Manajemen Kategori</h2>
        <button onClick={() => onAdd()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          <span>Tambah Kategori</span>
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {(!categories || categories.length === 0) ? (
          <EmptyState 
            icon={List}
            title="Belum Ada Kategori"
            message="Silakan tambahkan kategori baru untuk mengelompokkan produk Anda."
          />
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {categories.map(cat => (
              <li key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <span className="font-semibold text-lg">{cat.name}</span>
                <div className="flex gap-4">
                  <button onClick={() => onEdit(cat)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => onDelete(cat.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManagementView;