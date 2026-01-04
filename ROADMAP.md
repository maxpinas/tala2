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

### Centraal Kleuren Thema
- [ ] Nieuw kleurenpalet implementeren (plan ligt klaar)
- [ ] Consistente toepassing door hele app

### Tiles Customization Modal
- [ ] Bij tiles op homepage: eerst een menu tonen (zelfde stijl als instellingen)
- [ ] Opties: "Aanpassen" of "Customizen"
- [ ] "Aanpassen" opent modal voor naam/volgorde/verwijderen (zelfde als onderwerpen aanpassen)

### Foto's Aanpassen Modal
- [ ] Long-press op foto's: "Aanpassen" in plaats van direct "Verwijderen"
- [ ] Zelfde modal stijl als tiles aanpassen

### Backup & Restore
- [ ] Restore functie implementeren (backup inlezen en herstellen)
- [ ] UI voor restore in Beheer menu

### Onboarding Help Flow
- [ ] Onboarding bij eerste app start met highlights van belangrijkste functies
- [ ] Uitleg over long-press functionaliteit
- [ ] Instructies voor taal instellen (spraak)
- [ ] Skip optie voor ervaren gebruikers

### Meertaligheid (i18n)
- [ ] Ondersteuning voor: Nederlands, Engels, Duits, Frans, Spaans
- [ ] AI flow voor genereren van nieuwe taalbestanden
- [ ] Inclusief vertaling van:
  - UI teksten
  - Initiële onderwerpen/zinnen
  - Locaties met grammatica regels (bij/naar/van)
  - Personen met grammatica regels
- [ ] Taal selectie in instellingen

### Overig
- [ ] Foto's koppelen aan zinnen
- [ ] Spraakherkenning voor input
- [ ] Export naar PDF van medisch paspoort

---

## App Store Release Checklist

### Metadata & Content
- [ ] App naam: "Tala" (check beschikbaarheid)
- [ ] Subtitle (max 30 tekens): bijv. "Communicatie bij afasie"
- [ ] Beschrijving (max 4000 tekens): duidelijke uitleg wat de app doet
- [ ] Keywords (max 100 tekens): afasie, communicatie, spraak, AAC, hulpmiddel
- [ ] Screenshots (6.7" en 5.5"): minimaal 3, liefst 5-10 per device
- [ ] App Preview video (optioneel maar aanbevolen)
- [ ] App icoon: 1024x1024px zonder transparantie
- [ ] Categorie: Medical of Lifestyle
- [ ] Leeftijdsclassificatie: 4+ (geen aanstootgevende content)

### Privacy & Legal
- [ ] Privacy Policy URL (verplicht)
  - Welke data wordt verzameld (lokaal opgeslagen profiel, geen server)
  - Hoe data wordt gebruikt
  - Geen tracking, geen analytics
- [ ] Terms of Service URL (aanbevolen)
- [ ] Support URL (verplicht)
- [ ] App Privacy labels in App Store Connect:
  - Data Not Collected (als alles lokaal blijft)
  - Of: Data Linked to You (als profiel data)

### Code & Security Audit
- [ ] **Data opslag review:**
  - Gevoelige data (profiel, medisch) in SecureStore ✅
  - Backup encryptie met AES ✅
  - Geen plaintext wachtwoorden
- [ ] **Permissions audit:**
  - Camera/Photo Library: alleen voor foto's toevoegen
  - Microphone: alleen als spraakherkenning wordt toegevoegd
  - Alle permissions hebben duidelijke usage descriptions in Info.plist
- [ ] **Network requests:**
  - Geen externe API calls (behalve evt. AI suggestions)
  - HTTPS only indien wel netwerk
- [ ] **Crash-free:** Test alle flows, geen unhandled exceptions
- [ ] **Memory leaks:** Profile met Instruments
- [ ] **Accessibility:** VoiceOver support, voldoende contrast

### Apple Review Specifiek
- [ ] **Demo account** (indien login): n.v.t. voor Tala
- [ ] **Review notes:** Uitleg dat app voor mensen met afasie is
- [ ] **In-app purchases:** n.v.t. (gratis app)
- [ ] **Sign in with Apple:** n.v.t. (geen login)
- [ ] **Geen verboden content:** geen user-generated public content
- [ ] **Geen private APIs:** alleen publieke React Native / Expo APIs

### Technische Vereisten
- [ ] Minimale iOS versie: 15.0+ (of lager indien gewenst)
- [ ] iPad support: ja/nee beslissen (Universal of iPhone only)
- [ ] Dark mode support: ja, via ThemeContext
- [ ] Launch screen: SplashScreen.storyboard ✅
- [ ] Bundle identifier: `com.studiohyra.tala` (aanpassen van anonymous)
- [ ] App versie: semantic versioning (1.0.0)
- [ ] Build nummer: incrementeel per submit

### Pre-Submit Testing
- [ ] Test op fysieke devices (niet alleen simulator)
- [ ] Test op oudere iOS versies
- [ ] Test alle happy paths
- [ ] Test edge cases (geen data, lege profiel, etc.)
- [ ] Test accessibility met VoiceOver
- [ ] Performance check (app start < 3 sec)

### Na Goedkeuring
- [ ] App Store Optimization (ASO): monitor downloads
- [ ] Ratings & Reviews: vraag gebruikers om review
- [ ] Versie updates plannen

---

## Tech Debt / Cleanup

### Expert Modus Verwijderen (TODO)
> ⚠️ De Expert modus wordt niet meer actief gebruikt. De code blijft voorlopig staan voor backwards compatibility, maar moet in een toekomstige versie volledig verwijderd worden.

**Te verwijderen:**
- `APP_MODES.EXPERT` uit `src/context/AppContext.js`
- Alle `isExpertMode` checks in `App.js` en componenten
- Expert-specifieke menu items in `SettingsMenuModal.js`
- Expert UI elementen (sentence bar, word picker, etc.)
- `StartupModeModal.js` mode selectie (nu alleen demo data vraag)

**Impact:** Ongeveer 500+ regels code kunnen verwijderd worden na cleanup.

