import React, { useState, useEffect } from 'react';
import { supabase } from '../db';
import { ShoppingBag } from 'lucide-react';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // --- STATE BARU: Untuk menyimpan pengaturan toko ---
  const [settings, setSettings] = useState(null);

  // --- EFEK BARU: Ambil data pengaturan toko saat komponen dimuat ---
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        setSettings(data);
      } catch (err) {
        console.error("Gagal mengambil pengaturan toko:", err.message);
      }
    };
    fetchStoreSettings();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          {/* --- LOGO DINAMIS --- */}
          <div className="bg-blue-600 p-3 rounded-xl text-white">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo Toko" className="w-10 h-10 object-contain" />
            ) : (
              <ShoppingBag size={40} />
            )}
          </div>
          {/* --- NAMA TOKO DINAMIS --- */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Selamat Datang di {settings?.name || 'KasirKu'}</h1>
          <p className="text-gray-500 dark:text-gray-400">{isLogin ? 'Silakan masuk untuk melanjutkan' : 'Buat akun baru'}</p>
        </div>

        {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-lg">{error}</p>}
        {message && <p className="text-center text-green-500 bg-green-100 dark:bg-green-900/20 dark:text-green-300 p-3 rounded-lg">{message}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-semibold text-blue-600 hover:underline dark:text-blue-400">
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;