import React, { useEffect, useState, useRef } from 'react';

// Web Audio API cyber sound
const playVeilSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.32);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.start(now);
    osc.stop(now + 0.32);
  } catch {
    // Autoplay policy fallback
  }
};

export interface CarterVeilHandle {
  trigger: (onMidpoint: () => void, targetLabel?: string) => void;
}

interface CarterVeilTransitionProps {
  onRegister?: (handle: CarterVeilHandle) => void;
}

export const CarterVeilTransition: React.FC<CarterVeilTransitionProps> = ({ onRegister }) => {
  // 'idle' | 'covering' | 'revealing'
  const [phase, setPhase] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [targetWord, setTargetWord] = useState<string>('BOB LABS');
  const [counter, setCounter] = useState<number>(0);
  const midpointCallbackRef = useRef<(() => void) | null>(null);

  // Register trigger with parent
  useEffect(() => {
    if (onRegister) {
      onRegister({
        trigger: (onMidpoint, word) => {
          if (word) setTargetWord(word);
          midpointCallbackRef.current = onMidpoint;
          playVeilSound();

          // Phase 1: Wipe in from bottom
          setPhase('covering');
          setCounter(0);

          // Counter ticker animation
          const startTime = performance.now();
          const duration = 380;
          let animFrame: number;

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setCounter(Math.floor(progress * 100));
            if (progress < 1) {
              animFrame = requestAnimationFrame(tick);
            }
          };
          animFrame = requestAnimationFrame(tick);

          // Phase 2: Execute state change at peak coverage
          const midTimer = setTimeout(() => {
            if (midpointCallbackRef.current) {
              midpointCallbackRef.current();
              midpointCallbackRef.current = null;
            }
            // Phase 3: Wipe out to top
            setPhase('revealing');
          }, 380);

          // Phase 4: Reset
          const endTimer = setTimeout(() => {
            setPhase('idle');
            cancelAnimationFrame(animFrame);
          }, 780);

          return () => {
            clearTimeout(midTimer);
            clearTimeout(endTimer);
            cancelAnimationFrame(animFrame);
          };
        },
      });
    }
  }, [onRegister]);

  // Keep in DOM always so CSS transition animates continuously!
  const isVisible = phase !== 'idle';

  // Transform calculation for continuous upward Carter Ogunsola veil sweep
  let transform = 'translateY(100%)';
  if (phase === 'covering') {
    transform = 'translateY(0%)';
  } else if (phase === 'revealing') {
    transform = 'translateY(-100%)';
  }

  return (
    <>
      {/* Background Dim Scrim */}
      <div
        className={`fixed inset-0 z-[1190] bg-black/60 pointer-events-none transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Main Carter Ogunsola Luxury Veil Curtain */}
      <div
        className={`fixed inset-0 z-[1200] overflow-hidden select-none bg-[#090d14] text-[#f8fafc] shadow-2xl ${
          isVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          transform,
          transition: 'transform 380ms cubic-bezier(0.76, 0, 0.24, 1)',
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 70%), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      >
        {/* Top-Right HUD Coordinates */}
        <div className="absolute top-6 right-8 text-right font-mono text-xs text-slate-400 space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYS_ROUTING // TELEMETRY</span>
          </div>
          <div className="text-[11px] text-slate-500">
            BITS PILANI / BMSIT ⇄ MQTT://127.0.0.1:1883
          </div>
        </div>

        {/* Center / Subtle Monogram Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span className="text-[18vw] font-kalice font-bold text-white select-none">BOB</span>
        </div>

        {/* Bottom Bar: Target Word on Left, Counter on Right (Exact Carter Ogunsola Layout) */}
        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
          {/* Bottom-Left Destination Word */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-indigo-400">
              [FILE // NAVIGATION]
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-kalice font-normal text-white tracking-tight leading-none">
              {targetWord}
            </h1>
          </div>

          {/* Bottom-Right Odometer Percentage Counter */}
          <div className="font-mono text-3xl sm:text-5xl md:text-6xl font-light text-slate-300 tabular-nums tracking-tighter">
            <span>{counter < 10 ? `0${counter}` : counter}</span>
            <span className="text-indigo-400 text-lg sm:text-2xl ml-1 font-mono">%</span>
          </div>
        </div>
      </div>
    </>
  );
};

