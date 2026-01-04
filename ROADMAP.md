# Tala2 Roadmap

> ⚠️ Dit bestand is auto-gegenereerd. Bewerk `roadmap.json` en run `npm run roadmap`.

## In Progress

### Complete UI Redesign + Dark Mode - Januari 2026

Volledige redesign met waterdichte dark mode ondersteuning, tile customization, navigatie verbeteringen en layout aanpassingen. Volgens tala-complete-redesign-plan.md

#### ✅ FASE 0: Architectuur Setup (6/6)

- [x] Creëer lightTheme en darkTheme in src/theme/colors.js
- [x] Creëer ThemeContext.js met provider en toggle
- [x] Creëer useTheme.js hook
- [x] Wrap hele app in ThemeProvider
- [x] Test: toggle werkt, beide themes laden
- [x] Persisteer theme keuze in storage

#### ✅ FASE 1: Basis Componenten Migreren (9/9)

- [x] Migreer Tile.js naar useTheme()
- [x] Migreer Header.js naar useTheme()
- [x] Migreer SubNavigation.js naar useTheme()
- [x] Migreer FloatingActionButton.js naar useTheme()
- [x] Migreer FilterModal.js naar useTheme()
- [x] Migreer QuickActionTile.js naar useTheme()
- [x] Migreer HistoryItem.js naar useTheme()
- [x] Migreer Grid.js naar useTheme()
- [x] Test dark mode op alle componenten

#### ✅ FASE 2: Alle Schermen Migreren (13/13)

- [x] SimpleHome.js → useTheme()
- [x] SimpleCategoryView.js → useTheme()
- [x] SimpleSentenceBuilder.js → useTheme()
- [x] GalleryScreen.js → useTheme()
- [x] HistoryView.js → useTheme()
- [x] SettingsMenuModal.js → useTheme()
- [x] ProfileMenuModal.js → useTheme()
- [x] ContentMenuModal.js → useTheme()
- [x] EmergencyModal.js → useTheme()
- [x] MedicalScreen.js → useTheme()
- [x] PartnerScreen.js → useTheme()
- [x] Alle andere modals → useTheme()
- [x] src/styles/index.js → dynamische styles

#### ✅ FASE 3: Layout Wijzigingen (7/7)

- [x] A1: Tile hoogte 30% reduceren (aspectRatio)
- [x] A2: Home tiles allemaal zelfde groen als 'Eten en Drinken'
- [x] A3: Favoriet tiles allemaal zelfde groen als 'Ja' tile
- [x] A4: Logo verwijderen, welkomsttekst naar links
- [x] A5: FAB menu 2x zo groot maken
- [x] A6: Tab badges verwijderen
- [x] A7: 'Onderwerpen' label verwijderen op homepage

#### ✅ FASE 4: Navigatie & Schermen (3/3)

- [x] B1: Zien tab → toont exact zelfde als + → Kijken
- [x] B2: Filter via tabs (locatie/persoon) + terug knop, geen modal
- [x] B3: Toon via + → toont 'Over mij' info + persoonlijke uitleg teksten

#### ✅ FASE 5: Instellingen Restructuur (6/6)

- [x] C1: Hernoem 'Instellingen' → 'Inhoud beheren' in menu
- [x] C2: Verplaats Stem naar 'Inhoud beheren'
- [x] C3: Verplaats Uitleg teksten naar 'Inhoud beheren'
- [x] C4: Profiel direct naar wizard, geen tussenstap
- [x] C5: Menu icons wit op groene cirkel achtergrond
- [x] C6: Dark mode toggle direct instelbaar in instellingen

#### ✅ FASE 6: Tile Customization (12/12)

- [x] Bouw TileCustomizationModal component
- [x] D1: Naam aanpassen (home + favorieten)
- [x] D2: Volgorde aanpassen (↑/↓ pijltjes of drag & drop)
- [x] D3: Kleur light mode keuze
- [x] D4: Kleur dark mode keuze (apart)
- [x] D5: Tekstkleur wit/zwart keuze
- [x] D6: Achtergrond foto uit Kijken/Zien (niet telefoon)
- [x] D7: Foto cropping langwerpig, tile ratio, object-fit cover
- [x] D8: Defaults groen + witte tekst
- [x] Koppel aan home tiles
- [x] Koppel aan favoriet tiles
- [x] Persisteer customizations in storage

#### ✅ FASE 7: Onderwerpen & Zinnen (4/4)

- [x] E1: Variabele tonen bij long press ({locatie:naar} ipv waarde)
- [x] E2: Grijze knoppen veel lichter maken, tekst leesbaar
- [x] E3: Sortering zinnen met variabele naar boven
- [x] E4: Fix contextgevoelige aanvulling ('ik ben boodschappen doen')

#### ✅ FASE 8: Overige Features (2/2)

- [x] F1: Geen dubbele entries in Herhaal (replay = tijdstip updaten)
- [x] G1: Long press edit voor Medisch paspoort

#### 🔄 FASE 9: Final Integration Test (1/8)

- [ ] Complete app flow testen in light mode
- [ ] Complete app flow testen in dark mode
- [ ] Theme switch mid-use testen
- [ ] Alle customizations persistent testen
- [x] Console errors checken
- [ ] Visuele glitches checken
- [ ] Second pass uitvoeren
- [ ] Tag release v2.0-redesign

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
Nieuw kleurenpalet implementeren (plan ligt klaar), consistente toepassing door hele app

### Tiles Customization Modal
Bij tiles op homepage eerst menu tonen (Aanpassen/Customizen). Aanpassen opent modal voor naam/volgorde/verwijderen (zelfde stijl als onderwerpen aanpassen)

### Foto's Aanpassen Modal
Long-press op foto's: 'Aanpassen' ipv direct 'Verwijderen'. Zelfde modal stijl als tiles aanpassen

### Backup & Restore
Restore functie implementeren (backup inlezen en herstellen). UI voor restore in Beheer menu

### Onboarding Help Flow
Onboarding bij eerste app start met highlights van belangrijkste functies. Uitleg over long-press, instructies voor taal instellen. Skip optie voor ervaren gebruikers

### Meertaligheid (i18n)
Ondersteuning voor NL, EN, DE, FR, ES. AI flow voor genereren van nieuwe taalbestanden. Inclusief UI teksten, initiële onderwerpen/zinnen, locaties/personen met grammatica regels. Taal selectie in instellingen

### Unified Photo Flow
Overal waar je foto toevoegt dezelfde modal: eigen library tonen, optie om foto toe te voegen van camera rol naar library, optie om foto te maken en toe te voegen. Alle foto's 1 formaat (geen small/medium/large). Library dezelfde tile maat als homepage tiles, geen flexibel grid met verschillende formaten

- [ ] Foto's koppelen aan zinnen
- [ ] Spraakherkenning voor input
- [ ] Export naar PDF van medisch paspoort

---

## Bugfixes

### Zin Bouwen: Verwijder 'Persoonlijk' en 'Aangepast' uit opslaan opties
Bij eigen zin opslaan worden nog 'Persoonlijk' en 'Aangepast' getoond als onderwerp opties, maar deze bestaan niet meer

### Zin Bouwen: Dark mode kleuren te donker
De kleuren van Wie/Doe/Wat/Waar knoppen zijn te donker en grauw in dark mode, moeten lichter/levendiger

### Zien tab: Zelfde header als andere tabs
Zien tab moet dezelfde header houden als Praat/Herhaal/Favoriet. Geen terug knop nodig

### Verwijder alle emoticons uit UI
Er staan emoticons (bijv. idee emoticon bij tips) in de UI. Alleen Feather icons gebruiken. Emoticons alleen toegestaan voor gebruiker in Zin Bouwen

---

## Tech Debt / Cleanup

### Expert Modus Verwijderen
> ⚠️ Expert modus wordt niet meer gebruikt. Te verwijderen: APP_MODES.EXPERT, alle isExpertMode checks, Expert menu items, Expert UI elementen, StartupModeModal mode selectie. Impact: ~500+ regels code

---

## App Store Release Checklist

### Metadata & Content
- [ ] App naam: 'Tala' (check beschikbaarheid)
- [ ] Subtitle (max 30 tekens): bijv. 'Communicatie bij afasie'
- [ ] Beschrijving (max 4000 tekens)
- [ ] Keywords (max 100 tekens): afasie, communicatie, spraak, AAC, hulpmiddel
- [ ] Screenshots (6.7" en 5.5"): minimaal 3, liefst 5-10 per device
- [ ] App Preview video (optioneel)
- [ ] App icoon: 1024x1024px zonder transparantie
- [ ] Categorie: Medical of Lifestyle
- [ ] Leeftijdsclassificatie: 4+

### Privacy & Legal
- [ ] Privacy Policy URL (verplicht)
- [ ] Terms of Service URL (aanbevolen)
- [ ] Support URL (verplicht)
- [ ] App Privacy labels in App Store Connect

### Code & Security Audit
- [x] Data opslag review: gevoelige data in SecureStore
- [x] Backup encryptie met AES
- [ ] Permissions audit: Camera/Photo Library usage descriptions
- [x] Network requests: HTTPS only
- [ ] Crash-free: test alle flows
- [ ] Memory leaks: profile met Instruments
- [ ] Accessibility: VoiceOver support

### Technische Vereisten
- [ ] Minimale iOS versie: 15.0+
- [ ] iPad support beslissen
- [ ] Bundle identifier: com.studiohyra.tala (aanpassen)
- [x] App versie: semantic versioning
- [x] Build nummer: incrementeel

### Pre-Submit Testing
- [ ] Test op fysieke devices
- [ ] Test op oudere iOS versies
- [ ] Test accessibility met VoiceOver
- [ ] Performance check (app start < 3 sec)

