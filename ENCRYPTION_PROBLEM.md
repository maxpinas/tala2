# Encryptie-probleem in Tala (Expo React Native App)

## Context

Tala is een communicatie-app voor mensen met spraakproblemen. De app slaat gevoelige data op:
- Medische gegevens (medicatie, allergieën, bloedgroep)
- Persoonlijke contactgegevens
- Communicatiegeschiedenis
- Foto's met bijschriften

De app is gebouwd met:
- Expo SDK 54
- React Native 0.81.5
- AsyncStorage voor data-opslag

## Huidige Situatie

### Wat werkt:
- **Backup-export**: Gebruiker kan een versleuteld backup-bestand maken (AES met wachtwoord via `crypto-js`) en delen via e-mail
- **Lokale opslag**: Data wordt opgeslagen in AsyncStorage (onversleuteld)

### Het Probleem:

We wilden ook de **lokale opslag versleutelen** met AES. De implementatie:

```javascript
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

// Genereer encryptiesleutel
const key = CryptoJS.lib.WordArray.random(32);

// Sla sleutel op in SecureStore
await SecureStore.setItemAsync('encryption_key', key);

// Versleutel data voor opslag
const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
await AsyncStorage.setItem(storageKey, encrypted);
```

**Dit faalt in Expo Go met error:**
```
Error: Native crypto module could not be used to get secure random number.
```

### Oorzaak:

1. `CryptoJS.lib.WordArray.random()` vereist een native crypto module
2. `CryptoJS.AES.encrypt()` gebruikt intern ook native crypto voor IV-generatie
3. Expo Go heeft beperkte native module support
4. `expo-secure-store` werkt ook niet volledig in Expo Go

## Voorgestelde Oplossing

### Development Build (in plaats van Expo Go)

**Wat is het verschil?**

| Aspect | Expo Go | Development Build |
|--------|---------|-------------------|
| Installatie | App Store | Zelf bouwen |
| Native modules | Beperkt | Volledig |
| Build tijd | 0 min | ~10-15 min (eenmalig) |
| Hot reload | ✅ Ja | ✅ Ja |
| Productie-parity | ❌ Nee | ✅ Ja |

**Implementatie:**

```bash
# 1. Installeer dev client
npx expo install expo-dev-client

# 2. Bouw development app (eenmalig)
npx expo run:ios
# of via cloud: eas build --profile development --platform ios

# 3. Daarna gewoon ontwikkelen
npm start
# Scan QR met je eigen development app (niet Expo Go)
```

**Voordelen:**
- Alle native modules werken (SecureStore, crypto, etc.)
- Je test exact wat je uitrolt naar productie
- Geen verschil meer tussen dev en prod omgeving
- Hot reload blijft werken

**Nadelen:**
- Eenmalige build stap (~10-15 min)
- Vereist Xcode geïnstalleerd (voor iOS)
- Iets meer setup

## Alternatieve Oplossingen

### Alternatief 1: Pure JavaScript Encryptie

Gebruik een crypto library zonder native dependencies:

```javascript
// Simpele XOR-encryptie (NIET cryptografisch veilig!)
function xorEncrypt(data, key) { ... }
```

**Nadeel:** Niet echt veilig, alleen obfuscatie.

### Alternatief 2: Feature Flag

```javascript
import Constants from 'expo-constants';

const USE_ENCRYPTION = Constants.appOwnership !== 'expo';

export const saveData = async (key, data) => {
  if (USE_ENCRYPTION) {
    // Versleutelde opslag
  } else {
    // Onversleutelde opslag (alleen in Expo Go)
  }
};
```

**Nadeel:** Je test niet wat je uitrolt.

### Alternatief 3: Alleen Backup Versleutelen

Huidige situatie: lokale data onversleuteld, alleen export is versleuteld.

**Nadeel:** Lokale data is kwetsbaar bij diefstal/verlies telefoon.

## Vragen voor Review

1. Is de overstap naar development builds de juiste keuze voor een app met gevoelige medische data?

2. Zijn er andere crypto libraries die wel werken in Expo Go zonder native dependencies?

3. Is er een betere architectuur om encryptie te implementeren in een Expo app?

4. Hoe zwaar weegt het nadeel van de eenmalige build-stap tegen de voordelen van development builds?

5. Zijn er security-risico's die we over het hoofd zien?

## Technische Details

### Huidige package.json dependencies:
```json
{
  "expo": "~54.0.0",
  "expo-secure-store": "...",
  "expo-file-system": "...",
  "expo-sharing": "...",
  "crypto-js": "..."
}
```

### Bestandsstructuur:
```
src/
  utils/
    storage.js      # AsyncStorage wrapper (nu onversleuteld)
    backup.js       # Backup export (versleuteld met wachtwoord)
    restore.js      # Backup import
```

### Data die moet worden beschermd:
- `@tala_profile` - naam, telefoon, email, adres
- `@tala_extended_profile` - medicatie, allergieën, bloedgroep
- `@tala_gallery` - foto URI's met bijschriften
- `@tala_history` - spraakgeschiedenis
