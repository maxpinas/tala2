# Tala Roadmap - Gefaseerde Implementatie

**Versie:** 1.1.0  
**Laatst bijgewerkt:** 6 december 2025  
**Strategie:** Iteratieve releases die elke 2-3 weken bruikbare waarde leveren

---

## 🎯 Filosofie

Focus op **universeel design** - één app die werkt voor:
- Mensen met ernstige afasie (non-verbaal, beperkte geletterdheid)
- Mensen met lichte afasie (kunnen lezen/typen maar hebben ondersteuning nodig)
- Verzorgers en familie (vol controle over content en instellingen)
- Internationale gebruikers (meertalig vanaf de basis)

**Geen binaire "patiënt/verzorger modus"** - maar een spectrum van aanpasbaarheid waar iedereen zijn ideale balans vindt.

### Design Principes
1. **Defaults > Options > Settings** - Kies smart defaults, maak niet alles configureerbaar
2. **Emoji's zijn universeel** - Werken over talen en geletterdheid heen
3. **Grote touch targets** - Minimaal 44pt, liefst 66-88pt voor motoriek issues
4. **Audio als gelijkwaardig kanaal** - Niet alleen output, ook navigatie feedback
5. **Instant = Default** - Tappen spreekt direct, bouwen is advanced

---

## 📱 NU: App Delen Zonder Expo Go

### Optie 1: Development Build (Android APK) - Aanbevolen

```bash
# 1. Installeer EAS CLI (eenmalig)
npm install -g eas-cli

# 2. Login bij Expo (maak account aan op expo.dev als je die niet hebt)
eas login

# 3. Configureer project
eas build:configure

# 4. Bouw Android APK voor development
eas build --profile development --platform android
```

**Resultaat na ~20 minuten:**
- Je krijgt een URL: `https://expo.dev/artifacts/eas/abcdef123.apk`
- Deze link kun je WhatsAppen/mailen naar wie je wilt
- Zij tappen link → download APK → installeren
- **Geen Expo Go nodig** - het IS jouw app

### Optie 2: Preview Build (productieklaar, maar niet in store)

```bash
# Voor een "echte" app experience zonder store submission
eas build --profile preview --platform android
```

### Optie 3: iOS TestFlight (vereist Apple Developer Account €99/jaar)

```bash
# 1. Zorg dat je Apple Developer account hebt
# 2. Bouw voor iOS
eas build --profile production --platform ios

# 3. Submit naar TestFlight
eas submit --platform ios

# 4. Nodig testers uit via App Store Connect
```

### EAS Configuratie (eas.json)

Na `eas build:configure` krijg je een `eas.json`. Hier is een optimale configuratie:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📋 Fase Overzicht

| Fase | Focus | Weken | Uren | Status |
|------|-------|-------|------|--------|
| 0 | Accessibility & i18n Structuur | 1-2 | ~20 | 🔴 Not Started |
| 1 | Visual Scaling System | 3-4 | ~20 | 🔴 Not Started |
| 2 | Visuele Taal (Emoji's + Kleuren) | 5-6 | ~20 | 🔴 Not Started |
| 3 | Audio-First Interacties | 7-8 | ~20 | 🔴 Not Started |
| 4 | Instant Mode als Default | 9-10 | ~20 | 🔴 Not Started |
| 5 | Meertaligheid Live | 11-12 | ~20 | 🔴 Not Started |
| 6 | Smart Defaults | 13-14 | ~20 | 🔴 Not Started |
| 7 | Family Dashboard | 15-16 | ~20 | 🔴 Not Started |
| 8 | Community Content Library | 17-18 | ~20 | 🔴 Not Started |
| 9 | Progressive Web App | 19-20 | ~20 | 🔴 Not Started |

**MVP Aanbeveling:** Fase 0 + 1 + 2 + 5 = 8 weken, internationaal bruikbare app

---

## Fase 0: Fundament - Accessibility & i18n Structuur

**Tijdsinvestering:** Week 1-2 (~20 uur)  
**Status:** 🔴 Not Started

### Doel
Technische basis voor toegankelijkheid en meertaligheid - zonder zichtbare UI changes.

### A. Internationalisatie Setup

**Installatie:**
```bash
npm install i18n-js
```

**Folder structuur maken:**
```
src/
└── i18n/
    ├── index.js
    ├── nl.json
    └── en.json
```

**src/i18n/index.js:**
```javascript
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import nl from './nl.json';
import en from './en.json';

const i18n = new I18n({
  nl,
  en,
});

i18n.locale = Localization.locale.split('-')[0]; // 'nl' of 'en'
i18n.enableFallback = true;
i18n.defaultLocale = 'nl';

export default i18n;
```

**src/i18n/nl.json (extract alle strings):**
```json
{
  "app": {
    "greeting_morning": "Goedemorgen {name}",
    "greeting_afternoon": "Goedemiddag {name}",
    "greeting_evening": "Goedenavond {name}"
  },
  "nav": {
    "speak": "Praten",
    "history": "Herhaal",
    "instant": "Direct",
    "emergency": "Snel"
  },
  "categories": {
    "personal": "Persoonlijk",
    "custom": "Aangepast",
    "social": "Sociaal",
    "work": "Werk",
    "home": "Thuis",
    "medical": "Medisch"
  },
  "quick": {
    "yes": "Ja",
    "no": "Nee",
    "moment": "Moment",
    "maybe": "Misschien"
  },
  "actions": {
    "speak": "Spreken",
    "copy": "Kopieer",
    "show": "Toon",
    "clear": "Wissen",
    "back": "Terug",
    "save": "Opslaan",
    "cancel": "Annuleren",
    "delete": "Verwijderen",
    "edit": "Aanpassen",
    "add": "Toevoegen"
  },
  "gallery": {
    "title": "Laten Zien",
    "add_photo": "Foto Toevoegen",
    "from_camera": "Camera",
    "from_library": "Bibliotheek",
    "caption_placeholder": "Wat wil je zeggen bij deze foto?"
  },
  "builder": {
    "title": "Zinsbouwer",
    "placeholder": "Zin wordt hier gebouwd...",
    "who": "WIE",
    "do": "DOE",
    "what": "WAT",
    "where": "WAAR",
    "type_custom": "Of typ zelf...",
    "ai_suggestions": "Tips:",
    "complete_sentence": "Maak zin af"
  },
  "emergency": {
    "title": "NOODGEVAL",
    "call_112": "BEL 112",
    "need_help": "IK HEB HULP NODIG",
    "call_partner": "Bel Partner",
    "call_doctor": "Bel Arts"
  },
  "medical": {
    "title": "MEDISCHE INFO",
    "intro": "Dit zijn mijn medische gegevens.",
    "name": "NAAM",
    "address": "ADRES",
    "blood_type": "BLOEDGROEP",
    "medication": "MEDICATIE",
    "allergies": "ALLERGIEËN",
    "contacts": "CONTACTPERSONEN",
    "unknown": "Onbekend",
    "not_specified": "Niet opgegeven",
    "none_known": "Geen bekend"
  },
  "settings": {
    "title": "Instellingen",
    "profile": "Profiel",
    "content": "Inhoud",
    "voice": "Stem",
    "accessibility": "Toegankelijkheid",
    "about": "Over Tala",
    "reset": "Reset App"
  },
  "accessibility": {
    "speak_button": "Spreek zin uit",
    "speak_hint": "Dubbeltik om je zin uit te spreken",
    "category_tile": "Categorie {name}",
    "category_hint": "Dubbeltik om zinnen te zien",
    "quick_response": "Snel antwoord: {text}",
    "photo_tile": "Foto: {caption}",
    "photo_hint": "Dubbeltik om fullscreen te tonen",
    "nav_speak": "Open zinsbouwer",
    "nav_history": "Bekijk geschiedenis",
    "nav_instant": "Schakel directe modus",
    "nav_emergency": "Noodtoegang",
    "close_modal": "Sluit dit scherm",
    "back_button": "Terug naar vorige scherm"
  },
  "onboarding": {
    "welcome_title": "Welkom bij Tala",
    "welcome_text": "Je persoonlijke communicatie assistent",
    "name_title": "Hoe heet je?",
    "name_placeholder": "Jouw naam",
    "partner_title": "Wie is je partner of verzorger?",
    "partner_placeholder": "Naam partner/verzorger",
    "start_button": "Start met Tala",
    "next": "Volgende",
    "skip": "Overslaan"
  }
}
```

### B. Accessibility Labels Toevoegen

**Top 20 Critical Touchpoints:**

1. **Speak button (OutputBar)**
```jsx
<TouchableOpacity
  onPress={onSpeak}
  accessibilityLabel={i18n.t('accessibility.speak_button')}
  accessibilityRole="button"
  accessibilityHint={i18n.t('accessibility.speak_hint')}
>
```

2. **Quick Responses**
```jsx
<TouchableOpacity
  onPress={() => handlePhrasePress(qr)}
  accessibilityLabel={i18n.t('accessibility.quick_response', { text: qr })}
  accessibilityRole="button"
>
```

3. **Category Tiles**
```jsx
<TouchableOpacity
  onPress={() => handleCategoryPress(cat)}
  accessibilityLabel={i18n.t('accessibility.category_tile', { name: cat })}
  accessibilityRole="button"
  accessibilityHint={i18n.t('accessibility.category_hint')}
>
```

4. **Bottom Navigation**
```jsx
<TouchableOpacity
  style={styles.navBtn}
  onPress={() => setIsBuilding(true)}
  accessibilityLabel={i18n.t('accessibility.nav_speak')}
  accessibilityRole="button"
>
```

5. **Photo Tiles**
```jsx
<TouchableOpacity
  onPress={() => handlePhotoPress(photo)}
  accessibilityLabel={i18n.t('accessibility.photo_tile', { caption: photo.text })}
  accessibilityRole="imagebutton"
  accessibilityHint={i18n.t('accessibility.photo_hint')}
>
```

### Bestanden te Wijzigen
- [ ] `src/i18n/index.js` (nieuw)
- [ ] `src/i18n/nl.json` (nieuw)
- [ ] `src/i18n/en.json` (nieuw - kopieer nl.json, vertaal later)
- [ ] `App.js` (accessibility labels + i18n imports)
- [ ] `src/components/common/OutputBar.js`
- [ ] `src/components/common/EditToolbar.js`
- [ ] `src/components/screens/GalleryScreen.js`
- [ ] `src/components/screens/SmartSentenceBuilder.js`
- [ ] `src/components/modals/*.js` (alle modals)

### Acceptatie Criteria
- [ ] VoiceOver (iOS) kan app volledig navigeren met audio feedback
- [ ] TalkBack (Android) leest alle belangrijke UI elementen voor
- [ ] Alle tekst komt uit i18n JSON files (geen hardcoded strings)
- [ ] App werkt identiek in Nederlands als voor de refactor
- [ ] `console.log` toont welke taal actief is bij app start

---

## Fase 1: Visual Scaling System

**Tijdsinvestering:** Week 3-4 (~20 uur)  
**Status:** 🔴 Not Started

### Doel
Adaptieve UI met settings slider - geen aparte modi, maar één interface die mee schaalt.

### A. Scaling Infrastructure

**src/theme/scaling.js:**
```javascript
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Base scale factor gebaseerd op schermgrootte
const BASE_SCALE = SCREEN_WIDTH / 375; // 375 = iPhone SE width

export const createScaler = (uiScale = 1.0) => {
  const combinedScale = BASE_SCALE * uiScale;
  
  return {
    // Font scaling
    font: (size) => Math.round(size * combinedScale),
    
    // Spacing/padding scaling
    space: (size) => Math.round(size * combinedScale),
    
    // Touch target minimums (WCAG 2.5.5)
    touchTarget: (baseSize) => Math.max(44, Math.round(baseSize * combinedScale)),
    
    // Icon scaling
    icon: (size) => Math.round(size * combinedScale),
    
    // Border radius (scale less aggressively)
    radius: (size) => Math.round(size * (1 + (combinedScale - 1) * 0.5)),
  };
};

// Hook voor gebruik in components
export const useScaling = (uiScale) => {
  return createScaler(uiScale);
};

// Preset scales
export const SCALE_PRESETS = {
  small: 0.9,
  normal: 1.0,
  large: 1.3,
  extraLarge: 1.6,
};
```

### B. AppContext Update

Voeg toe aan `src/context/AppContext.js`:
```javascript
// In initial profile state
const [profile, setProfile] = useState({
  // ... bestaande velden
  uiScale: 1.0, // NIEUW: default normal
});
```

### C. Onboarding Scale Selector

Nieuwe stap in `OnboardingFlow.js` (na welkom, voor naam):

```jsx
const ScaleSelector = ({ onSelect, currentScale }) => {
  const previewText = "Ik heet Jan en ik heb afasie.";
  
  return (
    <View style={styles.onbCard}>
      <Text style={styles.onbTitle}>Hoe groot wil je de tekst?</Text>
      
      {/* Live Preview */}
      <View style={[styles.previewBox, { marginBottom: 24 }]}>
        <Text style={{ 
          fontSize: 18 * currentScale, 
          color: '#FFF',
          textAlign: 'center'
        }}>
          {previewText}
        </Text>
      </View>
      
      {/* Preset Buttons */}
      <View style={styles.scaleOptions}>
        <TouchableOpacity
          style={[styles.scaleBtn, currentScale === 1.0 && styles.scaleBtnActive]}
          onPress={() => onSelect(1.0)}
        >
          <Text style={styles.scaleBtnText}>Normaal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scaleBtn, currentScale === 1.3 && styles.scaleBtnActive]}
          onPress={() => onSelect(1.3)}
        >
          <Text style={[styles.scaleBtnText, { fontSize: 18 }]}>Groot</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scaleBtn, currentScale === 1.6 && styles.scaleBtnActive]}
          onPress={() => onSelect(1.6)}
        >
          <Text style={[styles.scaleBtnText, { fontSize: 22 }]}>Extra Groot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### D. Styles Refactoren

**Voorbeeld refactor in `src/styles/index.js`:**

```javascript
// OUD:
catTitle: { color: theme.text, fontSize: 16, fontWeight: 'bold' },

// NIEUW (gebruik scale functie):
// In component waar style gebruikt wordt:
const { font, space } = useScaling(profile.uiScale);

<Text style={[styles.catTitle, { fontSize: font(16) }]}>{title}</Text>
```

**Prioriteit refactoring (meeste impact eerst):**
1. Category tile titles + icons
2. Quick response buttons
3. Bottom nav labels + icons
4. Sentence bar word bubbles
5. Gallery photo captions
6. Modal titles + body text
7. Form labels + inputs

### Acceptatie Criteria
- [ ] UI schaalt consistent bij 1.0x, 1.3x, 1.6x
- [ ] Geen text overflow of layout breaks
- [ ] Onboarding toont scale selector als stap 2
- [ ] Touch targets minimaal 44pt (WCAG)
- [ ] Scale preference persists na app restart

---

## Fase 2: Visuele Taal - Icons + Kleuren

**Tijdsinvestering:** Week 5-6 (~20 uur)  
**Status:** 🔴 Not Started

### Doel
App begrijpelijk maken zonder tekst kunnen lezen - emoji's en kleuren als primaire communicatie.

### A. Category Data Update

**src/data/index.js:**
```javascript
export const INITIAL_CATEGORIES = {
  Persoonlijk: { 
    icon: 'user', 
    emoji: '👤',
    color: '#8B5CF6', // Purple
    items: [] 
  },
  Aangepast: { 
    icon: 'edit-3', 
    emoji: '✏️',
    color: '#06B6D4', // Cyan (primary)
    items: [] 
  },
  Sociaal: { 
    icon: 'smile', 
    emoji: '😊',
    color: '#FBBF24', // Yellow
    items: ["Hoe is het?", "Leuk je te zien", "Dank je wel", "Tot ziens"] 
  },
  Werk: { 
    icon: 'briefcase', 
    emoji: '💼',
    color: '#3B82F6', // Blue
    items: ["Ik zit in een meeting", "Even overleggen", "Ik werk thuis"] 
  },
  Thuis: { 
    icon: 'home', 
    emoji: '🏠',
    color: '#10B981', // Green
    items: ["Ik heb honger", "Ik ga slapen", "Ik ben moe", "Ik wil koffie"] 
  },
  Medisch: { 
    icon: 'activity', 
    emoji: '⚕️',
    color: '#EF4444', // Red
    items: ["Ik heb pijn", "Medicatie tijd", "Ik voel me niet lekker", "Ik heb hulp nodig"] 
  },
};

export const DEFAULT_QUICK = [
  { text: "Ja", emoji: "✅" },
  { text: "Nee", emoji: "❌" },
  { text: "Moment", emoji: "⏱️" },
  { text: "Misschien", emoji: "🤔" }
];

// Sentence builder tabs
export const WORD_CATEGORIES = {
  WIE: { 
    emoji: '👤',
    color: '#FBBF24',
    words: ["Ik", "Jij", "Wij", "Zij", "De dokter", "Iemand", "Bezoek"]
  },
  DOE: { 
    emoji: '⚡',
    color: '#10B981',
    words: ["Wil", "Ga", "Heb", "Ben", "Moet", "Kan", "Vind", "Zie"]
  },
  WAT: { 
    emoji: '📦',
    color: '#3B82F6',
    words: ["Koffie", "Water", "Eten", "Pijn", "Hulp", "Rust", "Huis", "Auto"]
  },
  WAAR: { 
    emoji: '📍',
    color: '#F97316',
    words: ["Hier", "Daar", "Thuis", "Buiten", "Boven", "Nu", "Straks", "Morgen"]
  }
};
```

### B. Category Tile Rendering

**Update in App.js:**
```jsx
const renderCategoryTile = (catKey, catData) => {
  const { font, space, icon } = useScaling(profile.uiScale);
  
  return (
    <TouchableOpacity
      key={catKey}
      style={[
        styles.catTile,
        { 
          borderLeftWidth: 4,
          borderLeftColor: catData.color,
        }
      ]}
      onPress={() => handleCategoryPress(catKey)}
      accessibilityLabel={i18n.t('accessibility.category_tile', { name: catKey })}
    >
      {/* Grote emoji bovenaan */}
      <Text style={{ fontSize: font(42), marginBottom: space(8) }}>
        {catData.emoji}
      </Text>
      
      {/* Titel onderaan */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name={catData.icon} size={icon(16)} color={theme.textDim} />
        <Text style={[styles.catTitle, { fontSize: font(14), marginLeft: space(6) }]}>
          {catKey}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
```

### C. Quick Responses met Emoji

```jsx
{quickResponses.map((qr, i) => (
  <TouchableOpacity 
    key={i} 
    style={styles.quickBtn} 
    onPress={() => handlePhrasePress(qr.text || qr)}
  >
    <Text style={styles.quickText}>
      {qr.emoji ? `${qr.emoji} ${qr.text}` : qr}
    </Text>
  </TouchableOpacity>
))}
```

### D. Sentence Builder Emoji Tabs

```jsx
<View style={styles.wordTabs}>
  {Object.entries(WORD_CATEGORIES).map(([cat, data]) => (
    <TouchableOpacity 
      key={cat} 
      style={[
        styles.wordTab, 
        builderTab === cat && { backgroundColor: data.color }
      ]} 
      onPress={() => setBuilderTab(cat)}
    >
      <Text style={{ fontSize: 20, marginRight: 4 }}>{data.emoji}</Text>
      <Text style={[
        styles.wordTabText, 
        builderTab === cat && { color: '#000' }
      ]}>
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
</View>
```

### E. Gallery Emoji Fallback

Voor foto's zonder URI (text-only visuele content):

```jsx
const renderPhotoTile = (photo) => {
  if (photo.uri) {
    return <Image source={{ uri: photo.uri }} style={styles.photoImage} />;
  }
  
  // Emoji fallback
  return (
    <View style={[
      styles.photoPlaceholder, 
      { backgroundColor: photo.color || theme.surface }
    ]}>
      <Text style={{ fontSize: 64 }}>{photo.emoji || '📷'}</Text>
    </View>
  );
};
```

### F. EmojiPicker Component

**src/components/common/EmojiPicker.js:**
```jsx
import React from 'react';
import { View, TouchableOpacity, Text, ScrollView, Modal } from 'react-native';

const EMOJI_CATEGORIES = {
  people: ['👤', '👨', '👩', '👴', '👵', '👶', '👨‍⚕️', '👩‍⚕️', '🧑‍🤝‍🧑'],
  expressions: ['😊', '😢', '😴', '🤒', '😰', '🥰', '😤', '🤔', '😌'],
  food: ['🍽️', '☕', '🥤', '🍞', '🥗', '🍎', '💊', '🍰', '🥛'],
  places: ['🏠', '🏥', '🛒', '🚗', '🛏️', '🚽', '🪑', '📺', '🚿'],
  actions: ['✅', '❌', '⏱️', '📞', '💬', '👋', '🙏', '💪', '🆘'],
  medical: ['⚕️', '💉', '🩹', '🌡️', '💊', '🏥', '🚑', '❤️', '🩺'],
  time: ['🌅', '☀️', '🌙', '📅', '⏰', '🔜', '🔙', '⬆️', '⬇️'],
  misc: ['❤️', '⭐', '🎵', '📱', '🔑', '💤', '🎁', '📖', '✏️'],
};

const EmojiPicker = ({ visible, onClose, onSelect }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Kies een Emoji</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <View key={category} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <View style={styles.emojiGrid}>
                  {emojis.map((emoji, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.emojiBtn}
                      onPress={() => {
                        onSelect(emoji);
                        onClose();
                      }}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EmojiPicker;
```

### Acceptatie Criteria
- [ ] Alle categories tonen grote emoji (42pt+)
- [ ] Quick responses hebben emoji prefixes
- [ ] Sentence builder tabs hebben emoji's
- [ ] Gallery kan emoji+color tiles tonen
- [ ] EmojiPicker werkt voor custom content
- [ ] Test met colorblind simulator - kleuren onderscheidbaar

---

## Fase 3: Audio-First Interacties

**Tijdsinvestering:** Week 7-8 (~20 uur)  
**Status:** 🔴 Not Started

### Doel
Spraak als navigatie hulp - hover/focus spreekt UI elementen uit.

### A. Audio Feedback Setting

**AppContext toevoegen:**
```javascript
profile: {
  // ... bestaande velden
  audioFeedback: true, // NIEUW
  guidedMode: false,   // NIEUW
  guidedModeProgress: {
    welcome: false,
    categories: false,
    builder: false,
    gallery: false,
    emergency: false
  }
}
```

### B. Hover-to-Speak Hook

**src/hooks/useHoverSpeak.js:**
```javascript
import { useState, useCallback, useRef } from 'react';
import speechService from '../services/speechService';
import { useApp } from '../context/AppContext';

export const useHoverSpeak = () => {
  const { profile } = useApp();
  const timeoutRef = useRef(null);
  
  const startHover = useCallback((text, delay = 800) => {
    if (!profile.audioFeedback) return;
    
    // Cancel any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      speechService.speak(text, { rate: 0.9 });
    }, delay);
  }, [profile.audioFeedback]);
  
  const cancelHover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    speechService.stop();
  }, []);
  
  return { startHover, cancelHover };
};
```

### C. Implementatie in Components

**Category tiles:**
```jsx
const { startHover, cancelHover } = useHoverSpeak();

<TouchableOpacity
  onPressIn={() => startHover(catKey)}
  onPressOut={cancelHover}
  onPress={() => handleCategoryPress(catKey)}
>
```

**Quick responses:**
```jsx
<TouchableOpacity
  onPressIn={() => startHover(qr.text || qr)}
  onPressOut={cancelHover}
  onPress={() => handlePhrasePress(qr.text || qr)}
>
```

### D. Guided Mode Coach

**src/components/common/GuidedModeOverlay.js:**
```jsx
const GUIDED_STEPS = {
  welcome: {
    text: "Welkom bij Tala! Ik help je de app te leren kennen.",
    next: 'categories'
  },
  categories: {
    text: "Dit zijn je categorieën. Tik op een categorie om zinnen te zien.",
    highlight: 'categoryGrid',
    next: 'builder'
  },
  builder: {
    text: "Hier kun je je eigen zinnen bouwen. Tik op Praten om te beginnen.",
    highlight: 'speakButton',
    next: 'gallery'
  },
  gallery: {
    text: "In Laten Zien kun je foto's toevoegen en tonen.",
    highlight: 'galleryBanner',
    next: 'emergency'
  },
  emergency: {
    text: "Bij nood tik je op Snel voor hulp en noodcontacten.",
    highlight: 'emergencyButton',
    next: null
  }
};

const GuidedModeOverlay = ({ step, onNext, onSkip }) => {
  const stepData = GUIDED_STEPS[step];
  
  useEffect(() => {
    // Auto-speak guidance
    speechService.speak(stepData.text, { rate: 0.85 });
  }, [step]);
  
  return (
    <View style={styles.overlay}>
      <View style={styles.coachBubble}>
        <Text style={styles.coachText}>{stepData.text}</Text>
        <View style={styles.coachActions}>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>Overslaan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
            <Text style={styles.nextText}>
              {stepData.next ? 'Volgende' : 'Klaar!'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
```

### E. Settings Toggle

**In VoiceSettingsScreen.js (of nieuwe AccessibilityScreen):**
```jsx
<View style={styles.settingRow}>
  <View>
    <Text style={styles.settingLabel}>Spraak bij aanraken</Text>
    <Text style={styles.settingDescription}>
      Hoor de naam van knoppen als je ze aanraakt
    </Text>
  </View>
  <Switch
    value={profile.audioFeedback}
    onValueChange={(value) => setProfile(prev => ({ ...prev, audioFeedback: value }))}
  />
</View>

<View style={styles.settingRow}>
  <View>
    <Text style={styles.settingLabel}>Tutorial herhalen</Text>
    <Text style={styles.settingDescription}>
      Start de rondleiding opnieuw
    </Text>
  </View>
  <TouchableOpacity 
    style={styles.resetBtn}
    onPress={() => {
      setProfile(prev => ({
        ...prev,
        guidedMode: true,
        guidedModeProgress: {
          welcome: false,
          categories: false,
          builder: false,
          gallery: false,
          emergency: false
        }
      }));
    }}
  >
    <Text style={styles.resetBtnText}>Reset</Text>
  </TouchableOpacity>
</View>
```

### Acceptatie Criteria
- [ ] Hold 800ms op element → hoor label uitgesproken
- [ ] Lift vinger voor 800ms → geen spraak
- [ ] Audio feedback toggle werkt
- [ ] Guided mode coacht door eerste gebruik
- [ ] Guided mode kan geskipped worden
- [ ] Tutorial reset knop werkt

---

## Fase 4: Instant Mode als Default

**Tijdsinvestering:** Week 9-10 (~20 uur)  
**Status:** 🔴 Not Started

### Doel
Simplify mental model - tappen = spreken wordt default.

### A. Default Mode Wijzigen

**In AppContext:**
```javascript
// WIJZIG default van false naar true
const [isInstantMode, setIsInstantMode] = useState(true);
```

### B. Bottom Nav Refactor

**Wijzig "Direct" naar "Bouwen":**
```jsx
<View style={styles.fixedBottomNav}>
  {/* Home */}
  <TouchableOpacity 
    style={styles.navBtn} 
    onPress={() => setCurrentView('HOME')}
  >
    <Feather name="home" size={24} color={theme.text} />
    <Text style={styles.navLabel}>Home</Text>
  </TouchableOpacity>
  
  {/* Praten - PRIMARY */}
  <TouchableOpacity 
    style={[styles.navBtn, styles.navBtnPrimary]} 
    onPress={handleMainAction}
  >
    <Feather name="message-circle" size={28} color="#000" />
    <Text style={styles.navLabelPrimary}>Praten</Text>
  </TouchableOpacity>
  
  {/* Herhaal */}
  <TouchableOpacity 
    style={styles.navBtn} 
    onPress={() => setCurrentView('HISTORY')}
  >
    <Feather name="clock" size={24} color={theme.text} />
    <Text style={styles.navLabel}>Herhaal</Text>
  </TouchableOpacity>
  
  {/* Bouwen (was: Direct) */}
  <TouchableOpacity 
    style={styles.navBtn} 
    onPress={() => {
      setBuilderMode('SENTENCE');
      setIsBuilding(true);
    }}
  >
    <Feather name="edit-3" size={24} color={theme.textDim} />
    <Text style={styles.navLabel}>Bouwen</Text>
  </TouchableOpacity>
  
  {/* Snel */}
  <TouchableOpacity 
    style={styles.navBtn} 
    onPress={() => setShowQuickAccess(true)}
  >
    <Feather name="zap" size={24} color={theme.warning} />
    <Text style={styles.navLabel}>Snel</Text>
  </TouchableOpacity>
</View>
```

### C. Long-Press Context Menus

**src/components/common/ContextMenu.js:**
```jsx
import React from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

const ContextMenu = ({ visible, onClose, options, title }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menu}>
          {title && <Text style={styles.menuTitle}>{title}</Text>}
          
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                option.destructive && styles.menuItemDestructive
              ]}
              onPress={() => {
                option.onPress();
                onClose();
              }}
            >
              <Feather 
                name={option.icon} 
                size={20} 
                color={option.destructive ? theme.danger : theme.text} 
              />
              <Text style={[
                styles.menuItemText,
                option.destructive && styles.menuItemTextDestructive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Annuleren</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
```

**Gebruik voor photo tiles:**
```jsx
const [contextMenu, setContextMenu] = useState({ visible: false, photo: null });

<TouchableOpacity
  onPress={() => openFullscreen(photo)}
  onLongPress={() => setContextMenu({ visible: true, photo })}
  delayLongPress={500}
>

<ContextMenu
  visible={contextMenu.visible}
  onClose={() => setContextMenu({ visible: false, photo: null })}
  title={contextMenu.photo?.text || 'Foto'}
  options={[
    { icon: 'eye', label: 'Toon Fullscreen', onPress: () => openFullscreen(contextMenu.photo) },
    { icon: 'edit-2', label: 'Bewerk', onPress: () => editPhoto(contextMenu.photo) },
    { icon: 'copy', label: 'Kopieer naar...', onPress: () => copyPhoto(contextMenu.photo) },
    { icon: 'trash-2', label: 'Verwijderen', onPress: () => deletePhoto(contextMenu.photo), destructive: true },
  ]}
/>
```

### D. Grote Terug Knop

**Universal back button component:**
```jsx
const BigBackButton = ({ onPress, label = "Terug" }) => {
  const { font, space, touchTarget } = useScaling(profile.uiScale);
  
  return (
    <TouchableOpacity
      style={[styles.bigBackBtn, { 
        width: touchTarget(70),
        height: touchTarget(70),
      }]}
      onPress={onPress}
      accessibilityLabel={i18n.t('accessibility.back_button')}
      accessibilityRole="button"
    >
      <Feather name="arrow-left" size={font(32)} color={theme.text} />
      <Text style={[styles.backLabel, { fontSize: font(12) }]}>{label}</Text>
    </TouchableOpacity>
  );
};
```

### Acceptatie Criteria
- [ ] Fresh install → instant mode default
- [ ] Tap phrase/photo = speaks immediately
- [ ] "Bouwen" knop opent sentence builder
- [ ] Long-press op photo → context menu
- [ ] Grote terug knop altijd zichtbaar
- [ ] Geen confusion over modes (duidelijk mental model)

---

## Fase 5: Meertaligheid Live

**Tijdsinvestering:** Week 11-12 (~20 uur)  
**Status:** 🔴 Not Started

### Doel
Engels live, andere talen voorbereid, content volgt taalswitch.

### A. Engels Vertaling

Vertaal `nl.json` → `en.json`. Hier key excerpts:

```json
{
  "app": {
    "greeting_morning": "Good morning {name}",
    "greeting_afternoon": "Good afternoon {name}",
    "greeting_evening": "Good evening {name}"
  },
  "nav": {
    "speak": "Speak",
    "history": "History",
    "instant": "Instant",
    "emergency": "Quick"
  },
  "categories": {
    "personal": "Personal",
    "custom": "Custom",
    "social": "Social",
    "work": "Work",
    "home": "Home",
    "medical": "Medical"
  },
  "quick": {
    "yes": "Yes",
    "no": "No",
    "moment": "One moment",
    "maybe": "Maybe"
  },
  "emergency": {
    "title": "EMERGENCY",
    "call_112": "CALL 112",
    "need_help": "I NEED HELP"
  }
}
```

### B. Language Selector UI

**src/components/screens/LanguageSettingsScreen.js:**
```jsx
const LANGUAGES = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', available: true },
  { code: 'en', name: 'English', flag: '🇬🇧', available: true },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', available: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', available: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', available: false },
];

const LanguageSettingsScreen = () => {
  const { profile, setProfile } = useApp();
  const [pendingLanguage, setPendingLanguage] = useState(null);
  
  const handleLanguageSelect = (langCode) => {
    if (langCode === profile.language) return;
    setPendingLanguage(langCode);
  };
  
  const confirmLanguageChange = () => {
    i18n.locale = pendingLanguage;
    setProfile(prev => ({ ...prev, language: pendingLanguage }));
    setPendingLanguage(null);
    // Trigger content translation check
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('settings.language')}</Text>
      
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.langOption,
            profile.language === lang.code && styles.langOptionActive,
            !lang.available && styles.langOptionDisabled
          ]}
          onPress={() => lang.available && handleLanguageSelect(lang.code)}
          disabled={!lang.available}
        >
          <Text style={styles.langFlag}>{lang.flag}</Text>
          <Text style={styles.langName}>{lang.name}</Text>
          {!lang.available && (
            <Text style={styles.comingSoon}>Binnenkort</Text>
          )}
          {profile.language === lang.code && (
            <Feather name="check" size={20} color={theme.primary} />
          )}
        </TouchableOpacity>
      ))}
      
      {/* Confirmation Modal */}
      <Modal visible={!!pendingLanguage} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>
              Switch to {LANGUAGES.find(l => l.code === pendingLanguage)?.name}?
            </Text>
            <Text style={styles.confirmText}>
              The app will restart in the new language.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setPendingLanguage(null)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={confirmLanguageChange}
              >
                <Text style={styles.confirmBtnText}>Switch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
```

### C. TTS Voice Per Language

**Update speechService.js:**
```javascript
const VOICE_MAP = {
  nl: {
    male: 'com.apple.voice.enhanced.nl-NL.Xander',
    female: 'com.apple.voice.enhanced.nl-NL.Claire',
    default: 'xander'
  },
  en: {
    male: 'com.apple.voice.enhanced.en-GB.Daniel',
    female: 'com.apple.voice.enhanced.en-US.Samantha',
    default: 'daniel'
  },
  de: {
    male: 'com.apple.voice.enhanced.de-DE.Markus',
    female: 'com.apple.voice.enhanced.de-DE.Anna',
    default: 'anna'
  }
};

class SpeechService {
  setLanguage(langCode) {
    this.currentLanguage = langCode;
    const voiceConfig = VOICE_MAP[langCode] || VOICE_MAP.en;
    this.setVoice(voiceConfig.default);
  }
  
  getAvailableVoices() {
    return VOICE_MAP[this.currentLanguage] || VOICE_MAP.en;
  }
}
```

### D. Content Translation (Optional Feature)

**src/services/translationService.js:**
```javascript
// Using Google Cloud Translation API (free tier: 500k chars/month)
const GOOGLE_TRANSLATE_API = 'https://translation.googleapis.com/language/translate/v2';

export const translateTexts = async (texts, targetLang, apiKey) => {
  if (!texts.length) return [];
  
  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        format: 'text'
      })
    });
    
    const data = await response.json();
    return data.data.translations.map(t => t.translatedText);
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return originals on error
  }
};

export const translateUserContent = async (categories, gallery, targetLang, apiKey) => {
  // Collect all user content
  const allPhrases = [];
  const phraseMap = [];
  
  Object.entries(categories).forEach(([catKey, catData]) => {
    catData.items.forEach((phrase, index) => {
      allPhrases.push(phrase);
      phraseMap.push({ type: 'category', catKey, index });
    });
  });
  
  gallery.forEach((photo, index) => {
    if (photo.text) {
      allPhrases.push(photo.text);
      phraseMap.push({ type: 'gallery', index });
    }
  });
  
  // Batch translate
  const translated = await translateTexts(allPhrases, targetLang, apiKey);
  
  // Map back
  const newCategories = { ...categories };
  const newGallery = [...gallery];
  
  translated.forEach((text, i) => {
    const map = phraseMap[i];
    if (map.type === 'category') {
      newCategories[map.catKey].items[map.index] = text;
    } else {
      newGallery[map.index].text = text;
    }
  });
  
  return { categories: newCategories, gallery: newGallery };
};
```

### Acceptatie Criteria
- [ ] App werkt volledig in Nederlands en Engels
- [ ] Language selector in settings
- [ ] TTS voice past aan bij taalswitch
- [ ] Content translation wizard (optional)
- [ ] Translated content is contextually correct

---

## Fase 6-9: Geavanceerde Features (Backlog)

### Fase 6: Smart Defaults (~20 uur)
- Usage tracking (lokaal)
- Smart category ordering
- Contextual quick responses
- "Recent Gebruikt" sectie
- Time-of-day patterns

### Fase 7: Family Dashboard (~20 uur)
- Firebase Realtime Database
- Pairing code + QR
- Web dashboard (family.tala.app)
- Opt-in privacy controls

### Fase 8: Community Content (~20 uur)
- Firestore shared phrases
- "Ontdek Zinnen" browser
- Upvote/downvote system
- Moderation + curated packs

### Fase 9: PWA (~20 uur)
- Expo Web setup
- Service Worker offline
- IndexedDB photo storage
- Deploy to app.tala.nl

---

## 🚀 Quick Start: Eerste 4 Weken

**Week 1-2: Fase 2 (Visual Language)**
- Start met emoji's - direct visueel resultaat
- Test met mensen die niet kunnen lezen

**Week 3-4: Fase 1 (Scaling)**
- Voeg UI scaling toe
- Onboarding vraagt tekstgrootte

**Week 5-6: Fase 0 (i18n + A11y)**
- Extract strings
- Accessibility labels

**Week 7-8: Fase 5 (Engels)**
- Vertaal strings
- Language selector

**Resultaat:** Internationaal bruikbare, toegankelijke app in 8 weken

---

## 📊 Success Metrics

### v1.0 Definition of Done
- [ ] Toegankelijk voor screenreaders
- [ ] Schaalbare UI 1.0-2.5x
- [ ] Visual language (emoji + color)
- [ ] Audio feedback optie
- [ ] Nederlands + Engels live
- [ ] 50 active users over 3 maanden
- [ ] <5 crashes per 1000 sessions
- [ ] Positive feedback 3+ logopedisten
- [ ] Published in App Store & Play Store

### KPIs
- **Adoption:** 100 downloads eerste maand
- **Retention:** 40% DAU/MAU
- **Engagement:** 10 speaks per sessie gemiddeld
- **Satisfaction:** 4.5+ star rating

---

## 📝 Notities Sessie 6 December 2025

### Wat We Vandaag Hebben Gedaan
1. ✅ Move/copy functionaliteit voor foto's toegevoegd
2. ✅ Alles gecommit naar GitHub main
3. ✅ Volledige analyse van app staat
4. ✅ Strategisch plan opgesteld

### Volgende Sessie
1. EAS build setup voor Android APK
2. Start Fase 2 (emoji's toevoegen aan categories)
3. Test met eerste gebruikers

### Open Vragen
- Apple Developer Account aanschaffen? (€99/jaar voor iOS TestFlight)
- Welke 3-5 mensen wil je als eerste testers?
- Heb je contact met logopedisten voor feedback?
