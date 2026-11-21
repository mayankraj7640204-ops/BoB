import React, { useState } from 'react';
import { Capability } from '../types';

interface CapabilitiesPageProps {
  capabilities: Capability[];
}

export const CapabilitiesPage: React.FC<CapabilitiesPageProps> = ({ capabilities }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Services · Capabilities
          </span>
          <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white max-w-4xl">
            We blend artistry with cutting-edge technology to bring imaginative concepts to life through innovative visual effects, immersive experiences, and a commitment to design excellence.
          </h1>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.id}
              className="p-8 border border-[#1f2428] rounded-sm bg-[#0a0d0e] flex flex-col justify-between space-y-6 hover:border-white/50 transition-colors group"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#859099] block mb-4">
                  0{idx + 1}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 group-hover:translate-x-1 transition-transform">
                  {cap.title}
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#c0c6ca] font-medium mb-6">
                  {cap.subtitle}
                </p>
                <p className="text-sm md:text-base text-[#859099] leading-relaxed">
                  {cap.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#1f2428] flex items-center justify-between text-xs uppercase tracking-widest text-[#859099] group-hover:text-white transition-colors">
                <span>Inquire Capability</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

