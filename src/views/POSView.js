import React from 'react';

// 1. Terima props baru: searchTerm dan setSearchTerm
const POSView = ({ products, cart, addToCart, updateQuantity, total, handleCheckout, syncStatus, searchTerm, setSearchTerm }) => {
  
  // 2. Logika untuk memfilter produk berdasarkan searchTerm
  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Daftar Produk */}
      <div className="w-3/5 bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Produk</h2>
        
        {/* 3. Tambahkan elemen input untuk kolom pencarian */}
        <div className="mb-4">
          <input 
            type="text"
            placeholder="Cari produk..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 4. Gunakan `filteredProducts` untuk di-render, bukan `products` */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1">
          {filteredProducts?.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} className="border rounded-lg p-3 text-center cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-between">
              <img src={p.image_url || 'https://placehold.co/150'} alt={p.name} className="w-full h-24 object-cover rounded-md mx-auto mb-2"/>
              <div>
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <p className="text-xs text-gray-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">Stok: {p.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keranjang (Tidak ada perubahan di sini) */}
      <div className="w-2/5 bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Keranjang</h2>
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Keranjang kosong</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 w-6 h-6 rounded-full">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-200 w-6 h-6 rounded-full">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
            Bayar
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">Status: {syncStatus}</p>
        </div>
      </div>
    </>
  );
};

export default POSView;
