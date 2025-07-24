import React, { useState } from 'react';
import { supabase } from '../db';
import { ShoppingBag } from 'lucide-react';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Proses Login
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Proses Pendaftaran
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-xl text-white">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Selamat Datang di KasirKu</h1>
          <p className="text-gray-500">{isLogin ? 'Silakan masuk untuk melanjutkan' : 'Buat akun baru'}</p>
        </div>

        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
        {message && <p className="text-center text-green-500 bg-green-100 p-3 rounded-lg">{message}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
        <p className="text-sm text-center text-gray-600">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-semibold text-blue-600 hover:underline">
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;