import React from 'react';

// Komponen untuk satu kartu produk skeleton
const SkeletonCard = () => (
  <div className="border rounded-lg p-3">
    <div className="w-full h-24 bg-gray-300 rounded-md mx-auto mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
  </div>
);

// Komponen untuk menampilkan grid skeleton
const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default ProductSkeleton;