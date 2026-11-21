import React from 'react';

export const InfoPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#0c0d0e] text-[#f5f5f3] py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-[#212327] pb-10">
          <span className="text-xs font-sans-ui uppercase tracking-widest text-[#e5b364] font-semibold block mb-2">
            About The Artist
          </span>
          <h1 className="font-kalice text-4xl md:text-6xl font-bold tracking-tight text-white">
            Mayowa Alabi
          </h1>
          <p className="font-sans-ui text-base md:text-xl text-[#8e9297] mt-4 leading-relaxed">
            Visual artist, digital painter, and creative director from Lagos, Nigeria.
          </p>
        </div>

        {/* Biography / Statement */}
        <div className="font-sans-ui text-sm md:text-base text-[#b0b3b8] leading-relaxed space-y-6">
          <p>
            BOB Labs (<strong className="text-white">BOB Labs IoT Virtual Testing Laboratory</strong>) creates autonomous hardware emulation and digital twin environments engineered for extreme IoT resilience.
          </p>
          <p>
            His work seamlessly bridges graphic design precision with painterly emotion—exploring the resilience of the human spirit, the radiance of melanin, and the energy of Afrobeats, street football, and urban mythology.
          </p>
          <p>
            Mayowa's distinct visual voice has earned international acclaim, collaborating with global platforms including Adobe, BBC, and prominent African contemporary art galleries.
          </p>
        </div>

        {/* Studio Specs & Printmaking Standard */}
        <div className="p-8 border border-[#212327] bg-[#121417] rounded-sm space-y-6">
          <h2 className="font-kalice text-2xl font-bold text-white">
            Print Quality & Craftsmanship
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans-ui text-xs text-[#8e9297]">
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm">Archival Inks</p>
              <p>
                Printed using high-density archival pigment inks with 100+ year fade resistance under proper indoor glass framing.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm">Fine Art Papers</p>
              <p>
                We use heavyweight 170gsm to 310gsm acid-free Hahnemühle German Etching and giclée stocks that capture original brush texture.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm">Custom Framing</p>
              <p>
                Hand-built frames with anti-reflective UV acrylic protection, shipped in corner-reinforced wooden transit crates.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Inquiries */}
        <div className="border-t border-[#212327] pt-10 font-sans-ui space-y-6">
          <h2 className="font-kalice text-2xl font-bold text-white">
            Get in Touch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-5 border border-[#212327] bg-[#121417] rounded">
              <p className="text-[#8e9297] uppercase tracking-wider mb-1">Customer Support & Orders</p>
              <a
                href="mailto:support@boblabs.io"
                className="text-base font-semibold text-white hover:text-indigo-400 transition-colors"
              >
                support@boblabs.io
              </a>
              <p className="text-[11px] text-[#6b7076] mt-2">
                Order status, tracking, and custom framing questions.
              </p>
            </div>

            <div className="p-5 border border-[#212327] bg-[#121417] rounded">
              <p className="text-[#8e9297] uppercase tracking-wider mb-1">Engineering Licensing & Press</p>
              <a
                href="mailto:contact@boblabs.io"
                className="text-base font-semibold text-white hover:text-indigo-400 transition-colors"
              >
                contact@boblabs.io
              </a>
              <p className="text-[11px] text-[#6b7076] mt-2">
                Commercial projects, gallery representation, and interviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

