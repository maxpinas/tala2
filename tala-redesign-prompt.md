# Tala App UI Redesign - Agent Briefing

## Project Overview

We gaan de Tala app redesignen van een donker thema naar een licht, fris design. De app is een AAC (Augmentative and Alternative Communication) applicatie die gebruikers helpt om te communiceren via tiles, zinnen en afbeeldingen.

**Belangrijkste regel: Alle bestaande functionaliteit moet 100% behouden blijven. We wijzigen alleen de UI/UX, niet de onderliggende logica.**

## Design Specificaties

### Kleurenpalet (Nieuw)

```
Primary Background:    #F5F0E8 (warm beige/cream)
Secondary Background:  #FFFFFF (wit, voor kaarten/modals)
Card/Tile Background:  #9BA3A8 (grijs, standaard tiles)

Accent Colors:
- Thuis:              #C8D4C8 (zacht groen)
- Boodschappen:       #E8DCD0 (beige/peach)
- Eten & Drinken:     #7A9A8A (teal/groen)
- Pijn & Zorg:        #9BA3A8 (grijs met roze accent)
- Vervoer:            #8A9A9A (grijs/groen)
- Ontspanning:        #B8C83C (lime groen)

Quick Action Colors:
- Ja (groen):         #7A9A8A
- Nee (grijs):        #9BA3A8
- Misschien:          #9BA3A8
- Hallo:              #B8D4E8 (lichtblauw)

Uitklapmenu Icons:
- Zin:                #2196F3 (blauw)
- Kijken/Foto:        #64B5F6 (lichtblauw)
- Toon:               #FFC107 (amber/geel)
- Arts:               #FF7043 (oranje/koraal)
- Nood:               #FF5252 (rood)

Text:
- Primary:            #1A1A1A (bijna zwart)
- Secondary:          #666666 (grijs)
- On dark:            #FFFFFF (wit)
```

### Typography

```
Font Family:          System default (SF Pro op iOS, Roboto op Android)
                      Of: Inter / Nunito voor consistentie

Heading (Welkom):     24px, Semi-bold
Tile Labels:          16px, Medium
Sub-labels:           14px, Regular
Navigation:           14px, Medium
Time stamps:          12px, Regular
```

### Grid System (CRUCIAAL)

```
Container Padding:    16px (alle zijden)
Tile Gap:             12px
Tile Grid:            2 kolommen (gelijke breedte)
Tile Aspect Ratio:    1:1 (vierkant) voor hoofdtiles
                      Uitzondering: Geschiedenis items zijn horizontaal

Tile Sizing:
- Small tiles:        ~160px x 160px (berekend op basis van scherm)
- Icon size:          48px (in tile)
- Corner radius:      16px (tiles)
- Corner radius:      24px (grote cards bovenaan)
```

### Component Hiërarchie

```
App
├── Layout (herbruikbaar)
│   ├── Header
│   │   ├── Logo/Back Button
│   │   ├── Title/Welcome
│   │   ├── Filter Button
│   │   └── Hamburger Menu
│   ├── SubNavigation (Praat/Zien/Herhaal/Favoriet)
│   └── Content Area
│       └── TileGrid (herbruikbaar)
├── Pages
│   ├── HomePage
│   ├── FavorietPage
│   ├── HerhaalPage (Geschiedenis)
│   ├── ZinBouwenPage
│   ├── KijkenPage
│   └── FilterModal
├── Components
│   ├── Tile (herbruikbaar)
│   ├── QuickActionTile
│   ├── CategoryTile
│   ├── HistoryItem
│   ├── FloatingActionButton (+)
│   └── ExpandMenu (uitklapmenu)
└── Styles
    ├── theme.js/css (CENTRAAL)
    ├── grid.css
    └── typography.css
```

## Architectuur Principes

### 1. Centralized Theming

Maak één centraal theme bestand waar ALLE kleuren, spacing, en typography gedefinieerd zijn:

```javascript
// theme.js - VOORBEELD STRUCTUUR
export const theme = {
  colors: {
    background: {
      primary: '#F5F0E8',
      secondary: '#FFFFFF',
      tile: '#9BA3A8',
    },
    accent: {
      thuis: '#C8D4C8',
      boodschappen: '#E8DCD0',
      // etc...
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      inverse: '#FFFFFF',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    heading: { size: 24, weight: '600' },
    body: { size: 16, weight: '500' },
    // etc...
  }
};
```

### 2. Modulaire Bestandsstructuur

```
src/
├── components/
│   ├── common/
│   │   ├── Tile/
│   │   │   ├── Tile.jsx
│   │   │   ├── Tile.styles.js
│   │   │   └── index.js
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Grid/
│   ├── navigation/
│   │   ├── Header/
│   │   ├── SubNav/
│   │   └── FloatingMenu/
│   └── tiles/
│       ├── CategoryTile/
│       ├── QuickActionTile/
│       └── HistoryTile/
├── pages/
│   ├── Home/
│   ├── Favoriet/
│   ├── Herhaal/
│   ├── ZinBouwen/
│   └── Kijken/
├── styles/
│   ├── theme.js
│   ├── globalStyles.js
│   └── grid.js
├── hooks/
│   └── useTheme.js
├── context/
│   └── ThemeContext.js
├── i18n/
│   ├── nl.json
│   └── en.json (later)
└── utils/
    └── constants.js
```

### 3. Herbruikbare Grid Component

```javascript
// Grid.jsx - VOORBEELD
const Grid = ({ 
  columns = 2, 
  gap = 'md', 
  children,
  fullWidth = false 
}) => {
  // Één component voor alle grid layouts
  // Wordt gebruikt op HomePage, Favoriet, ZinBouwen, etc.
};
```

### 4. i18n Voorbereiding (Internationalization)

i18n = het voorbereiden van de app op meerdere talen. Alle user-facing teksten komen uit taalbestanden, niet hardcoded in componenten. Dit maakt het later eenvoudig om Engels (of andere talen) toe te voegen.

```javascript
// i18n/nl.json
{
  "greeting": {
    "morning": "Goedemorgen",
    "afternoon": "Goedemiddag",
    "evening": "Goedenavond"
  },
  "nav": {
    "praat": "Praat",
    "zien": "Zien",
    "herhaal": "Herhaal",
    "favoriet": "Favoriet"
  },
  "categories": {
    "thuis": "Thuis",
    "boodschappen": "Boodschappen",
    // etc...
  }
}
```

## Scherm-voor-Scherm Specificaties

### 1. HomePage (Hoofdpagina)

**Header:**
- Links: "Tala." logo
- Rechts: Filter icon (3 lijntjes met bolletjes) + Hamburger menu
- Daaronder: Welkomsttekst "Goedemiddag, [Naam]"

**SubNavigation:**
- Pill-style toggle buttons: Praat | Zien | Herhaal | Favoriet
- Actieve staat: donkere achtergrond, witte tekst
- Inactieve staat: geen achtergrond, donkere tekst

**Content (bij "Praat" actief):**
- 2-koloms grid met category tiles
- Elke tile: icon + label
- Categories: Thuis, Boodschappen, Eten & Drinken, Pijn & Zorg, Vervoer, Ontspanning

**Floating Action Button (+):**
- Rechtsonder
- Bij tap: uitklapmenu met 5 opties (Zin, Kijken, Toon, Arts, Nood)

### 2. Favoriet Page

**Zelfde header en navigatie als HomePage**

**Content:**
- 2-koloms grid met quick response tiles
- Tiles: Ja ✓, Nee ✗, Misschien ?, Waarom 💡, Hallo 👋, Goed 👍
- Elk met passend icon en kleur

### 3. Herhaal Page (Geschiedenis)

**Zelfde header en navigatie**

**Content:**
- UITZONDERING op 2-koloms grid
- Horizontale list items
- Elk item: Speech icon | Tekst | Timestamp | Play button
- Lichtblauwe achtergrond voor items

### 4. Zin Bouwen Page

**Header aangepast:**
- Links: "< Terug" (met chevron)
- Titel: "Zin Bouwen"

**Content:**
- Input veld bovenaan: "Typ je zin" / "Of kies woorden hieronder..."
- Tags voor gekozen woorden (met X om te verwijderen)
- "Kies woorden" sectie met 2-koloms grid:
  - Wie (Personen) - blauw
  - Doe (Acties) - geel
  - Wat (Dingen) - groen
  - Waar (Plaatsen) - oranje
  - Emoji (Emoticons) - paars

**Bottom actions:**
- Delete icon | Opslaan button | Spreek button

### 5. Kijken Page

**Header:** Zelfde als Zin Bouwen (< Terug)

**Content:**
- Titel: "Laten Zien"
- Filter pills: Alles | Eten en drinken | Ontspannen | Buiten
- Grid met foto items (kan variëren van 2-koloms)
- "Foto Toevoegen" placeholder tile

### 6. Filter Modal (Locaties/Mensen)

**Triggered door:** Filter icon in header

**SubNav verandert naar:** mensen | locaties

**Content:**
- 2-koloms grid met locatie/persoon tiles
- Locaties: Thuis, Ziekenhuis, Supermarkt, Auto, Bioscoop, Slaapkamer

## Fase Planning

### Fase 1: Foundation & Theme Setup
**Doel:** Opzetten van de basis architectuur

**Taken:**
1. Creëer theme.js met alle design tokens
2. Setup grid system component
3. Maak basis Tile component
4. Setup i18n structuur (alleen NL voor nu)
5. Creëer Layout component met Header placeholder

**Test criteria:**
- [ ] Alle kleuren komen uit theme.js
- [ ] Grid responsive op verschillende schermgroottes
- [ ] Tile component accepteert icon, label, kleur props
- [ ] Geen hardcoded waarden in componenten

### Fase 2: Navigation & Homepage
**Doel:** Werkende homepage met nieuwe design

**Taken:**
1. Implementeer Header component (logo, filter, hamburger)
2. Implementeer SubNavigation (Praat/Zien/Herhaal/Favoriet)
3. Bouw HomePage met category tiles
4. Implementeer FloatingActionButton met expand menu
5. Behoud alle bestaande tap/click handlers

**Test criteria:**
- [ ] Navigatie tussen tabs werkt
- [ ] Alle category tiles tonen correct
- [ ] FAB expand menu werkt
- [ ] Geen functionaliteit verloren

### Fase 3: Sub-pages
**Doel:** Alle sub-pagina's werkend

**Taken:**
1. Favoriet page met quick actions
2. Herhaal page met geschiedenis items
3. Zin Bouwen page
4. Kijken page
5. Filter modal

**Test criteria:**
- [ ] Alle pagina's bereikbaar
- [ ] Terug navigatie werkt
- [ ] Bestaande data/state behouden
- [ ] Modals openen/sluiten correct

### Fase 4: Polish & Edge Cases
**Doel:** Afronding en quality assurance

**Taken:**
1. Loading states
2. Error handling UI
3. Empty states
4. Animations/transitions
5. Accessibility check
6. Performance optimalisatie

**Test criteria:**
- [ ] Geen console errors
- [ ] Smooth transitions
- [ ] Alle edge cases afgehandeld
- [ ] Code review passed

## Second Pass Protocol (Na Elke Fase)

Na afronding van elke fase, voer het volgende uit:

### Scope
- Detecteer bugs, edge cases en regressies
- Controleer logica, aannames en state flow
- Valideer async gedrag, error handling en data consistentie
- Test functioneel en conceptueel, alsof dit production code is
- Zoek actief naar wat kan breken, niet naar bevestiging

### Werkwijze
1. Analyseer de code en architectuur stap voor stap
2. Identificeer concrete problemen en risico's
3. Los deze zelfstandig op in de code
4. Herhaal tests tot er geen open issues meer zijn
5. Documenteer kort wat is aangepast en waarom

### Output regels
- Presenteer het resultaat pas nadat alle checks zijn uitgevoerd
- Geen speculatie, alleen geverifieerde conclusies
- Als iets onzeker blijft, markeer het expliciet als zodanig
- Lever schone, consistente en her-testte code op

## Absolute Don'ts

1. **GEEN inline styles** - Alles via theme of styled components
2. **GEEN hardcoded kleuren** - Alles via theme.colors
3. **GEEN hardcoded teksten** - Alles via i18n (ook al is het nu alleen NL)
4. **GEEN onnodig grote bestanden** - Splits logisch op waar het de leesbaarheid ten goede komt, maar geen harde limiet
5. **GEEN duplicate code** - Hergebruik components waar praktisch
6. **GEEN breaking changes** - Alle bestaande functionaliteit moet werken
7. **GEEN magic numbers** - Spacing etc via theme.spacing

## Referentie: Huidige vs Nieuwe Mapping

| Huidig (Donker)      | Nieuw (Licht)           | Notes                          |
|----------------------|-------------------------|--------------------------------|
| "Snel reageren"      | "Favoriet" tab          | Verplaatst naar sub-nav        |
| "Praat"              | "Zin" (in FAB menu)     | Hernoemd                       |
| "Laten Zien"         | "Kijken" (in FAB menu)  | Hernoemd                       |
| "Herhaal"            | "Herhaal" tab           | Wordt "Geschiedenis" genoemd   |
| "Onderwerpen"        | Category tiles          | Zelfde functionaliteit         |
| Dark background      | #F5F0E8 beige           | Hoofdwijziging                 |
| Cyan accents         | Diverse pastels         | Per category                   |

## Bijlagen

### Bijlage A: Icon Mapping

Gebruik consistente iconset (bijv. Lucide, Heroicons, of SF Symbols):

- Thuis: Home icon (met X voor unavailable)
- Boodschappen: Shopping cart
- Eten & Drinken: Utensils/Restaurant
- Pijn & Zorg: Heart with pulse
- Vervoer: Bus/Transport
- Ontspanning: Play button in screen
- Ja: Checkmark
- Nee: X mark
- Misschien: Question mark
- Waarom: Lightbulb
- Hallo: Waving hand
- Goed: Thumbs up
- Zin: Sound waves
- Kijken: Image
- Toon: Lightning bolt
- Arts: Stethoscope
- Nood: Alert/Warning

### Bijlage B: Responsive Breakpoints

```javascript
breakpoints: {
  sm: 320,   // Small phones
  md: 375,   // Standard phones
  lg: 414,   // Large phones
  xl: 768,   // Tablets
}
```

---

**Start met Fase 1. Rapport terug na voltooiing met:**
1. Lijst van aangemaakte bestanden
2. Screenshot of beschrijving van resultaat
3. Eventuele vragen of onduidelijkheden
4. Second pass resultaten
