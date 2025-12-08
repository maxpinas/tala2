# Tala - Quick Setup Guide

**Versie:** 1.1.0  
**Laatst bijgewerkt:** 7 december 2025

---

## 🎯 Wat is Tala?

Tala is een React Native (Expo) communicatie-app voor mensen met afasie. De app helpt gebruikers om te communiceren via:

- **Snelle zinnen** - Voorgedefinieerde zinnen per categorie
- **Zinsbouwer** - Bouw zinnen met WIE/DOE/WAT/WAAR structuur
- **Foto gallery** - Toon foto's met bijschriften
- **Spraakuitvoer** - Text-to-speech in Nederlands
- **Noodtoegang** - Snelle toegang tot medische info en noodcontacten

---

## 📦 Dependencies

De app gebruikt de volgende packages:

```json
{
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "expo": "~54.0.0",
    "expo-image-picker": "~17.0.9",
    "expo-speech": "~14.0.8",
    "expo-updates": "~29.0.14",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-web": "^0.21.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}
```

---

## 🚀 Quick Start

### 1. Clone de repo en installeer dependencies

```bash
cd tala2
npm install
```

### 2. Start Expo Go

```bash
npx expo start
```

### 3. Open op je telefoon

- **iOS:** Scan QR code met Camera app
- **Android:** Scan QR code met Expo Go app

---

## 📁 Project Structuur

```
tala2/
├── App.js                    # Hoofdcomponent (~606 regels)
├── package.json
├── src/
│   ├── components/
│   │   ├── common/           # Herbruikbare UI componenten
│   │   │   ├── CustomPopup.js
│   │   │   ├── EditToolbar.js
│   │   │   ├── OutputBar.js
│   │   │   ├── SelectorModal.js
│   │   │   ├── SimpleInputModal.js
│   │   │   ├── SpeakingIndicator.js
│   │   │   └── Toast.js
│   │   │
│   │   ├── modals/           # Modal dialogs
│   │   │   ├── AddOrEditPhotoModal.js
│   │   │   ├── ContentMenuModal.js
│   │   │   ├── EmergencyModal.js
│   │   │   ├── FullScreenShow.js
│   │   │   ├── HistoryOptionsModal.js
│   │   │   ├── MedicalScreen.js
│   │   │   ├── MovePhraseModal.js     # Move/copy zinnen
│   │   │   ├── PartnerScreen.js
│   │   │   ├── PhotoFullScreenShow.js
│   │   │   ├── ProfileMenuModal.js
│   │   │   ├── QuickAccessModal.js
│   │   │   ├── SettingsMenuModal.js
│   │   │   └── ToolsMenuModal.js
│   │   │
│   │   ├── screens/          # Volledige schermen
│   │   │   ├── BasicSetupFlow.js
│   │   │   ├── CustomTextsFlow.js
│   │   │   ├── ExtendedModeSetup.js
│   │   │   ├── GalleryScreen.js       # Foto gallery met move/copy
│   │   │   ├── HistoryView.js
│   │   │   ├── ListManagerScreen.js
│   │   │   ├── ManageLocationsScreen.js
│   │   │   ├── ManagePartnersScreen.js
│   │   │   ├── ManagePeopleLocations.js
│   │   │   ├── ManagePhotosScreen.js
│   │   │   ├── ManageTopicsScreen.js
│   │   │   ├── OnboardingFlow.js
│   │   │   ├── ProfileSetupFlow.js
│   │   │   ├── SmartSentenceBuilder.js
│   │   │   └── VoiceSettingsScreen.js
│   │   │
│   │   └── test/             # Test componenten
│   │       └── SpeechTest.js
│   │
│   ├── context/              # React Context voor state management
│   │   ├── AppContext.js          # Hoofdcontext (profile, photos, history)
│   │   ├── CategoriesContext.js   # Categorieën met zinnen
│   │   ├── SentenceContext.js     # Zin-bouw logica
│   │   ├── UIContext.js           # UI state (modals, views)
│   │   └── index.js
│   │
│   ├── data/                 # Initiële data en constanten
│   │   └── index.js          # INITIAL_CATEGORIES, DEFAULT_QUICK, etc.
│   │
│   ├── services/             # Business logic
│   │   ├── aiSuggestions.js  # AI zin suggesties
│   │   ├── speechService.js  # Text-to-speech wrapper
│   │   └── index.js
│   │
│   ├── styles/               # Stylesheets
│   │   └── index.js
│   │
│   ├── theme/                # Kleuren en thema
│   │   └── index.js          # Dark theme colors
│   │
│   └── utils/                # Helper functies
│       └── storage.js        # AsyncStorage wrappers
```

---

## 🔑 Key Features (Wat al werkt)

### ✅ Volledig werkend
- **Onboarding flow** - Vraagt naam, partner, voorkeursstem
- **Categorieën** - 6 standaard categorieën met zinnen
- **Quick responses** - Ja/Nee/Moment/Misschien knoppen
- **Text-to-speech** - Nederlandse spraak via expo-speech
- **Foto gallery** - Toevoegen, bewerken, fullscreen tonen
- **Move/copy foto's** - Verplaats foto's tussen albums
- **Zin geschiedenis** - Recent gesproken zinnen
- **Noodmodus** - Medische info + noodcontacten
- **Persistentie** - Data blijft bewaard via AsyncStorage
- **Smart Sentence Builder** - WIE/DOE/WAT/WAAR structuur

### 🔄 Gedeeltelijk werkend
- **AI suggesties** - Basis implementatie, kan uitgebreid worden

---

## 🎨 App States

De app heeft deze main views:

1. **HOME** - Hoofdscherm met categorieën en quick responses
2. **PHRASES** - Zinnen binnen geselecteerde categorie
3. **BUILDER** - Smart sentence builder
4. **GALLERY** - Foto albums
5. **HISTORY** - Gesproken zinnen geschiedenis

---

## 🗣️ Speech Service

De speech service (`src/services/speechService.js`) wrapt expo-speech:

```javascript
import speechService from './src/services/speechService';

// Spreek tekst uit
speechService.speak("Hallo, ik ben Jan");

// Stop spraak
speechService.stop();

// Check of spraak bezig is
const isSpeaking = await speechService.isSpeaking();
```

---

## 💾 Data Persistence

Data wordt opgeslagen met AsyncStorage. Key prefixes:

- `@tala_profile` - Gebruikersprofiel
- `@tala_categories` - Categorieën en zinnen
- `@tala_gallery` - Foto's per album
- `@tala_history` - Spraakgeschiedenis
- `@tala_onboarded` - Onboarding voltooid flag

---

## 🎯 Context API

De app gebruikt React Context voor state management:

```javascript
import { useApp, useCategories } from './src/context';

// In component:
const { profile, setProfile, photos, history } = useApp();
const { categories, addPhrase, removePhrase } = useCategories();
```

---

## 🛠️ Development Tips

### Expo Go tunneling (als QR niet werkt)
```bash
npx expo start --tunnel
```

### Clear cache
```bash
npx expo start -c
```

### Reset AsyncStorage (in app)
Ga naar Settings → Reset App

---

## 📱 Test Checklist

Na setup, test deze flows:

1. [ ] App start zonder errors
2. [ ] Onboarding flow werkt (naam invoeren)
3. [ ] Categorie tappen → zinnen zien
4. [ ] Zin tappen → spraak horen
5. [ ] Quick response knoppen werken
6. [ ] Gallery → foto toevoegen (camera/library)
7. [ ] Foto fullscreen tonen
8. [ ] History view toont recente zinnen
9. [ ] Noodmodus opent met medische info

---

## ❓ Troubleshooting

### "Unable to resolve module" error
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Expo Go ziet app niet
- Check dat telefoon op zelfde WiFi zit
- Probeer `npx expo start --tunnel`

### Spraak werkt niet
- Check volume telefoon
- Test met `SpeechTest` component (uncomment in App.js)

---

## 📞 Contact

Vragen? Neem contact op met de maintainer.

---

*Dit document is voor het snel opstarten van development in een nieuwe repo.*
