import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db, supabase } from './db';
import Navbar from './components/Navbar';
import ProductFormModal from './components/ProductFormModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import PaymentModal from './components/PaymentModal';
import POSView from './views/POSView';
import TransactionsView from './views/TransactionsView';
import ProductManagementView from './views/ProductManagementView';
import ReportsView from './views/ReportsView';
import DebugInfoPanel from './components/DebugInfoPanel';

export default function App() {
  // --- STATE ---
  const [cart, setCart] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [currentView, setCurrentView] = useState('pos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // --- DATA DARI INDEXEDDB ---
  const products = useLiveQuery(() => db.products.orderBy('name').toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.orderBy('transaction_time').reverse().toArray(), []);
  const transactionItems = useLiveQuery(() => db.transaction_items.toArray(), []);

  // --- LOGIKA SINKRONISASI (DIPERBARUI) ---
  const syncFromSupabase = useCallback(async () => {
    try {
      setSyncStatus('Syncing from cloud...');
      
      const { data: prods, error: pErr } = await supabase.from('products').select('*');
      if (pErr) throw pErr;

      const { data: txs, error: tErr } = await supabase.from('transactions').select('*');
      if (tErr) throw tErr;

      const { data: items, error: iErr } = await supabase.from('transaction_items').select('*');
      if (iErr) throw iErr;

      // --- PERBAIKAN DI SINI: Gunakan transaksi Dexie untuk memastikan konsistensi data ---
      await db.transaction('rw', db.products, db.transactions, db.transaction_items, async () => {
        if (prods) await db.products.bulkPut(prods);
        
        if (txs) {
          const syncedTxs = txs.map(tx => ({ ...tx, synced: 1 }));
          await db.transactions.bulkPut(syncedTxs);
        }
        
        if (items) await db.transaction_items.bulkPut(items);
      });
      
      setSyncStatus('Synced');
      console.log('Atomic sync from cloud complete.');
    } catch (error) {
      setSyncStatus('Offline (Sync Error)');
      console.error('Sync from Supabase error:', error.message);
    }
  }, []);
  
  const syncToSupabase = useCallback(async () => {
    setSyncStatus('Syncing to cloud...');
    const unsyncedTxs = await db.transactions.where('synced').equals(0).toArray();
    if (unsyncedTxs.length === 0) {
      setSyncStatus('Synced');
      return;
    }
    console.log(`Pushing ${unsyncedTxs.length} transactions...`);
    for (const tx of unsyncedTxs) {
      try {
        const items = await db.transaction_items.where('transaction_id').equals(tx.id).toArray();
        const { synced, ...txToSync } = tx;
        
        const { error: txError } = await supabase.from('transactions').upsert(txToSync);
        if (txError) throw txError;
        
        const { error: itemsError } = await supabase.from('transaction_items').upsert(items);
        if (itemsError) throw itemsError;

        await db.transactions.update(tx.id, { synced: 1 });
        console.log(`Transaction ${tx.id} pushed and marked as synced.`);
      } catch (error) {
        setSyncStatus('Sync Failed');
        console.error(`Failed to sync transaction ${tx.id}:`, error);
      }
    }
    setSyncStatus('Synced');
  }, []);

  useEffect(() => {
    syncFromSupabase();
    syncToSupabase();
    const intervalId = setInterval(() => {
        syncToSupabase();
        syncFromSupabase();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [syncFromSupabase, syncToSupabase]);

  // --- LOGIKA PEMBAYARAN ---
  const handleInitiateCheckout = () => {
    if (cart.length > 0) {
      setIsPaymentModalOpen(true);
    }
  };

  const handleConfirmPayment = async () => {
    if (cart.length === 0) return;
    
    const transactionId = crypto.randomUUID();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newTransaction = { id: transactionId, total_amount: totalAmount, transaction_time: new Date().toISOString(), synced: 0 };
    const newTransactionItems = cart.map(item => ({ id: crypto.randomUUID(), transaction_id: transactionId, product_id: item.id, quantity: item.quantity, price_at_transaction: item.price }));

    try {
      await db.transaction('rw', db.transactions, db.transaction_items, db.products, async () => {
        await db.transactions.add(newTransaction);
        await db.transaction_items.bulkAdd(newTransactionItems);
        for (const item of cart) {
          await db.products.update(item.id, { stock: item.stock - item.quantity });
        }
      });
      console.log('Transaction saved locally.');
      setCart([]);
      setIsPaymentModalOpen(false);
      await syncToSupabase();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Gagal menyimpan transaksi lokal.');
    }
  };
  
  // --- FUNGSI LAINNYA ---
  const handleViewTransactionDetails = async (transaction) => {
    try {
      const items = await db.transaction_items.where('transaction_id').equals(transaction.id).toArray();
      const itemsWithProductNames = await Promise.all(items.map(async (item) => {
        const product = await db.products.get(item.product_id);
        return { ...item, productName: product ? product.name : 'Produk Dihapus' };
      }));
      setViewingTransaction({ ...transaction, items: itemsWithProductNames });
    } catch (error) {
      console.error("Gagal mengambil detail transaksi:", error);
      alert("Tidak bisa memuat detail transaksi.");
    }
  };
  const handleCloseTransactionDetails = () => { setViewingTransaction(null); };
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
  const handleSaveProduct = async (productData) => {
    try {
      let savedProduct;
      if (selectedProduct) {
        const { data, error } = await supabase.from('products').update(productData).eq('id', selectedProduct.id).select().single();
        if (error) throw error;
        savedProduct = data;
        await db.products.update(savedProduct.id, savedProduct);
      } else {
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
  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const reportData = useMemo(() => {
    if (!transactions || !transactionItems || !products) {
      return { stats: null, topProducts: [] };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todaysTransactions = transactions.filter(tx => new Date(tx.transaction_time) >= todayStart);
    const todaysTransactionIds = todaysTransactions.map(tx => tx.id);

    const totalRevenue = todaysTransactions.reduce((sum, tx) => sum + tx.total_amount, 0);
    const transactionCount = todaysTransactions.length;

    const productSales = {};
    const todaysItems = transactionItems.filter(item => todaysTransactionIds.includes(item.transaction_id));
    
    todaysItems.forEach(item => {
      productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return {
          id: productId,
          name: product ? product.name : 'Produk Tidak Dikenal',
          quantity
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      stats: { totalRevenue, transactionCount },
      topProducts
    };
  }, [transactions, transactionItems, products]);

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 flex gap-4 p-4">
        {currentView === 'pos' && ( 
          <POSView 
            {...{products, cart, addToCart, updateQuantity, total, syncStatus, searchTerm, setSearchTerm}} 
            onInitiateCheckout={handleInitiateCheckout}
          /> 
        )}
        {currentView === 'transactions' && ( <TransactionsView transactions={transactions} onViewDetails={handleViewTransactionDetails} /> )}
        {currentView === 'products' && ( <ProductManagementView {...{products, onAdd: () => openModal(), onEdit: openModal, onDelete: handleDeleteProduct}} /> )}
        {currentView === 'reports' && (
          <ReportsView stats={reportData.stats} topProducts={reportData.topProducts} />
        )}
      </main>
      
      {isModalOpen && ( <ProductFormModal product={selectedProduct} onSave={handleSaveProduct} onClose={closeModal} /> )}
      
      {viewingTransaction && ( <TransactionDetailModal transaction={viewingTransaction} onClose={handleCloseTransactionDetails} /> )}

      {isPaymentModalOpen && (
        <PaymentModal 
          total={total}
          onConfirm={handleConfirmPayment}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
      <DebugInfoPanel status={syncStatus} />
    </div>
  );
}