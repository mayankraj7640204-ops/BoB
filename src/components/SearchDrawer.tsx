import React, { useState, useMemo, useEffect, useRef } from 'react';
import { WorkProject, Article } from '../types';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  works: WorkProject[];
  articles: Article[];
  onSelectWork: (work: WorkProject) => void;
  onSelectArticle: (article: Article) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  works,
  articles,
  onSelectWork,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'work' | 'news' | 'other'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchedWorks = works.filter((w) => {
      if (!q) return true;
      return (
        w.title.toLowerCase().includes(q) ||
        w.client.toLowerCase().includes(q) ||
        w.services.some((s) => s.toLowerCase().includes(q))
      );
    });

    const matchedArticles = articles.filter((a) => {
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q)
      );
    });

    if (activeTab === 'work') return { works: matchedWorks, articles: [] };
    if (activeTab === 'news') return { works: [], articles: matchedArticles };
    return { works: matchedWorks, articles: matchedArticles };
  }, [query, activeTab, works, articles]);

  const totalCount = results.works.length + results.articles.length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Search Panel (White / light themed as in original Preymaker) */}
      <div className="relative w-full max-w-2xl h-full bg-[#f1f3f5] text-black shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[#c0c6ca]/40">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#666]">Search Preymaker</p>
          <button
            onClick={onClose}
            className="heading-xxs uppercase tracking-widest text-black hover:opacity-60 transition-opacity focus:outline-none"
            aria-label="Close search"
          >
            close
          </button>
        </div>

        {/* Input Bar */}
        <div className="px-6 md:px-8 py-6 border-b border-[#c0c6ca]/40">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search works, news, technology..."
              className="w-full bg-transparent text-2xl md:text-3xl font-semibold tracking-tight text-black placeholder-[#859099] border-none outline-none focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-[#859099] hover:text-black"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs & Counter */}
        <div className="px-6 md:px-8 py-4 border-b border-[#c0c6ca]/40 flex items-center justify-between">
          <div className="flex space-x-6 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`transition-opacity ${activeTab === 'all' ? 'text-black opacity-100 font-bold' : 'text-black opacity-40 hover:opacity-80'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`transition-opacity ${activeTab === 'work' ? 'text-black opacity-100 font-bold' : 'text-black opacity-40 hover:opacity-80'}`}
            >
              Work
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`transition-opacity ${activeTab === 'news' ? 'text-black opacity-100 font-bold' : 'text-black opacity-40 hover:opacity-80'}`}
            >
              News & press
            </button>
          </div>

          <p className="text-xs text-[#859099] font-medium tracking-wide">
            {totalCount} Results Found
          </p>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
          {totalCount === 0 ? (
            <div className="py-16 text-center text-[#859099]">
              <p className="text-base font-medium">No results found for "{query}"</p>
              <p className="text-sm mt-1">Try another keyword or filter category.</p>
            </div>
          ) : (
            <>
              {/* Works section */}
              {results.works.slice(0, 30).map((work) => (
                <div
                  key={work.id}
                  onClick={() => {
                    onSelectWork(work);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-sm hover:bg-[#e6e9ec] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    {work.image ? (
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-16 h-10 object-cover bg-black rounded-sm"
                      />
                    ) : (
                      <div className="w-16 h-10 bg-black/10 flex items-center justify-center text-[10px] text-black/50 font-bold uppercase">
                        VFX
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#859099] font-medium">
                        {work.client || 'Preymaker'}
                      </p>
                      <h4 className="text-base font-semibold text-black group-hover:translate-x-1 transition-transform">
                        {work.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-wider text-[#859099] px-2 py-1 bg-black/5 rounded">
                    {work.services[0] || 'Work'}
                  </span>
                </div>
              ))}

              {/* Articles section */}
              {results.articles.slice(0, 20).map((article) => (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-sm hover:bg-[#e6e9ec] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-16 h-10 object-cover bg-black rounded-sm"
                      />
                    ) : (
                      <div className="w-16 h-10 bg-black/10 flex items-center justify-center text-[10px] text-black/50 font-bold uppercase">
                        News
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#859099] font-medium">
                        {article.type} · {article.date}
                      </p>
                      <h4 className="text-base font-semibold text-black group-hover:translate-x-1 transition-transform line-clamp-1">
                        {article.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-wider text-[#859099] px-2 py-1 bg-black/5 rounded">
                    {article.type}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

