import React from 'react';
import { TechPillar } from '../types';

interface TechnologyPageProps {
  technology: TechPillar[];
}

export const TechnologyPage: React.FC<TechnologyPageProps> = ({ technology }) => {
  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Approach · Technology
          </span>
          <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white max-w-4xl">
            100% Cloud-Native Creative Engineering
          </h1>
          <p className="mt-4 text-base md:text-xl text-[#859099] max-w-3xl leading-relaxed">
            Preymaker is built from the ground up entirely in the cloud. We liberate artists from physical machine constraints, enabling instantaneous cross-continent collaboration, unbounded compute power, and unmatched turnaround speeds.
          </p>
        </div>

        {/* Cloud Architecture Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 p-8 border border-[#1f2428] rounded-sm bg-[#080a0c]">
          <div>
            <p className="heading-xxs uppercase tracking-wider text-[#859099] mb-2">Global Network</p>
            <p className="text-2xl font-bold text-white">NYC · LA · London · Cape Town</p>
            <p className="text-xs text-[#859099] mt-2">Zero-latency distributed artist workstations powered by enterprise AWS.</p>
          </div>
          <div>
            <p className="heading-xxs uppercase tracking-wider text-[#859099] mb-2">Data Throughput</p>
            <p className="text-2xl font-bold text-white">WEKA NeuralMesh</p>
            <p className="text-xs text-[#859099] mt-2">Extreme performance parallel file system streaming petabytes of uncompressed 4K/8K EXR frames.</p>
          </div>
          <div>
            <p className="heading-xxs uppercase tracking-wider text-[#859099] mb-2">Compute Power</p>
            <p className="text-2xl font-bold text-white">Dynamic Scale</p>
            <p className="text-xs text-[#859099] mt-2">Instantaneous GPU cluster spin-up on demand for heavy fluid, pyro, and crowd simulations.</p>
          </div>
        </div>

        {/* 7 Technology Pillars */}
        <div className="space-y-6">
          <h2 className="heading-xxs text-[#859099] uppercase tracking-widest mb-6">
            Core Technology Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technology.map((pillar) => (
              <div
                key={pillar.number}
                className="p-8 border border-[#1f2428] rounded-sm bg-[#0a0d0e] hover:border-white/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#859099] block mb-3">
                    {pillar.number}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#859099] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1f2428] flex items-center justify-between text-xs text-[#859099] uppercase font-mono">
                  <span>Pillar {pillar.number}</span>
                  <span>Active Architecture</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

