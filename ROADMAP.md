# Tala2 Roadmap

> ⚠️ Dit bestand is auto-gegenereerd. Bewerk `roadmap.json` en run `npm run roadmap`.

## In Progress

### UI Redesign: Donker naar Licht Thema - Januari 2026

Volledige visuele overhaul van donker (#0B1120) naar warm licht thema (#F5F0E8). Alleen 'Gewone modus' - Expert modus blijft ongewijzigd.

#### ✅ Foundation - Theme Systeem (4/4)

- [x] Nieuw kleurenpalet in src/theme/colors.js
- [x] Design tokens toevoegen (spacing, typography, borderRadius)
- [x] i18n structuur opzetten (src/i18n/nl.json)
- [x] Hardcoded kleuren vervangen in src/styles/index.js

#### ✅ Basis Componenten (8/8)

- [x] Grid.js - Herbruikbare 2-koloms grid
- [x] Tile.js - Base tile component
- [x] QuickActionTile.js - Favoriet tiles
- [x] HistoryItem.js - Horizontale geschiedenis items
- [x] Header.js - Nieuwe header met logo, filter, hamburger
- [x] SubNavigation.js - Praat/Zien/Herhaal/Favoriet tabs
- [x] FloatingActionButton.js - FAB met expand menu
- [x] FilterModal.js - Context selectie met 2 tabs

#### ✅ Core Screens Redesign (6/6)

- [x] SimpleHome.js - Volledig nieuw met tab navigatie
- [x] Praat tab (zinnen per categorie)
- [x] Zien tab (foto galerij grid)
- [x] Herhaal tab (geschiedenis)
- [x] Favoriet tab (quick responses grid)
- [x] SimpleCategoryView.js - Aanpassen aan nieuw design

#### ✅ Polish & Integratie (5/5)

- [x] Modals updaten naar licht thema
- [x] Animaties toevoegen
- [x] Edge cases afhandelen
- [x] Testen en bugfixes
- [x] Second pass voor consistentie

**Architectuur Wijzigingen**:
- Echte tab navigatie (geen modals voor Praat/Zien/Herhaal/Favoriet)
- Quick Responses → eigen Favoriet tab (2-koloms grid)
- FAB vervangt Praat/Laten Zien/Snel knoppen
- Context selectie via Filter knop → modal met 2 tabs (Locatie/Persoon)

---

## Completed

### Gebruikersmodus Menu & Selectie UX Herstructurering (v2) - December 2024
- ✅ Menu-items hernoemd: 'Persoonlijke instellingen' → 'Profiel'
- ✅ ProfileMenuModal aangepast: 'Persoonlijke Gegevens' → 'Gegevens', 'Snel Reageren' verwijderd
- ✅ TopicSelectorRow toegevoegd met 3 knoppen: 'Zin Bouwen', 'Locaties', 'Mensen'
- ✅ Selectie-flow voor Locaties/Mensen met standaard zinnen
- ✅ Long-press menu met Bewerken, Tonen, Kopiëren opties
- ✅ Losse Locaties/Mensen knoppen verwijderd uit SimpleCategoryView

### Secure Storage & Voice Fallback - December 2024
- ✅ Expo SecureStore implementatie
- ✅ AES-256 encryptie voor gevoelige data
- ✅ Voice fallback naar standaard stem als enhanced niet beschikbaar
- ✅ iOS development build werkend

---

## Backlog

- [ ] Foto's koppelen aan zinnen
- [ ] Spraakherkenning voor input
- [ ] Export naar PDF van medisch paspoort

