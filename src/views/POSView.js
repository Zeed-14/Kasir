import React from 'react';
import ProductSkeleton from '../components/ProductSkeleton';
import { X, ShoppingCart } from 'lucide-react';

const POSView = ({ products, cart, addToCart, updateQuantity, total, onInitiateCheckout, syncStatus, searchTerm, setSearchTerm, isMobile, isCartVisible, setIsCartVisible }) => {
  
  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Cart = () => (
    <div className={`
      ${isMobile ? 'fixed inset-y-0 right-0 z-30 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300' : 'relative w-full'}
      ${isMobile && !isCartVisible ? 'translate-x-full' : 'translate-x-0'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold">Keranjang</h2>
          {isMobile && (
            <button onClick={() => setIsCartVisible(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X size={24} />
            </button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <ShoppingCart size={48} className="mx-auto mb-2" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 w-7 h-7 rounded-md">-</button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-200 w-7 h-7 rounded-md">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <button onClick={onInitiateCheckout} disabled={cart.length === 0} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-lg font-semibold">
            Bayar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Product List */}
      <div className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Selamat Datang, Kasir!</h1>
          <p className="text-gray-500">Pilih produk untuk ditambahkan ke keranjang.</p>
        </div>
        <div className="mb-4">
          <input 
            type="text"
            placeholder="Cari produk..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {products === undefined ? (
          <ProductSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1">
            {filteredProducts?.map(p => (
              <div key={p.id} onClick={() => addToCart(p)} className="border rounded-lg p-3 text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all flex flex-col justify-between bg-gray-50">
                <img src={p.image_url || 'https://placehold.co/150'} alt={p.name} className="w-full h-24 object-cover rounded-md mx-auto mb-2"/>
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs text-gray-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className={`transition-all duration-300 ${isMobile ? 'w-0' : 'w-1/3'}`}>
        {!isMobile && <Cart />}
      </div>
      {isMobile && <Cart />}

      {/* Floating Cart Button for Mobile */}
      {!isCartVisible && isMobile && (
        <button 
          onClick={() => setIsCartVisible(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-20"
        >
          <ShoppingCart size={28} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">{cart.length}</span>
          )}
        </button>
      )}
    </>
  );
};

export default POSView;