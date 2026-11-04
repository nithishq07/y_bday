import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, ChevronDown, ChevronUp, Globe, Beaker, Rocket, Trophy, Film, Flag, MapPin } from 'lucide-react';
import newsData from '../data/generated/news.json';

interface NewsItem {
  headline: string;
  description: string;
  eventDate: string;
  dateMatch: 'exact-day' | 'same-week' | 'period';
  sourceName: string;
  sourceUrl: string;
  category: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  world: { label: 'World', icon: <Globe size={16} />, color: 'text-blue-400' },
  religion: { label: 'Politics & Major Events', icon: <Flag size={16} />, color: 'text-purple-400' },
  science: { label: 'Science & Discovery', icon: <Beaker size={16} />, color: 'text-green-400' },
  spaceAndAstronomy: { label: 'Space & Astronomy', icon: <Rocket size={16} />, color: 'text-cyan-400' },
  sports: { label: 'Sports', icon: <Trophy size={16} />, color: 'text-orange-400' },
  entertainment: { label: 'Entertainment', icon: <Film size={16} />, color: 'text-pink-400' },
  notableDeaths: { label: 'Notable Passings', icon: <Calendar size={16} />, color: 'text-gray-400' },
  india: { label: 'India', icon: <MapPin size={16} />, color: 'text-amber-400' },
  technology: { label: 'Science & Technology', icon: <Beaker size={16} />, color: 'text-emerald-400' },
};

const DATE_MATCH_BADGES: Record<string, { label: string; className: string }> = {
  'exact-day': { label: 'November 5, 2005', className: 'bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30' },
  'same-week': { label: 'Around this time', className: 'bg-cosmic-blue/20 text-cosmic-blue-light border-cosmic-blue/30' },
  'period': { label: 'From 2005', className: 'bg-galaxy-purple/20 text-galaxy-purple-light border-galaxy-purple/30' },
};

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const badge = DATE_MATCH_BADGES[item.dateMatch];
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass rounded-xl p-5 hover:border-champagne-gold/20 transition-all duration-300 group"
    >
      {/* Date match badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge.className}`}>
          {badge.label}
        </span>
        <span className="text-star-white/30 text-xs">{item.eventDate}</span>
      </div>
      
      {/* Headline */}
      <h3 className="font-serif text-lg text-star-white/90 mb-2 leading-snug group-hover:text-champagne-gold transition-colors">
        {item.headline}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-star-white/50 mb-3 leading-relaxed">
        {item.description}
      </p>
      
      {/* Source */}
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-galaxy-purple-light hover:text-champagne-gold transition-colors"
      >
        <ExternalLink size={12} />
        {item.sourceName}
      </a>
    </motion.article>
  );
}

export default function ChapterNews() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const allCategories = useMemo(() => {
    return Object.entries(newsData.categories).map(([key, items]) => ({
      key,
      config: CATEGORY_CONFIG[key] || { label: key, icon: <Globe size={16} />, color: 'text-gray-400' },
      items: items as NewsItem[],
    }));
  }, []);

  return (
    <div className="chapter newspaper-bg py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Chapter header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-galaxy-purple-light text-sm tracking-[0.3em] uppercase mb-4">Chapter III</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-4">
            While the World Was Turning...
          </h2>
          <p className="text-star-white/40 max-w-lg mx-auto text-sm">
            The headlines, discoveries, and events that filled the newspapers on and around
            November 5, 2005 — the day Yukthi arrived.
          </p>
        </motion.div>

        {/* Newspaper masthead decoration */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          className="border-t-2 border-b border-champagne-gold/20 py-3 mb-12 text-center"
        >
          <p className="font-serif text-champagne-gold/60 text-xs tracking-[0.5em] uppercase">
            The World Chronicle — Saturday, November 5, 2005
          </p>
        </motion.div>

        {/* Category sections */}
        <div className="space-y-8">
          {allCategories.map(({ key, config, items }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Category header */}
              <button
                onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                className="w-full flex items-center justify-between gap-3 py-3 border-b border-star-white/10 mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className={config.color}>{config.icon}</span>
                  <h3 className="font-serif text-xl text-star-white/80 group-hover:text-champagne-gold transition-colors">
                    {config.label}
                  </h3>
                  <span className="text-xs text-star-white/30 bg-star-white/5 px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <span className="text-star-white/30">
                  {expandedCategory === key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {/* Items grid - show first 2 always, rest when expanded */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(expandedCategory === key ? items : items.slice(0, 2)).map((item, i) => (
                  <NewsCard key={`${key}-${i}`} item={item} index={i} />
                ))}
              </div>
              {items.length > 2 && expandedCategory !== key && (
                <button
                  onClick={() => setExpandedCategory(key)}
                  className="mt-3 text-xs text-galaxy-purple-light hover:text-champagne-gold transition-colors"
                >
                  Show {items.length - 2} more →
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Skipped sources note */}
        {newsData.provenance.skippedSources.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-star-white/20 text-xs">
              Some sources were unavailable: {newsData.provenance.skippedSources.map(s => s.name).join(', ')}.
              All displayed items are sourced from Wikipedia (CC BY-SA 3.0).
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

