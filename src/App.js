import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

// Import database dan komponen-komponen kita
import { db, supabase } from './db';
import Navbar from './components/Navbar';
import ProductFormModal from './components/ProductFormModal';
import POSView from './views/POSView';
import TransactionsView from './views/TransactionsView';
import ProductManagementView from './views/ProductManagementView';

export default function App() {
  // --- STATE UTAMA APLIKASI ---
  const [cart, setCart] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [currentView, setCurrentView] = useState('pos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- DATA DARI INDEXEDDB ---
  const products = useLiveQuery(() => db.products.orderBy('name').toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.orderBy('transaction_time').reverse().toArray(), []);

  // --- LOGIKA SINKRONISASI ---
  const syncFromSupabase = useCallback(async () => {
    setSyncStatus('Syncing products...');
    try {
      const { data: supabaseProducts, error } = await supabase.from('products').select('*');
      if (error) throw error;
      if (supabaseProducts && supabaseProducts.length > 0) {
        await db.products.bulkPut(supabaseProducts);
      }
      setSyncStatus('Synced');
      console.log('Products synced from Supabase.');
    } catch (error) {
      setSyncStatus('Offline (Error)');
      console.error('Sync error:', error.message);
    }
  }, []);
  
  const syncToSupabase = useCallback(async () => {
    setSyncStatus('Syncing transactions...');
    const unsyncedTxs = await db.transactions.where('synced').equals(0).toArray();

    if (unsyncedTxs.length === 0) {
      setSyncStatus('Synced');
      return;
    }
    console.log(`Found ${unsyncedTxs.length} unsynced transactions.`);
    for (const tx of unsyncedTxs) {
      try {
        const items = await db.transaction_items.where('transaction_local_id').equals(tx.local_id).toArray();
        const { local_id, synced, ...txToSync } = tx;
        const { data: newTx, error: txError } = await supabase.from('transactions').insert(txToSync).select().single();
        if (txError) throw txError;
        const itemsToSync = items.map(item => ({
          transaction_id: newTx.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_transaction: item.price
        }));
        const { error: itemsError } = await supabase.from('transaction_items').insert(itemsToSync);
        if (itemsError) throw itemsError;
        await db.transactions.update(tx.local_id, { synced: 1, id: newTx.id });
        console.log(`Transaction ${tx.local_id} synced.`);
      } catch (error) {
        setSyncStatus('Sync Failed');
        console.error(`Failed to sync transaction ${tx.local_id}:`, error);
      }
    }
    setSyncStatus('Synced');
  }, []);

  useEffect(() => {
    syncFromSupabase();
    syncToSupabase();
    const intervalId = setInterval(syncToSupabase, 60000);
    return () => clearInterval(intervalId);
  }, [syncFromSupabase, syncToSupabase]);

  // --- LOGIKA KERANJANG & CHECKOUT ---
  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + amount } : item
      );
      return updatedCart.filter(item => item.quantity > 0);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const transactionData = {
      total_amount: totalAmount,
      transaction_time: new Date().toISOString(),
      synced: 0
    };
    try {
      await db.transaction('rw', db.transactions, db.transaction_items, db.products, async () => {
        const txId = await db.transactions.add(transactionData);
        const transactionItems = cart.map(item => ({
          transaction_local_id: txId,
          product_id: item.id,
          quantity: item.quantity,
          price_at_transaction: item.price
        }));
        await db.transaction_items.bulkAdd(transactionItems);
        for (const item of cart) {
          await db.products.update(item.id, { stock: item.stock - item.quantity });
        }
      });
      console.log('Transaction saved locally.');
      setCart([]);
      await syncToSupabase();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Gagal menyimpan transaksi secara lokal.');
    }
  };
  
  // --- LOGIKA MANAJEMEN PRODUK (CRUD) ---
  const handleSaveProduct = async (productData) => {
    try {
      let savedProduct;
      if (selectedProduct) {
        // UPDATE
        const { data, error } = await supabase.from('products').update(productData).eq('id', selectedProduct.id).select().single();
        if (error) throw error;
        savedProduct = data;
        await db.products.update(savedProduct.id, savedProduct);
      } else {
        // CREATE
        const { data, error } = await supabase.from('products').insert(productData).select().single();
        if (error) throw error;
        savedProduct = data;
        await db.products.add(savedProduct);
      }
      closeModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await supabase.from('products').delete().eq('id', productId);
        await db.products.delete(productId);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // --- LOGIKA MODAL ---
  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- RENDER TAMPILAN UTAMA ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 flex gap-4 p-4">
        {currentView === 'pos' && (
          <POSView
            products={products}
            cart={cart}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            total={total}
            handleCheckout={handleCheckout}
            syncStatus={syncStatus}
          />
        )}
        {currentView === 'transactions' && <TransactionsView transactions={transactions} />}
        {currentView === 'products' && (
          <ProductManagementView
            products={products}
            onAdd={() => openModal()}
            onEdit={openModal}
            onDelete={handleDeleteProduct}
          />
        )}
      </main>

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onSave={handleSaveProduct}
          onClose={closeModal}
        />
      )}
    </div>
  );
}