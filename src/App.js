import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import './utils/logger';
import { db, supabase } from './db';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNavbar from './components/BottomNavbar';
import ProductFormModal from './components/ProductFormModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import PaymentModal from './components/PaymentModal';
import POSView from './views/POSView';
import TransactionsView from './views/TransactionsView';
import ProductManagementView from './views/ProductManagementView';
import ReportsView from './views/ReportsView';
import DebugInfoPanel from './components/DebugInfoPanel';
import SyncProgressModal from './components/SyncProgressModal';
import DebugConsole from './components/DebugConsole';
import CategoryManagementView from './views/CategoryManagementView';
import AuthView from './views/AuthView';
import InstallPWAButton from './components/InstallPWAButton'; // <-- IMPORT BARU

const CategoryFormModal = ({ category, onSave, onClose }) => {
  const [name, setName] = useState(category?.name || '');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name });
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">{category ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Nama Kategori" required autoFocus />
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  // --- STATE ---
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [currentView, setCurrentView] = useState('pos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ active: false, count: 0, total: 0 });
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reportPeriod, setReportPeriod] = useState('today');
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  // --- STATE BARU: Untuk menyimpan event instalasi ---
  const [installPrompt, setInstallPrompt] = useState(null);

  // --- EFEK ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- EFEK BARU: Untuk menangkap event instalasi PWA ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log('PWA install prompt event captured!');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // --- DATA DARI INDEXEDDB ---
  const products = useLiveQuery(() => db.products.orderBy('name').toArray(), []);
  const categories = useLiveQuery(() => db.categories.orderBy('name').toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.orderBy('transaction_time').reverse().toArray(), []);
  const transactionItems = useLiveQuery(() => db.transaction_items.toArray(), []);

  // --- LOGIKA SINKRONISASI ---
  const syncFromSupabase = useCallback(async () => {
    try {
      setSyncStatus('Syncing from cloud...');
      const { data: prods } = await supabase.from('products').select('*');
      const { data: txs } = await supabase.from('transactions').select('*');
      const { data: items } = await supabase.from('transaction_items').select('*');
      const { data: cats } = await supabase.from('categories').select('*');
      await db.transaction('rw', db.products, db.transactions, db.transaction_items, db.categories, async () => {
        if (prods) await db.products.bulkPut(prods);
        if (txs) {
          const syncedTxs = txs.map(tx => ({ ...tx, synced: 1 }));
          await db.transactions.bulkPut(syncedTxs);
        }
        if (items) await db.transaction_items.bulkPut(items);
        if (cats) await db.categories.bulkPut(cats);
      });
      setSyncStatus('Synced');
      setIsInitialSyncComplete(true);
    } catch (error) {
      setSyncStatus('Offline (Sync Error)');
      console.error('Sync from Supabase error:', error.message);
    }
  }, []);
  
  const syncToSupabase = useCallback(async () => {
    const unsyncedTxs = await db.transactions.where('synced').equals(0).toArray();
    if (unsyncedTxs.length === 0) {
      setSyncStatus('Synced');
      return;
    }
    const totalToSync = unsyncedTxs.length;
    setSyncProgress({ active: true, count: 0, total: totalToSync });
    setSyncStatus('Syncing to cloud...');
    let syncedCount = 0;
    for (const tx of unsyncedTxs) {
      try {
        const items = await db.transaction_items.where('transaction_id').equals(tx.id).toArray();
        const { synced, ...txToSync } = tx;
        await supabase.from('transactions').upsert(txToSync);
        await supabase.from('transaction_items').upsert(items);
        await db.transactions.update(tx.id, { synced: 1 });
        syncedCount++;
        setSyncProgress({ active: true, count: syncedCount, total: totalToSync });
      } catch (error) {
        setSyncStatus('Sync Failed');
        console.error(`Failed to sync transaction ${tx.id}:`, error);
        break;
      }
    }
    setTimeout(() => {
      setSyncProgress({ active: false, count: 0, total: 0 });
      setSyncStatus('Synced');
    }, 1000);
  }, []);

  useEffect(() => {
    if (session) {
      syncFromSupabase();
      syncToSupabase();
      const intervalId = setInterval(() => {
          syncToSupabase();
          syncFromSupabase();
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [session, syncFromSupabase, syncToSupabase]);

  // --- LOGIKA KALKULASI LAPORAN ---
  const reportData = useMemo(() => {
    if (!isInitialSyncComplete || !transactions || !transactionItems || !products) {
      return { stats: null, topProducts: [], chartData: [] };
    }
    const endDate = new Date();
    const startDate = new Date();
    if (reportPeriod === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (reportPeriod === '7days') {
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (reportPeriod === '30days') {
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }
    const filteredTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.transaction_time);
      return txDate >= startDate && txDate <= endDate;
    });
    const filteredTransactionIds = filteredTransactions.map(tx => tx.id);
    const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.total_amount, 0);
    const transactionCount = filteredTransactions.length;
    const productSales = {};
    const filteredItems = transactionItems.filter(item => filteredTransactionIds.includes(item.transaction_id));
    filteredItems.forEach(item => {
      productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
    });
    const topProducts = Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return { id: productId, name: product ? product.name : 'Produk Tidak Dikenal', quantity };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    const salesByDay = {};
    filteredTransactions.forEach(tx => {
      const day = new Date(tx.transaction_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      salesByDay[day] = (salesByDay[day] || 0) + tx.total_amount;
    });
    const chartData = Object.entries(salesByDay).map(([name, total]) => ({ name, total })).reverse();
    return { stats: { totalRevenue, transactionCount }, topProducts, chartData };
  }, [transactions, transactionItems, products, reportPeriod, isInitialSyncComplete]);

  // --- FUNGSI-FUNGSI LAINNYA ---
  const handleLogout = async () => { await supabase.auth.signOut(); };
  const handleInitiateCheckout = () => { if (cart.length > 0) setIsPaymentModalOpen(true); };
  const handleConfirmPayment = async () => {
    if (cart.length === 0 || !session?.user) return;
    const transactionId = crypto.randomUUID();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTransaction = { id: transactionId, total_amount: totalAmount, transaction_time: new Date().toISOString(), synced: 0, cashier_id: session.user.id };
    const newTransactionItems = cart.map(item => ({ id: crypto.randomUUID(), transaction_id: transactionId, product_id: item.id, quantity: item.quantity, price_at_transaction: item.price }));
    try {
      await db.transaction('rw', db.transactions, db.transaction_items, db.products, async () => {
        await db.transactions.add(newTransaction);
        await db.transaction_items.bulkAdd(newTransactionItems);
        for (const item of cart) {
          await db.products.update(item.id, { stock: item.stock - item.quantity });
        }
      });
      setCart([]);
      setIsPaymentModalOpen(false);
      setIsCartVisible(false);
      await syncToSupabase();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Gagal menyimpan transaksi lokal.');
    }
  };
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
        await db.products.put(savedProduct);
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
  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        const { data, error } = await supabase.from('categories').update({ name: categoryData.name }).eq('id', selectedCategory.id).select().single();
        if (error) throw error;
        await db.categories.put(data);
      } else {
        const { data, error } = await supabase.from('categories').insert({ name: categoryData.name }).select().single();
        if (error) throw error;
        await db.categories.put(data);
      }
      closeCategoryModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Menghapus kategori akan membuat produk terkait menjadi "Tanpa Kategori". Lanjutkan?')) {
      try {
        await supabase.from('categories').delete().eq('id', categoryId);
        await db.categories.delete(categoryId);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };
  const openCategoryModal = (category = null) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
  };
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setInstallPrompt(null);
  };

  // --- RENDER ---
  if (!session) {
    return <AuthView />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} user={session.user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          {currentView === 'pos' && ( 
            <POSView 
              {...{products, cart, addToCart, updateQuantity, total, syncStatus, searchTerm, setSearchTerm}} 
              onInitiateCheckout={handleInitiateCheckout}
              isMobile={isMobile}
              isCartVisible={isCartVisible}
              setIsCartVisible={setIsCartVisible}
              categories={categories}
              activeCategoryId={activeCategoryId}
              setActiveCategoryId={setActiveCategoryId}
            /> 
          )}
          {currentView === 'transactions' && ( <TransactionsView transactions={transactions} onViewDetails={handleViewTransactionDetails} /> )}
          {currentView === 'products' && ( <ProductManagementView {...{products, onAdd: () => openModal(), onEdit: openModal, onDelete: handleDeleteProduct}} /> )}
          {currentView === 'categories' && ( <CategoryManagementView categories={categories} onAdd={openCategoryModal} onEdit={openCategoryModal} onDelete={handleDeleteCategory} /> )}
          {currentView === 'reports' && (
            <ReportsView 
              reportData={reportData}
              reportPeriod={reportPeriod}
              setReportPeriod={setReportPeriod}
              isInitialSyncComplete={isInitialSyncComplete}
            />
          )}
        </main>
      </div>
      <BottomNavbar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} user={session.user} />
      
      {isModalOpen && ( <ProductFormModal product={selectedProduct} categories={categories} onSave={handleSaveProduct} onClose={closeModal} /> )}
      {viewingTransaction && ( <TransactionDetailModal transaction={viewingTransaction} onClose={handleCloseTransactionDetails} /> )}
      {isPaymentModalOpen && ( <PaymentModal total={total} onConfirm={handleConfirmPayment} onClose={() => setIsPaymentModalOpen(false)} /> )}
      {syncProgress.active && ( <SyncProgressModal progress={(syncProgress.count / syncProgress.total) * 100} count={syncProgress.count} total={syncProgress.total} /> )}
      {isConsoleVisible && <DebugConsole onClose={() => setIsConsoleVisible(false)} />}
      <div onDoubleClick={() => setIsConsoleVisible(true)}>
        <DebugInfoPanel status={syncStatus} onManualSync={syncToSupabase} />
      </div>
      {isCategoryModalOpen && ( <CategoryFormModal category={selectedCategory} onSave={handleSaveCategory} onClose={closeCategoryModal} /> )}

      {installPrompt && <InstallPWAButton onInstall={handleInstallClick} />}
    </div>
  );
}