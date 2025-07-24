
// src/components/ProductFormModal.js

import React, { useState } from 'react';

const ProductFormModal = ({ product, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, category_id: formData.category_id || null });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Nama Produk</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Harga</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Stok Awal</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">URL Gambar (Opsional)</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
            <select
              name="category_id"
              value={formData.category_id || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Tanpa Kategori --</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;