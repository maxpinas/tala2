# Tala2 Roadmap

## In Progress

### Plan: Gebruikersmodus Menu & Selectie UX Herstructurering (v2)

**Doel:** Herstructureer het menu in gebruikersmodus met intuïtieve 3-knops navigatie. Mensen/Locaties knoppen spreken direct bij selectie en tonen long-press menu met bewerken, tonen en kopiëren — consistent met bestaande styling.

#### Steps

1. **Hernoem menu-items in SettingsMenuModal.js**
   - Wijzig "Persoonlijke instellingen" → "Profiel"

2. **Pas ProfileMenuModal.js aan**
   - Wijzig "Persoonlijke Gegevens" → "Gegevens"
   - Verwijder "Snel Reageren" (staat al bij Instellingen)

3. **Maak TopicSelectorRow in SimpleSentenceBuilder.js**
   - Drie gelijkwaardige knoppen: "Zin Bouwen" (geel/primary), "Locaties" (blauw), "Mensen" (accent)
   - Elk met eigen kleur, styled zoals `actionRow` op home

4. **Implementeer selectie-flow voor Locaties/Mensen**
   - Tap op knop → toon modale lijst
   - Eerste optie: de persoon/locatie naam als losse optie (spreekt alleen de naam)
   - Daarna: standaard zinnen met `[naam]` of `[locatie]` placeholder
   - Tap op item → `speechService.speak(tekst)` + bewaar in `SentenceContext` (persistent)
   - Knop-label update naar geselecteerde item naam

5. **Long-press menu voor Locaties/Mensen knoppen**
   - Toon popup met opties: "Bewerken" (open ManagePeopleLocations), "Tonen" (fullscreen display), "Kopiëren" (clipboard)
   - Gebruik bestaande `CustomPopup` styling

6. **Verwijder losse knoppen in SimpleCategoryView.js**
   - De Locaties/Mensen functionaliteit verplaatst naar TopicSelectorRow

#### Standaard Zinnen Structuur

Bij selectie van een persoon of locatie:
```
1. [Naam/Locatie] (spreekt alleen de naam)
2. "Ik ben bij [locatie]"
3. "Ik ga naar [locatie]"
4. "Ik wil naar [locatie]"
5. "[Naam] is hier"
6. "Bel [naam]"
```

De `[ ]` placeholders worden automatisch vervangen door de geselecteerde naam/locatie.

---

## Completed

### Secure Storage & Voice Fallback (December 2024)
- ✅ Expo SecureStore implementatie
- ✅ AES-256 encryptie voor gevoelige data
- ✅ Voice fallback naar standaard stem als enhanced niet beschikbaar
- ✅ iOS development build werkend

---

## Backlog

- [ ] Foto's koppelen aan zinnen
- [ ] Spraakherkenning voor input
- [ ] Thema aanpassing (donker/licht mode toggle)
- [ ] Export naar PDF van medisch paspoort
