import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, Collection, Currency } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  collections: Collection[];
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onSelectCollection: (slug: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  products,
  collections,
  currency,
  onSelectProduct,
  onSelectCollection,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // open command palette
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        collections: collections.slice(0, 6),
        products: products.slice(0, 8),
      };
    }
    const filteredCollections = collections.filter(
      (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
    const filteredProducts = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.collectionSlug.toLowerCase().includes(q)
    );
    return {
      collections: filteredCollections,
      products: filteredProducts.slice(0, 20),
    };
  }, [query, collections, products]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#141517] border border-[#2b2d32] rounded-lg shadow-2xl overflow-hidden text-[#f5f5f3] z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#26282d] flex items-center space-x-3 bg-[#111214]">
          <span className="text-[#8e9297] text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, collections, series..."
            className="w-full bg-transparent text-base font-sans-ui text-white placeholder-[#6b7076] border-none outline-none focus:ring-0"
          />
          <button
            onClick={onClose}
            className="text-xs uppercase font-mono px-2 py-1 rounded bg-[#232529] text-[#8e9297] hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 font-sans-ui text-xs">
          {/* Collections Matches */}
          {matched.collections.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6b7076] font-semibold mb-2 px-2">
                Collections
              </p>
              <div className="space-y-1">
                {matched.collections.map((col) => (
                  <button
                    key={col.slug}
                    onClick={() => {
                      onSelectCollection(col.slug);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded hover:bg-[#202226] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#e5b364]">
                        {col.name}
                      </p>
                      <p className="text-[11px] text-[#8e9297] line-clamp-1">{col.desc}</p>
                    </div>
                    <span className="text-xs font-mono text-[#8e9297]">
                      {col.productCount} prints →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Matches */}
          {matched.products.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6b7076] font-semibold mb-2 px-2">
                Artworks ({matched.products.length})
              </p>
              <div className="space-y-1">
                {matched.products.map((prod) => {
                  const price = (prod.price * currency.rate).toLocaleString(undefined, {
                    minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
                    maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
                  });

                  return (
                    <button
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                      className="w-full text-left p-2 rounded hover:bg-[#202226] transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-12 object-contain bg-black p-0.5 rounded border border-[#26282c]"
                        />
                        <div>
                          <p className="font-kalice text-sm font-bold text-white group-hover:text-[#e5b364]">
                            {prod.title}
                          </p>
                          <p className="text-[11px] text-[#8e9297] uppercase tracking-wider">
                            {prod.collectionSlug.replace(/-/g, ' ')}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono font-semibold text-white">
                        {currency.symbol}{price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matched.collections.length === 0 && matched.products.length === 0 && (
            <div className="py-12 text-center text-[#8e9297]">
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

