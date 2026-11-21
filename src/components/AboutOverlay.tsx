import React, { useEffect, useState, useRef } from 'react';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onLaunchRotunda: () => void;
  onLaunchDashboard: () => void;
}

// Subtle Web Audio synthesizer for tactile high-tech feedback
const playCyberFeedback = (type: 'open' | 'close' | 'pulse' | 'toggle') => {
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
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.3);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'close') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'pulse') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(480, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Silently ignore if audio autoplay is restricted
  }
};

export const AboutOverlay: React.FC<AboutOverlayProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onLaunchRotunda,
  onLaunchDashboard,
}) => {
  // Animation state machine: 'closed' | 'opening' | 'open' | 'closing'
  const [animState, setAnimState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [systemTime, setSystemTime] = useState<string>('');
  const [fps, setFps] = useState<number>(60.0);
  const [pulseCount, setPulseCount] = useState<number>(142890);
  const [radarFrequency, setRadarFrequency] = useState<number>(440);
  const [activeTab, setActiveTab] = useState<'manifesto' | 'engine' | 'record'>('manifesto');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle open / close lifecycle transitions
  useEffect(() => {
    if (isOpen) {
      setAnimState('opening');
      playCyberFeedback('open');
      const timer = setTimeout(() => {
        setAnimState('open');
      }, 500);
      return () => clearTimeout(timer);
    } else if (animState === 'open' || animState === 'opening') {
      setAnimState('closing');
      playCyberFeedback('close');
      const timer = setTimeout(() => {
        setAnimState('closed');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (animState === 'open' || animState === 'opening')) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animState, onClose]);

  // Live millisecond system clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n: number, z = 2) => ('00' + n).slice(-z);
      const hours = pad(now.getHours());
      const mins = pad(now.getMinutes());
      const secs = pad(now.getSeconds());
      const ms = pad(now.getMilliseconds(), 3);
      setSystemTime(`${hours}:${mins}:${secs}.${ms}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 37);
    return () => clearInterval(interval);
  }, []);

  // Live FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime) * 10) / 10);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

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
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
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
        const v = Math.sin((i * 0.15) + phase) * Math.cos((i * 0.05) - phase * 0.5);
        const y = (height / 2) + v * (height * 0.32);
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
      const scanX = ((phase * 40) % width);
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
  }, [radarFrequency]);

  if (animState === 'closed') return null;

  const isTransitioning = animState === 'opening' || animState === 'closing';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex flex-col pointer-events-auto"
      style={{
        perspective: '1200px',
      }}
    >
      {/* Dynamic Ambient Blur Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-out ${
          animState === 'open' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Primary Rollout Curtain Layer 1: Indigo Wave Lead Sheet */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform:
            animState === 'open'
              ? 'translateY(0%)'
              : animState === 'opening'
              ? 'translateY(0%)'
              : 'translateY(100%)',
          transition: 'transform 600ms cubic-bezier(0.76, 0, 0.24, 1)',
          background: 'linear-gradient(180deg, #4f46e5 0%, #312e81 100%)',
          opacity: isTransitioning ? 0.35 : 0,
        }}
      />

      {/* Primary Rollout Sheet Layer 2: Main Obsidian Carter Ogunsola Dossier */}
      <div
        className="relative w-full h-full flex flex-col overflow-y-auto bg-[#06080d] text-[#f8fafc] shadow-2xl selection:bg-indigo-500 selection:text-white"
        style={{
          transform:
            animState === 'open'
              ? 'translateY(0%)'
              : 'translateY(100%)',
          transition: 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 70%), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      >
        {/* Rollout Curved Lip Indicator (SVG Bezier Arch) */}
        <div
          className={`absolute top-0 left-0 right-0 h-4 overflow-hidden pointer-events-none transition-opacity duration-300 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg
            className="w-full h-full text-indigo-500"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path d="M0,10 Q50,0 100,10 L100,0 L0,0 Z" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        {/* TOP HUD TELEMETRY BAR (Carter Ogunsola Signature Top Ribbon) */}
        <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#06080d]/90 backdrop-blur-md px-6 py-3 flex items-center justify-between text-xs font-mono">
          {/* Left: System Identifier & Coordinates */}
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-2 text-indigo-400 font-semibold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>FILE :: BOB_LABS_DOSSIER.MD</span>
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline">
              SYS_ID: <span className="text-white">B2W-AURA-999+</span>
            </span>
            <span className="hidden lg:inline text-white/20">|</span>
            <span className="hidden lg:inline">
              COORD: <span className="text-slate-300">12.9716° N, 77.5946° E [BLR]</span>
            </span>
          </div>

          {/* Right: Live Telemetry Metrics & Tactical Close Pill */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 text-[11px] text-slate-400">
              <span>
                SYS_TIME: <span className="text-white font-mono">{systemTime || '12:00:00.000'}</span>
              </span>
              <span className="text-white/20">/</span>
              <span>
                FPS: <span className="text-emerald-400">{fps.toFixed(1)}</span>
              </span>
              <span className="text-white/20">/</span>
              <span>
                BROKER: <span className="text-indigo-400">127.0.0.1:1883</span>
              </span>
            </div>

            {/* Tactical Close Button (Pill matching user's reference) */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1f2638] text-white text-xs font-mono font-medium tracking-tight border border-white/15 hover:border-indigo-500/50 shadow-sm transition-all flex items-center space-x-2 group active:scale-95"
              title="Close Dossier (Esc)"
            >
              <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">✕</span>
              <span>CLOSE</span>
              <kbd className="hidden sm:inline text-[9px] px-1 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                ESC
              </kbd>
            </button>
          </div>
        </header>

        {/* MAIN DOSSIER BODY (Staggered Layout) */}
        <div className="max-w-[1240px] w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-16">
          {/* SECTION 1: HERO HEADER & STAMP (Carter Ogunsola Introduction Pattern) */}
          <section className="relative pt-4">
            {/* Background Corner Crosshair Accents */}
            <span className="absolute top-0 left-0 text-white/20 font-mono text-sm select-none">+</span>
            <span className="absolute top-0 right-0 text-white/20 font-mono text-sm select-none">+</span>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
              <div className="space-y-4 max-w-2xl">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span>BITS2WAVE HACKATHON 2024</span>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono uppercase tracking-wider">
                    TEAM AURA 999+
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono">
                    STATUS: OPERATIONAL
                  </span>
                </div>

                {/* Big Display Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight font-kalice text-white">
                  Autonomous IoT Testing & Chaos Laboratory.
                </h1>

                {/* Carter-style Dossier Intro Quote */}
                <p className="text-slate-300 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
                  &ldquo;You pulled our file. BOB Labs was engineered to bridge the gap between firmware
                  design and unpredictable physical reality—emulating 22 distributed device nodes under
                  extreme real-time chaos.&rdquo;
                </p>

                {/* Geolocation & Telemetry Vector Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-400">●</span>
                    <span>ORIGIN: BITS PILANI & BMSIT</span>
                  </div>
                  <span>⇄</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">●</span>
                    <span>MQTT BROKER: 127.0.0.1:1883</span>
                  </div>
                  <span>/</span>
                  <div>
                    DELIVERED: <span className="text-white font-mono">{pulseCount.toLocaleString()} MSGS</span>
                  </div>
                </div>
              </div>

              {/* Right: Mascot Hologram Stamp & Quick Jump Pills */}
              <div className="flex flex-col items-center sm:items-end space-y-4">
                <div className="relative group p-1.5 rounded-2xl bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-transparent border border-white/10 shadow-2xl">
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-[#0c101a] flex items-center justify-center">
                    <img
                      src="/images/bob-labs/bob-mascot.jpg"
                      alt="BOB Labs Mascot"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">
                        SYS_BOT // VER 2.4
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Launch Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchRotunda();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium tracking-tight shadow-md transition-all active:scale-95"
                  >
                    🏛️ 3D Rotunda
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchDashboard();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-medium tracking-tight border border-white/15 transition-all active:scale-95"
                  >
                    📊 Dashboard
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: NAVIGATION SUB-TABS */}
          <div className="flex items-center space-x-2 border-b border-white/10 pb-4 text-xs font-mono">
            {[
              { id: 'manifesto', label: '01 // THE MANIFESTO & ORIGINS' },
              { id: 'engine', label: '02 // ARCHITECTURE & CHAOS ENGINE' },
              { id: 'record', label: '03 // THE RECORD & MILESTONES' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playCyberFeedback('toggle');
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600/25 border border-indigo-500/40 text-indigo-300 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: THE MANIFESTO & PHILOSOPHY */}
          {activeTab === 'manifesto' && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: The Letter / File Writing */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 relative overflow-hidden font-mono text-sm leading-relaxed text-slate-300 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400">
                    <span className="text-indigo-400">FILE :: /var/log/bob_manifesto.ts</span>
                    <span>ENCODING: UTF-8</span>
                  </div>

                  <p className="text-white text-base font-sans font-normal leading-relaxed">
                    Hardware at scale is notoriously unpredictable. Sensors freeze in blizzards,
                    network gateways drop packets in high-interference factories, and power ripples
                    cause microcontrollers to brownout without warning.
                  </p>

                  <p>
                    <span className="text-indigo-400 font-semibold">&gt;&gt;</span> BOB Labs was built
                    to eliminate &ldquo;works on my desk&rdquo; syndrome. Before deploying code to
                    thousands of physical IoT devices across smart agriculture, healthcare telemetry,
                    and industrial automation, our digital twin platform puts firmware through rigorous,
                    deterministic stress tests.
                  </p>

                  <p>
                    From our 22-node virtual fleet to our live chaos injector, we reproduce packet
                    loss, temperature anomalies, and broker partitions in real time—delivering zero-downtime
                    confidence to mission-critical hardware teams.
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>BUILD: RELEASE_V2.4</span>
                    <span className="text-emerald-400">STATUS: VERIFIED BY TEAM AURA 999+</span>
                  </div>
                </div>

                {/* Team Badges & Hackathon Origins */}
                <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 space-y-4">
                  <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-wider">
                    // ORIGIN STORY: BITS2WAVE HACKATHON
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <div className="text-slate-400">CHAMPIONSHIP ARENA</div>
                      <div className="text-white font-medium">BITS2WAVE National IoT Hackathon</div>
                      <div className="text-slate-400 text-[11px]">Theme: Build · Launch · Break · Repeat</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <div className="text-slate-400">FOUNDING SQUAD</div>
                      <div className="text-white font-medium">Team AURA 999+</div>
                      <div className="text-slate-400 text-[11px]">IEEE AP-S / MTT-S / BMSIT Student Branch</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Oscilloscope & Signal Generator (Lab Toy) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-wider">
                        // INTERACTIVE LAB TOY
                      </h3>
                      <p className="text-xs text-slate-400">Live Telemetry Waveform & Acoustic Radar</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      LIVE SIM
                    </span>
                  </div>

                  {/* Oscilloscope Canvas */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={144}
                      className="w-full h-full block"
                    />
                    <div className="absolute bottom-2 right-3 text-[10px] font-mono text-indigo-400/80">
                      FREQ: {radarFrequency} Hz
                    </div>
                  </div>

                  {/* Frequency Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>TELEMETRY OSCILLATION FREQUENCY</span>
                      <span className="text-white">{radarFrequency} Hz</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={1200}
                      step={20}
                      value={radarFrequency}
                      onChange={(e) => {
                        setRadarFrequency(Number(e.target.value));
                      }}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Acoustic Pulse Trigger Button */}
                  <button
                    onClick={() => {
                      playCyberFeedback('pulse');
                      setPulseCount((c) => c + 1);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-300 font-mono text-xs font-semibold tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-98"
                  >
                    <span>⚡ INJECT ACOUSTIC RADAR PULSE</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: ARCHITECTURE & CHAOS ENGINE */}
          {activeTab === 'engine' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    num: '01',
                    title: 'WebGL Rotunda Walkthrough',
                    desc: 'Cylindrical 360° virtual gallery built in Three.js with real-time camera orbits, smooth touch/mouse lerping, and dynamic canvas rendering for 22 interactive exhibits.',
                    tag: 'THREE.JS / PBR',
                  },
                  {
                    num: '02',
                    title: 'Chaos Emulation Suite',
                    desc: 'Targeted fault injector simulating device dropouts, thermal anomalies, packet delays, and burst drops across connected sensor clusters.',
                    tag: 'CHAOS FAULT INJECTION',
                  },
                  {
                    num: '03',
                    title: 'Full-Duplex MQTT Stream',
                    desc: 'Standard MQTT broker interface running over port 1883 with auto-reconnect, JSON payload validation, and sub-millisecond dispatch.',
                    tag: 'MQTT 1883 / WEBSOCKET',
                  },
                  {
                    num: '04',
                    title: 'Diagnostic HUD Telemetry',
                    desc: 'Telemetry command center tracking CPU heap, FPS, sensor variance, resilience index, and real-time failure recovery cascades.',
                    tag: 'CARTER OGUNSOLA HUD',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 hover:border-indigo-500/50 transition-all duration-300 space-y-4 group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-indigo-400 font-semibold">{item.num} //</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px]">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="text-white font-medium text-base font-sans group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>STATUS: ACTIVE</span>
                      <span className="text-emerald-400">● READY</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Architecture Diagram Strip */}
              <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 space-y-3 font-mono text-xs text-slate-400">
                <div className="text-indigo-400 font-semibold uppercase tracking-wider">
                  // FULL-STACK REPOSITORY ARCHITECTURE
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-white font-medium">Front-End Experience</div>
                    <div className="text-slate-400 text-[11px]">React 18 · TypeScript · Tailwind CSS · Three.js</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-white font-medium">Telemetry Protocol</div>
                    <div className="text-slate-400 text-[11px]">MQTT 1883 · WebSocket · REST API · JSON Schema</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-white font-medium">Device Modeling</div>
                    <div className="text-slate-400 text-[11px]">22 Hardware Node Specs · Industrial / Agricultural</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: THE RECORD & MILESTONES (Carter Ogunsola Structured Table Pattern) */}
          {activeTab === 'record' && (
            <section className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-wider">
                    // THE RECORD: RELEASES & MILESTONES
                  </h3>
                  <span className="text-xs font-mono text-slate-400">ON FILE: 2024–PRESENT</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="pb-3 pr-4 font-medium">YEAR</th>
                        <th className="pb-3 pr-4 font-medium">INITIATIVE / PROJECT</th>
                        <th className="pb-3 pr-4 font-medium">ROLE & SCOPE</th>
                        <th className="pb-3 font-medium">RECOGNITION / OUTCOME</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-3.5 pr-4 text-indigo-400">2024</td>
                        <td className="py-3.5 pr-4 text-white font-medium">BITS2WAVE Hackathon</td>
                        <td className="py-3.5 pr-4 text-slate-400">Team AURA 999+ · Core IoT Engine</td>
                        <td className="py-3.5 text-emerald-400">Championship Contender</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 text-indigo-400">2024</td>
                        <td className="py-3.5 pr-4 text-white font-medium">360° Rotunda 3D Experience</td>
                        <td className="py-3.5 pr-4 text-slate-400">Three.js Cylindrical Walkthrough & PBR</td>
                        <td className="py-3.5 text-indigo-300">22 Mounted Lab Exhibits</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 text-indigo-400">2024</td>
                        <td className="py-3.5 pr-4 text-white font-medium">Chaos Emulation Suite</td>
                        <td className="py-3.5 pr-4 text-slate-400">Fault Injection & Self-Healing Testing</td>
                        <td className="py-3.5 text-slate-300">99.98% Resilience Score</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 text-indigo-400">2024</td>
                        <td className="py-3.5 pr-4 text-white font-medium">Carter Ogunsola Developer HUD</td>
                        <td className="py-3.5 pr-4 text-slate-400">Tactile Micro-Grid, Live Metrics & Diagnostics</td>
                        <td className="py-3.5 text-emerald-400">Fluid Bezier Rollout Overlay</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Awards & Badges Strip ("On File") */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0b0e17] border border-white/10 space-y-1">
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">AFFILIATION</span>
                  <div className="text-white font-medium">IEEE AP-S / MTT-S / COMSOC</div>
                  <div className="text-slate-400 text-[11px]">BMSIT Student Branch Chapter</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0b0e17] border border-white/10 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">BENCHMARK</span>
                  <div className="text-white font-medium">Sub-millisecond Local IPC</div>
                  <div className="text-slate-400 text-[11px]">Low latency telemetry transport</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0b0e17] border border-white/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-semibold uppercase">RESILIENCE</span>
                  <div className="text-white font-medium">Fault Tolerant Recovery</div>
                  <div className="text-slate-400 text-[11px]">Automatic node failover emulation</div>
                </div>
              </div>
            </section>
          )}

          {/* FOOTER BAR: JUMP ACTIONS & DISMISS */}
          <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 pb-12">
            <div className="flex items-center space-x-3">
              <span className="text-white font-medium">BOB LABS IoT</span>
              <span>© 2024 BITS2WAVE HACKATHON · ALL RIGHTS RESERVED</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  onClose();
                  onLaunchRotunda();
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all active:scale-95"
              >
                ENTER 3D ROTUNDA →
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-all active:scale-95"
              >
                CLOSE DOSSIER [ESC]
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

