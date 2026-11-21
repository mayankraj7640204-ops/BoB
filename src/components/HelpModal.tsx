import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const topics = [
    {
      title: 'Lab simulation & runtime',
      desc: 'Telemetry streams, virtual node spawning, MQTT broker connection',
      email: 'mailto:support@boblabs.io?subject=Runtime%20support',
    },
    {
      title: 'Chaos testing & fault injection',
      desc: 'Packet drop scenarios, temperature spikes, node partition recovery',
      email: 'mailto:support@boblabs.io?subject=Chaos%20testing',
    },
    {
      title: 'Hardware devices & integration',
      desc: 'ESP32, Arduino, LoRaWAN gateways, external webhook connectors',
      email: 'mailto:support@boblabs.io?subject=Hardware%20integration',
    },
    {
      title: 'Hackathon & partnerships',
      desc: 'BITS2WAVE Hackathon, IEEE BMSIT student chapter, team inquiries',
      email: 'mailto:contact@boblabs.io?subject=Partnership%20inquiry',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#111214] border border-[#232528] rounded text-[#f5f5f3] p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#232528]">
          <div>
            <h2 className="font-kalice text-2xl font-bold text-white">BOB Labs Support</h2>
            <p className="font-sans-ui text-xs text-[#8e9297] mt-1">
              Reach out directly to the BOB Labs engineering team.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs uppercase font-sans-ui text-[#8e9297] hover:text-white px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="font-sans-ui space-y-3">
          <div className="p-3 bg-[#181a1d] rounded border border-[#26282c]">
            <p className="text-xs font-semibold text-white">Direct Engineering Support</p>
            <a
              href="mailto:support@boblabs.io"
              className="text-sm text-indigo-400 hover:underline block mt-0.5"
            >
              support@boblabs.io
            </a>
            <p className="text-[11px] text-[#8e9297] mt-1">
              MQTT Broker: 127.0.0.1:1883 • Response latency &lt; 24h
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {topics.map((t) => (
              <a
                key={t.title}
                href={t.email}
                className="block p-3 rounded border border-[#212327] hover:border-white/50 bg-[#141517] hover:bg-[#181a1d] transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white group-hover:text-[#e5b364] transition-colors">
                    {t.title}
                  </p>
                  <span className="text-xs text-[#8e9297] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                <p className="text-xs text-[#8e9297] mt-1">{t.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#232528] flex justify-end font-sans-ui">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white text-black text-xs uppercase font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

