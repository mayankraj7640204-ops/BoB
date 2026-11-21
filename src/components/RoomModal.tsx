import React, { useState } from 'react';
import { Product } from '../types';

interface RoomModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenDetails: (product: Product) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  product,
  onClose,
  onOpenDetails,
}) => {
  const [frameType, setFrameType] = useState<'black' | 'oak' | 'white'>('black');
  const [wallColor, setWallColor] = useState<'charcoal' | 'linen' | 'sage'>('linen');

  if (!product) return null;

  const wallBg = {
    charcoal: 'bg-[#1f2022]',
    linen: 'bg-[#e5e1d8]',
    sage: 'bg-[#cbd5cc]',
  }[wallColor];

  const frameBorder = {
    black: 'border-[14px] border-neutral-900 shadow-2xl bg-neutral-900',
    oak: 'border-[14px] border-[#9c7247] shadow-2xl bg-[#9c7247]',
    white: 'border-[14px] border-white shadow-2xl bg-white',
  }[frameType];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl bg-[#141517] border border-[#2b2d32] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 border-b border-[#232528] flex items-center justify-between bg-[#111214] font-sans-ui text-xs">
          <div>
            <h3 className="font-kalice text-lg font-bold text-white">
              View In Room — {product.title}
            </h3>
            <p className="text-[#8e9297] text-[11px]">
              Simulated gallery display to scale (A1 format)
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded bg-[#212327] hover:bg-[#2b2e34] text-white"
          >
            Close ✕
          </button>
        </div>

        {/* Virtual Room Simulator Viewport */}
        <div className={`relative flex-1 min-h-[460px] md:min-h-[540px] ${wallBg} flex flex-col justify-between items-center p-8 overflow-hidden transition-colors duration-500`}>
          {/* Subtle Room Lighting Effect */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

          {/* Ceiling Spotlight Beam */}
          <div className="absolute top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Framed Artwork on Wall */}
          <div className="my-auto z-10 flex flex-col items-center">
            <div className={`p-4 ${frameBorder} rounded-sm transition-all duration-300 max-w-[280px] md:max-w-[340px] aspect-[4/5] flex items-center justify-center`}>
              <div className="p-3 bg-white shadow-inner flex items-center justify-center w-full h-full">
                <img
                  src={product.imageLarge || product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            <p className="text-[11px] font-sans-ui text-black/60 font-semibold tracking-wider uppercase mt-3">
              {product.title} · {product.collectionSlug}
            </p>
          </div>

          {/* Minimalist Designer Credenza / Bench in Room */}
          <div className="w-full max-w-md h-12 bg-neutral-800/80 rounded-t-sm shadow-xl z-0 border-t border-neutral-700/50 flex items-center justify-center">
            <div className="w-16 h-1 bg-neutral-600 rounded-full" />
          </div>

          {/* Hardwood Flooring */}
          <div className="w-full h-14 bg-gradient-to-b from-[#3d2c1f] to-[#2b1f15] border-t border-black/30 shadow-inner" />
        </div>

        {/* Room Customizer Controls Bar */}
        <div className="p-4 bg-[#111214] border-t border-[#232528] flex flex-wrap items-center justify-between gap-4 font-sans-ui text-xs">
          {/* Frame Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-[#8e9297] uppercase tracking-wider text-[11px]">Frame:</span>
            {(['black', 'oak', 'white'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrameType(f)}
                className={`px-3 py-1 rounded capitalize transition-all ${
                  frameType === f
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#1e2023] text-[#8e9297] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Wall Tone Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-[#8e9297] uppercase tracking-wider text-[11px]">Wall Tone:</span>
            {(['linen', 'charcoal', 'sage'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWallColor(w)}
                className={`px-3 py-1 rounded capitalize transition-all ${
                  wallColor === w
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#1e2023] text-[#8e9297] hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Open Full Specs Action */}
          <button
            onClick={() => {
              onClose();
              onOpenDetails(product);
            }}
            className="px-4 py-2 rounded bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-[#e2e2df]"
          >
            Configure & Buy Print →
          </button>
        </div>
      </div>
    </div>
  );
};

