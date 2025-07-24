import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoryManagementView = ({ categories, onAdd, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manajemen Kategori</h2>
        <button onClick={() => onAdd()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          <span>Tambah Kategori</span>
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {(!categories || categories.length === 0) ? (
          <p className="text-center text-gray-500 mt-16">Belum ada kategori. Silakan tambahkan.</p>
        ) : (
          <ul className="divide-y">
            {categories.map(cat => (
              <li key={cat.id} className="p-4 flex justify-between items-center">
                <span className="font-semibold text-lg">{cat.name}</span>
                <div className="flex gap-4">
                  <button onClick={() => onEdit(cat)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => onDelete(cat.id)} className="text-red-600 hover:text-red-800">
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