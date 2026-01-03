// Tala App - Design Tokens
// Alle design tokens voor de app op één centrale plek
// DUAL THEME SUPPORT - Light & Dark Mode - Januari 2026

// === SPACING TOKENS (shared between themes) ===
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

// === BORDER RADIUS TOKENS (shared between themes) ===
export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

// === TYPOGRAPHY TOKENS (shared between themes) ===
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

// === SHADOWS (shared between themes, maar met theme-aware colors) ===
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

// === LIGHT THEME ===
export const lightTheme = {
  // Mode identifier
  isDark: false,
  
  // === BASIS ACHTERGRONDEN ===
  bg: '#F5F0E8',              // Warm beige/cream - hoofdachtergrond
  surface: '#FFFFFF',          // Wit - voor kaarten/modals
  surfaceHighlight: '#9BA3A8', // Grijs - standaard tiles
  surfaceSecondary: '#F0EBE3', // Iets donkerder dan bg voor sections

  // === TEKST KLEUREN ===
  text: '#1A1A1A',             // Bijna zwart - primaire tekst
  textDim: '#666666',          // Grijs - secundaire tekst
  textHighContrast: '#1A1A1A', // Bijna zwart - hoog contrast
  textInverse: '#FFFFFF',      // Wit - op donkere achtergronden

  // === PRIMAIRE KLEUREN ===
  primary: '#7A9A8A',          // Teal/groen - primaire actieknop
  primaryDark: '#5A7A6A',      // Darker variant voor hover/pressed
  accent: '#B8C83C',           // Lime groen - accent

  // === STATUS KLEUREN ===
  success: '#7A9A8A',          // Groen
  danger: '#FF5252',           // Rood
  warning: '#FFC107',          // Amber/geel

  // === CATEGORIE KLEUREN ===
  categories: {
    thuis: '#C8D4C8',
    boodschappen: '#E8DCD0',
    etenDrinken: '#7A9A8A',
    pijnZorg: '#9BA3A8',
    vervoer: '#8A9A9A',
    ontspanning: '#B8C83C',
    persoonlijk: '#E8DCD0',
    aangepast: '#C8D4C8',
    default: '#9BA3A8',
  },

  // === QUICK ACTION KLEUREN ===
  quickActions: {
    ja: '#7A9A8A',
    nee: '#9BA3A8',
    misschien: '#9BA3A8',
    hallo: '#B8D4E8',
    default: '#9BA3A8',
  },

  // === FAB MENU KLEUREN ===
  fabMenu: {
    zin: '#2196F3',
    kijken: '#64B5F6',
    toon: '#FFC107',
    arts: '#FF7043',
    nood: '#FF5252',
  },

  // === TABS ===
  tab: {
    active: '#1A1A1A',
    inactive: '#9BA3A8',
    indicator: '#7A9A8A',
  },

  // === MODAL & OVERLAY ===
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  modalBg: '#FFFFFF',

  // === BORDERS ===
  border: '#E0E0E0',
  borderLight: '#F0F0F0',

  // === PARTNER SCHERM ===
  partnerBg: '#F5F0E8',
  partnerText: '#1A1A1A',

  // === NOOD SCHERM ===
  emergencyBg: '#FEE2E2',
  emergencyCard: '#FECACA',

  // === INPUT FIELDS ===
  inputBg: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputText: '#1A1A1A',
  inputPlaceholder: '#9BA3A8',

  // === LEGACY (voor backwards compatibility) ===
  catPeople: '#E8DCD0',
  catAction: '#7A9A8A',
  catThing: '#B8D4E8',
  catPlace: '#C8D4C8',
};

// === DARK THEME ===
export const darkTheme = {
  // Mode identifier
  isDark: true,
  
  // === BASIS ACHTERGRONDEN ===
  bg: '#121212',               // Donker grijs - hoofdachtergrond
  surface: '#1E1E1E',          // Iets lichter - voor kaarten/modals
  surfaceHighlight: '#2D2D2D', // Nog lichter - voor tiles
  surfaceSecondary: '#1A1A1A', // Iets donkerder dan surface

  // === TEKST KLEUREN ===
  text: '#FFFFFF',             // Wit - primaire tekst
  textDim: '#A0A0A0',          // Grijs - secundaire tekst
  textHighContrast: '#FFFFFF', // Wit - hoog contrast
  textInverse: '#1A1A1A',      // Donker - op lichte achtergronden (tiles)

  // === PRIMAIRE KLEUREN ===
  primary: '#8FBCBB',          // Mintgroen - primaire actieknop (lichter in dark)
  primaryDark: '#6F9C9B',      // Darker variant
  accent: '#C8D84C',           // Lime groen - accent (lichter in dark)

  // === STATUS KLEUREN ===
  success: '#8FBCBB',          // Groen (lichter in dark)
  danger: '#FF6B6B',           // Rood (lichter in dark)
  warning: '#FFD54F',          // Amber (lichter in dark)

  // === CATEGORIE KLEUREN (aangepast voor dark mode) ===
  categories: {
    thuis: '#4A5A4A',          // Donker groen
    boodschappen: '#5A4A3A',   // Donker beige
    etenDrinken: '#4A6A5A',    // Donker teal
    pijnZorg: '#4A4A4A',       // Donker grijs
    vervoer: '#4A5A5A',        // Donker grijs/groen
    ontspanning: '#5A6A2A',    // Donker lime
    persoonlijk: '#5A4A3A',    // Donker beige
    aangepast: '#4A5A4A',      // Donker groen
    default: '#3A3A3A',        // Donker grijs
  },

  // === QUICK ACTION KLEUREN (aangepast voor dark mode) ===
  quickActions: {
    ja: '#4A6A5A',
    nee: '#4A4A4A',
    misschien: '#4A4A4A',
    hallo: '#3A4A5A',
    default: '#3A3A3A',
  },

  // === FAB MENU KLEUREN ===
  fabMenu: {
    zin: '#42A5F5',
    kijken: '#90CAF9',
    toon: '#FFD54F',
    arts: '#FF8A65',
    nood: '#FF6B6B',
  },

  // === TABS ===
  tab: {
    active: '#FFFFFF',
    inactive: '#6A6A6A',
    indicator: '#8FBCBB',
  },

  // === MODAL & OVERLAY ===
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  modalBg: '#1E1E1E',

  // === BORDERS ===
  border: '#3A3A3A',
  borderLight: '#2A2A2A',

  // === PARTNER SCHERM ===
  partnerBg: '#121212',
  partnerText: '#FFFFFF',

  // === NOOD SCHERM ===
  emergencyBg: '#3A1A1A',
  emergencyCard: '#4A2A2A',

  // === INPUT FIELDS ===
  inputBg: '#2D2D2D',
  inputBorder: '#3A3A3A',
  inputText: '#FFFFFF',
  inputPlaceholder: '#6A6A6A',

  // === LEGACY (voor backwards compatibility) ===
  catPeople: '#5A4A3A',
  catAction: '#4A6A5A',
  catThing: '#3A4A5A',
  catPlace: '#4A5A4A',
};

// === TILE CUSTOMIZATION KLEUREN (voor beide modes) ===
export const tileColorOptions = {
  light: [
    { id: 'groen', color: '#7A9A8A', label: 'Groen' },
    { id: 'mintgroen', color: '#8FBCBB', label: 'Mintgroen' },
    { id: 'blauw', color: '#5E81AC', label: 'Blauw' },
    { id: 'lichtblauw', color: '#81A1C1', label: 'Lichtblauw' },
    { id: 'paars', color: '#B48EAD', label: 'Paars' },
    { id: 'rood', color: '#BF616A', label: 'Rood' },
    { id: 'oranje', color: '#D08770', label: 'Oranje' },
    { id: 'geel', color: '#EBCB8B', label: 'Geel' },
    { id: 'lime', color: '#B8C83C', label: 'Lime' },
    { id: 'roze', color: '#E8A0BF', label: 'Roze' },
    { id: 'bruin', color: '#A8896C', label: 'Bruin' },
    { id: 'grijs', color: '#9BA3A8', label: 'Grijs' },
  ],
  dark: [
    { id: 'groen', color: '#5A7A6A', label: 'Groen' },
    { id: 'mintgroen', color: '#6F9C9B', label: 'Mintgroen' },
    { id: 'blauw', color: '#4E618C', label: 'Blauw' },
    { id: 'lichtblauw', color: '#6181A1', label: 'Lichtblauw' },
    { id: 'paars', color: '#946E8D', label: 'Paars' },
    { id: 'rood', color: '#9F414A', label: 'Rood' },
    { id: 'oranje', color: '#B06750', label: 'Oranje' },
    { id: 'geel', color: '#CBAB6B', label: 'Geel' },
    { id: 'lime', color: '#98A81C', label: 'Lime' },
    { id: 'roze', color: '#C880A0', label: 'Roze' },
    { id: 'bruin', color: '#886950', label: 'Bruin' },
    { id: 'grijs', color: '#6A7A80', label: 'Grijs' },
  ],
};

// === BACKWARDS COMPATIBILITY ===
// Voor code die nog de oude 'colors' object verwacht
// Dit wordt vervangen door useTheme() hook
export const colors = lightTheme;

export default lightTheme;
