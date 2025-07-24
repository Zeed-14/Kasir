import React from 'react';

const SyncProgressModal = ({ progress, count, total }) => {
  const circumference = 2 * Math.PI * 54; // 2 * pi * radius
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-50 text-white">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Lingkaran latar belakang */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#4A5568" // gray-700
            strokeWidth="12"
            fill="transparent"
          />
          {/* Lingkaran progres */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#4299E1" // blue-400
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <span className="text-4xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
      <p className="mt-4 text-lg">Mengunggah data ke cloud...</p>
      <p className="text-gray-300">({count}/{total} transaksi)</p>
    </div>
  );
};

export default SyncProgressModal;