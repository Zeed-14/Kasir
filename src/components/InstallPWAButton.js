import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const InstallPWAButton = ({ onInstall }) => {
  return (
    <motion.button
      onClick={onInstall}
      className="fixed top-1/2 -translate-y-1/2 right-0 bg-green-600 text-white flex items-center gap-2 z-50 rounded-l-full shadow-lg"
      title="Install Aplikasi KasirKu"
      initial={{ x: 'calc(100% - 48px)' }} // Mulai dengan hanya 48px yang terlihat
      whileHover={{ x: 0 }} // Muncul sepenuhnya saat di-hover
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <Download size={24} />
      </div>
      <span className="pr-4 font-semibold whitespace-nowrap">Install App</span>
    </motion.button>
  );
};

export default InstallPWAButton;
