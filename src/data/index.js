// Data constants voor Tala app

export const WORD_CATEGORIES = {
  WIE:  ["Ik", "Jij", "Wij", "Zij", "De dokter", "Iemand", "Bezoek"],
  DOE:  ["Wil", "Ga", "Heb", "Ben", "Moet", "Kan", "Vind", "Zie"],
  WAT:  ["Koffie", "Water", "Eten", "Pijn", "Hulp", "Rust", "Huis", "Auto"],
  WAAR: ["Hier", "Daar", "Thuis", "Buiten", "Boven", "Nu", "Straks", "Morgen"]
};

// Emoji / emoticon category for SimpleSentenceBuilder (not spoken)
WORD_CATEGORIES.EMOJI = ["😀","😂","😊","😍","😢","😡","👍","🙏","🎉","❤️","👏","😮"];

export const INITIAL_CATEGORIES = {
  Persoonlijk: { icon: 'user', items: [] },
  Aangepast: { icon: 'edit-3', items: [] },
  Sociaal: { icon: 'smile', items: ["Hoe is het?", "Leuk je te zien"] },
  Werk: { icon: 'briefcase', items: ["Ik zit in een meeting", "Even overleggen"] },
  Thuis: { icon: 'home', items: ["Ik heb honger", "Ik ga slapen"] },
  Medisch: { icon: 'activity', items: ["Ik heb pijn", "Medicatie tijd"] },
};

export const DEFAULT_CONTEXTS = [
  { id: 'thuis', label: 'Thuis', icon: 'home' },
  { id: 'dokter', label: 'Dokter', icon: 'activity' },
  { id: 'winkel', label: 'Winkel', icon: 'shopping-cart' },
];

export const DEFAULT_QUICK = ["Ja", "Nee", "Moment", "Misschien"];

export const EXTENDED_SECTIONS = [
  { id: 'intro', title: 'Introductie' },
  { id: 'personal', title: '1. Persoonlijk' },
  { id: 'family', title: '2. Familie' },
  { id: 'medical', title: '3. Medisch' },
  { id: 'daily', title: '4. Dagelijks' },
  { id: 'emergency', title: '9. Nood' },
];

export default { WORD_CATEGORIES, INITIAL_CATEGORIES, DEFAULT_CONTEXTS, DEFAULT_QUICK, EXTENDED_SECTIONS };
