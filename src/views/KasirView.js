import React, { useState } from 'react';
import PointOfSaleView from './PointOfSaleView';
import ProductManagementView from './ProductManagementView';
import { motion, AnimatePresence } from 'framer-motion';

const KasirView = (props) => {
  const [subView, setSubView] = useState('pos');

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <TabButton
          label="Point of Sale"
          isActive={subView === 'pos'}
          onClick={() => setSubView('pos')}
        />
        <TabButton
          label="Manajemen Produk"
          isActive={subView === 'products'}
          onClick={() => setSubView('products')}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={subView}
            initial="initial"
            animate="in"
            exit="out"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {subView === 'pos' && <PointOfSaleView {...props} />}
            {subView === 'products' && (
              <ProductManagementView
                products={props.products}
                onAdd={props.onAddProduct}
                onEdit={props.onEditProduct}
                onDelete={props.onDeleteProduct}
                // --- PERUBAHAN DI SINI: Teruskan props pagination ---
                onShowMore={props.onShowMore}
                hasMoreProducts={props.hasMoreProducts}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-semibold transition-colors ${
      isActive
        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
    }`}
  >
    {label}
  </button>
);

export default KasirView;