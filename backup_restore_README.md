# Backup & Restore implementatie (iOS, versie 1)

- Dependencies toegevoegd: expo-secure-store, expo-file-system, expo-sharing, crypto-js
- Nieuwe module `backup.js`: verzamelt alle data, voegt versie toe, versleutelt met AES, slaat bestand tijdelijk op en deelt via e-mail
- Nieuwe module `restore.js`: decrypt, versie-check, migratie (voorbereid), data terugzetten
- Instellingenmenu: nieuwe optie 'Backup maken' (Expert-modus), vraagt wachtwoord, maakt en deelt versleutelde backup
- Volledige second pass uitgevoerd: async gedrag, error handling, edge cases, data consistentie en logica getest
- Geen fouten of regressies gevonden in de aangepaste code
- Herstel-proces voorbereid op toekomstige migraties via versieveld

**Resultaat:**
- Gebruiker kan veilig een versleutelde backup maken en delen
- Restore-proces is voorbereid op dataset-wijzigingen
- Code is getest, robuust en production ready
