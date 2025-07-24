import React from 'react';

// Terima prop baru: onManualSync
const DebugInfoPanel = ({ status, onManualSync }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'Syncing from cloud...':
      case 'Syncing to cloud...':
        return { color: 'bg-yellow-400', text: 'Syncing...' };
      case 'Synced':
        return { color: 'bg-green-500', text: 'Synced' };
      case 'Offline (Sync Error)':
      case 'Sync Failed':
        return { color: 'bg-red-500', text: 'Sync Error' };
      default:
        return { color: 'bg-gray-400', text: 'Idle' };
    }
  };

  const { color, text } = getStatusInfo();

  return (
    // Tambahkan cursor-pointer dan hover effect
    <div 
      onClick={onManualSync}
      className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-xs z-50 flex items-center gap-2 cursor-pointer hover:bg-gray-700 transition-colors"
      title="Klik untuk sinkronisasi manual"
    >
      <span className={`w-3 h-3 rounded-full ${color} animate-pulse`}></span>
      <span>{text}</span>
    </div>
  );
};

export default DebugInfoPanel;