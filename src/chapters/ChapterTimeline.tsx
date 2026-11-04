import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, ExternalLink, Calendar } from 'lucide-react';
import { computeAge } from '../astronomy/engine';
import worldBankData from '../data/generated/worldbank.json';

// 2005 milestones (from verified Wikipedia/news data)
const MILESTONES_2005 = [
  {
    date: 'January 14',
    title: 'Huygens Lands on Titan',
    description: 'ESA\'s Huygens probe became the first spacecraft to land on a moon in the outer solar system, touching down on Saturn\'s moon Titan.',
    category: 'Space',
    source: 'Wikipedia - 2005 in spaceflight',
    sourceUrl: 'https://en.wikipedia.org/wiki/Huygens_(spacecraft)',
    dateMatch: 'period' as const,
  },
  {
    date: 'February 16',
    title: 'Kyoto Protocol Enters into Force',
    description: 'The Kyoto Protocol, an international treaty committing nations to reduce greenhouse gas emissions, officially entered into force.',
    category: 'World',
    source: 'Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/Kyoto_Protocol',
    dateMatch: 'period' as const,
  },
  {
    date: 'April 2',
    title: 'Pope John Paul II Dies',
    description: 'Pope John Paul II, head of the Catholic Church for 26 years, passed away at the Vatican. He was succeeded by Pope Benedict XVI.',
    category: 'World',
    source: 'Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pope_John_Paul_II',
    dateMatch: 'period' as const,
  },
  {
    date: 'June 6',
    title: 'Apple Announces Intel Transition',
    description: 'Apple CEO Steve Jobs announced that Apple would transition from PowerPC to Intel processors, reshaping the personal computer industry.',
    category: 'Technology',
    source: 'Wikipedia - 2005 in technology',
    sourceUrl: 'https://en.wikipedia.org/wiki/Apple%27s_transition_to_Intel_processors',
    dateMatch: 'period' as const,
  },
  {
    date: 'July 26',
    title: 'Space Shuttle Discovery Returns to Flight',
    description: 'Space Shuttle Discovery launched on STS-114, the first shuttle mission after the Columbia disaster, carrying out a test and repair mission.',
    category: 'Space',
    source: 'Wikipedia - 2005 in spaceflight',
    sourceUrl: 'https://en.wikipedia.org/wiki/STS-114',
    dateMatch: 'period' as const,
  },
  {
    date: 'August 29',
    title: 'Hurricane Katrina Strikes Gulf Coast',
    description: 'Hurricane Katrina made landfall along the U.S. Gulf Coast, becoming one of the deadliest and costliest natural disasters in American history.',
    category: 'World',
    source: 'Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hurricane_Katrina',
    dateMatch: 'period' as const,
  },
  {
    date: 'October 8',
    title: 'Kashmir Earthquake',
    description: 'A 7.6-magnitude earthquake struck Pakistan-administered Kashmir, killing over 86,000 people and leaving millions homeless.',
    category: 'World',
    source: 'Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/2005_Kashmir_earthquake',
    dateMatch: 'period' as const,
  },
  {
    date: 'November 5',
    title: '★ Yukthi Is Born',
    description: 'At 5:25 AM IST, in Kanakapura, Karnataka — with Saturn gleaming near the zenith and Mars on the western horizon.',
    category: 'The Main Event',
    source: '',
    sourceUrl: '',
    dateMatch: 'exact-day' as const,
  },
  {
    date: 'November 22',
    title: 'Xbox 360 Launches',
    description: 'Microsoft launched the Xbox 360, kicking off the seventh generation of video game consoles and changing the gaming landscape.',
    category: 'Technology',
    source: 'Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/Xbox_360',
    dateMatch: 'period' as const,
  },
  {
    date: 'December 15',
    title: 'Iraqi Parliamentary Elections',
    description: 'Iraq held parliamentary elections, a major step in the country\'s post-war democratic process with high voter turnout.',
    category: 'World',
    source: 'Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/2005_Iraqi_parliamentary_election',
    dateMatch: 'period' as const,
  },
];

function LiveAgeCounter() {
  const [age, setAge] = useState(computeAge(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(computeAge(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (n: number) => n.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 md:p-8 mb-16"
    >
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl md:text-3xl text-gradient-gold mb-2">
          {age.birthdayState === 'on' ? '🎂 Happy Birthday, Yukthi!' : "Yukthi's Age Right Now"}
        </h3>
        {age.birthdayState === 'before' && (
          <p className="text-star-white/40 text-sm">Counting down to the next birthday...</p>
        )}
      </div>

      {/* Main age display */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
        <AgeUnit value={age.years} label="Years" highlight />
        <AgeUnit value={age.months} label="Months" />
        <AgeUnit value={age.days} label="Days" />
      </div>

      {/* Live elapsed time counter */}
      <div className="border-t border-star-white/10 pt-6">
        <p className="text-star-white/30 text-xs text-center mb-4 tracking-wider uppercase">
          Total Time Since Birth
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-center">
          <ElapsedStat value={formatNumber(age.totalDays)} label="days" />
          <ElapsedStat value={formatNumber(age.totalHours)} label="hours" />
          <ElapsedStat value={formatNumber(age.totalMinutes)} label="minutes" />
          <ElapsedStat value={formatNumber(age.totalSeconds)} label="seconds" />
        </div>
      </div>

      <p className="text-star-white/20 text-[10px] text-center mt-4">
        Computed dynamically from birth date (2005-11-05T05:25:00+05:30) in Asia/Kolkata timezone
      </p>
    </motion.div>
  );
}

function AgeUnit({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={`font-serif text-4xl md:text-5xl font-bold ${highlight ? 'text-gradient-gold' : 'text-star-white/80'}`}>
        {value}
      </div>
      <div className="text-star-white/40 text-xs tracking-wider uppercase mt-1">{label}</div>
    </div>
  );
}

function ElapsedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-star-white/5 rounded-lg px-3 py-2 min-w-[90px]">
      <div className="font-mono text-lg text-champagne-gold">{value}</div>
      <div className="text-star-white/30 text-[10px] uppercase">{label}</div>
    </div>
  );
}

function ThenVsNowCard({ comparison }: { comparison: typeof worldBankData.comparisons[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-xl p-5"
    >
      <h4 className="font-serif text-lg text-star-white/80 mb-4">{comparison.indicator}</h4>
      
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <p className="text-star-white/30 text-xs uppercase tracking-wider">{comparison.then.year}</p>
          <p className="font-serif text-2xl text-star-white/60">{comparison.then.formatted}</p>
        </div>
        <TrendingUp className="text-champagne-gold flex-shrink-0" size={20} />
        <div className="flex-1 text-right">
          <p className="text-star-white/30 text-xs uppercase tracking-wider">{comparison.now.year}</p>
          <p className="font-serif text-2xl text-champagne-gold">{comparison.now.formatted}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-green-400">{comparison.change}</span>
        <a
          href={comparison.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-star-white/20 hover:text-star-white/40 flex items-center gap-1"
        >
          <ExternalLink size={10} />
          {comparison.sourceName}
        </a>
      </div>
    </motion.div>
  );
}

export default function ChapterTimeline() {
  return (
    <div className="chapter py-20 px-4 md:px-8 bg-gradient-to-b from-midnight via-deep-navy to-midnight">
      <div className="max-w-4xl mx-auto">
        {/* Chapter header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-galaxy-purple-light text-sm tracking-[0.3em] uppercase mb-4">Chapter V</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-4">
            A Journey Through Time
          </h2>
          <p className="text-star-white/40 max-w-lg mx-auto text-sm">
            From the milestones of 2005 to the present day — how the world has changed
            since Yukthi's arrival.
          </p>
        </motion.div>

        {/* Live age counter */}
        <LiveAgeCounter />

        {/* Then vs Now stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-serif text-2xl text-star-white/70 text-center mb-6">
            <Globe className="inline-block mr-2 mb-1" size={20} />
            Then vs. Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worldBankData.comparisons.map((comparison, i) => (
              <ThenVsNowCard key={i} comparison={comparison} />
            ))}
          </div>
        </motion.div>

        {/* 2005 Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-serif text-2xl text-star-white/70 text-center mb-8">
            <Calendar className="inline-block mr-2 mb-1" size={20} />
            The Year 2005
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-galaxy-purple/50 via-champagne-gold/30 to-galaxy-purple/50" />

            {MILESTONES_2005.map((milestone, index) => {
              const isSpecial = milestone.title.includes('Yukthi');
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`relative flex items-start mb-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 z-10 ${
                    isSpecial ? 'w-4 h-4' : 'w-2.5 h-2.5'
                  } rounded-full ${
                    isSpecial
                      ? 'bg-champagne-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]'
                      : 'bg-galaxy-purple border border-galaxy-purple-light/50'
                  }`} />

                  {/* Content card */}
                  <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'
                  }`}>
                    <div className={`${
                      isSpecial ? 'glass border-champagne-gold/30 animate-pulse-glow' : 'glass'
                    } rounded-xl p-4`}>
                      <p className={`text-xs tracking-wider uppercase mb-1 ${
                        isSpecial ? 'text-champagne-gold' : 'text-star-white/30'
                      }`}>
                        {milestone.date}
                      </p>
                      <h4 className={`font-serif text-base mb-1 ${
                        isSpecial ? 'text-gradient-gold text-lg' : 'text-star-white/80'
                      }`}>
                        {milestone.title}
                      </h4>
                      <p className="text-star-white/40 text-xs leading-relaxed mb-2">
                        {milestone.description}
                      </p>
                      {milestone.sourceUrl && (
                        <a
                          href={milestone.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-galaxy-purple-light hover:text-champagne-gold"
                        >
                          <ExternalLink size={10} />
                          {milestone.source}
                        </a>
                      )}
                      <span className={`inline-block ml-2 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                        milestone.dateMatch === 'exact-day'
                          ? 'bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30'
                          : 'bg-galaxy-purple/20 text-galaxy-purple-light border-galaxy-purple/30'
                      }`}>
                        {milestone.dateMatch === 'exact-day' ? 'Nov 5' : '2005'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-star-white/15 text-xs mt-16"
        >
          Statistics from World Bank Open Data (CC BY 4.0). Milestones sourced from Wikipedia (CC BY-SA 3.0).
        </motion.p>
      </div>
    </div>
  );
}

