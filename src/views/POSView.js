import React from 'react';
import ProductSkeleton from '../components/ProductSkeleton';
import { X, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const POSView = ({ products, categories, activeCategoryId, setActiveCategoryId, cart, addToCart, updateQuantity, total, onInitiateCheckout, searchTerm, setSearchTerm, isMobile, isCartVisible, setIsCartVisible }) => {
  
  const filteredProducts = products?.filter(p => {
    const matchesCategory = activeCategoryId === 'all' ? true : p.category_id === activeCategoryId;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Varian animasi untuk kontainer produk
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Setiap anak akan muncul dengan jeda 0.05 detik
      }
    }
  };

  // Varian animasi untuk setiap kartu produk
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const Cart = () => (
    <div className={`
      ${isMobile ? 'fixed inset-y-0 right-0 z-30 w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300' : 'relative w-full bg-white dark:bg-gray-800 rounded-lg shadow'}
      ${isMobile && !isCartVisible ? 'translate-x-full' : 'translate-x-0'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">Keranjang</h2>
          {isMobile && (
            <button onClick={() => setIsCartVisible(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X size={24} />
            </button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
              <ShoppingCart size={48} className="mx-auto mb-2" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 dark:bg-gray-600 w-7 h-7 rounded-md">-</button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-200 dark:bg-gray-600 w-7 h-7 rounded-md">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
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
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold dark:text-white">Pilih Produk</h1>
          <p className="text-gray-500 dark:text-gray-400">Klik produk untuk ditambahkan ke keranjang.</p>
        </div>
        <div className="mb-4">
          <input 
            type="text"
            placeholder="Cari produk..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          <button 
            onClick={() => setActiveCategoryId('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeCategoryId === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
          >
            Semua
          </button>
          {categories?.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeCategoryId === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {products === undefined ? (
          <ProductSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1"
          >
            {filteredProducts?.map(p => (
              <motion.div
                key={p.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(p)}
                className="border dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between bg-gray-50 dark:bg-gray-700/50"
              >
                <img src={p.image_url || 'https://placehold.co/150'} alt={p.name} className="w-full h-24 object-cover rounded-md mx-auto mb-2"/>
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <div className={`transition-all duration-300 ${isMobile ? 'w-0' : 'w-1/3'}`}>
        {!isMobile && <Cart />}
      </div>
      {isMobile && <Cart />}
      {!isCartVisible && isMobile && (
        <button 
          onClick={() => setIsCartVisible(true)}
          className="fixed bottom-20 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-20"
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