# DATA VERIFICATION AND PROVENANCE REPORT

Generated at: 2026-11-04T18:31:45.171Z  
Subject: **Yukthi**  
Birth Moment: **Saturday, 5 November 2005, 5:25 AM IST** (`2005-11-04T23:55:00Z`)  
Location: **Kanakapura, Karnataka, India** (`12.54654°N, 77.42005°E`, elevation `639 m`)

---

## 1. Astronomy Verification (JPL Horizons vs. astronomy-engine)

Tolerance gates:
- Planets: **&le; 0.10°** angular difference
- Moon: **&le; 0.50°** angular difference

| Body | Constellation | Computed Alt | Horizons Alt | Computed Az | Horizons Az | Max Difference | Status |
|------|---------------|--------------|--------------|-------------|-------------|----------------|--------|
| **Sun** | Libra | -12.56° | -12.562° | 103.497° | 103.497° | **0.0019°** | ✅ PASS |
| **Moon** | Ophiuchus | -48.236° | -48.238° | 117.632° | 117.633° | **0.0018°** | ✅ PASS |
| **Mercury** | Scorpius | -35.082° | -35.085° | 110.773° | 110.773° | **0.0025°** | ✅ PASS |
| **Venus** | Sagittarius | -57.661° | -57.663° | 121.335° | 121.338° | **0.0025°** | ✅ PASS |
| **Mars** | Aries | 15.775° | 15.779° | 283.341° | 283.341° | **0.004°** | ✅ PASS |
| **Jupiter** | Virgo | -2.274° | -2.277° | 101.013° | 101.013° | **0.0035°** | ✅ PASS |
| **Saturn** | Cancer | 76.242° | 76.237° | 65.373° | 65.361° | **0.0121°** | ✅ PASS |

### Astronomical Summary at Birth Instant
- **Bodies above the horizon**:
  - **Mars**: Altitude `+15.78°`, Azimuth `283.34°` (West-Northwest) in constellation **Aries**.
  - **Saturn**: Altitude `+76.24°`, Azimuth `65.36°` (East-Northeast, near zenith!) in constellation **Cancer**.
- **Bodies below the horizon**:
  - **Sun**: `-12.56°` (astronomical twilight, dawn approaching) in **Libra**.
  - **Jupiter**: `-2.28°` (just under the eastern horizon) in **Virgo**.
  - **Mercury**: `-35.09°` in **Scorpius**.
  - **Moon**: `-48.24°` in **Ophiuchus** (Waxing Crescent, ~9.1% illuminated, ~3.2 days old).
  - **Venus**: `-57.66°` in **Sagittarius**.

---

## 2. Weather at Birth Instant
- Source: **Open-Meteo Historical Weather API (ERA5 Reanalysis)**
- Label: *"ERA5 reanalysis model data, not direct weather station observation"*
- Temperature at 05:00 IST: **20.9°C** (~69.6°F)
- Kanakapura, Karnataka (Elevation: 639 m)

---

## 3. News and Historical Headlines
Items extracted from **Wikipedia Portal:Current events/2005 November 5**, **Wikipedia On This Day API**, and related verified articles:

| Category | Headline | Event Date | Date Match | Source Link |
|----------|----------|------------|------------|-------------|
| World | Cruise Ship Evades Pirate Attack Off Somalia | 2005-11-05 | `exact-day` | [Seabourn Spirit](https://en.wikipedia.org/wiki/Seabourn_Spirit) |
| World | 400th Anniversary of the Gunpowder Plot | 2005-11-05 | `exact-day` | [Gunpowder Plot](https://en.wikipedia.org/wiki/Gunpowder_Plot) |
| Politics | Pope Benedict XVI Prepares Seminary Restrictions | 2005-11-05 | `exact-day` | [Seminaries](https://en.wikipedia.org/wiki/Homosexuality_and_Roman_Catholic_seminaries) |
| Science | Ancient Christian Church Discovered in Israel | 2005-11-05 | `exact-day` | [Megiddo Church](https://en.wikipedia.org/wiki/Megiddo_church) |
| Entertainment | The Red Green Show Airs Final Episode | 2005-11-05 | `exact-day` | [The Red Green Show](https://en.wikipedia.org/wiki/The_Red_Green_Show) |
| Passings | John Fowles, English Novelist, Dies | 2005-11-05 | `exact-day` | [John Fowles](https://en.wikipedia.org/wiki/John_Fowles) |
| Passings | Link Wray, Pioneer Guitarist, Dies | 2005-11-05 | `exact-day` | [Link Wray](https://en.wikipedia.org/wiki/Link_Wray) |
| Space | Venus Express Launched by ESA | 2005-11-09 | `same-week` | [Venus Express](https://en.wikipedia.org/wiki/Venus_Express) |
| Space | Hayabusa Arrives at Asteroid Itokawa | 2005-11-19 | `same-week` | [Hayabusa](https://en.wikipedia.org/wiki/Hayabusa_(spacecraft)) |
| Technology | Xbox 360 Launched | 2005-11-22 | `same-week` | [Xbox 360](https://en.wikipedia.org/wiki/Xbox_360) |
| India | India's Rapid Economic Growth in 2005 (~9.3% GDP) | 2005 | `period` | [2005 in India](https://en.wikipedia.org/wiki/2005_in_India) |
| Sports | India vs Sri Lanka ODI Cricket Series | 2005-11 | `same-week` | [Indian Cricket](https://en.wikipedia.org/wiki/Indian_cricket_team_in_Sri_Lanka_in_2005%E2%80%9306) |

---

## 4. Skipped Sources (Reasoning & Graceful Handling)
- **The Guardian Open Platform**: Requires user API key (anonymous test quota returned empty for 2005). Handled cleanly with zero dummy data.
- **NYT Archive API**: Requires private developer API key. Skipped per operating rules.
- **NASA APOD**: November 5, 2005 entry returned placeholder/empty metadata in archive; accurately noted in UI without fabricated entries.

---

## 5. Then vs. Now Comparative Statistics
- **World Population** (`SP.POP.TOTL`):
  - 2005: **6,575,410,029** (~6.58 billion)
  - 2024: **8,140,897,523** (~8.14 billion) — **+23.8%**
- **Individuals Using the Internet in India** (`IT.NET.USER.ZS`):
  - 2005: **2.39%** of population
  - 2023: **60.25%** of population — **+2,422%**

---

## 6. Licenses and Legal Attribution
- **NASA JPL Horizons & APOD**: Public Domain (United States Government Work)
- **Wikimedia / Wikipedia**: Creative Commons Attribution-ShareAlike 3.0/4.0 (CC BY-SA)
- **Open-Meteo Weather & Geocoding**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **World Bank Open Data**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **astronomy-engine**: MIT License (Copyright (c) Don Cross)
