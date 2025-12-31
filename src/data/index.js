// Data constants voor Tala app

// Exporteer ook context variabelen
export { 
  LOCATIONS, 
  PEOPLE, 
  renderPhrase, 
  hasPlaceholders, 
  shouldShowPhrase,
  getLocationById,
  getPersonById,
  generatePersonVariants 
} from './contextVariables';

export const WORD_CATEGORIES = {
  WIE:  ["Ik", "Jij", "Wij", "Zij", "De dokter", "Iemand", "Bezoek"],
  DOE:  ["Wil", "Ga", "Heb", "Ben", "Moet", "Kan", "Vind", "Zie"],
  WAT:  ["Koffie", "Water", "Eten", "Pijn", "Hulp", "Rust", "Huis", "Auto"],
  WAAR: ["Hier", "Daar", "Thuis", "Buiten", "Boven", "Nu", "Straks", "Morgen"]
};

// Emoji / emoticon category for SimpleSentenceBuilder (not spoken)
WORD_CATEGORIES.EMOJI = ["😀","😂","😊","😍","😢","😡","👍","🙏","🎉","❤️","👏","😮"];

export const INITIAL_CATEGORIES = {
  Persoonlijk: {
    icon: 'user',
    items: [
      'Ik heet Jeroen',
      'Ik woon in Utrecht',
      'Ik gebruik deze app om te praten',
      'Ik ben 42 jaar',
      '{persoon} is mijn partner',
      'Ik heb een lichte afasie',
      'Ik heb soms meer tijd nodig',
      'Ik wil graag rustig praten',
      'Ik wil zelf beslissingen nemen',
    ],
  },
  Aangepast: { icon: 'edit-3', items: [] },
  Verplaatsen: {
    icon: 'navigation',
    items: [
      // Locatie zinnen
      'Ik ben {locatie:bij}',
      'Ik ga naar {locatie:naar}',
      'Ik wil naar {locatie:naar}',
      'Ik kom van {locatie:van}',
      'Breng me naar {locatie:naar}',
      'Hoe laat gaan we naar {locatie:naar}?',
      // Persoon zinnen
      'Ik wil met {persoon} praten',
      '{persoon} komt eraan',
      'Bel {persoon}',
      'Waar is {persoon}?',
      // Combinatie
      'Ik ga met {persoon} naar {locatie:naar}',
      // Zonder placeholders
      'Ik wil naar buiten',
      'Kunnen we even stoppen?',
      'Ik wil terug',
      'Hoe lang duurt het nog?',
    ],
  },
  Thuis: {
    icon: 'home',
    items: [
      'Zet het raam even open',
      'Ik wil naar de woonkamer',
      'Doe het licht aan',
      'Doe de tv aan',
      'Kun je de verwarming lager zetten?',
      'Ik wil even zitten',
      'Ik heb hulp nodig bij het opstaan',
      'Ik wil naar het toilet',
      'Ik wil douchen',
      'Pak alsjeblieft een glas water',
      'Ik ben moe, ik wil rusten',
      '{persoon}, kun je me helpen?',
      'Ik wil de deur op slot',
      'Kun je de gordijnen dichtdoen?',
      'Ik wil naar de slaapkamer',
    ],
  },
  'Eten en drinken': {
    icon: 'coffee',
    items: [
      'Ik heb honger',
      'Ik wil ontbijt',
      'Mag ik koffie?',
      'Ik wil thee met honing',
      'Een glas water graag',
      'Ik wil iets kouds drinken',
      'Hebben we fruit?',
      'Ik wil soep',
      'Kun je brood smeren?',
      'Ik wil iets warms eten',
      'Geen suiker alstublieft',
      'Mag er wat zout op?',
      'Hebben we wat snacks?',
      'Ik wil nog een portie',
      'Ik ben klaar met eten',
    ],
  },
  'Pijn en zorg': {
    icon: 'activity',
    items: [
      'Ik heb hoofdpijn',
      'Mijn keel doet pijn',
      'Ik ben duizelig',
      'Ik ben kortademig',
      'Mijn arm tintelt',
      'Mijn been voelt slap',
      'Ik ben misselijk',
      'Ik heb hulp nodig',
      'Kun je mijn bloeddruk meten?',
      'Ik wil even liggen',
      'Ik heb mijn medicatie nodig',
      'Kunt u {persoon} bellen?',
      'Ik wil een ijscompres',
      'Ik voel me benauwd',
      'Ik heb ondersteuning om te lopen',
    ],
  },
  Onderweg: {
    icon: 'navigation',
    items: [
      'Ik wil naar buiten',
      'Kunnen we naar het park?',
      'Ik wil met de auto',
      'Ik wil liever lopen',
      'Kunnen we even stoppen?',
      'Ik heb mijn jas nodig',
      'Ik wil mijn rolstoel',
      'Ik heb een taxi nodig',
      'Waar zijn we nu?',
      'Ik wil terug naar {locatie:naar}',
      'Ik wil naar {locatie:naar}',
      'Kun je navigatie aanzetten?',
      'Hoe lang duurt het nog?',
      'Ik wil naar Aruba kijken',
    ],
  },
  Ontspannen: {
    icon: 'film',
    items: [
      'Zet Netflix aan',
      'Ik wil muziek luisteren',
      'Kun je het volume lager zetten?',
      'Ik wil een boek lezen',
      'Kun je een podcast starten?',
      'Ik wil een spelletje doen',
      'Zullen we een filmpje kijken?',
      'Ik wil foto’s terugzien',
      'Ik wil even mediteren',
      'Zet het nieuws op',
      'Ik wil een rustige playlist',
      'Ik wil de sportuitslagen horen',
      'Kun je kaarsen aansteken?',
      'Ik wil in de tuin zitten',
      'Neem even de tijd voor mij',
    ],
  },
  Boodschappen: {
    icon: 'shopping-bag',
    items: [
      'We hebben brood nodig',
      'Haal melk en yoghurt',
      'We zijn bijna door de thee',
      'Ik wil vers fruit kopen',
      'Vergeet de groenten niet',
      'We hebben pasta nodig',
      'Kun je tandpasta meenemen?',
      'Neem paracetamol mee',
      'We hebben wc-papier nodig',
      'Haal wat snacks',
      'Ik wil een fles Fanta',
      'Neem bloemen mee',
      'Haal iets voor het ontbijt',
      'Kun je de boodschappenlijst checken?',
      'Ik wil mee naar de supermarkt',
    ],
  },
  Buiten: {
    icon: 'sunrise',
    items: [
      'Ik wil naar het strand',
      'Ik wil in de tuin zitten',
      'Kunnen we wandelen?',
      'Ik wil de vogels zien',
      'Neem een foto van de tuin',
      'Laten we naar het bos gaan',
      'Ik wil in de zon zitten',
      'Breng me naar de schaduw',
      'Ik wil frisse lucht',
      'Neem mijn jas mee',
      'Ik wil een ritje maken',
      'Laten we langs het water lopen',
      'Ik wil naar de markt',
      'Ik wil naar de tuin kijken',
      'Ik wil een picknick doen',
    ],
  },
};

export const DEFAULT_CONTEXTS = [
  { id: 'thuis', label: 'Thuis', icon: 'home' },
  { id: 'zorg', label: 'Zorg', icon: 'activity' },
  { id: 'boodschappen', label: 'Boodschappen', icon: 'shopping-bag' },
  { id: 'onderweg', label: 'Onderweg', icon: 'navigation' },
  { id: 'familie', label: 'Familie', icon: 'heart' },
  { id: 'ontspannen', label: 'Ontspannen', icon: 'tv' },
];

export const DEFAULT_QUICK = [
  'Ja',
  'Nee',
  'Even wachten',
  'Kun je het herhalen?',
  'Langzamer alsjeblieft',
  'Ik voel me niet goed',
  'Bel mijn partner',
  'Ik wil naar huis',
];

export const EXTENDED_SECTIONS = [
  { id: 'intro', title: 'Introductie' },
  { id: 'personal', title: '1. Persoonlijk' },
  { id: 'family', title: '2. Familie' },
  { id: 'medical', title: '3. Medisch' },
  { id: 'daily', title: '4. Dagelijks' },
  { id: 'emergency', title: '9. Nood' },
];

export default { WORD_CATEGORIES, INITIAL_CATEGORIES, DEFAULT_CONTEXTS, DEFAULT_QUICK, EXTENDED_SECTIONS };
