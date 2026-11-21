import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Article Details"
    >
      <div className="relative w-full max-w-4xl bg-[#0a0d0e] border border-[#1f2428] p-6 md:p-12 text-[#f1f3f5] rounded-sm shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 heading-xxs uppercase tracking-widest text-[#859099] hover:text-white transition-colors focus:outline-none"
        >
          close ✕
        </button>

        {/* Article Meta */}
        <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-[#859099] mb-4">
          <span className="text-white font-semibold">{article.type}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-6">
          {article.title}
        </h2>

        {/* Featured Image */}
        {article.image && (
          <div className="w-full h-64 md:h-96 overflow-hidden mb-8 rounded-sm bg-black">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Subtitle / Quote */}
        {article.subtitle && (
          <p className="text-lg md:text-xl text-[#c0c6ca] font-medium leading-relaxed mb-6 italic">
            "{article.subtitle}"
          </p>
        )}

        {/* Article Body */}
        <div className="text-sm md:text-base text-[#859099] leading-relaxed space-y-4">
          {article.body ? (
            article.body.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>
              Preymaker continues to push the envelope in visual storytelling and cutting-edge visual effects. With an entirely cloud-native pipeline spanning New York, Los Angeles, and Cape Town, our teams deliver world-class CGI, animation, and color grading for iconic commercial and entertainment releases.
            </p>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t border-[#1f2428] flex items-center justify-between text-xs text-[#859099]">
          <p>© Preymaker Studio News</p>
          <a
            href="mailto:hello@preymaker.com"
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Press Inquiries: hello@preymaker.com
          </a>
        </div>
      </div>
    </div>
  );
};

