import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center p-8 h-full"
    >
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <Icon size={48} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{message}</p>
    </motion.div>
  );
};

export default EmptyState;