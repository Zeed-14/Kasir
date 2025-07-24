import React from 'react';
import { Download } from 'lucide-react';

const InstallPWAButton = ({ onInstall }) => {
  return (
    <button
      onClick={onInstall}
      className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 hover:bg-green-700 transition-transform hover:scale-105 active:scale-95"
      title="Install Aplikasi KasirKu"
    >
      <Download size={20} />
      <span className="text-sm font-semibold">Install App</span>
    </button>
  );
};

export default InstallPWAButton;