import React, { useState, useEffect } from 'react';

interface CityTime {
  city: string;
  country: string;
  timeZone: string;
  hasDirections?: boolean;
}

export const ContactPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email.trim());
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const formatCityTime = (timeZone: string) => {
    try {
      const timeStr = currentTime.toLocaleTimeString('en-GB', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dayStr = currentTime.toLocaleDateString('en-US', {
        timeZone,
        weekday: 'long',
      });
      return { timeStr, dayStr };
    } catch {
      return { timeStr: '00:00:00', dayStr: 'Loading...' };
    }
  };

  const cities: CityTime[] = [
    { city: 'New York', country: 'United States', timeZone: 'America/New_York', hasDirections: true },
    { city: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles' },
    { city: 'Cape Town', country: 'South Africa', timeZone: 'Africa/Johannesburg' },
  ];

  const contactList = [
    { label: 'General Enquiries', email: 'hello@preymaker.com' },
    { label: 'PR & Press Inquiries', email: 'laurijaloi@me.com' },
    {
      label: 'East Coast Representation — Representation Co',
      email: 'sales@representationco.com',
      website: 'https://www.representationco.com/',
      webLabel: 'representationco.com',
    },
    {
      label: 'West Coast Representation — The Department of Sales',
      email: 'sales@thedeptofsales.com',
      website: 'https://www.thedeptofsales.com',
      webLabel: 'thedeptofsales.com',
    },
    { label: 'Midwest Representation — Baer Brown', email: 'chris@baerbrownreps.com' },
    { label: 'Careers & Talent', email: 'joinus@preymaker.com' },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Contact · Reach Out
          </span>
          <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white max-w-4xl">
            Get in touch with our global collective.
          </h1>
        </div>

        {/* 1. Global Studio Clocks Section */}
        <div className="mb-20 pb-16 border-b border-[#1f2428]">
          <p className="heading-xxs uppercase tracking-widest text-[#859099] mb-8">
            Global Studio Hubs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cities.map((city) => {
              const { timeStr, dayStr } = formatCityTime(city.timeZone);
              return (
                <div
                  key={city.city}
                  className="p-8 border border-[#1f2428] rounded-sm bg-[#0a0d0e] flex flex-col justify-between space-y-6"
                >
                  <div>
                    <h3 className="heading-xxl font-mono tracking-tighter text-white">
                      {timeStr}
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-2">
                      {city.city}
                    </h2>
                  </div>

                  <div className="pt-6 border-t border-[#1f2428] flex items-center justify-between text-xs text-[#859099] uppercase tracking-wider">
                    <div>
                      <p className="text-white font-medium">{dayStr}</p>
                      <p>{city.country}</p>
                    </div>

                    {city.hasDirections && (
                      <a
                        href="https://www.google.com/maps/place/Preymaker/@40.7253757,-73.9973825,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline underline-offset-4"
                      >
                        Directions ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Representation & Inquiries Directory */}
        <div>
          <p className="heading-xxs uppercase tracking-widest text-[#859099] mb-8">
            Directory & Representation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactList.map((item) => (
              <div
                key={item.label}
                className="p-6 border border-[#1f2428] rounded-sm bg-[#080a0c] flex flex-col justify-between space-y-4 hover:border-white/40 transition-colors"
              >
                <p className="text-xs uppercase tracking-widest text-[#859099] font-medium">
                  {item.label}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    onClick={() => handleCopy(item.email)}
                    className="text-lg md:text-xl font-semibold text-white hover:text-[#c0c6ca] transition-colors text-left flex items-center space-x-2"
                  >
                    <span>{item.email}</span>
                    {copiedEmail === item.email && (
                      <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded font-bold uppercase">
                        Copied
                      </span>
                    )}
                  </button>

                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider text-[#859099] hover:text-white transition-colors underline underline-offset-4"
                    >
                      {item.webLabel} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

