import React from 'react';

export const AuctionsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#0c0d0e] text-[#f5f5f3] py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#212327] pb-8">
          <span className="text-xs font-sans-ui uppercase tracking-widest text-[#e5b364] font-semibold block mb-2">
            Rare & One-of-a-Kind
          </span>
          <h1 className="font-kalice text-4xl md:text-5xl font-bold tracking-tight text-white">
            Studio Auctions
          </h1>
          <p className="font-sans-ui text-sm md:text-base text-[#8e9297] mt-3">
            Original physical paintings, artist proof 1-of-1s, and exclusive charity drops.
          </p>
        </div>

        {/* Current Drops Status */}
        <div className="p-8 md:p-12 border border-[#212327] bg-[#121316] rounded-sm text-center font-sans-ui space-y-4">
          <span className="text-3xl block">⏳</span>
          <h2 className="font-kalice text-2xl md:text-3xl font-bold text-white">
            Next Auction Drop Coming Soon
          </h2>
          <p className="text-xs md:text-sm text-[#8e9297] max-w-md mx-auto leading-relaxed">
            New 1-of-1 original digital paintings and hand-embellished artist proofs are dropped periodically. Join the priority mailing list for early bidding access.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded bg-[#1a1c1f] border border-[#2d3036] text-xs text-white placeholder-[#6b7076] focus:outline-none focus:border-white"
            />
            <button className="w-full sm:w-auto px-5 py-2.5 rounded bg-white text-black font-semibold text-xs uppercase tracking-wider whitespace-nowrap hover:bg-[#e2e2df]">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

