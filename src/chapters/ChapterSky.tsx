import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Calendar,
  Thermometer,
  Moon,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import astronomyData from '../data/generated/astronomy.json';
import weatherData from '../data/generated/weather.json';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Body {
  name: string;
  type: string;
  azimuth: number;
  altitude: number;
  constellation: string;
  aboveHorizon: boolean;
}

interface TooltipInfo {
  body: Body;
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Stereographic‑style projection: zenith → centre, horizon → edge. */
function skyToScreen(
  azDeg: number,
  altDeg: number,
  cx: number,
  cy: number,
  radius: number,
) {
  const r = ((90 - altDeg) / 90) * radius;
  const theta = (azDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.sin(theta),
    y: cy - r * Math.cos(theta),
  };
}

/** Colour per celestial body. */
function bodyColor(name: string): string {
  switch (name) {
    case 'Sun':
      return '#FFD700';
    case 'Moon':
      return '#C0C0C0';
    case 'Mercury':
      return '#B0B0B0';
    case 'Venus':
      return '#FFFACD';
    case 'Mars':
      return '#FF4500';
    case 'Jupiter':
      return '#DAA520';
    case 'Saturn':
      return '#F0D060';
    default:
      return '#FFFFFF';
  }
}

/** Dot radius per body. */
function bodyRadius(name: string): number {
  switch (name) {
    case 'Sun':
      return 6;
    case 'Moon':
      return 5;
    case 'Jupiter':
    case 'Saturn':
      return 5;
    case 'Mars':
      return 4.5;
    default:
      return 3.5;
  }
}

/** Unicode symbol per body. */
function bodySymbol(name: string): string {
  switch (name) {
    case 'Sun':
      return '☉';
    case 'Moon':
      return '☽';
    case 'Mercury':
      return '☿';
    case 'Venus':
      return '♀';
    case 'Mars':
      return '♂';
    case 'Jupiter':
      return '♃';
    case 'Saturn':
      return '♄';
    default:
      return '·';
  }
}

/* ------------------------------------------------------------------ */
/*  Random background stars (seeded once)                              */
/* ------------------------------------------------------------------ */

function generateStars(count: number, seed: number) {
  const stars: { cx: number; cy: number; r: number; opacity: number; delay: number }[] = [];
  let s = seed;
  const next = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      cx: next() * 100,
      cy: next() * 100,
      r: 0.3 + next() * 1.2,
      opacity: 0.15 + next() * 0.55,
      delay: next() * 6,
    });
  }
  return stars;
}

/* ------------------------------------------------------------------ */
/*  Sub‑components                                                     */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/** UTC explanation tooltip */
function UtcTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="ml-1 text-galaxy-purple-light hover:text-champagne-gold transition-colors"
        aria-label="UTC explanation"
      >
        <Info size={14} />
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg glass p-3 text-xs text-star-white/80 z-50 shadow-lg pointer-events-none">
          {astronomyData.birthInstant.utcDateExplanation}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Birth Details Card                                                 */
/* ------------------------------------------------------------------ */

function BirthDetailsCard() {
  const { observer, dayOfWeek } = astronomyData;
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto"
    >
      <h3 className="font-serif text-2xl md:text-3xl text-gradient-gold mb-6">
        Birth Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
        {/* Name */}
        <div className="flex items-start gap-3">
          <span className="text-champagne-gold mt-0.5">✦</span>
          <div>
            <span className="text-star-white/50 text-xs uppercase tracking-wider">
              Name
            </span>
            <p className="text-star-white font-serif text-lg">Yukthi</p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-champagne-gold mt-1 shrink-0" />
          <div>
            <span className="text-star-white/50 text-xs uppercase tracking-wider">
              Date
            </span>
            <p className="text-star-white">
              Saturday, November 5, 2005
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock size={16} className="text-champagne-gold mt-1 shrink-0" />
          <div>
            <span className="text-star-white/50 text-xs uppercase tracking-wider">
              Time
            </span>
            <p className="text-star-white">
              5:25 AM IST
              <span className="text-star-white/40 ml-1 text-xs">
                (23:55 UTC, Nov 4)
              </span>
              <UtcTooltip />
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-champagne-gold mt-1 shrink-0" />
          <div>
            <span className="text-star-white/50 text-xs uppercase tracking-wider">
              Location
            </span>
            <p className="text-star-white">
              {observer.name}, {observer.state}, {observer.country}
            </p>
            <p className="text-star-white/40 text-xs">
              {observer.latitude.toFixed(4)}°N, {observer.longitude.toFixed(4)}°E
              &nbsp;·&nbsp;{observer.elevation}m
            </p>
          </div>
        </div>

        {/* Day */}
        <div className="flex items-start gap-3">
          <span className="text-champagne-gold mt-0.5">☀</span>
          <div>
            <span className="text-star-white/50 text-xs uppercase tracking-wider">
              Day
            </span>
            <p className="text-star-white">{dayOfWeek}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Sky Map                                                 */
/* ------------------------------------------------------------------ */

function SkyMap() {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const bodies = astronomyData.bodies as Body[];

  const SIZE = 520;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 40; // leave margin for labels

  const bgStars = useMemo(() => generateStars(120, 20051105), []);

  const projected = useMemo(
    () =>
      bodies.map((b) => {
        // For bodies below horizon, clamp altitude to show them outside the circle
        const alt = b.altitude;
        const pos = skyToScreen(b.azimuth, Math.max(alt, -30), CX, CY, R);
        return { body: b, ...pos };
      }),
    [bodies],
  );

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
      className="relative w-full flex justify-center"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[520px] select-none"
        role="img"
        aria-label="Sky map at Yukthi's birth"
      >
        <defs>
          {/* Radial gradient for sky background */}
          <radialGradient id="skyBg">
            <stop offset="0%" stopColor="#0d1b2a" />
            <stop offset="80%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor="#060612" />
          </radialGradient>
          {/* Glow filters */}
          <filter id="glow-mars" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-saturn" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-dim" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="star-twinkle">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Sky background circle */}
        <circle cx={CX} cy={CY} r={R + 30} fill="url(#skyBg)" />

        {/* Background stars */}
        {bgStars.map((s, i) => (
          <circle
            key={i}
            cx={(s.cx / 100) * SIZE}
            cy={(s.cy / 100) * SIZE}
            r={s.r}
            fill="#f0f0ff"
            opacity={s.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`}
              dur={`${3 + s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Horizon circle */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(123,45,142,0.35)"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />

        {/* "Horizon" label */}
        <text
          x={CX}
          y={CY + R + 16}
          textAnchor="middle"
          fill="rgba(155,77,202,0.5)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          — Horizon —
        </text>

        {/* Zenith marker */}
        <circle cx={CX} cy={CY} r={2} fill="rgba(155,77,202,0.4)" />
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          fill="rgba(155,77,202,0.5)"
          fontSize={9}
          fontFamily="var(--font-sans)"
        >
          Zenith
        </text>

        {/* Cardinal directions */}
        {[
          { label: 'N', angle: 0 },
          { label: 'E', angle: 90 },
          { label: 'S', angle: 180 },
          { label: 'W', angle: 270 },
        ].map(({ label, angle }) => {
          const theta = (angle * Math.PI) / 180;
          const lx = CX + (R + 22) * Math.sin(theta);
          const ly = CY - (R + 22) * Math.cos(theta);
          return (
            <text
              key={label}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#d4af37"
              fontSize={13}
              fontWeight="bold"
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
          );
        })}

        {/* Altitude rings (30° increments) */}
        {[30, 60].map((alt) => {
          const rr = ((90 - alt) / 90) * R;
          return (
            <g key={alt}>
              <circle
                cx={CX}
                cy={CY}
                r={rr}
                fill="none"
                stroke="rgba(123,45,142,0.12)"
                strokeWidth={0.8}
                strokeDasharray="3 5"
              />
              <text
                x={CX + rr + 4}
                y={CY - 2}
                fill="rgba(155,77,202,0.3)"
                fontSize={8}
                fontFamily="var(--font-sans)"
              >
                {alt}°
              </text>
            </g>
          );
        })}

        {/* Celestial bodies */}
        {projected.map(({ body, x, y }) => {
          const above = body.aboveHorizon;
          const color = bodyColor(body.name);
          const r = bodyRadius(body.name);
          const filter = above
            ? body.name === 'Mars'
              ? 'url(#glow-mars)'
              : body.name === 'Saturn'
                ? 'url(#glow-saturn)'
                : undefined
            : 'url(#glow-dim)';
          const opacity = above ? 1 : 0.3;

          return (
            <g
              key={body.name}
              opacity={opacity}
              className="cursor-pointer"
              onMouseEnter={() => setTooltip({ body, x, y })}
              onMouseLeave={() => setTooltip(null)}
              onClick={() =>
                setTooltip((prev) =>
                  prev?.body.name === body.name ? null : { body, x, y },
                )
              }
            >
              {/* Glow halo for above-horizon bodies */}
              {above && (
                <circle
                  cx={x}
                  cy={y}
                  r={r * 3}
                  fill={color}
                  opacity={0.12}
                  filter={filter}
                />
              )}
              {/* Body dot */}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={color}
                filter={filter}
              />
              {/* Saturn ring */}
              {body.name === 'Saturn' && (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={r * 2.2}
                  ry={r * 0.7}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.8}
                  opacity={above ? 0.7 : 0.3}
                  transform={`rotate(-15 ${x} ${y})`}
                />
              )}
              {/* Label */}
              <text
                x={x}
                y={y - r - 6}
                textAnchor="middle"
                fill={color}
                fontSize={10}
                fontFamily="var(--font-sans)"
                fontWeight={above ? 600 : 400}
              >
                {bodySymbol(body.name)} {body.name}
              </text>
              {/* Below Horizon indicator */}
              {!above && (
                <text
                  x={x}
                  y={y + r + 12}
                  textAnchor="middle"
                  fill="rgba(240,240,255,0.25)"
                  fontSize={7}
                  fontFamily="var(--font-sans)"
                >
                  Below Horizon
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip overlay */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `calc(${(tooltip.x / SIZE) * 100}% + 12px)`,
            top: `${(tooltip.y / SIZE) * 100}%`,
          }}
        >
          <div className="glass rounded-xl p-3 text-xs min-w-[180px] shadow-xl border border-galaxy-purple/20">
            <p className="font-serif text-champagne-gold text-sm mb-1.5">
              {bodySymbol(tooltip.body.name)} {tooltip.body.name}
            </p>
            <div className="space-y-1 text-star-white/70">
              <p>
                <span className="text-star-white/40">Altitude:</span>{' '}
                {tooltip.body.altitude > 0 ? '+' : ''}
                {tooltip.body.altitude.toFixed(2)}°
              </p>
              <p>
                <span className="text-star-white/40">Azimuth:</span>{' '}
                {tooltip.body.azimuth.toFixed(2)}°
              </p>
              <p>
                <span className="text-star-white/40">Constellation:</span>{' '}
                {tooltip.body.constellation}
              </p>
              <p className="flex items-center gap-1">
                {tooltip.body.aboveHorizon ? (
                  <>
                    <Eye size={11} className="text-green-400" />
                    <span className="text-green-400">Above horizon</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={11} className="text-red-400/60" />
                    <span className="text-red-400/60">Below horizon</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Moon Phase Card                                                    */
/* ------------------------------------------------------------------ */

function MoonPhaseCard() {
  const { moonPhase } = astronomyData;
  const moonBody = astronomyData.bodies.find((b) => b.name === 'Moon');

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      className="glass rounded-2xl p-6 md:p-8 max-w-xl mx-auto"
    >
      <h3 className="font-serif text-xl md:text-2xl text-gradient-gold mb-5 flex items-center gap-2">
        <Moon size={20} className="text-champagne-gold" />
        Moon Phase
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* CSS crescent moon */}
        <div className="relative shrink-0" aria-hidden="true">
          {/* Outer glow */}
          <div className="w-24 h-24 rounded-full absolute -inset-2 bg-[#C0C0C0] opacity-[0.06] blur-xl" />
          {/* Moon base (lit side) */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D0D0D0] to-[#A0A0A0] relative overflow-hidden shadow-lg shadow-white/5">
            {/* Shadow overlay for crescent (~9% illumination) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 70% 50%, transparent 0%, transparent 30%, #0a0a1a 42%, #0a0a1a 100%)',
              }}
            />
            {/* Extra darkening to get ~9% */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 8%, #0a0a1a 22%, #0a0a1a 100%)',
              }}
            />
          </div>
        </div>

        {/* Moon data */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-star-white/40 w-24 shrink-0">Phase</span>
            <span className="text-star-white font-medium">
              {moonPhase.phaseName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-star-white/40 w-24 shrink-0">Illumination</span>
            <span className="text-star-white">~{moonPhase.illuminationPercentage}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-star-white/40 w-24 shrink-0">Lunar Age</span>
            <span className="text-star-white">
              ~{moonPhase.lunarAgeDays} days
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-star-white/40 w-24 shrink-0">Position</span>
            <span className="text-star-white/70 text-xs leading-relaxed">
              Below the horizon at birth time (altitude{' '}
              {moonBody?.altitude.toFixed(1)}°)
            </span>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-5 flex items-start gap-2 text-xs text-star-white/40 bg-white/[0.03] rounded-lg p-3">
        <Info size={13} className="shrink-0 mt-0.5 text-galaxy-purple-light/60" />
        <span>
          The Moon's phase describes its illumination cycle on that calendar date.
          However, at the exact moment of birth (5:25 AM IST) the Moon was well below
          the horizon and not visible from Kanakapura.
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Weather Card                                                       */
/* ------------------------------------------------------------------ */

function WeatherCard() {
  const { atBirth, location } = weatherData;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
      className="glass rounded-2xl p-6 md:p-8 max-w-xl mx-auto"
    >
      <h3 className="font-serif text-xl md:text-2xl text-gradient-gold mb-5 flex items-center gap-2">
        <Thermometer size={20} className="text-champagne-gold" />
        Weather at Birth
      </h3>

      <div className="flex items-center gap-6">
        {/* Temp display */}
        <div className="text-center shrink-0">
          <span className="text-4xl md:text-5xl font-serif text-gradient-gold">
            {atBirth.temperature_2m_celsius}
          </span>
          <span className="text-xl text-champagne-gold/70 ml-1">°C</span>
          <p className="text-xs text-star-white/30 mt-1">
            ~{((atBirth.temperature_2m_celsius * 9) / 5 + 32).toFixed(1)}°F
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2 text-sm">
          <p className="text-star-white/70">{atBirth.description}</p>
          <p className="text-star-white/30 text-xs">
            {location.name}, {location.state} · {atBirth.time} ({atBirth.note})
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-5 flex items-start gap-2 text-xs text-star-white/40 bg-white/[0.03] rounded-lg p-3">
        <Info size={13} className="shrink-0 mt-0.5 text-galaxy-purple-light/60" />
        <span>
          ERA5 reanalysis model data, not direct weather station observation.
          <br />
          Source: Open-Meteo Historical Weather API
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Chapter Component                                             */
/* ------------------------------------------------------------------ */

export default function ChapterSky() {
  // Background stars for the full section
  const sectionStars = useMemo(() => generateStars(80, 42), []);

  return (
    <div className="chapter relative overflow-hidden bg-midnight">
      {/* Star field background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {sectionStars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-star-white"
            style={{
              left: `${s.cx}%`,
              top: `${s.cy}%`,
              width: `${s.r * 1.2}px`,
              height: `${s.r * 1.2}px`,
              opacity: s.opacity * 0.6,
              animation: `twinkle ${4 + s.delay}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 md:py-28 px-4 md:px-8 space-y-16 max-w-4xl mx-auto">
        {/* Chapter title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center space-y-3"
        >
          <p className="text-champagne-gold/60 uppercase tracking-[0.3em] text-xs md:text-sm">
            Chapter II
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-gradient-gold leading-tight">
            The Sky on the Day
            <br />
            Yukthi Was Born
          </h2>
          <p className="text-star-white/40 text-sm md:text-base max-w-lg mx-auto">
            A snapshot of the heavens above Kanakapura at 5:25 AM IST,
            Saturday, November 5, 2005.
          </p>
        </motion.div>

        {/* Birth Details */}
        <BirthDetailsCard />

        {/* Sky Map section */}
        <div className="space-y-4">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-xl md:text-2xl text-center text-gradient-cosmic"
          >
            Interactive Sky Map
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-star-white/30 text-xs md:text-sm"
          >
            Hover or tap a planet to see details · Bodies below the horizon are dimmed
          </motion.p>
          <SkyMap />

          {/* Legend */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-star-white/50 pt-2"
          >
            {(astronomyData.bodies as Body[]).map((b) => (
              <span
                key={b.name}
                className="flex items-center gap-1.5"
                style={{ opacity: b.aboveHorizon ? 1 : 0.45 }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: bodyColor(b.name) }}
                />
                <span>
                  {bodySymbol(b.name)} {b.name}
                </span>
                <span className="text-star-white/25">
                  {b.aboveHorizon ? `+${b.altitude.toFixed(1)}°` : `${b.altitude.toFixed(1)}°`}
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Moon Phase */}
        <MoonPhaseCard />

        {/* Weather */}
        <WeatherCard />

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-star-white/20 text-xs pt-4"
        >
          Computed with astronomy-engine, cross-checked against NASA JPL Horizons.
        </motion.p>
      </div>
    </div>
  );
}
