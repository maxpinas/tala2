import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import CryptoJS from 'crypto-js';
import { loadAllData } from '../storage';

const BACKUP_VERSION = 1;

// Verzamel alle relevante data en structureer met versieveld
export async function createBackupObject() {
  const data = await loadAllData();
  return {
    version: BACKUP_VERSION,
    timestamp: new Date().toISOString(),
    data,
  };
}

// Versleutel backup-object met AES (wachtwoord)
export function encryptBackup(backupObject, password) {
  const json = JSON.stringify(backupObject);
  return CryptoJS.AES.encrypt(json, password).toString();
}

// Sla versleutelde backup tijdelijk op en deel via e-mail
export async function saveAndShareBackup(encryptedBackup) {
  const fileUri = FileSystem.cacheDirectory + 'tala_backup.enc';
  await FileSystem.writeAsStringAsync(fileUri, encryptedBackup, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(fileUri, { mimeType: 'application/octet-stream', dialogTitle: 'Deel je Tala-backup' });
}

// Decrypteer backup-bestand
export function decryptBackup(encrypted, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}
