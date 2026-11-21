import React from 'react';
import { Collection } from '../types';

interface CollectionsBarProps {
  collections: Collection[];
  selectedCollection: string;
  onSelectCollection: (slug: string) => void;
  totalProducts: number;
}

export const CollectionsBar: React.FC<CollectionsBarProps> = ({
  collections,
  selectedCollection,
  onSelectCollection,
  totalProducts,
}) => {
  return (
    <div className="w-full border-b border-[#232528] bg-[#0c0d0e]/60 py-3 px-4 md:px-8 overflow-x-auto no-scrollbar">
      <div className="max-w-[1600px] mx-auto flex items-center space-x-2 md:space-x-3 whitespace-nowrap">
        {/* All Prints */}
        <button
          onClick={() => onSelectCollection('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-sans-ui tracking-wide transition-all ${
            selectedCollection === 'all'
              ? 'bg-white text-black font-semibold'
              : 'bg-[#181a1c] text-[#8e9297] hover:text-white hover:bg-[#232528]'
          }`}
        >
          All Prints ({totalProducts})
        </button>

        {/* Collection Pills */}
        {collections.map((col) => {
          const isSelected = selectedCollection.toLowerCase() === col.slug.toLowerCase();
          return (
            <button
              key={col.slug}
              onClick={() => onSelectCollection(col.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans-ui tracking-wide transition-all ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#181a1c] text-[#8e9297] hover:text-white hover:bg-[#232528]'
              }`}
            >
              <span>{col.name}</span>
              <span className="ml-1.5 opacity-60 font-mono text-[11px]">({col.productCount})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

