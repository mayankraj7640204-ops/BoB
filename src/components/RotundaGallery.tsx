import React, { useState, useEffect, useRef, useMemo } from 'react';
import rotundaRaw from '../data/rotundaData.json';
import { Product } from '../types';

interface RotundaPrint {
  title: string;
  large: string;
  src: string;
  ratio: number;
  href: string;
  key?: string;
}

interface RotundaCollection {
  title: string;
  slug: string;
  description: string;
  href: string;
  count: number;
  prints: RotundaPrint[];
}

interface RotundaGalleryProps {
  onSelectPrint: (product: Product) => void;
  onEnterCollection: (slug: string) => void;
  isDarkMode: boolean;
}

const rotundaCollections = rotundaRaw as RotundaCollection[];

export const RotundaGallery: React.FC<RotundaGalleryProps> = ({
  onSelectPrint,
  onEnterCollection,
  isDarkMode,
}) => {
  // Flatten all paintings into a continuous circular exhibition wall
  const allPaintings = useMemo(() => {
    const list: Array<{
      collectionIndex: number;
      collectionTitle: string;
      collectionSlug: string;
      print: RotundaPrint;
      globalIndex: number;
    }> = [];

    rotundaCollections.forEach((col, colIdx) => {
      col.prints.forEach((pr) => {
        list.push({
          collectionIndex: colIdx,
          collectionTitle: col.title,
          collectionSlug: col.slug,
          print: pr,
          globalIndex: list.length,
        });
      });
    });
    return list;
  }, []);

  // Current camera angle in degrees (or continuous rotation index)
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const currentDragRotation = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel listener for smooth walk
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      setRotationIndex((prev) => prev + delta * 0.05);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setRotationIndex((prev) => Math.round(prev) + 1);
      } else if (e.key === 'ArrowLeft') {
        setRotationIndex((prev) => Math.round(prev) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    currentDragRotation.current = rotationIndex;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX.current;
    // Dragging right moves exhibition left
    setRotationIndex(currentDragRotation.current - diff * 0.08);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    currentDragRotation.current = rotationIndex;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    setRotationIndex(currentDragRotation.current - diff * 0.12);
  };

  // Wrap around index calculation
  const total = allPaintings.length;
  const normalizedIndex = ((Math.round(rotationIndex) % total) + total) % total;
  const currentActivePainting = allPaintings[normalizedIndex] || allPaintings[0];

  // Window of visible paintings along the curved rotunda wall
  // We render ~13 paintings around the current position for cylindrical 3D curve
  const visibleSlots = useMemo(() => {
    const slots = [];
    const windowSize = 7; // -7 to +7
    const radius = 1350; // cylinder radius in px
    const angleStep = 18; // degrees per painting

    for (let offset = -windowSize; offset <= windowSize; offset++) {
      const floatIndex = rotationIndex + offset;
      const targetIndex = ((Math.floor(floatIndex) % total) + total) % total;
      const painting = allPaintings[targetIndex];
      const relAngle = (offset - (rotationIndex % 1)) * angleStep;

      slots.push({
        painting,
        offset,
        relAngle,
        radius,
      });
    }
    return slots;
  }, [rotationIndex, allPaintings, total]);

  const handleCardClick = (painting: typeof allPaintings[0]) => {
    // Convert to Product interface
    const prod: Product = {
      id: painting.print.href.split('/').pop() || 'print',
      title: painting.print.title,
      href: painting.print.href,
      collectionSlug: painting.collectionSlug,
      price: 50.0,
      minPrice: 50.0,
      maxPrice: 700.0,
      image: painting.print.src,
      imageLarge: painting.print.large,
      ratio: painting.print.ratio || 0.75,
      caption: '',
    };
    onSelectPrint(prod);
  };

  const stepNext = () => setRotationIndex((prev) => Math.round(prev) + 1);
  const stepPrev = () => setRotationIndex((prev) => Math.round(prev) - 1);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className={`relative w-full h-[calc(100vh-62px)] overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors duration-700 ${
        isDarkMode ? 'bg-[#0a0a0b]' : 'bg-[#efefed]'
      }`}
    >
      {/* 3D Rotunda Room Container */}
      <div
        className="w-full h-full relative flex items-center justify-center perspective-room"
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 48%',
        }}
      >
        {/* Curved Wall Lighting / Shadow Backdrop */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity ${
            isDarkMode
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#18191c]/80 via-[#0a0a0b] to-[#050506]'
              : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#f0f0ee] to-[#d8d8d5]'
          }`}
        />

        {/* Ambient Floor Shadow / Perspective horizon */}
        <div
          className={`absolute bottom-0 inset-x-0 h-44 pointer-events-none transition-colors ${
            isDarkMode
              ? 'bg-gradient-to-t from-black via-black/40 to-transparent'
              : 'bg-gradient-to-t from-[#c5c5c0] via-[#dededb]/40 to-transparent'
          }`}
        />

        {/* Cylindrical 3D Wall with Hanging Artworks */}
        <div
          className="relative w-0 h-0 transition-transform duration-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-200px) translateY(-20px)',
          }}
        >
          {visibleSlots.map(({ painting, relAngle, radius }, idx) => {
            // Cylindrical coordinates
            const rad = (relAngle * Math.PI) / 180;
            const x = Math.sin(rad) * radius;
            const z = Math.cos(rad) * radius - radius;
            const isCenter = Math.abs(relAngle) < 9;

            return (
              <div
                key={`${painting.print.title}-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(painting);
                }}
                className="absolute top-1/2 left-1/2 cursor-pointer transition-opacity duration-300 group"
                style={{
                  width: '320px',
                  height: '440px',
                  transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${relAngle}deg)`,
                  transformStyle: 'preserve-3d',
                  opacity: Math.max(0.15, 1 - Math.abs(relAngle) / 85),
                }}
              >
                {/* Spot-light cone oval on the curved wall behind artwork */}
                <div
                  className={`absolute -top-16 -left-12 -right-12 bottom-6 rounded-full blur-2xl pointer-events-none transition-all ${
                    isDarkMode
                      ? 'bg-white/10 group-hover:bg-white/20'
                      : 'bg-white/80 group-hover:bg-white'
                  }`}
                  style={{
                    transform: 'translateZ(-15px)',
                  }}
                />

                {/* White / Matte Frame Artwork Body */}
                <div
                  className={`w-full h-full p-4 rounded-sm flex flex-col justify-between transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-[#141518] border border-[#2a2d33] shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                      : 'bg-white border border-[#dedede] shadow-[0_20px_45px_rgba(0,0,0,0.14)]'
                  } ${isCenter ? 'ring-1 ring-black/10' : ''}`}
                >
                  {/* High-res Image Canvas */}
                  <div className="relative flex-1 bg-black/5 rounded-xs overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={painting.print.large || painting.print.src}
                      alt={painting.print.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>

                  {/* Museum-style Caption Label below artwork */}
                  <div className="pt-3 px-1 border-t border-black/5 flex flex-col space-y-0.5 font-sans-ui text-[10px]">
                    <div className="flex items-baseline justify-between">
                      <span
                        className={`font-semibold line-clamp-1 ${
                          isDarkMode ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {painting.print.title}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between ${
                        isDarkMode ? 'text-[#8e9297]' : 'text-neutral-500'
                      }`}
                    >
                      <span className="font-kalice italic">Mayowa Alabi</span>
                      <span className="text-[9px]">Fine art print</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Center HUD Info (Matching screenshot exactly) */}
      <div className="absolute inset-x-0 bottom-28 md:bottom-24 flex flex-col items-center justify-center pointer-events-none z-20 text-center px-4">
        {/* Caption Tag */}
        <p
          className={`text-[11px] font-sans-ui tracking-[0.25em] uppercase font-semibold mb-2 transition-colors ${
            isDarkMode ? 'text-[#8e9297]' : 'text-neutral-500'
          }`}
        >
          You Are Walking Past
        </p>

        {/* Huge Bold Title */}
        <h2
          className={`font-kalice text-2xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl transition-colors duration-300 ${
            isDarkMode ? 'text-white drop-shadow-lg' : 'text-neutral-900 drop-shadow-sm'
          }`}
        >
          {currentActivePainting.collectionTitle}
        </h2>

        {/* Enter Collection Link Button */}
        <button
          onClick={() => onEnterCollection(currentActivePainting.collectionSlug)}
          className={`pointer-events-auto mt-3 text-xs md:text-sm font-sans-ui font-semibold uppercase tracking-widest transition-all hover:scale-105 border-b pb-0.5 ${
            isDarkMode
              ? 'text-white border-white hover:text-[#e5b364] hover:border-[#e5b364]'
              : 'text-neutral-900 border-neutral-900 hover:text-black hover:border-black'
          }`}
        >
          Enter The Collection →
        </button>
      </div>

      {/* Bottom Right Controls & Subtitle (Matching screenshot exactly) */}
      <div className="absolute bottom-6 right-6 md:right-10 flex flex-col items-end space-y-3 z-20 font-sans-ui">
        {/* Circular Arrow Buttons ← → */}
        <div className="flex items-center space-x-2">
          <button
            onClick={stepPrev}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              isDarkMode
                ? 'border-white/30 text-white hover:bg-white hover:text-black'
                : 'border-black/30 text-black hover:bg-black hover:text-white'
            }`}
            aria-label="Walk Previous"
          >
            ←
          </button>
          <button
            onClick={stepNext}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              isDarkMode
                ? 'border-white/30 text-white hover:bg-white hover:text-black'
                : 'border-black/30 text-black hover:bg-black hover:text-white'
            }`}
            aria-label="Walk Next"
          >
            →
          </button>
        </div>

        {/* Instruction Subtitles */}
        <div
          className={`text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-right space-y-0.5 font-medium ${
            isDarkMode ? 'text-[#8e9297]' : 'text-neutral-500'
          }`}
        >
          <p>Scroll or drag to walk round</p>
          <p>Click a painting to look closer</p>
        </div>
      </div>
    </div>
  );
};

