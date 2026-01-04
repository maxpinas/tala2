import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';
import { useStyles } from '../../styles';
import { clearAllData } from '../../storage';
import { createBackupObject, encryptBackup, saveAndShareBackup } from '../../utils/backup';
import { useApp, APP_MODES } from '../../context';

const MenuItem = ({ icon, iconBg, title, subtitle, onPress, danger, theme, rightElement, styles }) => (
  <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface }]} onPress={onPress} disabled={!onPress}>
    <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
      <View style={[styles.selectorIcon, {backgroundColor: iconBg || theme.primary}]}>
        <Feather name={icon} size={22} color={danger ? theme.textInverse : (iconBg === theme.accent || iconBg === theme.danger ? theme.textInverse : theme.textInverse)} />
      </View>
      <View style={{flex: 1, marginLeft: spacing.lg}}>
        <Text style={[styles.menuItemTitle, {marginLeft: 0, color: theme.text}, danger && {color: theme.danger}]}>{title}</Text>
        {subtitle && <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>{subtitle}</Text>}
      </View>
      {rightElement ? rightElement : (
        onPress && <Feather name="chevron-right" size={20} color={theme.textDim} />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsMenuModal = ({ visible, onClose, onProfileMenu, onContentMenu, onReset, onSpeechTest, onVoiceSettings }) => {
    // Get theme from context
    const { theme, isDark, toggleTheme } = useTheme();
    const styles = useStyles();
    
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
    <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
      <View style={[styles.selectorContainer, { backgroundColor: theme.bg }]}>
        <View style={styles.selectorHeader}>
          <Text style={[styles.selectorTitle, { color: theme.text }]}>Instellingen</Text>
          <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        {/* Dark Mode Toggle - altijd zichtbaar */}
        <MenuItem
          icon={isDark ? "moon" : "sun"}
          iconBg={isDark ? theme.primary : theme.accent}
          title="Donkere modus"
          subtitle={isDark ? "Aan" : "Uit"}
          theme={theme}
          styles={styles}
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.surfaceHighlight, true: theme.primary }}
              thumbColor={theme.surface}
            />
          }
        />
        
        {isGebruikMode ? (
          // C1-C6: Simplified menu for 'gebruik' mode with restructured navigation
          <>
            {/* C1: Renamed to 'Inhoud beheren' */}
            <MenuItem
              icon="grid"
              iconBg={theme.primary}  // C5: Green circle background
              title="Inhoud beheren"
              subtitle="Zinnen, onderwerpen en foto's"
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); if (onContentMenu) onContentMenu(); }}
            />
            {/* C4: Profiel direct naar wizard (BASIC_SETUP) */}
            <MenuItem
              icon="user"
              iconBg={theme.primary}  // C5: Green circle background
              title="Profiel"
              subtitle="Gegevens aanpassen"
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); if (onProfileMenu) onProfileMenu('BASIC_SETUP'); }}
            />
            <MenuItem
              icon="unlock"
              iconBg={theme.primary}  // C5: Green circle background
              title="Wijzig naar Expert"
              subtitle="Schakel naar Expertmodus"
              theme={theme}
              styles={styles}
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
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); if (onProfileMenu) onProfileMenu(); }}
            />
            <MenuItem
              icon="grid"
              iconBg={theme.primary}
              title="Inhoud beheren"
              subtitle="Zinnen, onderwerpen en foto's"
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); if (onContentMenu) onContentMenu(); }}
            />
            <MenuItem
              icon="volume-2"
              iconBg={theme.accent}
              title="Stem"
              subtitle="Kies of test de spraak"
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); if(onVoiceSettings) onVoiceSettings(); }}
            />
            <MenuItem
              icon="trash-2"
              iconBg={theme.danger}
              title="App resetten"
              subtitle="Verwijder alle data"
              danger
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); handleReset(); }}
            />
            <MenuItem
              icon="download"
              iconBg={theme.accent}
              title="Backup maken"
              subtitle="Versleutelde backup exporteren"
              theme={theme}
              styles={styles}
              onPress={() => { onClose(); handleBackup(); }}
            />
            <MenuItem
              icon="lock"
              iconBg={theme.surfaceHighlight}
              title="Wijzig naar Gebruikersmodus"
              subtitle="Schakel naar Gebruikersmodus"
              theme={theme}
              styles={styles}
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
