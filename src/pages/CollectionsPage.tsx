import React from 'react';
import { Collection } from '../types';

interface CollectionsPageProps {
  collections: Collection[];
  onSelectCollection: (slug: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  collections,
  onSelectCollection,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#0c0d0e] text-[#f5f5f3] py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-[#212327]">
          <span className="text-xs font-sans-ui uppercase tracking-widest text-[#e5b364] font-semibold block mb-2">
            Thematic Series
          </span>
          <h1 className="font-kalice text-3xl md:text-5xl font-bold tracking-tight text-white">
            Collections Index
          </h1>
          <p className="font-sans-ui text-sm text-[#8e9297] mt-3 max-w-2xl leading-relaxed">
            Explore curated series spanning Lagos urban streetscapes, Yoruba mythology, pop culture homages, and vibrant chromatic portraiture.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <div
              key={col.slug}
              onClick={() => onSelectCollection(col.slug)}
              className="group cursor-pointer flex flex-col justify-between p-5 border border-[#212327] rounded-sm bg-[#121316] hover:border-white/50 transition-all duration-300"
            >
              <div>
                {col.previewImage && (
                  <div className="w-full aspect-[4/3] bg-black rounded-sm overflow-hidden mb-4 p-2 flex items-center justify-center">
                    <img
                      src={col.previewImage}
                      alt={col.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex items-baseline justify-between">
                  <h3 className="font-kalice text-2xl font-bold text-white group-hover:text-[#e5b364] transition-colors">
                    {col.name}
                  </h3>
                  <span className="text-xs font-sans-ui font-mono text-[#8e9297]">
                    {col.productCount} prints
                  </span>
                </div>

                <p className="font-sans-ui text-xs text-[#8e9297] mt-2 leading-relaxed">
                  {col.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1e2023] flex items-center justify-between text-xs font-sans-ui uppercase tracking-wider text-[#8e9297] group-hover:text-white transition-colors">
                <span>Browse Collection</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

