import { Image } from 'react-native';
import { INITIAL_CATEGORIES, DEFAULT_CONTEXTS, DEFAULT_QUICK } from '../data';

const DEMO_PROFILE = {
  name: 'Jeroen Demo',
  partnerName: 'Sanne',
  phone: '06 1234 5678',
  email: 'jeroen.demo@example.com',
  address: 'Vondelstraat 12, Utrecht',
  partnerPhone: '06 1122 3344',
  partnerEmail: 'sanne@example.com',
  contact2Name: 'Dr. Bakker',
  contact2Phone: '030-1234567',
  hospitalName: 'UMC Utrecht',
  doctorPhone: '030-7654321',
  medication: 'Paracetamol 500mg in de ochtend en avond',
  allergies: 'Penicilline',
  customPartnerText: 'Partner Sanne helpt bij afspraken en vervoer.',
  customMedicalText: 'Af en toe duizelig na inspanning, graag rustig opstarten.',
  voiceId: 'claire',
};

const DEMO_EXTENDED_PROFILE = {
  dob: '14-05-1982',
  address: 'Appartement 2 hoog, bel 12A',
  bloodType: 'O+',
  meds: [
    'Paracetamol 500mg 2x per dag',
    'Omeprazol 20mg in de ochtend',
    'Ventolin bij benauwdheid',
  ],
  emergencyName2: 'Broer Pieter',
  emergencyPhone2: '06-99887766',
  generic: [
    'Ik loop met een wandelstok',
    'Let op bij drukke omgevingen',
    'Graag duidelijke uitleg stap voor stap',
  ],
};

const DEMO_CONTEXTS = [
  ...DEFAULT_CONTEXTS,
  { id: 'fysio', label: 'Fysio', icon: 'activity' },
];

const DEMO_PARTNERS = [
  { id: 'dochter', label: 'Dochter Eva', icon: 'user' },
  { id: 'zoon', label: 'Zoon Tom', icon: 'user' },
  { id: 'fysio', label: 'Fysiotherapeut Iris', icon: 'activity' },
  { id: 'buur', label: 'Buuf Maria', icon: 'home' },
];

const DEMO_QUICK = [
  ...DEFAULT_QUICK,
  'Ik wil zitten',
  'Ik heb dorst',
  'Kun je met me meelopen?',
  'Ik ben klaar',
];

const DEMO_GALLERY = [
  { asset: require('./ontbijt.jpeg'), caption: 'Ontbijt klaarzetten', category: 'Eten en drinken', size: 'medium' },
  { asset: require('./fanta.jpeg'), caption: 'Fanta meenemen', category: 'Eten en drinken', size: 'small' },
  { asset: require('./netflix.jpeg'), caption: 'Netflix avondje', category: 'Ontspannen', size: 'large' },
  { asset: require('./tuin.jpeg'), caption: 'In de tuin zitten', category: 'Buiten', size: 'medium' },
  { asset: require('./strand.jpeg'), caption: 'Dagje strand plannen', category: 'Onderweg', size: 'large' },
  { asset: require('./auto.jpeg'), caption: 'Ritje met de auto', category: 'Onderweg', size: 'medium' },
  { asset: require('./supermarkt.jpeg'), caption: 'Samen boodschappen doen', category: 'Boodschappen', size: 'medium' },
  { asset: require('./aruba.jpeg'), caption: 'Vakantie naar Aruba', category: 'Onderweg', size: 'large' },
];

const DEMO_HISTORY = [
  { text: 'Ik wil naar buiten', timestamp: Date.now() - 60 * 60 * 1000 },
  { text: 'Kun je koffie maken?', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { text: 'Bel mijn partner', timestamp: Date.now() - 4 * 60 * 60 * 1000 },
];

const resolveDemoGallery = () => {
  const now = Date.now();
  return DEMO_GALLERY.map((item, index) => {
    const asset = Image.resolveAssetSource(item.asset);
    return {
      id: now + index,
      uri: asset?.uri,
      type: 'image',
      text: item.caption,
      category: item.category,
      size: item.size || 'medium',
      createdAt: new Date().toISOString(),
    };
  });
};

export const buildDemoState = () => ({
  profile: { ...DEMO_PROFILE },
  extendedProfile: { ...DEMO_EXTENDED_PROFILE },
  contexts: [...DEMO_CONTEXTS],
  customPartners: [...DEMO_PARTNERS],
  quickResponses: [...DEMO_QUICK],
  categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
  gallery: resolveDemoGallery(),
  history: [...DEMO_HISTORY],
});

export const DEMO_DATA = {
  profile: DEMO_PROFILE,
  extendedProfile: DEMO_EXTENDED_PROFILE,
  contexts: DEMO_CONTEXTS,
  customPartners: DEMO_PARTNERS,
  quickResponses: DEMO_QUICK,
  categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
  gallery: DEMO_GALLERY,
  history: DEMO_HISTORY,
};

export default DEMO_DATA;
