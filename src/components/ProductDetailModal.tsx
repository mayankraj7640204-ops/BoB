import React, { useState, useEffect } from 'react';
import { Product, Currency, CartItem } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onViewInRoom: (product: Product) => void;
  relatedProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  onViewInRoom,
  relatedProducts,
  onSelectRelated,
}) => {
  const [selectedPaper, setSelectedPaper] = useState('Budget Art Paper');
  const [selectedSize, setSelectedSize] = useState('11.7 × 16.5” (A3)');
  const [selectedSignature, setSelectedSignature] = useState('Unsigned');
  const [selectedFrame, setSelectedFrame] = useState('Unframed');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('paper');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Calculate pricing adjustments
  let priceUSD = product.price; // base $50

  // Paper additions
  if (selectedPaper === 'Giclée Fine Art Paper') priceUSD += 35;
  if (selectedPaper === 'Hahnemühle German Etching') priceUSD += 85;

  // Size additions
  if (selectedSize.includes('A2')) priceUSD += 30;
  if (selectedSize.includes('A1')) priceUSD += 65;
  if (selectedSize.includes('A0')) priceUSD += 140;

  // Signature addition
  if (selectedSignature === 'Signed and Numbered') priceUSD += 45;

  // Frame additions
  if (selectedFrame === 'Classic frame') priceUSD += 110;
  if (selectedFrame === 'Framed canvas') priceUSD += 160;

  const totalCalculatedUSD = priceUSD * quantity;
  const displayUnitPrice = (priceUSD * currency.rate).toLocaleString(undefined, {
    minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
  });
  const displayTotalPrice = (totalCalculatedUSD * currency.rate).toLocaleString(undefined, {
    minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
  });

  const handleAdd = () => {
    const cartItem: CartItem = {
      cartId: `${product.id}-${selectedPaper}-${selectedSize}-${selectedFrame}-${Date.now()}`,
      product,
      paper: selectedPaper,
      size: selectedSize,
      frame: selectedFrame,
      signature: selectedSignature,
      quantity,
      unitPrice: priceUSD,
    };
    onAddToCart(cartItem);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-6xl bg-[#0e1012] border border-[#232528] rounded-sm text-[#f5f5f3] my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#232528] flex items-center justify-between bg-[#121417]">
          <div className="flex items-center space-x-2 text-xs font-sans-ui text-[#8e9297]">
            <button
              onClick={onClose}
              className="hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>←</span>
              <span>Back to Prints</span>
            </button>
            <span>/</span>
            <span className="uppercase text-white font-medium">
              {product.collectionSlug.replace(/-/g, ' ')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xs uppercase font-sans-ui tracking-wider px-3 py-1 rounded bg-[#1f2125] text-[#8e9297] hover:text-white transition-colors"
          >
            Close ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left: High-Res Artwork & View In Room (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div
              className={`relative w-full aspect-[4/5] bg-[#16171a] rounded-sm overflow-hidden flex items-center justify-center p-6 border transition-all ${
                selectedFrame === 'Classic frame'
                  ? 'border-8 border-neutral-900 shadow-2xl bg-neutral-900/40'
                  : selectedFrame === 'Framed canvas'
                  ? 'border-[12px] border-amber-900/60 shadow-2xl'
                  : 'border-[#212327]'
              }`}
            >
              <img
                src={product.imageLarge || product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-sans-ui text-[#8e9297] pt-2">
              <button
                onClick={() => onViewInRoom(product)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded bg-[#1c1e22] hover:bg-[#25282d] text-white transition-colors border border-[#2d3036]"
              >
                <span>🖼️</span>
                <span>View In Room</span>
              </button>

              <span className="italic font-kalice">
                Made to order fine art print
              </span>
            </div>
          </div>

          {/* Right: Product Specifications & Add to Cart (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#e5b364] font-sans-ui font-semibold mb-1">
                {product.collectionSlug.replace(/-/g, ' ')}
              </p>
              <h1 className="font-kalice text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                {product.title}
              </h1>
              <p className="font-sans-ui text-sm text-[#8e9297] leading-relaxed">
                Fine art print created in Lagos by Mayowa Alabi. Produced using museum-grade archival pigments.
              </p>
            </div>

            {/* Price display */}
            <div className="py-3 border-y border-[#232528] flex items-baseline justify-between font-sans-ui">
              <div>
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {currency.symbol}{displayUnitPrice}
                </span>
                <span className="text-xs text-[#8e9297] ml-2 font-normal">
                  (Shop prices exclude tax)
                </span>
              </div>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                Limited Edition
              </span>
            </div>

            {/* Paper Selection */}
            <div className="space-y-2 font-sans-ui">
              <label className="text-xs uppercase tracking-wider text-[#8e9297] font-semibold block">
                Paper: <span className="text-white font-normal">{selectedPaper}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Budget Art Paper', sub: '170gsm Matte' },
                  { name: 'Giclée Fine Art Paper', sub: '200gsm Heavy Matte (+35)' },
                  { name: 'Hahnemühle German Etching', sub: '310gsm Archival (+85)' },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPaper(p.name)}
                    className={`p-2.5 text-left border rounded text-xs transition-all ${
                      selectedPaper === p.name
                        ? 'border-white bg-[#1e2024] text-white font-medium'
                        : 'border-[#26282c] bg-[#141518] text-[#8e9297] hover:border-[#3a3d43] hover:text-white'
                    }`}
                  >
                    <p className="font-semibold line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-[#6b7076] mt-0.5">{p.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2 font-sans-ui">
              <label className="text-xs uppercase tracking-wider text-[#8e9297] font-semibold block">
                Size: <span className="text-white font-normal">{selectedSize}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { size: '11.7 × 16.5” (A3)', label: 'A3' },
                  { size: '16.5 × 23.4” (A2)', label: 'A2 (+30)' },
                  { size: '23.4 × 33.1” (A1)', label: 'A1 (+65)' },
                  { size: '33.1 × 46.8” (A0)', label: 'A0 (+140)' },
                ].map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`p-2 text-center border rounded text-xs transition-all ${
                      selectedSize === s.size
                        ? 'border-white bg-[#1e2024] text-white font-semibold'
                        : 'border-[#26282c] bg-[#141518] text-[#8e9297] hover:border-[#3a3d43] hover:text-white'
                    }`}
                  >
                    <p className="font-mono">{s.label}</p>
                    <p className="text-[9px] text-[#6b7076] mt-0.5">{s.size.split('”')[0]}”</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div className="space-y-2 font-sans-ui">
              <label className="text-xs uppercase tracking-wider text-[#8e9297] font-semibold block">
                Framing: <span className="text-white font-normal">{selectedFrame}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { frame: 'Unframed', desc: 'Rolled in tube' },
                  { frame: 'Classic frame', desc: 'Corner-protected crate (+110)' },
                  { frame: 'Framed canvas', desc: 'Gallery stretched (+160)' },
                ].map((f) => (
                  <button
                    key={f.frame}
                    onClick={() => setSelectedFrame(f.frame)}
                    className={`p-2.5 text-left border rounded text-xs transition-all ${
                      selectedFrame === f.frame
                        ? 'border-white bg-[#1e2024] text-white font-medium'
                        : 'border-[#26282c] bg-[#141518] text-[#8e9297] hover:border-[#3a3d43] hover:text-white'
                    }`}
                  >
                    <p className="font-semibold">{f.frame}</p>
                    <p className="text-[10px] text-[#6b7076] mt-0.5">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart Action */}
            <div className="pt-2 flex items-center space-x-4 font-sans-ui">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#26282c] bg-[#141518] rounded px-3 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-sm font-bold text-[#8e9297] hover:text-white px-2 focus:outline-none"
                >
                  -
                </button>
                <span className="mx-3 text-sm font-semibold font-mono text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-sm font-bold text-[#8e9297] hover:text-white px-2 focus:outline-none"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-6 rounded bg-white text-black font-semibold text-sm uppercase tracking-wider hover:bg-[#e2e2df] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-white/10"
              >
                <span>Add to Bag</span>
                <span>·</span>
                <span className="font-mono">{currency.symbol}{displayTotalPrice}</span>
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600/40 rounded text-xs text-emerald-300 font-sans-ui text-center animate-fadeIn">
                ✓ Added {quantity} × "{product.title}" to your bag!
              </div>
            )}

            {/* Expandable Accordions */}
            <div className="border-t border-[#232528] pt-4 font-sans-ui space-y-3">
              {/* Paper & Sizes */}
              <div className="border border-[#232528] rounded bg-[#121316]">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'paper' ? null : 'paper')}
                  className="w-full px-4 py-3 text-left text-xs uppercase font-semibold text-white flex justify-between items-center"
                >
                  <span>Paper & Sizes</span>
                  <span>{activeAccordion === 'paper' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'paper' && (
                  <div className="px-4 pb-4 text-xs text-[#8e9297] leading-relaxed border-t border-[#1e2023] pt-3 space-y-2">
                    <p>
                      <strong className="text-white">Budget Fine Art Paper (170gsm):</strong> Smooth matte finish faithful to the original, ideal for home framing.
                    </p>
                    <p>
                      <strong className="text-white">Giclée Fine Art Print (200gsm):</strong> Printed with pigment inks on heavier archival stock. Deeper blacks and rich contrast.
                    </p>
                    <p>
                      <strong className="text-white">Hahnemühle German Etching (310gsm):</strong> Museum-grade, mould-made tactile textured paper designed to last generations.
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Info */}
              <div className="border border-[#232528] rounded bg-[#121316]">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'delivery' ? null : 'delivery')}
                  className="w-full px-4 py-3 text-left text-xs uppercase font-semibold text-white flex justify-between items-center"
                >
                  <span>Delivery & Worldwide Shipping</span>
                  <span>{activeAccordion === 'delivery' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'delivery' && (
                  <div className="px-4 pb-4 text-xs text-[#8e9297] leading-relaxed border-t border-[#1e2023] pt-3 space-y-2">
                    <p>
                      Prints are made to order and dispatched within 7–10 working days. Unframed prints ship rolled in an acid-free tube; framed pieces travel in corner-protected crates.
                    </p>
                    <p>
                      Flat shipping is US$27 to US, UK, Canada, and EU; US$40 to the rest of the world, auto-converted to your checkout currency.
                    </p>
                  </div>
                )}
              </div>

              {/* Returns Policy */}
              <div className="border border-[#232528] rounded bg-[#121316]">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'returns' ? null : 'returns')}
                  className="w-full px-4 py-3 text-left text-xs uppercase font-semibold text-white flex justify-between items-center"
                >
                  <span>Returns Policy</span>
                  <span>{activeAccordion === 'returns' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'returns' && (
                  <div className="px-4 pb-4 text-xs text-[#8e9297] leading-relaxed border-t border-[#1e2023] pt-3 space-y-2">
                    <p>
                      Every module is tested and verified. For hardware diagnostics and lab support, simply email <a href="mailto:support@boblabs.io" className="text-white underline">support@boblabs.io</a>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Artworks Carousel */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-[#232528]">
                <p className="text-xs uppercase tracking-wider text-[#8e9297] font-sans-ui font-semibold mb-3">
                  You May Also Like
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {relatedProducts.slice(0, 3).map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="cursor-pointer group border border-[#212327] rounded overflow-hidden bg-[#141517] hover:border-white/50 transition-colors p-2"
                    >
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full aspect-[4/5] object-contain group-hover:scale-105 transition-transform"
                      />
                      <p className="font-kalice text-xs text-white truncate mt-1 group-hover:text-[#e5b364]">
                        {rel.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

