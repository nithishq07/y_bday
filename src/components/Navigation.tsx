import { motion } from 'framer-motion';
import { Compass, Newspaper, Star, Clock, Sparkles, BookOpen } from 'lucide-react';
import type { Chapter } from '../types';

interface NavigationProps {
  chapters: { id: Chapter; label: string }[];
  activeChapter: Chapter;
  onNavigate: (id: Chapter) => void;
  onShowSources: () => void;
}

const ICONS: Record<Chapter, React.ReactNode> = {
  galaxy: <Sparkles size={16} />,
  sky: <Compass size={16} />,
  news: <Newspaper size={16} />,
  headline: <Star size={16} />,
  timeline: <Clock size={16} />,
};

export default function Navigation({ chapters, activeChapter, onNavigate, onShowSources }: NavigationProps) {
  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-2" role="navigation" aria-label="Chapter navigation">
      {chapters.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`group flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-300 ${
            activeChapter === id
              ? 'glass text-champagne-gold'
              : 'text-star-white/40 hover:text-star-white/80'
          }`}
          aria-label={`Navigate to ${label}`}
          aria-current={activeChapter === id ? 'true' : undefined}
        >
          <span className={`text-xs font-sans tracking-wider uppercase transition-all duration-300 ${
            activeChapter === id ? 'opacity-100 max-w-40' : 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-40'
          } overflow-hidden whitespace-nowrap`}>
            {label}
          </span>
          <span className="relative">
            {ICONS[id]}
            {activeChapter === id && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute -inset-1 rounded-full border border-champagne-gold/50"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </span>
        </button>
      ))}
      <div className="w-px h-4 bg-star-white/10 mx-auto" />
      <button
        onClick={onShowSources}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-star-white/30 hover:text-star-white/60 transition-colors text-xs"
        aria-label="View sources and attribution"
      >
        <span className="hidden group-hover:inline">Sources</span>
        <BookOpen size={14} />
      </button>
    </nav>
  );
}

