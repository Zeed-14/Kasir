import React from 'react';

const ProductManagementView = ({ products, onAdd, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manajemen Produk</h2>
        <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Tambah Produk</button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-150px)]">
        <table className="w-full text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3">Nama Produk</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products?.map(p => (
              <tr key={p.id}>
                <td className="p-3">{p.name}</td>
                <td className="p-3">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-right">
                  <button onClick={() => onEdit(p)} className="text-blue-600 hover:underline mr-4">Edit</button>
                  <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">Hapus</button>
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