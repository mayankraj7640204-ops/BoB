import React, { useEffect, useState, useRef } from 'react';

// Web Audio synthesizer for tactile sound
const playCyberSound = (type: 'open' | 'close' | 'pulse' | 'toggle') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'close') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'pulse') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.setValueAtTime(500, now + 0.05);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Autoplay policy fallback
  }
};

interface AboutDossierViewProps {
  isDarkMode: boolean;
  onOpenRotunda: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AboutDossierView: React.FC<AboutDossierViewProps> = ({
  isDarkMode,
  onOpenRotunda,
  onNavigateTab,
}) => {
  // Active modal dialog: 'letter' | 'record' | 'onfile' | null
  const [activeDialog, setActiveDialog] = useState<'letter' | 'record' | 'onfile' | null>(null);

  // Telemetry & interactive toy state
  const [pulseCount, setPulseCount] = useState<number>(142890);
  const [radarFrequency, setRadarFrequency] = useState<number>(440);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Open / Close helper with sound
  const openModal = (dialog: 'letter' | 'record' | 'onfile') => {
    setActiveDialog(dialog);
    playCyberSound('open');
  };

  const closeModal = () => {
    setActiveDialog(null);
    playCyberSound('close');
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDialog) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialog]);

  // Interactive Oscilloscope Radar Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = isDarkMode ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sine wave telemetry line
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const sliceWidth = width / 100;
      let x = 0;
      for (let i = 0; i <= 100; i++) {
        const v = Math.sin(i * 0.15 + phase) * Math.cos(i * 0.05 - phase * 0.5);
        const y = height / 2 + v * (height * 0.32);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanning radar pulse head
      const scanX = (phase * 40) % width;
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      phase += 0.04;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [radarFrequency, isDarkMode]);

  // Color theme classes
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = isDarkMode
    ? 'bg-[#090d16]/90 border-white/10 shadow-xl'
    : 'bg-white/95 border-slate-200/90 shadow-md';
  const innerCardBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200/70';

  return (
    <div className="space-y-10 animate-fadeIn font-sans pb-12">
      {/* =========================================================================
          SECTION 1: CARTER OGUNSOLA TOP TICKET BAR
         ========================================================================= */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors ${cardBg}`}
      >
        <div className="flex items-center space-x-3">
          <span className="font-bold text-indigo-500 uppercase tracking-wider">
            THE FRONT OFFICE ::
          </span>
          <span className={textMuted}>BOB LABS VIRTUAL TESTING DOSSIER</span>
        </div>
        <div className={`flex items-center space-x-4 text-[11px] ${textMuted}`}>
          <span>
            JOB:: <b className={textPrimary}>N°01</b>
          </span>
          <span>•</span>
          <span>
            HACKATHON:: <b className="text-indigo-400">BITS2WAVE</b>
          </span>
          <span>•</span>
          <span>
            SQUAD:: <b className="text-emerald-500">TEAM AURA 999+</b>
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CARTER OGUNSOLA THREE-CARD INTERACTIVE BOARD (ov3__board)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CARD 1: THE HERO CARD (Stamp, Mascot & 3 Interactive Feature Popups) */}
        <div
          data-cursor="inspect"
          className={`cyera-tilt-card lg:col-span-7 p-6 sm:p-8 rounded-2xl border transition-colors flex flex-col justify-between space-y-6 ${cardBg}`}
        >
          <div className="space-y-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[11px] font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>BITS2WAVE HACKATHON 2024</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-mono uppercase tracking-wider">
                TEAM AURA 999+
              </span>
              <span className={`px-2.5 py-1 rounded ${innerCardBg} text-[11px] font-mono ${textMuted}`}>
                STATUS: VERIFIED
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-kalice font-normal tracking-tight ${textPrimary}`}
            >
              Autonomous IoT Testing & Chaos Laboratory.
            </h1>

            {/* Bio quote */}
            <p className={`text-base sm:text-lg font-light leading-relaxed max-w-xl ${textSecondary}`}>
              &ldquo;You pulled our file. BOB Labs was engineered to bridge the gap between firmware
              design and unpredictable physical reality—emulating 22 distributed device nodes under
              extreme real-time chaos.&rdquo;
            </p>
          </div>

          {/* Interactive Feature Buttons (The exact 3 buttons from Carter Ogunsola's site!) */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">
              CLICK TO POP UP DOSSIER FILES (CARTER OGUNSOLA MODALS):
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Feature 1: The Letter */}
              <button
                onClick={() => openModal('letter')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium tracking-tight shadow-md transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                title="Open The Letter / Manifesto Modal"
              >
                <span>📜 The Letter :: Manifesto</span>
                <span className="text-indigo-200">↗</span>
              </button>

              {/* Feature 2: The Record */}
              <button
                onClick={() => openModal('record')}
                className={`px-4 py-2 rounded-xl border text-xs font-mono font-medium tracking-tight transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
                title="Open The Record / Milestones Modal"
              >
                <span>💼 The Record :: Milestones</span>
                <span className="text-slate-400">↗</span>
              </button>

              {/* Feature 3: On File */}
              <button
                onClick={() => openModal('onfile')}
                className={`px-4 py-2 rounded-xl border text-xs font-mono font-medium tracking-tight transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
                title="Open On File / Architecture Specs Modal"
              >
                <span>🏆 On File :: Architecture Specs</span>
                <span className="text-slate-400">↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: THE TELEMETRY HUD & ACOUSTIC LAB TOY CARD */}
        <div
          data-cursor="inspect"
          className={`cyera-tilt-card lg:col-span-5 p-6 sm:p-8 rounded-2xl border transition-colors flex flex-col justify-between space-y-6 ${cardBg}`}
        >
          {/* Top: Coordinates Vector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                // TELEMETRY VECTOR
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ONLINE
              </span>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${innerCardBg}`}>
              <div className="flex items-center justify-between">
                <span className={textMuted}>ORIGIN::</span>
                <span className={`font-medium ${textPrimary}`}>BITS PILANI & BMSIT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={textMuted}>BROKER::</span>
                <span className="text-indigo-400 font-semibold">MQTT://127.0.0.1:1883</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={textMuted}>DELIVERED::</span>
                <span className={`font-semibold ${textPrimary}`}>
                  {pulseCount.toLocaleString()} MSGS
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Acoustic Oscilloscope Radar Toy */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                // ACOUSTIC RADAR TOY
              </div>
              <span className={`text-[10px] font-mono ${textMuted}`}>{radarFrequency} Hz</span>
            </div>

            <div className="relative w-full h-28 rounded-xl overflow-hidden bg-black/80 border border-indigo-500/20 flex items-center justify-center">
              <canvas ref={canvasRef} width={400} height={112} className="w-full h-full block" />
            </div>

            <input
              type="range"
              min={120}
              max={1200}
              step={20}
              value={radarFrequency}
              onChange={(e) => setRadarFrequency(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <button
              onClick={() => {
                playCyberSound('pulse');
                setPulseCount((c) => c + 1);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-md"
            >
              <span>⚡ TRIGGER ACOUSTIC RADAR PULSE</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: QUICK LAUNCH BUTTONS
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10 text-xs font-mono">
        <div className={textMuted}>BOB LABS IoT • BITS2WAVE HACKATHON 2024</div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenRotunda}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all active:scale-95 shadow-sm"
          >
            🏛️ Enter 3D Rotunda
          </button>
          <button
            onClick={() => onNavigateTab('failure')}
            className={`px-4 py-2 rounded-lg border font-medium transition-all active:scale-95 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            ⚡ Open Chaos Lab
          </button>
        </div>
      </div>

      {/* =========================================================================
          CARTER OGUNSOLA POPUP DIALOGS (<dialog class="ov3__dialog">)
         ========================================================================= */}
      {activeDialog && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 select-none">
          {/* Backdrop Scrim */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          />

          {/* Modal Container */}
          <div
            className={`relative z-10 w-full max-w-2xl max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-scaleUp ${
              isDarkMode
                ? 'bg-[#090d16] border-white/15 text-[#f8fafc]'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Modal Top Bar */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-indigo-400 font-semibold tracking-wider">
                {activeDialog === 'letter' && 'THE LETTER ::'}
                {activeDialog === 'record' && 'THE RECORD ::'}
                {activeDialog === 'onfile' && 'ON FILE ::'}
              </span>

              {/* Close Button Pill */}
              <button
                onClick={closeModal}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-all active:scale-95 ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                <span>✕</span>
                <span>CLOSE</span>
                <kbd className="text-[10px] opacity-60">ESC</kbd>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* DIALOG 1: THE LETTER (MANIFESTO & ORIGINS) */}
              {activeDialog === 'letter' && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className={`text-2xl sm:text-3xl font-kalice font-normal tracking-tight ${textPrimary}`}
                    >
                      Hey, you pulled our file.
                    </h2>
                    <p className={`text-xs font-mono mt-1 ${textMuted}`}>
                      /var/log/bob_manifesto.ts • ENCODING: UTF-8
                    </p>
                  </div>

                  <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${textSecondary}`}>
                    <p>
                      Hardware at scale is unruly. Sensors freeze in blizzards, network gateways
                      drop packets in high-interference factories, and power ripples cause
                      microcontrollers to brownout without warning.
                    </p>
                    <p className="font-mono text-indigo-400 text-xs sm:text-sm p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      &gt;&gt; BOB Labs was built to eliminate &ldquo;works on my desk&rdquo;
                      syndrome. Before deploying code to physical IoT devices, our digital twin
                      engine puts firmware through deterministic chaos.
                    </p>
                    <p>
                      Forged at the <b>BITS2WAVE National IoT Hackathon 2024</b> by <b>Team AURA 999+</b>{' '}
                      (IEEE BMSIT Student Branch Chapter), BOB Labs proves that distributed hardware
                      resilience can be verified in software before the first silicon chip is soldered.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>BUILD: RELEASE_V2.4</span>
                    <span className="text-emerald-400 font-semibold">● CHAMPIONSHIP VERIFIED</span>
                  </div>
                </div>
              )}

              {/* DIALOG 2: THE RECORD (WHERE WE'VE WORKED & MILESTONES) */}
              {activeDialog === 'record' && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className={`text-2xl sm:text-3xl font-kalice font-normal tracking-tight ${textPrimary}`}
                    >
                      Where the work has been.
                    </h2>
                    <p className={`text-xs font-mono mt-1 ${textMuted}`}>
                      TRACK RECORD: 2024–PRESENT • STRUCTURED DATA RECORD
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400">
                          <th className="pb-3 pr-4 font-medium">YEAR</th>
                          <th className="pb-3 pr-4 font-medium">INITIATIVE</th>
                          <th className="pb-3 pr-4 font-medium">ROLE</th>
                          <th className="pb-3 font-medium">OUTCOME</th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y divide-slate-200 dark:divide-white/5 ${textSecondary}`}
                      >
                        <tr className="hover:bg-indigo-500/5 transition-colors">
                          <td className="py-3.5 pr-4 text-indigo-400 font-semibold">2024</td>
                          <td className={`py-3.5 pr-4 font-medium ${textPrimary}`}>
                            BITS2WAVE Hackathon
                          </td>
                          <td className="py-3.5 pr-4 text-slate-400">Team AURA 999+</td>
                          <td className="py-3.5 text-emerald-500 font-semibold">Championship</td>
                        </tr>
                        <tr className="hover:bg-indigo-500/5 transition-colors">
                          <td className="py-3.5 pr-4 text-indigo-400 font-semibold">2024</td>
                          <td className={`py-3.5 pr-4 font-medium ${textPrimary}`}>
                            360° Rotunda 3D Experience
                          </td>
                          <td className="py-3.5 pr-4 text-slate-400">Three.js Cylindrical Walkthrough</td>
                          <td className="py-3.5 text-indigo-400">22 Mounted Exhibits</td>
                        </tr>
                        <tr className="hover:bg-indigo-500/5 transition-colors">
                          <td className="py-3.5 pr-4 text-indigo-400 font-semibold">2024</td>
                          <td className={`py-3.5 pr-4 font-medium ${textPrimary}`}>
                            Chaos Emulation Suite
                          </td>
                          <td className="py-3.5 pr-4 text-slate-400">Fault Injection & Self-Healing</td>
                          <td className="py-3.5 text-emerald-500">99.98% Resilience</td>
                        </tr>
                        <tr className="hover:bg-indigo-500/5 transition-colors">
                          <td className="py-3.5 pr-4 text-indigo-400 font-semibold">2024</td>
                          <td className={`py-3.5 pr-4 font-medium ${textPrimary}`}>
                            Carter Ogunsola Developer HUD
                          </td>
                          <td className="py-3.5 pr-4 text-slate-400">Fluid Veil Rollout & Popups</td>
                          <td className="py-3.5 text-indigo-400">Full Suite Transition</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DIALOG 3: ON FILE (ARCHITECTURE SPECIFICATIONS) */}
              {activeDialog === 'onfile' && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className={`text-2xl sm:text-3xl font-kalice font-normal tracking-tight ${textPrimary}`}
                    >
                      What the engine runs.
                    </h2>
                    <p className={`text-xs font-mono mt-1 ${textMuted}`}>
                      ENGINEERING ARCHITECTURE & BENCHMARK VALIDATION
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'WebGL Rotunda Walkthrough',
                        desc: 'Three.js cylindrical projection, custom camera lerping, and dynamic canvas rendering for 22 IoT exhibits.',
                        tag: 'THREE.JS / PBR',
                      },
                      {
                        title: 'Chaos Emulation Suite',
                        desc: 'Fault injector simulating device dropouts, thermal runaways, packet loss cadence, and delay queues.',
                        tag: 'CHAOS INJECTION',
                      },
                      {
                        title: 'Full-Duplex MQTT Stream',
                        desc: 'Simulated MQTT broker running over port 1883 with auto-reconnect, JSON schema, and sub-millisecond dispatch.',
                        tag: 'MQTT 1883',
                      },
                      {
                        title: 'Carter Ogunsola HUD',
                        desc: 'Telemetry command center tracking CPU heap, FPS, sensor variance, and fluid veil page transitions.',
                        tag: 'CARTER HUD',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border space-y-2 ${innerCardBg}`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-indigo-400 font-semibold">0{idx + 1} //</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                            {item.tag}
                          </span>
                        </div>
                        <h4 className={`text-sm font-semibold ${textPrimary}`}>{item.title}</h4>
                        <p className={`text-xs leading-relaxed ${textMuted}`}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end font-mono text-xs">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all active:scale-95"
              >
                DISMISS [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
