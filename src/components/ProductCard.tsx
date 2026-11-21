import React, { useState } from 'react';
import { Product, Currency } from '../types';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelect: (product: Product) => void;
  onViewInRoom: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelect,
  onViewInRoom,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Convert USD price to current currency
  const convertedPrice = (product.price * currency.rate).toLocaleString(undefined, {
    minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
  });

  return (
    <div className="group flex flex-col justify-between bg-[#111214] border border-[#212327] rounded-sm overflow-hidden hover:border-[#383c44] transition-all duration-300">
      {/* Artwork Image Container */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full aspect-[4/5] bg-[#16171a] overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#1a1c1f] animate-pulse" />
        )}

        {/* High-res artwork */}
        <img
          src={product.imageLarge || product.image}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`max-w-full max-h-full object-contain filter drop-shadow-xl transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 pointer-events-none p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewInRoom(product);
            }}
            className="pointer-events-auto px-3 py-1.5 rounded bg-black/80 hover:bg-black text-white text-[11px] font-sans-ui uppercase tracking-wider backdrop-blur-md border border-white/20 transition-transform hover:scale-105"
          >
            View in Room
          </button>
          <button
            onClick={() => onSelect(product)}
            className="pointer-events-auto px-3 py-1.5 rounded bg-white text-black text-[11px] font-sans-ui uppercase tracking-wider font-semibold hover:bg-[#e2e2df] transition-transform hover:scale-105"
          >
            Details
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div
        onClick={() => onSelect(product)}
        className="p-4 border-t border-[#1e2023] flex flex-col justify-between cursor-pointer space-y-1.5"
      >
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-kalice text-lg font-bold tracking-tight text-white group-hover:text-[#e5b364] transition-colors line-clamp-1">
            {product.title}
          </h3>
          <span className="font-sans-ui text-sm font-semibold text-white whitespace-nowrap">
            {currency.symbol}{convertedPrice}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-sans-ui text-[#8e9297]">
          <span className="uppercase tracking-wider text-[11px] font-medium text-[#c4c7cc]">
            {product.collectionSlug.replace(/-/g, ' ')}
          </span>
          <span className="text-[10px] text-[#63676e] uppercase">
            Made to order
          </span>
        </div>
      </div>
    </div>
  );
};

