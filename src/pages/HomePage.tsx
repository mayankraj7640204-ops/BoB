import React, { useState } from 'react';
import { SiteData, WorkProject, Article } from '../types';

interface HomePageProps {
  data: SiteData;
  onSelectWork: (work: WorkProject) => void;
  onSelectArticle: (article: Article) => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  data,
  onSelectWork,
  onSelectArticle,
  onNavigate,
}) => {
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);

  // Curated featured works for homepage
  const featuredWorks = data.works.slice(0, 10);
  const featuredArticles = data.articles.slice(0, 4);

  return (
    <div className="w-full bg-black text-[#f1f3f5] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col justify-between p-4 md:p-8 select-none">
        {/* Hero Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          >
            <source src={data.heroVideo.desktop} type="video/mp4" />
          </video>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
        </div>

        {/* Top spacer (for fixed navbar) */}
        <div className="w-full pt-16" />

        {/* Main Hero Headline */}
        <div className="relative z-10 max-w-5xl mb-12">
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">
            Future-Facing Creators of Exceptional Visual Content
          </h1>
        </div>

        {/* Hero Bottom Bar */}
        <div className="relative z-10 w-full flex items-center justify-between pb-4 border-b border-white/20 text-xs md:text-sm text-[#859099]">
          <p className="font-mono tracking-widest uppercase">Preymaker Studios</p>
          <div className="flex items-center space-x-2 animate-bounce">
            <span className="uppercase tracking-widest text-[11px]">Scroll Down</span>
            <span>↓</span>
          </div>
        </div>
      </section>

      {/* 2. STICKY FEATURED WORK */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-b border-[#1f2428]">
        <div className="max-w-7xl mx-auto">
          <div
            onClick={() => onSelectWork(data.works[0])}
            data-cursor="pointer"
            data-content="View Work"
            className="group relative w-full h-[60vh] md:h-[80vh] rounded-sm overflow-hidden bg-[#0a0d0e] cursor-pointer"
          >
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            >
              <source
                src={data.works[0]?.video || 'https://d2rb54pmpxhpry.cloudfront.net/work/lincoln-navigator2026-101047/lincoln-waterfalls-preview_1080p.mp4'}
                type="video/mp4"
              />
            </video>

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-6 md:p-12 flex flex-col justify-end">
              <span className="heading-xxs text-[#859099] mb-2 uppercase tracking-widest">
                Featured Work · {data.works[0]?.services[0] || 'VFX'}
              </span>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#c0c6ca] font-medium">
                    {data.works[0]?.client || 'Lincoln'}
                  </p>
                  <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white group-hover:translate-x-2 transition-transform duration-300">
                    {data.works[0]?.title || 'Waterfall 60'}
                  </h2>
                </div>
                <div className="hidden md:flex items-center space-x-3 text-xs uppercase tracking-widest bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white">
                  <span>Watch Reel</span>
                  <span>▶</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED WORK GRID */}
      <section className="w-full py-16 md:py-28 px-4 md:px-8 border-b border-[#1f2428]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-8 mb-12 border-b border-[#1f2428]">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-white">
              Selected Works
            </h2>
            <button
              onClick={() => onNavigate('work')}
              className="heading-xxs uppercase tracking-widest text-[#859099] hover:text-white transition-colors"
            >
              See All Work ({data.works.length}) →
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {featuredWorks.slice(1, 7).map((work) => (
              <div
                key={work.id}
                onClick={() => onSelectWork(work)}
                data-cursor="pointer"
                data-content="Play Video"
                className="group flex flex-col space-y-4 cursor-pointer"
              >
                {/* Media Container */}
                <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-[#0d1012]">
                  {work.video ? (
                    <video
                      loop
                      muted
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    >
                      <source src={work.video} type="video/mp4" />
                    </video>
                  ) : work.image ? (
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#859099]">
                      <span className="text-xs uppercase tracking-widest">No Media</span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="text-tag uppercase text-[10px] tracking-wider">
                      {work.services[0] || 'Work'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#859099] font-medium">
                      {work.client || 'Preymaker'}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white group-hover:translate-x-1 transition-transform">
                      {work.title}
                    </h3>
                  </div>
                  <span className="text-xs text-[#859099] uppercase font-mono">
                    {work.services.slice(0, 2).join(' · ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION & MANIFESTO PARAGRAPH */}
      <section className="w-full py-24 md:py-36 px-4 md:px-8 border-b border-[#1f2428] bg-[#050607]">
        <div className="max-w-5xl mx-auto">
          <p className="heading-xxs uppercase tracking-widest text-[#859099] mb-8">
            Who We Are
          </p>
          <h2 className="text-xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] text-[#f1f3f5]">
            An award-winning creative collective specializing in visual effects, design, color grading, and technology. With teams in New York, LA, and Cape Town, we blend global trends with local insight to deliver bold, future-focused solutions wherever our clients are.
          </h2>
          <div className="mt-12 flex flex-wrap gap-6">
            <button
              onClick={() => onNavigate('capabilities')}
              className="heading-xxs uppercase tracking-widest px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              Explore Capabilities
            </button>
            <button
              onClick={() => onNavigate('technology')}
              className="heading-xxs uppercase tracking-widest px-6 py-3 border border-[#333] text-[#859099] hover:border-white hover:text-white transition-colors"
            >
              Cloud Technology
            </button>
          </div>
        </div>
      </section>

      {/* 5. PARTNERS ECOSYSTEM */}
      <section className="w-full py-20 md:py-28 px-4 md:px-8 border-b border-[#1f2428]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-8 mb-12 border-b border-[#1f2428]">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-white">
              Partners
            </h2>
            <span className="text-xl md:text-3xl font-semibold font-mono text-[#859099]">
              {data.partners.length}
            </span>
          </div>

          {/* Grid of Partners */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {data.partners.map((partner, idx) => (
              <div
                key={partner.name}
                onMouseEnter={() => setActivePartnerIndex(idx)}
                className="group flex flex-col items-center justify-center p-6 border border-[#1f2428] hover:border-white/60 transition-all duration-300 rounded-sm bg-[#0a0d0e]/50 hover:bg-[#12161a]"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 md:h-12 w-auto object-contain filter invert opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <p className="mt-3 text-[11px] uppercase tracking-wider text-[#859099] group-hover:text-white transition-colors text-center">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWS & PRESS */}
      <section className="w-full py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-8 mb-12 border-b border-[#1f2428]">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-white">
              Studio News & Press
            </h2>
            <button
              onClick={() => onNavigate('news')}
              className="heading-xxs uppercase tracking-widest text-[#859099] hover:text-white transition-colors"
            >
              See All News →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                data-cursor="pointer"
                data-content="Read Article"
                className="group flex flex-col space-y-4 cursor-pointer p-4 border border-[#1f2428] hover:border-white/40 transition-colors bg-[#080a0b] rounded-sm"
              >
                {article.image && (
                  <div className="w-full aspect-[16/10] overflow-hidden rounded-sm bg-black">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#859099] mb-2">
                    <span className="text-white font-semibold">{article.type}</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold tracking-tight text-white group-hover:translate-x-1 transition-transform line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

