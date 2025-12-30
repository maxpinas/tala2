import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';
import { clearAllData } from '../../storage';
import { createBackupObject, encryptBackup, saveAndShareBackup } from '../../utils/backup';
import { useApp, APP_MODES } from '../../context';

const MenuItem = ({ icon, iconBg, title, subtitle, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
      <View style={[styles.selectorIcon, {backgroundColor: iconBg || theme.primary}]}>
        <Feather name={icon} size={22} color={danger ? '#FFF' : '#000'} />
      </View>
      <View style={{flex: 1, marginLeft: 16}}>
        <Text style={[styles.menuItemTitle, {marginLeft: 0}, danger && {color: theme.danger}]}>{title}</Text>
        {subtitle && <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>{subtitle}</Text>}
      </View>
      <Feather name="chevron-right" size={20} color={theme.textDim} />
    </View>
  </TouchableOpacity>
);

const SettingsMenuModal = ({ visible, onClose, onProfileMenu, onContentMenu, onReset, onSpeechTest, onVoiceSettings }) => {
    // Backup handler
    const handleBackup = async () => {
      try {
        // Vraag om wachtwoord
        let password = '';
        if (typeof window !== 'undefined') {
          password = prompt('Kies een wachtwoord voor je backup-bestand:');
        } else {
          // React Native prompt alternatief (optioneel: gebruik een eigen modal)
          Alert.prompt(
            'Backup-wachtwoord',
            'Kies een wachtwoord voor je backup-bestand:',
            [
              {
                text: 'Annuleren',
                style: 'cancel',
                onPress: () => {},
              },
              {
                text: 'OK',
                onPress: async (input) => {
                  if (!input) return;
                  const backupObj = await createBackupObject();
                  const encrypted = encryptBackup(backupObj, input);
                  await saveAndShareBackup(encrypted);
                },
              },
            ],
            'secure-text'
          );
          return;
        }
        if (!password) return;
        const backupObj = await createBackupObject();
        const encrypted = encryptBackup(backupObj, password);
        await saveAndShareBackup(encrypted);
      } catch (e) {
        Alert.alert('Fout', 'Backup maken is mislukt. Probeer het opnieuw.');
      }
    };
  const { appMode, setAppMode, setModeRemember, isExpertMode, isGebruikMode } = useApp();

  const handleModeSwitch = () => {
    const newMode = isExpertMode ? APP_MODES.GEBRUIK : APP_MODES.EXPERT;
    const modeName = newMode === APP_MODES.GEBRUIK ? 'Gebruikersmodus' : 'Expertmodus';
    
    Alert.alert(
      "Modus Wijzigen",
      `Wil je overschakelen naar ${modeName}?`,
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Wijzigen", 
          onPress: () => {
            // When switching modes from the settings menu we persist the choice
            // so the app will start in the selected mode next time.
            setModeRemember(true);
            setAppMode(newMode);
            onClose();
          }
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      "App Resetten",
      "Weet je zeker dat je alle gegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.",
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            onClose();
            if (onReset) onReset();
          }
        }
      ]
    );
  };

  return (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.selectorContainer}>
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>Instellingen</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        {isGebruikMode ? (
          // Simplified menu for 'gebruik' mode
          <>
            <MenuItem
              icon="settings"
              iconBg={theme.primary}
              title="Instellingen"
              subtitle="Algemene instellingen"
              onPress={() => { onClose(); onContentMenu ? onContentMenu() : onProfileMenu(); }}
            />
            <MenuItem
              icon="user"
              iconBg={theme.surfaceHighlight}
              title="Persoonlijke instellingen"
              subtitle="Wizzard & teksten"
              onPress={() => { onClose(); if (onProfileMenu) onProfileMenu(); }}
            />
            <MenuItem
              icon="volume-2"
              iconBg={theme.accent}
              title="Stem"
              subtitle="Kies of test de spraak"
              onPress={() => { onClose(); if(onVoiceSettings) onVoiceSettings(); }}
            />
            <MenuItem
              icon="unlock"
              iconBg={theme.surfaceHighlight}
              title="Wijzig naar Expert"
              subtitle="Schakel naar Expertmodus"
              onPress={() => { onClose(); handleModeSwitch(); }}
            />
          </>
        ) : (
          // Full menu for Expert mode
          <>
            <MenuItem
              icon="user"
              iconBg={theme.surfaceHighlight}
              title="Persoonlijke gegevens"
              subtitle="Beheer je profiel"
              onPress={() => { onClose(); if (onProfileMenu) onProfileMenu(); }}
            />
            <MenuItem
              icon="grid"
              iconBg={theme.primary}
              title="Inhoud beheren"
              subtitle="Zinnen, onderwerpen en foto's"
              onPress={() => { onClose(); if (onContentMenu) onContentMenu(); }}
            />
            <MenuItem
              icon="volume-2"
              iconBg={theme.accent}
              title="Stem"
              subtitle="Kies of test de spraak"
              onPress={() => { onClose(); if(onVoiceSettings) onVoiceSettings(); }}
            />
            <MenuItem
              icon="trash-2"
              iconBg={theme.danger}
              title="App resetten"
              subtitle="Verwijder alle data"
              danger
              onPress={() => { onClose(); handleReset(); }}
            />
            <MenuItem
              icon="download"
              iconBg={theme.accent}
              title="Backup maken"
              subtitle="Versleutelde backup exporteren"
              onPress={() => { onClose(); handleBackup(); }}
            />
            <MenuItem
              icon="lock"
              iconBg={theme.surfaceHighlight}
              title="Wijzig naar Gebruikersmodus"
              subtitle="Schakel naar Gebruikersmodus"
              onPress={() => { onClose(); handleModeSwitch(); }}
            />
          </>
        )}
      </View>
    </View>
  </Modal>
  );
};

export default SettingsMenuModal;
