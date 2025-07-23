import React from 'react';

// Kita menggunakan React.forwardRef agar komponen induk bisa mendapatkan referensi ke DOM node ini
const Receipt = React.forwardRef(({ transaction }, ref) => {
  if (!transaction) return null;

  return (
    <div ref={ref} className="p-4 bg-white text-black font-mono">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">KasirKu</h1>
        <p className="text-sm">Terima Kasih Atas Kunjungan Anda</p>
      </div>
      <div className="border-t border-b border-dashed border-black py-2 mb-2 text-xs">
        <p>No. Transaksi: {transaction.id.substring(0, 8)}</p>
        <p>Waktu: {new Date(transaction.transaction_time).toLocaleString('id-ID')}</p>
      </div>
      <table className="w-full text-xs mb-2">
        <tbody>
          {transaction.items?.map((item, index) => (
            <tr key={index}>
              <td className="align-top">{item.productName}</td>
              <td className="align-top text-center">x{item.quantity}</td>
              <td className="align-top text-right">
                {(item.price_at_transaction * item.quantity).toLocaleString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-dashed border-black pt-2 text-xs">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</span>
        </div>
      </div>
      <div className="text-center mt-4 text-xs">
        <p>--- Layanan Pelanggan ---</p>
        <p>kasirku@example.com</p>
      </div>
    </div>
  );
});

export default Receipt;
