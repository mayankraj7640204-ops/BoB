import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CustomCursorProps {
  isDarkMode?: boolean;
}

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isDarkMode = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<
    'default' | 'pointer' | 'drag' | 'card' | 'input'
  >('default');
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Real mouse coordinates
  const mouseRef = useRef({ x: -100, y: -100 });
  // Lerped core dot coordinates
  const dotRef = useRef({ x: -100, y: -100 });
  // Lerped outer halo coordinates
  const ringRef = useRef({ x: -100, y: -100 });
  // Velocity & kinetic stretch
  const velRef = useRef({ vx: 0, vy: 0, speed: 0, angle: 0 });

  // DOM node references for direct 60/120fps hardware acceleration
  const dotElRef = useRef<HTMLDivElement | null>(null);
  const ringElRef = useRef<HTMLDivElement | null>(null);
  const spotlightElRef = useRef<HTMLDivElement | null>(null);

  // Check touch device
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (isTouchDevice) return;

    // Add cursor-hiding class to body
    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Inspect target element for contextual state
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Text input / textarea
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        setCursorType('input');
        return;
      }

      // 2. 3D Rotunda Canvas (orbit / drag mode)
      const is3DCanvas = target.closest('canvas') || target.closest('.cursor-grab') || target.closest('#rotunda-container');
      if (is3DCanvas) {
        setCursorType('drag');
        return;
      }

      // 3. Inspectable Card / Node
      const cardTarget = target.closest(
        '[data-cursor="inspect"], .tilt-card, [data-node-id]'
      ) as HTMLElement | null;
      if (cardTarget) {
        setCursorType('card');
        return;
      }

      // 4. Clickable buttons, links, tabs, pills
      const clickable = target.closest(
        'button, a, [role="button"], .cursor-pointer, input[type="range"]'
      ) as HTMLElement | null;
      if (clickable) {
        setCursorType('pointer');
        return;
      }

      // Default state
      setCursorType('default');
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      // Spawn expanding shockwave ripple at click location
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: mouseRef.current.x,
        y: mouseRef.current.y,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 60/120Hz Hardware-accelerated rAF animation loop
    let animId: number;
    let prevRingX = mouseRef.current.x;
    let prevRingY = mouseRef.current.y;

    const renderLoop = () => {
      const mouse = mouseRef.current;
      const dot = dotRef.current;
      const ring = ringRef.current;

      // 1. Tightly lerp center dot (responsive high-precision lead)
      dot.x += (mouse.x - dot.x) * 0.45;
      dot.y += (mouse.y - dot.y) * 0.45;

      // 2. Smoothly lerp outer halo ring (signature weighted Cyera lag)
      ring.x += (mouse.x - ring.x) * 0.14;
      ring.y += (mouse.y - ring.y) * 0.14;

      // 3. Compute kinetic velocity vector & dynamic squash/stretch
      const vx = ring.x - prevRingX;
      const vy = ring.y - prevRingY;
      prevRingX = ring.x;
      prevRingY = ring.y;

      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      velRef.current = { vx, vy, speed, angle };

      // Aerodynamic elongation factor (stretches along travel axis when moving fast)
      const stretch = Math.min(1 + speed * 0.015, 1.45);
      const squeeze = 1 / Math.sqrt(stretch);

      // Render Center Dot
      if (dotElRef.current) {
        dotElRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }

      // Render Outer Kinetic Ring with Rotation and Stretch
      if (ringElRef.current) {
        // Base scale modifications for hover and click
        let baseScale = 1.0;
        if (cursorType === 'pointer') baseScale = 1.45;
        if (cursorType === 'card') baseScale = 1.6;
        if (cursorType === 'drag') baseScale = 1.7;
        if (isMouseDown) baseScale *= 0.78;

        const scaleX = baseScale * stretch;
        const scaleY = baseScale * squeeze;

        ringElRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      }

      // Render Ambient Spotlight torch background glow
      if (spotlightElRef.current) {
        spotlightElRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [cursorType, isMouseDown, isTouchDevice, isVisible]);

  // Clean up finished ripples after animation duration
  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* =========================================================================
          1. AMBIENT CYERA SPOTLIGHT / TORCH GLOW
         ========================================================================= */}
      <div
        ref={spotlightElRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full z-0 transition-opacity duration-300 blur-3xl ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.01) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* =========================================================================
          2. CLICK SHOCKWAVE EXPANDING RIPPLES
         ========================================================================= */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          onAnimationEnd={() => removeRipple(ripple.id)}
          className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-indigo-400/80 animate-cyera-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '40px',
            height: '40px',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
          }}
        />
      ))}

      {/* =========================================================================
          3. SIGNATURE LAGGING OUTER RING HALO (ACTIVE THEORY / CYERA FEEL)
         ========================================================================= */}
      <div
        ref={ringElRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center transition-opacity duration-200 select-none ${
          isVisible && cursorType !== 'input' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '36px',
          height: '36px',
          willChange: 'transform',
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-colors duration-200 flex items-center justify-center relative ${
            cursorType === 'pointer'
              ? isDarkMode
                ? 'border-2 border-indigo-400 bg-indigo-500/15 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                : 'border-2 border-indigo-600 bg-indigo-500/10 shadow-[0_0_16px_rgba(99,102,241,0.35)]'
              : cursorType === 'drag'
              ? 'border-2 border-cyan-400 bg-cyan-500/15 shadow-[0_0_22px_rgba(6,182,212,0.5)]'
              : cursorType === 'card'
              ? 'border-2 border-indigo-400/90 bg-indigo-500/10 shadow-[0_0_18px_rgba(99,102,241,0.4)]'
              : isDarkMode
              ? 'border border-indigo-400/50 bg-indigo-500/5 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              : 'border border-indigo-500/60 bg-indigo-500/5 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
          }`}
        >
          {/* Micro HUD Crosshair Ticks on Card Hover */}
          {cursorType === 'card' && (
            <>
              <span className="absolute -top-1 font-mono text-[8px] text-indigo-400 leading-none">+</span>
              <span className="absolute -bottom-1 font-mono text-[8px] text-indigo-400 leading-none">+</span>
              <span className="absolute -left-1 font-mono text-[8px] text-indigo-400 leading-none">+</span>
              <span className="absolute -right-1 font-mono text-[8px] text-indigo-400 leading-none">+</span>
            </>
          )}

          {/* Orbit Navigation Chevrons on 3D Rotunda */}
          {cursorType === 'drag' && (
            <div className="flex items-center space-x-1 font-mono text-[8px] font-bold text-cyan-300 tracking-tighter">
              <span>‹</span>
              <span>›</span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. PRECISION CENTER CORE DOT
         ========================================================================= */}
      <div
        ref={dotElRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-150 ${
          isVisible && cursorType !== 'input' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '6px',
          height: '6px',
          willChange: 'transform',
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-transform duration-150 ${
            isMouseDown ? 'scale-150' : 'scale-100'
          } ${
            cursorType === 'pointer'
              ? 'bg-white shadow-[0_0_8px_#ffffff]'
              : cursorType === 'drag'
              ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]'
              : 'bg-indigo-400 shadow-[0_0_6px_#818cf8]'
          }`}
        />
      </div>
    </>
  );
};
