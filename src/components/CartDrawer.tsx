import React, { useState } from 'react';
import { CartItem, Currency } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  currency: Currency;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onClearCart,
}) => {
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const totalUSD = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const formattedSubtotal = (totalUSD * currency.rate).toLocaleString(undefined, {
    minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
  });

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckoutComplete(true);
      onClearCart();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-[#111214] border-l border-[#232528] text-[#f5f5f3] flex flex-col z-10 shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-[#232528] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-kalice text-xl font-bold text-white">Your Bag</h2>
            <span className="text-xs font-sans-ui text-[#8e9297] font-mono">
              ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xs uppercase font-sans-ui tracking-wider text-[#8e9297] hover:text-white px-2 py-1"
          >
            Close ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {checkoutComplete ? (
            <div className="py-20 text-center font-sans-ui space-y-4">
              <span className="text-4xl block">✨</span>
              <h3 className="font-kalice text-2xl font-bold text-white">
                Thank You for Your Order!
              </h3>
              <p className="text-xs text-[#8e9297] max-w-xs mx-auto leading-relaxed">
                Your made-to-order artwork is being processed in the Lagos studio. An order confirmation has been logged.
              </p>
              <button
                onClick={() => {
                  setCheckoutComplete(false);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 rounded bg-white text-black font-semibold text-xs uppercase"
              >
                Continue Browsing
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-24 text-center font-sans-ui space-y-3">
              <p className="font-kalice text-lg text-white">Your bag is empty</p>
              <p className="text-xs text-[#8e9297]">
                Explore limited edition prints by Mayowa Alabi.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded border border-[#333] hover:border-white text-xs uppercase tracking-wider text-white"
              >
                Browse Prints
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = (item.unitPrice * item.quantity * currency.rate).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
                  maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
                }
              );

              return (
                <div
                  key={item.cartId}
                  className="flex space-x-3.5 p-3.5 bg-[#17181c] border border-[#212327] rounded-sm"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-20 object-contain bg-[#111214] p-1 border border-[#2d3036] rounded"
                  />

                  <div className="flex-1 flex flex-col justify-between font-sans-ui text-xs">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-kalice text-base font-bold text-white line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cartId)}
                          className="text-[#8e9297] hover:text-white ml-2 text-sm"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-[11px] text-[#8e9297] mt-0.5">
                        {item.size.split(' ')[0]} · {item.paper}
                      </p>
                      {item.frame !== 'Unframed' && (
                        <p className="text-[11px] text-[#e5b364]">
                          {item.frame}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#2d3036] bg-black/40 rounded px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          className="text-xs text-[#8e9297] hover:text-white px-1"
                        >
                          -
                        </button>
                        <span className="mx-2 text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                          className="text-xs text-[#8e9297] hover:text-white px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-white font-mono">
                        {currency.symbol}{itemTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && !checkoutComplete && (
          <div className="p-5 border-t border-[#232528] bg-[#141518] font-sans-ui space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8e9297]">
                Subtotal
              </span>
              <span className="text-xl font-bold font-mono text-white">
                {currency.symbol}{formattedSubtotal}
              </span>
            </div>

            <p className="text-[11px] text-[#8e9297] leading-tight">
              Taxes & international shipping calculated at checkout. Tracked global delivery.
            </p>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-3 rounded bg-white hover:bg-[#e2e2df] text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {checkingOut ? (
                <span>Processing Order...</span>
              ) : (
                <span>Proceed to Checkout →</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

