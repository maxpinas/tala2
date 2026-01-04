/**
 * Context Variables - Locaties en Personen met grammatica varianten
 * 
 * Deze data maakt het mogelijk om zinnen te personaliseren met correcte
 * Nederlandse grammatica, zonder dat de gebruiker iets hoeft te configureren.
 */

// 10 standaard locaties + "Geen" optie
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
    id: "ziekenhuis", 
    label: "Ziekenhuis", 
    icon: "activity",
    variants: { bij: "in het ziekenhuis", naar: "het ziekenhuis", van: "het ziekenhuis" } 
  },
  { 
    id: "dokter", 
    label: "Dokter", 
    icon: "user-plus",
    variants: { bij: "bij de dokter", naar: "de dokter", van: "de dokter" } 
  },
  { 
    id: "apotheek", 
    label: "Apotheek", 
    icon: "package",
    variants: { bij: "bij de apotheek", naar: "de apotheek", van: "de apotheek" } 
  },
  { 
    id: "winkel", 
    label: "Winkel", 
    icon: "shopping-bag",
    variants: { bij: "in de winkel", naar: "de winkel", van: "de winkel" } 
  },
  { 
    id: "boodschappen", 
    label: "Boodschappen", 
    icon: "shopping-cart",
    variants: { bij: "boodschappen aan het doen", naar: "boodschappen doen", van: "het boodschappen doen" } 
  },
  { 
    id: "werk", 
    label: "Werk", 
    icon: "briefcase",
    variants: { bij: "op het werk", naar: "het werk", van: "het werk" } 
  },
  { 
    id: "fysio", 
    label: "Fysiotherapie", 
    icon: "heart",
    variants: { bij: "bij de fysio", naar: "de fysio", van: "de fysio" } 
  },
  { 
    id: "logo", 
    label: "Logopedie", 
    icon: "message-circle",
    variants: { bij: "bij de logopedie", naar: "de logopedie", van: "de logopedie" } 
  },
  { 
    id: "familie", 
    label: "Familie", 
    icon: "users",
    variants: { bij: "bij familie", naar: "familie", van: "familie" } 
  },
  { 
    id: "buiten", 
    label: "Buiten", 
    icon: "sun",
    variants: { bij: "buiten", naar: "buiten", van: "buiten" } 
  },
];

// 10 persoon slots + "Niemand" optie
// label is de display naam, name is de werkelijke naam (editable)
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
    id: "kind1", 
    label: "Kind", 
    icon: "smile",
    editable: true,
    defaultName: "Kind",
    variants: null
  },
  { 
    id: "ouder1", 
    label: "Vader/Moeder", 
    icon: "user",
    editable: true,
    defaultName: "Vader",
    variants: null
  },
  { 
    id: "broerzus", 
    label: "Broer/Zus", 
    icon: "users",
    editable: true,
    defaultName: "Broer",
    variants: null
  },
  { 
    id: "vriend", 
    label: "Vriend(in)", 
    icon: "user-check",
    editable: true,
    defaultName: "Vriend",
    variants: null
  },
  { 
    id: "buur", 
    label: "Buur", 
    icon: "home",
    editable: true,
    defaultName: "Buur",
    variants: null
  },
  { 
    id: "arts", 
    label: "Arts", 
    icon: "user-plus",
    editable: true,
    defaultName: "Dokter",
    variants: null
  },
  { 
    id: "therapeut", 
    label: "Therapeut", 
    icon: "activity",
    editable: true,
    defaultName: "Therapeut",
    variants: null
  },
  { 
    id: "verzorger", 
    label: "Verzorger", 
    icon: "shield",
    editable: true,
    defaultName: "Verzorger",
    variants: null
  },
  { 
    id: "ander", 
    label: "Anders", 
    icon: "user",
    editable: true,
    defaultName: "Iemand",
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
