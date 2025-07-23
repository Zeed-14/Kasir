import { createClient } from '@supabase/supabase-js';
import Dexie from 'dexie';

// 1. Konfigurasi Supabase
const supabaseUrl = 'https://wuwpgzxqjdwqxdtomhjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1d3BnenhxamR3cXhkdG9taGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzIyMjAsImV4cCI6MjA2ODgwODIyMH0.xxAoAr5Dg3aSz4zHA_CHCvAp0t1jTjLsh8eDxLtCPGU';
export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Konfigurasi IndexedDB menggunakan Dexie.js
export const db = new Dexie('PosDatabase');
db.version(2).stores({
  products: 'id, name', 
  transactions: '++local_id, id, synced, transaction_time',
  transaction_items: '++local_id, transaction_local_id, product_id',
});