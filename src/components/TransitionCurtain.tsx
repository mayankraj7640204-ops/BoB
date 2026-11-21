import React, { useEffect, useState, useRef } from 'react';

// Web Audio API cyber whoosh / click sound
const playTransitionSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    // Cyber whoosh
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Autoplay policy fallback
  }
};

export interface TransitionCurtainHandle {
  trigger: (onMidpoint: () => void, targetLabel?: string) => void;
}

interface TransitionCurtainProps {
  onRegister?: (handle: TransitionCurtainHandle) => void;
}

export const TransitionCurtain: React.FC<TransitionCurtainProps> = ({ onRegister }) => {
  // 'idle' | 'covering' | 'revealing'
  const [phase, setPhase] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [targetLabel, setTargetLabel] = useState<string>('SYSTEM ROUTE');
  const [systemTime, setSystemTime] = useState<string>('');
  const midpointCallbackRef = useRef<(() => void) | null>(null);

  // Live millisecond time for transition HUD
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number, z = 2) => ('00' + n).slice(-z);
      setSystemTime(
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(
          now.getMilliseconds(),
          3
        )}`
      );
    };
    updateTime();
  }, [phase]);

  // Expose trigger method to parent
  useEffect(() => {
    if (onRegister) {
      onRegister({
        trigger: (onMidpoint, label) => {
          if (label) setTargetLabel(label);
          midpointCallbackRef.current = onMidpoint;
          playTransitionSound();

          // Phase 1: Roll in and cover viewport
          setPhase('covering');

          // Phase 2: Execute state change at peak coverage
          const midTimer = setTimeout(() => {
            if (midpointCallbackRef.current) {
              midpointCallbackRef.current();
              midpointCallbackRef.current = null;
            }
            // Phase 3: Roll out to top
            setPhase('revealing');
          }, 400);

          // Phase 4: Reset to idle after roll-out completes
          const endTimer = setTimeout(() => {
            setPhase('idle');
          }, 850);

          return () => {
            clearTimeout(midTimer);
            clearTimeout(endTimer);
          };
        },
      });
    }
  }, [onRegister]);

  if (phase === 'idle') return null;

  // Transform calculation for continuous upward rollout:
  // covering: from translateY(100%) to translateY(0%)
  // revealing: from translateY(0%) to translateY(-100%)
  const curtainTransform =
    phase === 'covering'
      ? 'translateY(0%)'
      : phase === 'revealing'
      ? 'translateY(-100%)'
      : 'translateY(100%)';

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-auto overflow-hidden select-none"
      style={{
        perspective: '1200px',
      }}
    >
      {/* Accent Lead Wave (Indigo Ribbon) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: curtainTransform,
          transition: 'transform 420ms cubic-bezier(0.76, 0, 0.24, 1)',
          background: 'linear-gradient(180deg, #6366f1 0%, #4338ca 100%)',
          opacity: 0.85,
        }}
      />

      {/* Main Obsidian Technical Curtain */}
      <div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#06080d] text-[#f8fafc] shadow-2xl"
        style={{
          transform: curtainTransform,
          transition: 'transform 400ms cubic-bezier(0.76, 0, 0.24, 1)',
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 75%), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 28px 28px, 28px 28px',
        }}
      >
        {/* Dynamic Curved SVG Lip on Leading Edge */}
        <div className="absolute -top-12 left-0 right-0 h-12 overflow-hidden pointer-events-none">
          <svg
            className="w-full h-full text-[#06080d]"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path d="M0,20 Q50,0 100,20 L100,20 L0,20 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Dynamic Curved SVG Lip on Trailing Edge */}
        <div className="absolute -bottom-12 left-0 right-0 h-12 overflow-hidden pointer-events-none">
          <svg
            className="w-full h-full text-[#06080d]"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path d="M0,0 Q50,20 100,0 L100,0 L0,0 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Carter Ogunsola High-Tech HUD Center Card */}
        <div className="relative z-10 max-w-md w-full px-8 py-6 rounded-2xl bg-[#090d16]/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center space-y-4 font-mono animate-fadeIn">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-[11px] text-indigo-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
            <span>SYS_TRANSITION // 01</span>
          </div>

          {/* Destination Target Label */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              TARGET DESTINATION
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
              {targetLabel}
            </h2>
          </div>

          {/* Live Telemetry Metadata */}
          <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>
              TIME: <span className="text-slate-200">{systemTime}</span>
            </span>
            <span>•</span>
            <span>
              STATUS: <span className="text-emerald-400">SYNCED 60.0 FPS</span>
            </span>
          </div>

          {/* Coordinate Vector */}
          <div className="text-[9px] text-slate-500 font-mono">
            BITS PILANI / BMSIT ⇄ MQTT BROKER (127.0.0.1:1883)
          </div>
        </div>
      </div>
    </div>
  );
};

