import React from 'react';

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenu,
  onOpenSearch,
  onNavigate,
  currentPage,
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-4 md:px-8 py-5 flex items-center justify-between pointer-events-none mix-blend-difference text-white">
      {/* Brand Logo */}
      <div className="pointer-events-auto flex items-center">
        <button
          onClick={() => onNavigate('home')}
          className="hover:opacity-75 transition-opacity duration-300 flex items-center group focus:outline-none"
          aria-label="Preymaker Logo"
        >
          {/* Official Preymaker Wordmark */}
          <img
            src="/icons/preymaker-logo.svg"
            alt="Preymaker"
            className="h-4 md:h-5 w-auto invert filter brightness-200"
          />
        </button>
      </div>

      {/* Nav Actions */}
      <div className="pointer-events-auto flex items-center space-x-6 md:space-x-8">
        <button
          onClick={onOpenMenu}
          className="heading-xxs uppercase tracking-widest hover:opacity-60 transition-opacity focus:outline-none"
          aria-label="Open menu"
        >
          menu
        </button>
        <button
          onClick={onOpenSearch}
          className="heading-xxs uppercase tracking-widest hover:opacity-60 transition-opacity focus:outline-none"
          aria-label="Open search"
        >
          search
        </button>
      </div>
    </nav>
  );
};

