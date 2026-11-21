import React, { useState } from 'react';
import bobDataRaw from './data/bobLabsData.json';
import { BobLabsData, BobLabModule } from './types';

// Components
import { Header } from './components/Header';
import { Rotunda3DWalkthrough } from './components/Rotunda3DWalkthrough';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { BobLabsDashboard } from './pages/BobLabsDashboard';
import { CustomCursor } from './components/CustomCursor';

const bobData = bobDataRaw as unknown as BobLabsData;

export function App() {
  const [viewMode, setViewMode] = useState<'gallery' | 'dashboard'>('gallery');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<BobLabModule | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Navigating tabs to their dedicated feature page
  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    if (viewMode !== 'dashboard') {
      setViewMode('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switching between 3D Lab Tour and Dashboard
  const handleToggleViewMode = (mode: 'gallery' | 'dashboard') => {
    if (mode === viewMode) return;
    setViewMode(mode);
    if (mode === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Launching a module from 3D Rotunda
  const handleLaunchModule = (slug: string) => {
    let target = 'overview';

    if (slug === 'simulation-control' || slug === 'simulation') {
      target = 'simulation';
    } else if (
      slug === 'device-monitoring' ||
      slug === 'device-fleet-alt' ||
      slug === 'fleet' ||
      slug === 'arduino-controller' ||
      slug === 'temp-humidity-sensor'
    ) {
      target = 'fleet';
    } else if (
      slug === 'live-telemetry' ||
      slug === 'telemetry' ||
      slug === 'analytics-console' ||
      slug === 'smart-city-traffic' ||
      slug === 'predictive-maintenance' ||
      slug === 'healthcare-monitoring' ||
      slug === 'smart-building-console' ||
      slug === 'asset-tracking' ||
      slug === 'industrial-iiot-factory'
    ) {
      target = 'telemetry';
    } else if (
      slug === 'failure-testing' ||
      slug === 'failure' ||
      slug === 'fire-hacker-mascot'
    ) {
      target = 'failure';
    } else if (
      slug === 'external-integration' ||
      slug === 'integration' ||
      slug === 'smart-agriculture-node' ||
      slug === 'smart-city' ||
      slug === 'iiot'
    ) {
      target = 'integration';
    } else if (slug === 'about' || slug === 'manifesto') {
      target = 'about';
    }

    setCurrentTab(target);
    if (viewMode !== 'dashboard') {
      setViewMode('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`relative min-h-screen font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200 ${
        isDarkMode ? 'bg-[#080b12] text-[#f8fafc]' : 'bg-[#f4f7fb] text-[#0f172a]'
      }`}
    >
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigateTab}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSearch={() => handleNavigateTab('fleet')}
        isSimulating={isSimulating}
      />

      {/* Main Content Area */}
      <main id="main" className="w-full">
        {/* View 1: 3D Rotunda Lab Walkthrough with BOB Labs IoT Wall Pictures */}
        {viewMode === 'gallery' && (
          <Rotunda3DWalkthrough
            onSelectModule={setSelectedModule}
            onLaunchModule={handleLaunchModule}
            isDarkMode={isDarkMode}
          />
        )}

        {/* View 2: Interactive System Dashboard (Continuous Smooth Scroll Page) */}
        {viewMode === 'dashboard' && (
          <BobLabsDashboard
            currentTab={currentTab}
            onNavigateTab={setCurrentTab}
            isDarkMode={isDarkMode}
            onOpenRotunda={() => handleToggleViewMode('gallery')}
          />
        )}
      </main>

      {/* Module Detail Inspector Modal (Opened from 3D Rotunda) */}
      <ModuleDetailModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onLaunchInDashboard={handleLaunchModule}
        isDarkMode={isDarkMode}
      />

      {/* Modern Studio Footer */}
      {viewMode === 'dashboard' && (
        <footer
          className={`border-t py-8 px-6 text-xs font-mono transition-colors ${
            isDarkMode
              ? 'bg-[#090d16] border-white/10 text-slate-400'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/bob-labs/bob-mascot.jpg"
                alt="BOB Labs"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                BOB Labs IoT Virtual Testing Laboratory
              </span>
              <span className="text-slate-500">• BITS2WAVE Hackathon 2026 • Team AURA 999+</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigateTab('about')}
                className="hover:text-indigo-500 transition-colors"
              >
                About
              </button>
              <span>•</span>
              <button
                onClick={() => handleToggleViewMode('gallery')}
                className="hover:text-indigo-500 transition-colors"
              >
                3D Lab Tour
              </button>
              <span>•</span>
              <button
                onClick={() => handleNavigateTab('failure')}
                className="hover:text-indigo-500 transition-colors"
              >
                Failure Testing
              </button>
              <span>•</span>
              <span>MQTT Broker: 127.0.0.1:1883</span>
            </div>
          </div>
        </footer>
      )}

      {/* Cyera / Active Theory Fluid Smooth Cursor */}
      <CustomCursor isDarkMode={isDarkMode} />
    </div>
  );
}
export default App;
