import React from 'react';

interface HeaderProps {
  onNavigate: (tab: string) => void;
  currentTab: string;
  viewMode: 'gallery' | 'dashboard';
  onToggleViewMode: (mode: 'gallery' | 'dashboard') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentTab,
  viewMode,
  onToggleViewMode,
  isDarkMode,
  onToggleDarkMode,
  onOpenSearch,
  isSimulating,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors backdrop-blur-md px-4 md:px-8 py-2.5 ${
        isDarkMode
          ? 'bg-[#06080d]/95 border-white/10 text-[#f8fafc]'
          : 'bg-[#ffffff]/95 border-[#e2e8f0] text-[#0f172a]'
      }`}
    >
      <div className="max-w-[1700px] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              onNavigate('overview');
              onToggleViewMode('gallery');
            }}
            className="flex items-center space-x-3 group focus:outline-none text-left"
            aria-label="BOB Labs Home"
          >
            {/* Mascot Avatar */}
            <div className="relative">
              <img
                src="/images/bob-labs/bob-mascot.jpg"
                alt="BOB Labs Mascot"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50 shadow-sm transition-transform group-hover:scale-105"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0f1422] ${
                  isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight font-sans">BOB Labs</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                  IoT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 uppercase tracking-wider font-mono">
                Virtual Testing Lab
              </p>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-medium font-sans">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'simulation', label: 'Simulation Control' },
              { id: 'fleet', label: 'Device Fleet' },
              { id: 'telemetry', label: 'Live Telemetry' },
              { id: 'failure', label: 'Failure Testing' },
              { id: 'integration', label: 'External App Integration' },
              { id: 'about', label: 'About', highlight: true },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onNavigate(tab.id);
                  onToggleViewMode('dashboard');
                }}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                  currentTab === tab.id && viewMode === 'dashboard'
                    ? isDarkMode
                      ? 'bg-indigo-500/20 text-indigo-400 font-semibold ring-1 ring-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-500/30'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Environment Pills & Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Search Button (⌘K) */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-sans transition-all ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 shadow-2xs'
            }`}
          >
            <span>🔍</span>
            <span className="hidden sm:inline">Search IoT nodes</span>
            <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-1.5 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-amber-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* View Mode Toggle: 3D LAB TOUR | DASHBOARD */}
          <div
            className={`inline-flex p-0.5 rounded-full border shadow-2xs text-[11px] font-mono font-semibold uppercase tracking-wider ${
              isDarkMode ? 'bg-[#161c2d] border-[#1e293b]' : 'bg-[#e2e8f0] border-[#cbd5e1]'
            }`}
          >
            <button
              onClick={() => onToggleViewMode('gallery')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'gallery'
                  ? isDarkMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              3D Lab Tour
            </button>
            <button
              onClick={() => onToggleViewMode('dashboard')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'dashboard'
                  ? isDarkMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
