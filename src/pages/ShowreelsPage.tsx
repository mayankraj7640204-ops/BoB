import React, { useState } from 'react';
import { Showreel } from '../types';

interface ShowreelsPageProps {
  showreels: Showreel[];
}

export const ShowreelsPage: React.FC<ShowreelsPageProps> = ({ showreels }) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const activeReel = showreels[activeReelIndex] || showreels[0];

  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#1f2428] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-2">
              Portfolio
            </span>
            <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white">
              Showreels
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#859099] uppercase font-mono">
            {activeReel.title} · {activeReel.category}
          </p>
        </div>

        {/* Video Player Display */}
        <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-[#0a0d0e] border border-[#1f2428] shadow-2xl mb-12">
          <video
            key={activeReel.id}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={activeReel.video} type="video/mp4" />
          </video>
        </div>

        {/* Reel Selector Tabs */}
        <div className="border-t border-[#1f2428] pt-8">
          <p className="heading-xxs text-[#859099] uppercase tracking-widest mb-6">
            Select Category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {showreels.map((reel, idx) => (
              <button
                key={reel.id}
                onClick={() => setActiveReelIndex(idx)}
                className={`p-4 text-left border rounded-sm transition-all duration-300 flex flex-col justify-between h-28 ${
                  activeReelIndex === idx
                    ? 'border-white bg-[#161a1d] text-white'
                    : 'border-[#1f2428] bg-[#0a0d0e] text-[#859099] hover:border-white/40 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  0{idx + 1}
                </span>
                <div>
                  <p className="text-xs text-[#859099] uppercase tracking-wider mb-0.5">
                    {reel.category}
                  </p>
                  <p className="text-sm font-semibold tracking-tight text-white line-clamp-1">
                    {reel.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

