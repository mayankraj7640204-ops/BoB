import React, { useState, useMemo } from 'react';
import { Product, Collection, Currency } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CollectionsBar } from '../components/CollectionsBar';

interface ShopPageProps {
  products: Product[];
  collections: Collection[];
  currency: Currency;
  selectedCollection: string;
  onSelectCollection: (slug: string) => void;
  onSelectProduct: (p: Product) => void;
  onViewInRoom: (p: Product) => void;
}

const ITEMS_PER_PAGE = 24;

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  collections,
  currency,
  selectedCollection,
  onSelectCollection,
  onSelectProduct,
  onViewInRoom,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [currentPage, setCurrentPage] = useState(1);

  // Active collection object
  const activeColObj = collections.find(
    (c) => c.slug.toLowerCase() === selectedCollection.toLowerCase()
  );

  // Filter products by collection and search query
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCollection !== 'all') {
      result = result.filter(
        (p) => p.collectionSlug.toLowerCase() === selectedCollection.toLowerCase()
      );
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.collectionSlug.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, selectedCollection, searchFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCollectionChange = (slug: string) => {
    onSelectCollection(slug);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#0c0d0e] text-[#f5f5f3]">
      {/* 1. Collections Horizontal Scroll Bar */}
      <CollectionsBar
        collections={collections}
        selectedCollection={selectedCollection}
        onSelectCollection={handleCollectionChange}
        totalProducts={products.length}
      />

      {/* 2. Collection Hero Banner */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 border-b border-[#212327]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans-ui uppercase tracking-widest text-[#e5b364] font-semibold block mb-2">
              {selectedCollection === 'all' ? 'Catalogue Archive' : 'Curated Collection'}
            </span>
            <h1 className="font-kalice text-3xl md:text-5xl font-bold tracking-tight text-white capitalize">
              {activeColObj ? activeColObj.name : 'Fine Art Prints'}
            </h1>
            <p className="font-sans-ui text-sm text-[#8e9297] mt-3 leading-relaxed">
              {activeColObj
                ? activeColObj.desc
                : 'Limited edition museum-grade prints by Mayowa Alabi. Archival pigment inks on acid-free Hahnemühle and giclée stocks.'}
            </p>
          </div>

          {/* Controls: Search & Sort */}
          <div className="flex flex-wrap items-center gap-3 font-sans-ui text-xs">
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter prints..."
                className="px-3 py-1.5 pl-8 rounded bg-[#16171a] border border-[#282a2e] text-white placeholder-[#6b7076] text-xs focus:outline-none focus:border-white"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6b7076]">
                🔍
              </span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded bg-[#16171a] border border-[#282a2e] text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Title: A to Z</option>
            </select>

            <span className="text-[#8e9297] text-xs font-mono ml-2">
              {filteredProducts.length} prints
            </span>
          </div>
        </div>
      </div>

      {/* 3. Products Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        {paginated.length === 0 ? (
          <div className="py-24 text-center font-sans-ui space-y-3">
            <p className="font-kalice text-xl text-white">No prints found</p>
            <p className="text-xs text-[#8e9297]">
              Try clearing your filter keyword or choosing a different collection.
            </p>
            <button
              onClick={() => {
                setSearchFilter('');
                handleCollectionChange('all');
              }}
              className="mt-3 px-4 py-2 rounded bg-white text-black text-xs uppercase font-semibold"
            >
              View All Prints
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onSelect={onSelectProduct}
                onViewInRoom={onViewInRoom}
              />
            ))}
          </div>
        )}

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-[#212327] flex items-center justify-between font-sans-ui text-xs">
            <div className="flex space-x-1.5">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded text-xs font-mono transition-colors ${
                      currentPage === pageNum
                        ? 'bg-white text-black font-bold'
                        : 'bg-[#161719] text-[#8e9297] hover:text-white hover:bg-[#232528]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded bg-[#161719] text-white disabled:opacity-30 hover:bg-[#232528]"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded bg-[#161719] text-white disabled:opacity-30 hover:bg-[#232528]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

