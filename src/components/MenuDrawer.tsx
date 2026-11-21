import React, { useEffect } from 'react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
  currentPage: string;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSearch,
  currentPage,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const pages = [
    { label: 'Work', id: 'work' },
    { label: 'Case Studies', id: 'case-study' },
    { label: 'Showreels', id: 'showreels' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: 'Technology', id: 'technology' },
    { label: 'Contact', id: 'contact' },
  ];

  const explore = [
    { label: 'News', id: 'news' },
    { label: 'Partners', id: 'partners' },
  ];

  const socials = [
    { label: 'Instagram', url: 'https://www.instagram.com/preymaker/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/preymaker/' },
    { label: 'YouTube', url: 'https://www.youtube.com/@preymaker9411' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#050607]/95 backdrop-blur-xl text-[#f1f3f5] overflow-y-auto transition-all duration-500 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
    >
      {/* Top Bar */}
      <div className="w-full px-4 md:px-8 py-5 flex items-center justify-between border-b border-[#1f2428]/60">
        <button
          onClick={() => handleLinkClick('home')}
          className="hover:opacity-75 transition-opacity focus:outline-none"
        >
          <img
            src="/icons/preymaker-logo.svg"
            alt="Preymaker"
            className="h-4 md:h-5 w-auto invert filter brightness-200"
          />
        </button>

        <div className="flex items-center space-x-6 md:space-x-8">
          <button
            onClick={onClose}
            className="heading-xxs uppercase tracking-widest hover:opacity-60 transition-opacity focus:outline-none"
            aria-label="Close menu"
          >
            close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="heading-xxs uppercase tracking-widest hover:opacity-60 transition-opacity focus:outline-none"
            aria-label="Search"
          >
            search
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
        {/* Left: Primary Pages (7 cols) */}
        <div className="md:col-span-7 flex flex-col">
          <div className="flex items-center space-x-4 mb-6 md:mb-8 pb-3 border-b border-[#1f2428]">
            <span className="text-xs uppercase tracking-widest text-[#859099] font-medium">Pages</span>
          </div>

          <ul className="space-y-3 md:space-y-4">
            {pages.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleLinkClick(item.id)}
                  className={`text-2xl md:text-5xl font-semibold tracking-tight text-left block w-full transition-all duration-300 hover:translate-x-3 ${
                    currentPage === item.id
                      ? 'text-white'
                      : 'text-[#859099] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Explore & Socials (5 cols) */}
        <div className="md:col-span-5 flex flex-col space-y-10 md:space-y-14 md:pl-8 md:border-l md:border-[#1f2428]">
          {/* Explore */}
          <div>
            <div className="flex items-center space-x-4 mb-5 pb-3 border-b border-[#1f2428]">
              <span className="text-xs uppercase tracking-widest text-[#859099] font-medium">Explore</span>
            </div>
            <ul className="space-y-3">
              {explore.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleLinkClick(item.id)}
                    className="text-xl md:text-2xl font-medium tracking-tight text-[#859099] hover:text-white transition-colors duration-200 block text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div className="flex items-center space-x-4 mb-5 pb-3 border-b border-[#1f2428]">
              <span className="text-xs uppercase tracking-widest text-[#859099] font-medium">Socials</span>
            </div>
            <ul className="space-y-3">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg text-[#859099] hover:text-white transition-colors duration-200 block"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Quick Contact */}
          <div className="pt-4 border-t border-[#1f2428]">
            <p className="text-xs text-[#859099] uppercase tracking-wider mb-2">Global Studios</p>
            <p className="text-sm text-[#f1f3f5] font-medium">New York · Los Angeles · Cape Town</p>
            <a
              href="mailto:hello@preymaker.com"
              className="inline-block mt-3 text-sm text-[#859099] hover:text-white transition-colors underline underline-offset-4"
            >
              hello@preymaker.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

