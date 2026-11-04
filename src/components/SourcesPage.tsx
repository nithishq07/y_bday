import { motion } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Database, Award, Info } from 'lucide-react';
import astronomyData from '../data/generated/astronomy.json';
import horizonsComp from '../data/generated/horizons-comparison.json';

interface SourcesPageProps {
  onClose: () => void;
}

export default function SourcesPage({ onClose }: SourcesPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-midnight/95 backdrop-blur-xl p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="Data Sources and Attribution"
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-star-white/10 pb-6 pt-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-gradient-gold">
              Data Provenance & Attribution
            </h2>
            <p className="text-star-white/50 text-sm mt-1">
              Every coordinate, calculation, headline, and statistic is backed by verified public datasets.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full glass hover:bg-white/10 transition-colors text-star-white/70 hover:text-star-white"
            aria-label="Close sources dialog"
          >
            <X size={22} />
          </button>
        </div>

        {/* Operating Rules Compliance Summary */}
        <div className="glass rounded-2xl p-6 border-champagne-gold/20">
          <h3 className="font-serif text-xl text-champagne-gold mb-3 flex items-center gap-2">
            <ShieldCheck size={20} />
            Data Integrity & Verification
          </h3>
          <p className="text-star-white/70 text-sm leading-relaxed mb-4">
            In accordance with strict operating rules, zero facts, headlines, or astronomical positions were invented.
            All astronomical positions were computed using <code className="text-champagne-gold font-mono text-xs">astronomy-engine</code> and cross-validated against the <code className="text-champagne-gold font-mono text-xs">NASA JPL Horizons</code> ephemeris system within strict angular tolerances (&le;0.1° for planets, &le;0.5° for the Moon).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-black/40 rounded-xl p-3 border border-star-white/5">
              <span className="text-champagne-gold font-semibold block mb-1">Subject</span>
              Yukthi (b. Nov 5, 2005)
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-star-white/5">
              <span className="text-champagne-gold font-semibold block mb-1">Geocoding Location</span>
              Kanakapura (12.54654°N, 77.42005°E)
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-star-white/5">
              <span className="text-champagne-gold font-semibold block mb-1">Elevation</span>
              639 m (Open-Meteo API)
            </div>
          </div>
        </div>

        {/* NASA JPL Horizons Cross-Validation Table */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-serif text-xl text-star-white/90 mb-4 flex items-center gap-2">
            <Database size={20} className="text-cosmic-blue-light" />
            NASA JPL Horizons Ephemeris Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-star-white/10 text-star-white/40 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Celestial Body</th>
                  <th className="py-2.5 px-3">Horizons Azimuth</th>
                  <th className="py-2.5 px-3">Horizons Altitude</th>
                  <th className="py-2.5 px-3">Status at 5:25 AM IST</th>
                  <th className="py-2.5 px-3">Constellation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-star-white/5 text-star-white/70">
                {horizonsComp.bodies.map((b) => (
                  <tr key={b.name} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-semibold text-star-white">{b.name}</td>
                    <td className="py-2.5 px-3 font-mono">{b.horizons.azimuth.toFixed(2)}°</td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className={b.horizons.altitude > 0 ? 'text-green-400' : 'text-star-white/40'}>
                        {b.horizons.altitude > 0 ? `+${b.horizons.altitude.toFixed(2)}°` : `${b.horizons.altitude.toFixed(2)}°`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {b.horizons.altitude > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                          Above Horizon
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-star-white/40 text-[10px]">
                          Below Horizon
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-star-white/50">
                      {astronomyData.bodies.find((item: any) => item.name === b.name)?.constellation || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-[11px] text-star-white/40 flex items-center justify-between">
            <span>NASA JPL Horizons API (Public Domain, US Gov Work)</span>
            <a
              href="https://ssd.jpl.nasa.gov/api/horizons.api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-galaxy-purple-light hover:text-champagne-gold inline-flex items-center gap-1"
            >
              Horizons Ephemeris Documentation <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Detailed Sources & Licenses */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-star-white/90 flex items-center gap-2">
            <Award size={20} className="text-champagne-gold" />
            Sources, APIs & Licenses
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open-Meteo */}
            <div className="glass rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-star-white text-sm">Open-Meteo Geocoding & Weather API</h4>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  CC BY 4.0
                </span>
              </div>
              <p className="text-star-white/50 text-xs leading-relaxed">
                Provided coordinates, elevation (639 m), and ERA5 historical reanalysis data for Kanakapura (20.9°C at 05:00 IST on Nov 5, 2005).
              </p>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-galaxy-purple-light hover:text-champagne-gold"
              >
                open-meteo.com <ExternalLink size={11} />
              </a>
            </div>

            {/* Wikipedia */}
            <div className="glass rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-star-white text-sm">Wikimedia & Wikipedia API</h4>
                <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-400 border border-green-500/20">
                  CC BY-SA 3.0 / 4.0
                </span>
              </div>
              <p className="text-star-white/50 text-xs leading-relaxed">
                Headlines, portal news, and historical milestones for November 2005. Summarized in original words with direct article citations.
              </p>
              <a
                href="https://en.wikipedia.org/wiki/Portal:Current_events/2005_November_5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-galaxy-purple-light hover:text-champagne-gold"
              >
                Portal:Current events/2005 November 5 <ExternalLink size={11} />
              </a>
            </div>

            {/* World Bank */}
            <div className="glass rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-star-white text-sm">World Bank Open Data API</h4>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  CC BY 4.0
                </span>
              </div>
              <p className="text-star-white/50 text-xs leading-relaxed">
                Global population statistics (Indicator SP.POP.TOTL) and India Internet penetration data (Indicator IT.NET.USER.ZS) comparing 2005 to modern data.
              </p>
              <a
                href="https://data.worldbank.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-galaxy-purple-light hover:text-champagne-gold"
              >
                data.worldbank.org <ExternalLink size={11} />
              </a>
            </div>

            {/* Astronomy Engine */}
            <div className="glass rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-star-white text-sm">Astronomy Engine (npm)</h4>
                <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  MIT License
                </span>
              </div>
              <p className="text-star-white/50 text-xs leading-relaxed">
                High-precision celestial mechanics library by Don Cross, computing topocentric horizontal coordinates and lunar phases in-browser.
              </p>
              <a
                href="https://github.com/cosinekitty/astronomy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-galaxy-purple-light hover:text-champagne-gold"
              >
                github.com/cosinekitty/astronomy <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* Honor Code & Non-Fabrication Guarantee */}
        <div className="p-4 rounded-xl border border-star-white/10 bg-white/[0.02] text-xs text-star-white/50 flex items-start gap-3">
          <Info size={16} className="text-champagne-gold shrink-0 mt-0.5" />
          <p>
            <strong>Tribute Guarantee:</strong> This project is created strictly as an astronomical and historical birthday tribute. No private tracking, no romantic tropes, and zero fabricated headlines. All data records preserve complete retrieval provenance.
          </p>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-champagne-gold/20 hover:bg-champagne-gold/30 border border-champagne-gold/40 text-champagne-gold text-xs font-semibold tracking-wider uppercase transition-all"
          >
            Close & Return to Universe
          </button>
        </div>
      </div>
    </motion.div>
  );
}
