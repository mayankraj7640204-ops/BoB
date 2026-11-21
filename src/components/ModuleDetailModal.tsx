import React from 'react';
import { BobLabModule } from '../types';

interface ModuleDetailModalProps {
  module: BobLabModule | null;
  onClose: () => void;
  onLaunchInDashboard: (slug: string) => void;
  isDarkMode: boolean;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  onClose,
  onLaunchInDashboard,
  isDarkMode,
}) => {
  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-500 font-semibold block">
              {module.category}
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-sans mt-0.5">{module.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Visual Image */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md max-h-[420px] flex items-center justify-center bg-slate-950">
            <img
              src={module.image}
              alt={module.title}
              className="w-full h-auto max-h-[420px] object-contain"
            />
          </div>

          {/* Description & Overview */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 font-mono mb-1.5">
              Overview & Functional Role
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
              {module.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 font-mono mb-2">
              Technical Specifications & Telemetry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              {Object.entries(module.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <span className="text-[10px] text-slate-400 uppercase block truncate">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-bold text-sm text-indigo-500 block truncate mt-0.5">
                    {Array.isArray(val) ? val.length : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {module.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close Inspector
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchInDashboard(module.slug);
            }}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-semibold shadow-sm flex items-center space-x-2"
          >
            <span>Launch Live Dashboard Module →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

