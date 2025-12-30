import * as FileSystem from 'expo-file-system';
import CryptoJS from 'crypto-js';
import * as Sharing from 'expo-sharing';
import { saveData } from '../storage';

// Restore backup: decrypt, versie check, migratie, en opslaan
export async function restoreBackupFromFile(fileUri, password) {
  try {
    const encrypted = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error('Wachtwoord onjuist of bestand corrupt');
    const backupObj = JSON.parse(decrypted);
    if (!backupObj.version || !backupObj.data) throw new Error('Backup-bestand ongeldig');
    // Migratie: indien nodig, hier migratielogica toevoegen
    // Voor nu alleen versie 1
    if (backupObj.version !== 1) throw new Error('Deze backup-versie wordt niet ondersteund');
    // Data terugzetten
    const keys = Object.keys(backupObj.data);
    for (const key of keys) {
      await saveData(`@tala_${key}`, backupObj.data[key]);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Helper: open bestand en restore
export async function pickAndRestoreBackup(password) {
  try {
    const result = await Sharing.getSharingOptionsAsync(); // Placeholder, vervang door document picker indien nodig
    // ...existing code...
  } catch (e) {
    return { success: false, error: e.message };
  }
}
