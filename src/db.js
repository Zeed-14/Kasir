import { createClient } from '@supabase/supabase-js';
import Dexie from 'dexie';

// 1. Konfigurasi Supabase
const supabaseUrl = 'https://wuwpgzxqjdwqxdtomhjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1d3BnenhxamR3cXhkdG9taGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzIyMjAsImV4cCI6MjA2ODgwODIyMH0.xxAoAr5Dg3aSz4zHA_CHCvAp0t1jTjLsh8eDxLtCPGU';
export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Konfigurasi IndexedDB menggunakan Dexie.js
export const db = new Dexie('PosDatabase');
// NAIKKAN VERSI DATABASE KE 4 DAN TAMBAHKAN 'categories'
db.version(4).stores({
  products: '&id, name, category_id', // Tambahkan indeks untuk category_id
  transactions: '&id, transaction_time, synced',
  transaction_items: '&id, transaction_id, product_id',
  categories: '&id, name', // <-- TABEL BARU UNTUK KATEGORI
});