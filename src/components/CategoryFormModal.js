import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CategoryFormModal = ({ category, onSave, onClose }) => {
  const [name, setName] = useState(category?.name || '');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 dark:text-white">{category ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" 
            placeholder="Nama Kategori" 
            required 
            autoFocus 
          />
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Simpan</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategoryFormModal;