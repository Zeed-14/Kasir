import React from 'react';
import EmptyState from '../components/EmptyState';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';

const SuplierView = ({ supliers, onAdd, onEdit, onDelete }) => {
  return (
    <div className="max-w-7xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-white">Manajemen Suplier</h2>
        {/* --- PERBAIKAN DI SINI: Bungkus onAdd dengan () => ... --- */}
        <button onClick={() => onAdd()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          <span>Tambah Suplier</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        {(!supliers || supliers.length === 0) ? (
          <EmptyState 
            icon={Truck}
            title="Belum Ada Suplier"
            message="Silakan tambahkan data suplier Anda."
          />
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3">Nama Suplier</th>
                <th className="p-3">Narahubung</th>
                <th className="p-3">Telepon</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {supliers.map(sup => (
                <tr key={sup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-3 font-semibold">{sup.name}</td>
                  <td className="p-3">{sup.contact_person || '-'}</td>
                  <td className="p-3">{sup.phone || '-'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => onEdit(sup)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 p-1">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => onDelete(sup.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SuplierView;