import React, { useState, useMemo } from 'react';
import { Article } from '../types';

interface NewsPageProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ articles, onSelectArticle }) => {
  const [selectedType, setSelectedType] = useState<string>('All');

  const types = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.type) set.add(a.type);
    });
    return ['All', ...Array.from(set)];
  }, [articles]);

  const filtered = useMemo(() => {
    if (selectedType === 'All') return articles;
    return articles.filter((a) => a.type === selectedType);
  }, [articles, selectedType]);

  return (
    <div className="w-full min-h-screen bg-black text-[#f1f3f5] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16 pb-8 border-b border-[#1f2428]">
          <span className="heading-xxs text-[#859099] uppercase tracking-widest block mb-4">
            Insights · Studio News
          </span>
          <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-white max-w-4xl">
            Latest News & Press Releases
          </h1>
          <p className="mt-4 text-sm md:text-base text-[#859099] max-w-2xl">
            Industry features, award announcements, technology breakthroughs, and project behind-the-scenes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`heading-xxs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedType === type
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-[#859099] border-[#1f2428] hover:border-white hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#859099] font-mono">
            {filtered.length} Articles
          </span>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              data-cursor="pointer"
              data-content="Read Article"
              className="group flex flex-col space-y-4 p-5 border border-[#1f2428] hover:border-white/40 transition-colors bg-[#080a0b] rounded-sm cursor-pointer"
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
                <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white group-hover:translate-x-1 transition-transform line-clamp-2">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="mt-2 text-xs text-[#859099] line-clamp-2">
                    {article.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

