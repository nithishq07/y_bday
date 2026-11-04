// Types for the Yukthi Birthday Website

export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'sun';
  ra: number; // Right ascension in decimal hours
  dec: number; // Declination in decimal degrees
  azimuth: number; // Azimuth in degrees (0=N, 90=E, 180=S, 270=W)
  altitude: number; // Altitude/elevation in degrees (-90 to +90)
  constellation: string;
  aboveHorizon: boolean;
  magnitude?: number;
  riseTime?: string;
  setTime?: string;
  horizonsData: {
    azimuth: number;
    altitude: number;
    ra_h: number;
    dec_deg: number;
  };
}

export interface MoonPhase {
  phaseName: string;
  illumination: number; // percentage
  lunarAge: number; // hours since preceding new moon
  altitude: number;
  azimuth: number;
  aboveHorizon: boolean;
  visibilityNote: string;
}

export interface BirthInstant {
  ist: string;
  utc: string;
  utcDateExplanation: string;
}

export interface Observer {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  source: string;
  sourceUrl: string;
}

export interface AstronomyData {
  birthInstant: BirthInstant;
  observer: Observer;
  dayOfWeek: string;
  bodies: CelestialBody[];
  moonPhase: MoonPhase;
  provenance: Provenance;
}

export interface Provenance {
  source?: string;
  sourceName?: string;
  sourceUrl: string;
  license: string;
  retrievedAt: string;
  dataset?: string;
}

export interface NewsItem {
  headline: string;
  description: string;
  eventDate: string;
  publicationDate?: string;
  dateMatch: 'exact-day' | 'same-week' | 'period';
  sourceName: string;
  sourceUrl: string;
  category: string;
  imageUrl?: string;
  imageCredit?: string;
  imageLicense?: string;
}

export interface NewsData {
  categories: Record<string, NewsItem[]>;
  nasaApod: {
    date: string;
    title: string;
    explanation: string;
    url?: string;
    hdurl?: string;
    status: string;
    sourceName: string;
    sourceUrl: string;
    license: string;
  };
  provenance: {
    sources: Provenance[];
    skippedSources: { name: string; reason: string; url: string }[];
    retrievedAt: string;
  };
}

export interface WorldBankComparison {
  indicator: string;
  indicatorId: string;
  country: string;
  countryCode: string;
  then: { year: number; value: number; formatted: string };
  now: { year: number; value: number; formatted: string };
  change: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  retrievedAt: string;
}

export interface WorldBankData {
  comparisons: WorldBankComparison[];
  provenance: Provenance;
}

export interface WeatherData {
  birthHour: {
    time: string;
    temperature: number;
    unit: string;
  };
  disclaimer: string;
  provenance: Provenance;
}

export interface HorizonsComparison {
  description: string;
  instant: string;
  observer: { latitude: number; longitude: number; elevation: number };
  tolerance: { planets: number; moon: number; unit: string };
  bodies: {
    name: string;
    horizonsId: string;
    horizons: { azimuth: number; altitude: number; ra_h: number; dec_deg: number };
    computed?: { azimuth: number; altitude: number; ra_h: number; dec_deg: number };
    diff?: { azimuthDeg: number; altitudeDeg: number };
    withinTolerance?: boolean;
  }[];
  provenance: Provenance;
}

export type Chapter = 'galaxy' | 'sky' | 'news' | 'headline' | 'timeline';

