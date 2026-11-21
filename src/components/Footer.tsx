import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenHelp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenHelp }) => {
  return (
    <footer className="w-full bg-[#0a0a0b] text-[#8e9297] border-t border-[#1e2023] pt-16 pb-12 px-4 md:px-8 font-sans-ui text-xs">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1c1e21]">
        {/* Brand & Artist Manifesto (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <img
              src="/images/bob-labs/bob-mascot.jpg"
              alt="BOB Labs"
              className="h-6 w-6 rounded-full object-cover ring-1 ring-indigo-500"
            />
            <span className="font-kalice text-lg font-bold">BOB Labs</span>
          </div>

          <p className="text-sm text-[#b0b3b8] leading-relaxed max-w-sm">
            BOB Labs is an autonomous IoT testing ground, digital-twin simulator, and hardware chaos laboratory engineered for extreme fleet resilience.
          </p>

          <p className="text-[11px] text-[#6b7076]">
            Forged at BITS2WAVE Hackathon 2024 by Team AURA 999+ (IEEE BMSIT Student Branch Chapter).
          </p>
        </div>

        {/* Quick Links (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <p className="text-xs uppercase tracking-wider text-white font-semibold">Explore</p>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('shop')}
                className="hover:text-white transition-colors"
              >
                All Prints Archive
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('collections')}
                className="hover:text-white transition-colors"
              >
                Collections Index
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('info')}
                className="hover:text-white transition-colors"
              >
                About Mayowa Alabi
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('auctions')}
                className="hover:text-white transition-colors"
              >
                Auctions & 1-of-1s
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Contact (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-white font-semibold">Studio & Support</p>
          <p className="text-xs text-[#b0b3b8]">
            For order inquiries, delivery updates, framing advice, or artist collaborations:
          </p>
          <div className="space-y-1">
            <a
              href="mailto:support@boblabs.io"
              className="text-white hover:text-indigo-400 block font-medium transition-colors"
            >
              support@boblabs.io
            </a>
            <a
              href="mailto:contact@boblabs.io"
              className="text-[#8e9297] hover:text-white block transition-colors"
            >
              Lab Inquiries: contact@boblabs.io
            </a>
          </div>

          <button
            onClick={onOpenHelp}
            className="mt-3 px-3.5 py-1.5 rounded bg-[#181a1d] hover:bg-[#22252a] text-white text-xs border border-[#2b2e34] transition-colors"
          >
            Help & Documentation →
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6b7076] gap-4">
        <p>© 2026 BOB Labs. All rights reserved. BITS2WAVE Hackathon 2024 • Team AURA 999+.</p>
        <div className="flex space-x-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Shipping & Customs</span>
        </div>
      </div>
    </footer>
  );
};
