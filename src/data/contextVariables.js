/**
 * Context Variables - Locaties en Personen met grammatica varianten
 * 
 * Deze data maakt het mogelijk om zinnen te personaliseren met correcte
 * Nederlandse grammatica, zonder dat de gebruiker iets hoeft te configureren.
 */

// Standaard locaties + "Geen" optie
// Varianten: bij = "Ik ben {locatie}", naar = "Ik ga naar {locatie}", van = "Ik kom van {locatie}"
export const LOCATIONS = [
  { 
    id: "geen", 
    label: "Geen locatie", 
    icon: "x",
    variants: { bij: "", naar: "", van: "" } 
  },
  { 
    id: "thuis", 
    label: "Thuis", 
    icon: "home",
    variants: { bij: "thuis", naar: "huis", van: "huis" } 
  },
  { 
    id: "supermarkt", 
    label: "Supermarkt", 
    icon: "shopping-cart",
    variants: { bij: "in de supermarkt", naar: "de supermarkt", van: "de supermarkt" } 
  },
  { 
    id: "winkel", 
    label: "Winkel", 
    icon: "shopping-bag",
    variants: { bij: "in de winkel", naar: "de winkel", van: "de winkel" } 
  },
  { 
    id: "auto", 
    label: "Auto", 
    icon: "truck",
    variants: { bij: "in de auto", naar: "de auto", van: "de auto" } 
  },
  { 
    id: "bus", 
    label: "Bus", 
    icon: "navigation",
    variants: { bij: "in de bus", naar: "de bus", van: "de bus" } 
  },
  { 
    id: "tram", 
    label: "Tram", 
    icon: "navigation",
    variants: { bij: "in de tram", naar: "de tram", van: "de tram" } 
  },
  { 
    id: "trein", 
    label: "Trein", 
    icon: "navigation",
    variants: { bij: "in de trein", naar: "de trein", van: "de trein" } 
  },
  { 
    id: "stad", 
    label: "Stad", 
    icon: "map-pin",
    variants: { bij: "in de stad", naar: "de stad", van: "de stad" } 
  },
  { 
    id: "buiten", 
    label: "Buiten", 
    icon: "sun",
    variants: { bij: "buiten", naar: "buiten", van: "buiten" } 
  },
  { 
    id: "onderweg", 
    label: "Onderweg", 
    icon: "navigation",
    variants: { bij: "onderweg", naar: "onderweg", van: "onderweg" } 
  },
];

// Standaard persoon slots + "Niemand" optie
// label is de display naam, defaultName is wat gebruikt wordt in zinnen
// Namen moeten goed werken met "Bel {persoon}" - dus eigen namen, niet "mijn zus"
export const PEOPLE = [
  { 
    id: "geen", 
    label: "Niemand", 
    icon: "x",
    variants: { naam: "", met: "", voor: "" } 
  },
  { 
    id: "partner", 
    label: "Partner", 
    icon: "heart",
    editable: true,
    defaultName: "Partner",
    variants: null // wordt dynamisch ingevuld op basis van name
  },
  { 
    id: "broer", 
    label: "Broer", 
    icon: "users",
    editable: true,
    defaultName: "Broer",
    variants: null
  },
  { 
    id: "zus", 
    label: "Zus", 
    icon: "users",
    editable: true,
    defaultName: "Zus",
    variants: null
  },
  { 
    id: "vader", 
    label: "Vader", 
    icon: "user",
    editable: true,
    defaultName: "Vader",
    variants: null
  },
  { 
    id: "moeder", 
    label: "Moeder", 
    icon: "user",
    editable: true,
    defaultName: "Moeder",
    variants: null
  },
  { 
    id: "arts", 
    label: "Arts", 
    icon: "user-plus",
    editable: true,
    defaultName: "Arts",
    variants: null
  },
  { 
    id: "thuiszorg", 
    label: "Thuiszorg", 
    icon: "shield",
    editable: true,
    defaultName: "Thuiszorg",
    variants: null
  },
  { 
    id: "huishoudster", 
    label: "Huishoudster", 
    icon: "home",
    editable: true,
    defaultName: "Huishoudster",
    variants: null
  },
];

/**
 * Genereer varianten voor een persoon op basis van naam
 * @param {string} name - De naam van de persoon
 * @returns {object} - Varianten object
 */
export const generatePersonVariants = (name) => {
  if (!name) return { naam: "", met: "", voor: "" };
  return {
    naam: name,           // "Sanne komt"
    met: name,            // "met Sanne"
    voor: name,           // "voor Sanne"
  };
};

/**
 * Vind locatie by id
 */
export const getLocationById = (id) => {
  return LOCATIONS.find(loc => loc.id === id) || LOCATIONS[0];
};

/**
 * Vind persoon by id
 */
export const getPersonById = (id) => {
  return PEOPLE.find(p => p.id === id) || PEOPLE[0];
};

/**
 * Render een zin met context variabelen
 * 
 * Placeholder syntax:
 * - {locatie:bij}  → "thuis" of "in het ziekenhuis"
 * - {locatie:naar} → "huis" of "het ziekenhuis"  
 * - {locatie:van}  → "huis" of "het ziekenhuis"
 * - {persoon}      → "Sanne"
 * - {persoon:met}  → "Sanne" (voor "met Sanne")
 * 
 * Als variant leeg is (bij "Geen"), verdwijnt de placeholder.
 * 
 * @param {string} text - Zin met placeholders
 * @param {object} context - { location: locationObject, person: { ...personObject, name: "Sanne" } }
 * @returns {string} - Gerenderde zin
 */
export const renderPhrase = (text, context = {}) => {
  if (!text) return "";
  
  let result = text;
  
  // Locatie placeholders
  if (context.location?.variants) {
    const variants = context.location.variants;
    result = result.replace(/\{locatie:bij\}/g, variants.bij || "");
    result = result.replace(/\{locatie:naar\}/g, variants.naar || "");
    result = result.replace(/\{locatie:van\}/g, variants.van || "");
    result = result.replace(/\{locatie\}/g, context.location.label || "");
  } else {
    // Geen locatie - verwijder placeholders
    result = result.replace(/\{locatie:\w+\}/g, "");
    result = result.replace(/\{locatie\}/g, "");
  }
  
  // Persoon placeholders
  if (context.person) {
    const name = context.person.name || context.person.defaultName || "";
    const variants = context.person.variants || generatePersonVariants(name);
    result = result.replace(/\{persoon:naam\}/g, variants.naam || "");
    result = result.replace(/\{persoon:met\}/g, variants.met || "");
    result = result.replace(/\{persoon:voor\}/g, variants.voor || "");
    result = result.replace(/\{persoon\}/g, name);
  } else {
    // Geen persoon - verwijder placeholders
    result = result.replace(/\{persoon:\w+\}/g, "");
    result = result.replace(/\{persoon\}/g, "");
  }
  
  // Cleanup: dubbele spaties en leading/trailing whitespace
  result = result.replace(/\s+/g, " ").trim();
  
  return result;
};

/**
 * Check of een zin placeholders bevat
 */
export const hasPlaceholders = (text) => {
  if (!text) return false;
  return /\{(locatie|persoon)(:\w+)?\}/.test(text);
};

/**
 * Check of een zin zichtbaar moet zijn gegeven de context
 * Een zin met alleen locatie placeholder is onzichtbaar als "Geen locatie" actief is
 * 
 * @param {string} text - Zin met placeholders
 * @param {object} context - Actieve context
 * @returns {boolean} - true als zin getoond moet worden
 */
export const shouldShowPhrase = (text, context = {}) => {
  if (!text) return false;
  
  const hasLocatiePlaceholder = /\{locatie(:\w+)?\}/.test(text);
  const hasPersoonPlaceholder = /\{persoon(:\w+)?\}/.test(text);
  
  // Als zin locatie placeholder heeft maar geen locatie actief → verberg
  if (hasLocatiePlaceholder && (!context.location || context.location.id === "geen")) {
    return false;
  }
  
  // Als zin persoon placeholder heeft maar geen persoon actief → verberg
  if (hasPersoonPlaceholder && (!context.person || context.person.id === "geen")) {
    return false;
  }
  
  return true;
};
