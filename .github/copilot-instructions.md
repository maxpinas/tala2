# Copilot Instructions voor Tala2

## Project Overzicht
Tala is een AAC (Augmentative and Alternative Communication) app voor mensen met afasie. 
De app is gebouwd met React Native / Expo.

## Belangrijke Regels

### Roadmap
- **ALTIJD** `roadmap.json` bewerken, NIET rechtstreeks `ROADMAP.md`
- Na wijzigingen: run `npm run roadmap` om ROADMAP.md te genereren
- roadmap.json bevat: inProgress, completed, backlog, techDebt, appStoreChecklist

### Code Stijl
- Gebruik `useTheme()` hook voor alle kleuren - GEEN hardcoded kleuren
- Nederlandse comments en UI teksten
- Alle modals in `src/components/modals/`
- Alle screens in `src/components/screens/`
- Alle common components in `src/components/common/`

### Belangrijke Bestanden
- `App.js` - Hoofdapp met routing en state
- `src/theme/colors.js` - Kleurenpalet (light/dark)
- `src/theme/ThemeContext.js` - Theme provider
- `src/data/index.js` - DEFAULT_CONTEXTS, DEFAULT_QUICK, categories
- `src/data/contextVariables.js` - LOCATIONS, PEOPLE met grammatica varianten
- `src/demo/demoData.js` - Demo data voor nieuwe gebruikers
- `src/context/AppContext.js` - Globale app state

### Locaties & Personen Grammatica
Locaties hebben varianten: `bij`, `naar`, `van`
- "Ik ben {locatie:bij}" → "Ik ben thuis" of "Ik ben in de supermarkt"
- "Ik ga naar {locatie:naar}" → "Ik ga naar de supermarkt"

Personen moeten direct werken met "Bel {persoon}":
- "Bel Partner" ✓
- "Bel mijn zus" ✗ (niet "mijn" toevoegen)

### Expo / Build
- Start dev server: `npx expo start --tunnel --go --port 8083`
- iOS build: `npx eas-cli build --platform ios --profile production`
- Submit naar TestFlight: `npx eas-cli submit --platform ios --latest`

### Git Workflow
- Maak restore points met descriptieve commit messages
- Push naar `main` branch voor productie
