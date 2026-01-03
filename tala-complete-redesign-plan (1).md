# Tala App - Complete UI Redesign Plan

## ⚠️ BELANGRIJKE CONTEXT

We hebben eerder geprobeerd deze wijzigingen door te voeren, maar zijn **vastgelopen op theming/dark mode**. Het probleem was:
- Dark mode werkte alleen op sommige schermen
- Hardcoded kleuren door de hele codebase
- Teksten onleesbaar (zwart op donker)
- Modals niet mee-themend
- Geen consistente architectuur

**Dit mag niet opnieuw gebeuren.** Daarom werken we nu in **strikte fases** met **tussentijdse tests** en **GitHub commits** na elke fase.

---

## 🏗️ ARCHITECTUUR-FIRST AANPAK

### Waarom Dit Belangrijk Is

De vorige keer zijn we vastgelopen omdat dark mode maar op sommige schermen werkte. De oorzaak: kleuren stonden verspreid door de code, sommige direct in componenten, andere ergens anders. Hierdoor was het onmogelijk om consistent te switchen tussen light en dark.

### Wat We Willen Bereiken

**Eén centrale plek voor alle kleuren.** Als je daar de kleuren aanpast, verandert de hele app mee. Geen losse kleuren meer die je moet opsporen in individuele bestanden.

**Twee complete kleurenschema's:** één voor light mode, één voor dark mode. Beide schema's moeten ALLE kleuren bevatten die de app gebruikt - achtergronden, tekst, knoppen, tiles, modals, alles.

**Een schakelaar die overal werkt.** Als de gebruiker dark mode aanzet, moet ELK scherm en ELKE modal direct meegaan. Niet sommige wel en sommige niet.

### Hoe Dit Te Bereiken

1. **Inventariseer eerst** welke kleuren de app nu gebruikt en waar ze staan
2. **Maak een centrale theming structuur** die past bij hoe de app nu is opgebouwd
3. **Definieer beide themes** (light en dark) met alle benodigde kleuren
4. **Vervang stap voor stap** alle losse kleurverwijzingen door verwijzingen naar het centrale theme
5. **Test na elke stap** of beide modes nog werken

### Het Principe

Stel je voor: één "hoofdschakelaar" die bepaalt of de app licht of donker is. Alle onderdelen van de app kijken naar die schakelaar en passen zich aan. Niemand bepaalt zelf zijn kleur - iedereen vraagt aan het centrale theme "welke kleur moet ik nu zijn?"

Dit vereist discipline: NOOIT meer een kleur direct in een component zetten. ALTIJD via het centrale theme.

---

## 📋 COMPLETE REQUIREMENTS LIJST

Hieronder ALLE wijzigingen die doorgevoerd moeten worden, verzameld uit alle eerdere gesprekken:

### A. Layout & Tiles

| # | Requirement | Details |
|---|-------------|---------|
| A1 | Tile hoogte | 30% minder hoog dan vierkant (home + favorieten) |
| A2 | Home tiles kleur | Allemaal zelfde groen als "Eten en Drinken" |
| A3 | Favoriet tiles kleur | Allemaal zelfde groen als "Ja" tile |
| A4 | Logo verwijderen | "Tala" logo weg, welkomsttekst naar links |
| A5 | FAB menu groter | + menu 2x zo groot maken |
| A6 | Tab badges weg | Nummers bij Herhaal/Favoriet tabs verwijderen |
| A7 | "Onderwerpen" weg | Label verwijderen op homepage |

### B. Navigatie & Schermen

| # | Requirement | Details |
|---|-------------|---------|
| B1 | Zien = Kijken | "Zien" tab toont exact zelfde als + → Kijken |
| B2 | Filter via tabs | Geen modal, maar tabs (locatie/persoon) + terug knop |
| B3 | Toon via + | Toont "Over mij" info + persoonlijke uitleg teksten |

### C. Instellingen Restructuur

| # | Requirement | Details |
|---|-------------|---------|
| C1 | Hernoemen | "Instellingen" → "Inhoud beheren" in menu |
| C2 | Stem verplaatsen | Naar "Inhoud beheren" |
| C3 | Uitleg teksten verplaatsen | Naar "Inhoud beheren" |
| C4 | Profiel direct | Opent direct wizard, geen tussenstap |
| C5 | Menu styling | Icons wit op groene cirkel achtergrond |
| C6 | Dark mode toggle | Direct instelbaar in instellingen |

### D. Tile Customization (Long Press)

| # | Requirement | Details |
|---|-------------|---------|
| D1 | Naam aanpassen | Werkt op home EN favorieten |
| D2 | Volgorde aanpassen | ↑/↓ pijltjes of drag & drop |
| D3 | Kleur light mode | Keuze uit kleuren |
| D4 | Kleur dark mode | Aparte kleur voor dark mode |
| D5 | Tekstkleur | Wit of zwart keuze |
| D6 | Achtergrond foto | Kies uit Kijken/Zien foto's (NIET telefoon) |
| D7 | Foto cropping | Langwerpig, tile verhouding, object-fit: cover |
| D8 | Defaults | Groen + witte tekst als niets gekozen |

### E. Onderwerpen & Zinnen

| # | Requirement | Details |
|---|-------------|---------|
| E1 | Variabele tonen | Bij long press: toon {locatie:naar} ipv ingevulde waarde |
| E2 | Grijze knoppen | Veel lichter maken, tekst moet leesbaar |
| E3 | Sortering | Zinnen met variabele naar boven |
| E4 | Contextgevoelige aanvulling | Fix "ik ben" → "ik ben boodschappen doen" |

### F. Herhaal/Geschiedenis

| # | Requirement | Details |
|---|-------------|---------|
| F1 | Geen dubbele entries | Replay = tijdstip updaten, geen nieuwe entry |

### G. Medisch Paspoort

| # | Requirement | Details |
|---|-------------|---------|
| G1 | Long press edit | Inhoud aanpassen via zelfde modals als instellingen |

### H. Dark Mode (CRUCIAAL)

| # | Requirement | Details |
|---|-------------|---------|
| H1 | Alle schermen | Homepage, Favorieten, Herhaal, Zien, Zin Bouwen, Toon, Instellingen, Filter |
| H2 | Alle modals | Long press modal, filter modal, alle popups |
| H3 | Alle teksten leesbaar | Geen zwart op donker, geen wit op licht |
| H4 | Persistentie | Keuze onthouden bij app herstart |

---

## 🔄 FASERING MET TUSSENTIJDSE COMMITS

### FASE 0: Architectuur Setup (EERST DIT, GEEN FEATURES)

**Doel:** Waterdichte theming basis

**Taken:**
1. Creëer `theme.js` met complete `lightTheme` en `darkTheme`
2. Creëer `ThemeContext.js` met provider en toggle
3. Creëer `useTheme.js` hook
4. Wrap hele app in `ThemeProvider`
5. Test: toggle werkt, beide themes laden

**Definition of Done:**
- [ ] Theme toggle werkt
- [ ] Console.log toont juiste theme bij switch
- [ ] Geen errors

**▶️ NA FASE 0:**
1. Second pass uitvoeren (zie protocol onderaan)
2. `git add . && git commit -m "Fase 0: Theme architectuur setup"`
3. `git push`

---

### FASE 1: Basis Componenten Migreren

**Doel:** Alle basis componenten gebruiken theme

**Taken:**
1. Migreer `Tile` component naar theme kleuren
2. Migreer `Modal` component naar theme kleuren  
3. Migreer `Button` component naar theme kleuren
4. Migreer `Header` component naar theme kleuren
5. Migreer `SubNavigation` component naar theme kleuren
6. Test dark mode op deze componenten

**Definition of Done:**
- [ ] Tile respecteert theme (beide modes)
- [ ] Modal respecteert theme (beide modes)
- [ ] Button respecteert theme (beide modes)
- [ ] Header respecteert theme (beide modes)
- [ ] SubNav respecteert theme (beide modes)
- [ ] Geen hardcoded kleuren meer in deze files

**▶️ NA FASE 1:**
1. Second pass uitvoeren
2. `git commit -m "Fase 1: Basis componenten gemigreerd naar theme"`
3. `git push`

---

### FASE 2: Alle Schermen Migreren

**Doel:** Elk scherm volledig themed

**Taken per scherm:**
1. HomePage → theme kleuren
2. FavorietenPage → theme kleuren
3. HerhaalPage → theme kleuren
4. ZienPage → theme kleuren
5. ZinBouwenPage → theme kleuren
6. ToonPage → theme kleuren
7. InstellingenPage → theme kleuren
8. FilterModal → theme kleuren
9. Alle andere modals → theme kleuren

**Test per scherm:**
- Light mode: alles leesbaar en mooi
- Dark mode: alles leesbaar en mooi
- Toggle: switch werkt instant

**Definition of Done:**
- [ ] Alle 9+ schermen getest in light mode
- [ ] Alle 9+ schermen getest in dark mode
- [ ] Geen zwarte tekst op donkere achtergrond
- [ ] Geen witte tekst op lichte achtergrond
- [ ] Geen hardcoded kleuren in ENIGE file

**▶️ NA FASE 2:**
1. Second pass uitvoeren
2. `git commit -m "Fase 2: Alle schermen volledig themed"`
3. `git push`

---

### FASE 3: Layout Wijzigingen

**Doel:** Visuele aanpassingen

**Taken:**
1. Tile hoogte 30% reduceren (A1)
2. Home tiles allemaal zelfde groen (A2)
3. Favoriet tiles allemaal zelfde groen (A3)
4. Logo weg, welkomsttekst naar links (A4)
5. FAB menu 2x groter (A5)
6. Tab badges verwijderen (A6)
7. "Onderwerpen" label weg (A7)

**Definition of Done:**
- [ ] Tiles zijn rechthoekig (breder dan hoog)
- [ ] Alle home tiles uniform groen
- [ ] Alle favoriet tiles uniform groen
- [ ] Geen logo, welkomsttekst links
- [ ] FAB menu duidelijk groter
- [ ] Geen nummers bij tabs
- [ ] Geen "Onderwerpen" tekst

**▶️ NA FASE 3:**
1. Second pass uitvoeren
2. `git commit -m "Fase 3: Layout wijzigingen"`
3. `git push`

---

### FASE 4: Navigatie & Schermen

**Doel:** Scherm routing en content

**Taken:**
1. Zien tab → toont Kijken content (B1)
2. Filter: tabs ipv modal (B2)
3. Toon via +: Over mij + uitleg teksten (B3)

**Definition of Done:**
- [ ] Zien tab = exact zelfde als + → Kijken
- [ ] Filter opent tabs (locatie/persoon), niet modal
- [ ] Terug knop bij filter view
- [ ] Toon toont Over mij correct

**▶️ NA FASE 4:**
1. Second pass uitvoeren
2. `git commit -m "Fase 4: Navigatie en schermen"`
3. `git push`

---

### FASE 5: Instellingen Restructuur

**Doel:** Menu herstructurering

**Taken:**
1. Hernoem naar "Inhoud beheren" (C1)
2. Verplaats Stem (C2)
3. Verplaats Uitleg teksten (C3)
4. Profiel direct naar wizard (C4)
5. Menu icons wit op groen (C5)
6. Dark mode toggle toevoegen (C6)

**Definition of Done:**
- [ ] Menu heet "Inhoud beheren"
- [ ] Stem staat in Inhoud beheren
- [ ] Uitleg teksten staat in Inhoud beheren
- [ ] Profiel opent direct wizard
- [ ] Icons zijn wit op groene cirkel
- [ ] Dark mode toggle werkt

**▶️ NA FASE 5:**
1. Second pass uitvoeren
2. `git commit -m "Fase 5: Instellingen restructuur"`
3. `git push`

---

### FASE 6: Tile Customization

**Doel:** Long press functionaliteit voor tiles

**BELANGRIJK:** Maak ÉÉN `TileCustomizationModal` component die werkt voor ALLE tile types (home én favorieten).

**Taken:**
1. Bouw TileCustomizationModal met opties:
   - Naam aanpassen
   - Volgorde aanpassen (↑/↓)
   - Kleur light mode
   - Kleur dark mode
   - Tekstkleur (wit/zwart)
   - Achtergrond foto
2. Foto picker: selectie uit Kijken/Zien (NIET telefoon gallery)
3. Foto cropping: langwerpig, tile ratio
4. Defaults: groen + wit
5. Koppel aan home tiles
6. Koppel aan favoriet tiles
7. Persisteer customizations

**Definition of Done:**
- [ ] Long press op home tile → modal
- [ ] Long press op favoriet tile → ZELFDE modal
- [ ] Naam aanpassen werkt + slaat op
- [ ] Volgorde aanpassen werkt + slaat op
- [ ] Kleur light mode werkt + slaat op
- [ ] Kleur dark mode werkt + slaat op
- [ ] Tekstkleur werkt + slaat op
- [ ] Foto selectie uit interne gallery
- [ ] Foto cropped langwerpig
- [ ] Default = groen + wit

**▶️ NA FASE 6:**
1. Second pass uitvoeren
2. `git commit -m "Fase 6: Tile customization"`
3. `git push`

---

### FASE 7: Onderwerpen & Zinnen

**Doel:** Verbeteringen in zinnen functionaliteit

**Taken:**
1. Variabele tonen bij long press (E1)
2. Grijze knoppen lichter (E2)
3. Sortering: variabele zinnen eerst (E3)
4. Contextgevoelige aanvulling fixen (E4)

**Definition of Done:**
- [ ] Long press toont {variabele} syntax
- [ ] Grijze knoppen hebben leesbare tekst
- [ ] Zinnen met variabele staan bovenaan
- [ ] "ik ben boodschappen doen" ipv "ik ben"

**▶️ NA FASE 7:**
1. Second pass uitvoeren
2. `git commit -m "Fase 7: Onderwerpen en zinnen"`
3. `git push`

---

### FASE 8: Overige Features

**Doel:** Resterende functionaliteit

**Taken:**
1. Herhaal: geen dubbele entries (F1)
2. Medisch paspoort long press edit (G1)

**Definition of Done:**
- [ ] Replay in Herhaal update alleen tijdstip
- [ ] Long press medisch paspoort → edit modal

**▶️ NA FASE 8:**
1. Second pass uitvoeren
2. `git commit -m "Fase 8: Herhaal en medisch paspoort"`
3. `git push`

---

### FASE 9: Final Integration Test

**Doel:** Alles samen testen

**Test checklist:**
- [ ] Complete app flow in light mode
- [ ] Complete app flow in dark mode
- [ ] Theme switch mid-use
- [ ] Alle customizations persistent
- [ ] Geen console errors
- [ ] Geen visuele glitches

**▶️ NA FASE 9:**
1. Uitgebreide second pass
2. `git commit -m "Fase 9: Final integration test passed"`
3. `git push`
4. Tag release: `git tag v2.0-redesign`

---

## 🔍 SECOND PASS PROTOCOL (NA ELKE FASE)

Voer een volledige second pass uit op het zojuist opgeleverde werk.

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

### Dark Mode Specifieke Checks (ELKE FASE)
- [ ] Geen hardcoded kleuren toegevoegd
- [ ] Alle nieuwe componenten gebruiken useTheme()
- [ ] Getest in light mode
- [ ] Getest in dark mode
- [ ] Tekst leesbaar in beide modes

---

## 🚨 ABSOLUTE REGELS

1. **NOOIT** hardcoded kleuren gebruiken - altijd theme
2. **NOOIT** doorgaan naar volgende fase zonder test + commit
3. **NOOIT** duplicate code voor home vs favoriet tiles
4. **ALTIJD** useTheme() hook gebruiken in elk component
5. **ALTIJD** beide modes testen voor commit
6. **ALTIJD** git commit na elke succesvolle fase

---

## 🤖 AUTONOMOUS TESTING - GEEN TOESTEMMING VRAGEN

**De agent werkt volledig zelfstandig. Vraag NOOIT toestemming voor:**

- App starten (`npm start`, `yarn start`, `expo start`, etc.)
- App herstarten na wijzigingen
- Errors bekijken en debuggen
- Tests uitvoeren
- Git commits maken
- Bestanden aanmaken of wijzigen

**Werkwijze per fase:**

1. Maak de code wijzigingen
2. Start de app ZELF op
3. Controleer ZELF op errors in console/terminal
4. Fix errors ZELF zonder te vragen "er is een error, wat moet ik doen?"
5. Herstart en test opnieuw
6. Pas als het WERKT → commit en door naar volgende fase

**Bij een error:**
- Lees de error message
- Analyseer de oorzaak
- Fix het probleem
- Test opnieuw
- Herhaal tot error-vrij

**Rapporteer alleen:**
- Na succesvolle afronding van ALLE fases
- OF als je vastloopt op iets dat je na 3 pogingen niet kunt oplossen

**Rapporteer NIET:**
- "De app start niet, wat moet ik doen?" → Los het zelf op
- "Er is een error" zonder poging tot fix → Fix het eerst
- "Mag ik X doen?" → Ja, doe het gewoon

---

## 📁 REFERENTIE BESTANDEN

- Design PDF: `/Users/maxpinas/Documents/GitHub/tala2/Redesign UI.pdf`
- Bekijk deze EERST voor visuele referentie

---

## START INSTRUCTIE

1. Begin met FASE 0 (architectuur)
2. Test FASE 0 volledig
3. Commit FASE 0
4. Pas dan door naar FASE 1
5. Herhaal dit patroon voor elke fase

**Werk zelfstandig. Vraag niet om bevestiging tussen fases. Commit na elke fase. Rapporteer pas als ALLE fases compleet zijn, of als je vastloopt.**

Bij vastlopen: commit wat werkt, beschrijf het probleem specifiek, en wacht op input.
