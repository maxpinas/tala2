// Tala App - Design Tokens
// Alle design tokens voor de app op één centrale plek
// NIEUW LICHT THEMA - Januari 2026

export const colors = {
  // === BASIS ACHTERGRONDEN ===
  bg: '#F5F0E8',              // Warm beige/cream - hoofdachtergrond
  surface: '#FFFFFF',          // Wit - voor kaarten/modals
  surfaceHighlight: '#9BA3A8', // Grijs - standaard tiles

  // === TEKST KLEUREN ===
  text: '#1A1A1A',             // Bijna zwart - primaire tekst
  textDim: '#666666',          // Grijs - secundaire tekst
  textHighContrast: '#1A1A1A', // Bijna zwart - hoog contrast
  textInverse: '#FFFFFF',      // Wit - op donkere achtergronden

  // === PRIMAIRE KLEUREN ===
  primary: '#7A9A8A',          // Teal/groen - primaire actieknop
  accent: '#B8C83C',           // Lime groen - accent

  // === STATUS KLEUREN ===
  success: '#7A9A8A',          // Groen
  danger: '#FF5252',           // Rood
  warning: '#FFC107',          // Amber/geel

  // === CATEGORIE KLEUREN ===
  categories: {
    thuis: '#C8D4C8',          // Zacht groen
    boodschappen: '#E8DCD0',   // Beige/peach
    etenDrinken: '#7A9A8A',    // Teal/groen
    pijnZorg: '#9BA3A8',       // Grijs
    vervoer: '#8A9A9A',        // Grijs/groen
    ontspanning: '#B8C83C',    // Lime groen
    persoonlijk: '#E8DCD0',    // Beige/peach
    aangepast: '#C8D4C8',      // Zacht groen
    default: '#9BA3A8',        // Grijs - fallback
  },

  // === QUICK ACTION KLEUREN ===
  quickActions: {
    ja: '#7A9A8A',             // Groen
    nee: '#9BA3A8',            // Grijs
    misschien: '#9BA3A8',      // Grijs
    hallo: '#B8D4E8',          // Lichtblauw
    default: '#9BA3A8',        // Grijs - fallback
  },

  // === FAB MENU KLEUREN ===
  fabMenu: {
    zin: '#2196F3',            // Blauw
    kijken: '#64B5F6',         // Lichtblauw
    toon: '#FFC107',           // Amber/geel
    arts: '#FF7043',           // Oranje/koraal
    nood: '#FF5252',           // Rood
  },

  // === TABS ===
  tab: {
    active: '#1A1A1A',         // Donker voor actieve tab
    inactive: '#9BA3A8',       // Grijs voor inactieve tab
    indicator: '#7A9A8A',      // Groene lijn onder actieve tab
  },

  // === PARTNER SCHERM ===
  partnerBg: '#F5F0E8',
  partnerText: '#1A1A1A',

  // === NOOD SCHERM ===
  emergencyBg: '#FEE2E2',      // Licht rood
  emergencyCard: '#FECACA',    // Iets donkerder rood

  // === LEGACY (voor backwards compatibility) ===
  catPeople: '#E8DCD0',
  catAction: '#7A9A8A',
  catThing: '#B8D4E8',
  catPlace: '#C8D4C8',
};

// === SPACING TOKENS ===
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  containerPadding: 16,
  tileGap: 12,
};

// === BORDER RADIUS TOKENS ===
export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

// === TYPOGRAPHY TOKENS ===
export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '500',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
  nav: {
    fontSize: 14,
    fontWeight: '500',
  },
  tileLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
};

// === SHADOWS ===
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default colors;
