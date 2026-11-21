import React from 'react';
import { Partner } from '../types';

interface PartnersPageProps {
  partners: Partner[];
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ partners }) => {
  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Brands · Partners
          </span>
          <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white max-w-4xl">
            At Preymaker, technology powers everything we do. As a fully cloud-native studio, we fuse innovation with artistry to craft boundary-pushing work across film, interactive, and immersive media.
          </h1>
        </div>

        {/* Partners Grid */}
        <div className="mb-24">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#1f2428]">
            <h2 className="heading-xxs text-[#859099] uppercase tracking-widest">
              Brand Collaborations ({partners.length})
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group flex flex-col items-center justify-center p-6 border border-[#1f2428] hover:border-white/60 transition-all duration-300 rounded-sm bg-[#0a0d0e] hover:bg-[#12161a]"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 md:h-12 w-auto object-contain filter invert opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <p className="mt-3 text-[11px] uppercase tracking-wider text-[#859099] group-hover:text-white transition-colors text-center">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Join The Team Block */}
        <div className="border border-[#1f2428] p-8 md:p-14 bg-[#080a0c] rounded-sm">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Careers & Team
          </span>
          <h3 className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-6">
            Join The Collective
          </h3>
          <p className="text-sm md:text-base text-[#859099] max-w-2xl mb-8 leading-relaxed">
            We are always looking for exceptional artists, technical directors, pipeline engineers, animators, and colorists who thrive in a future-facing, cloud-first environment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#1f2428]">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#859099] mb-1">General Enquiries</p>
              <a
                href="mailto:hello@preymaker.com"
                className="text-lg md:text-xl font-semibold text-white hover:underline underline-offset-4"
              >
                hello@preymaker.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#859099] mb-1">Career Submissions</p>
              <a
                href="mailto:joinus@preymaker.com"
                className="text-lg md:text-xl font-semibold text-white hover:underline underline-offset-4"
              >
                joinus@preymaker.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

