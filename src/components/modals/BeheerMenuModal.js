import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';
import { clearAllData } from '../../storage';
import { createBackupObject, encryptBackup, saveAndShareBackup } from '../../utils/backup';

const BeheerMenuModal = ({ visible, onClose, onReset }) => {
  const { theme } = useTheme();

  const MenuItem = ({ icon, title, subtitle, onPress, iconBg, danger }) => (
    <TouchableOpacity 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: spacing.md, 
        borderBottomWidth: 1, 
        borderBottomColor: theme.border 
      }} 
      onPress={onPress}
    >
      <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
        <View style={{ 
          width: 44, 
          height: 44, 
          borderRadius: borderRadius.lg, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: iconBg || theme.primary 
        }}>
          <Feather name={icon} size={22} color={theme.textInverse} />
        </View>
        <View style={{flex: 1, marginLeft: spacing.lg}}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: danger ? theme.danger : theme.text }}>{title}</Text>
          {subtitle && <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>{subtitle}</Text>}
        </View>
        <Feather name="chevron-right" size={20} color={theme.textDim} />
      </View>
    </TouchableOpacity>
  );

  const handleBackup = async () => {
    onClose();
    // Kleine delay zodat modal eerst sluit
    setTimeout(() => {
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
              if (!input) {
                Alert.alert('Fout', 'Vul een wachtwoord in.');
                return;
              }
              try {
                const backupObj = await createBackupObject();
                const encrypted = encryptBackup(backupObj, input);
                await saveAndShareBackup(encrypted);
                // Share dialoog is gesloten - gebruiker heeft gedeeld of geannuleerd
              } catch (e) {
                Alert.alert('Fout', 'Backup maken is mislukt. Probeer het opnieuw.');
              }
            },
          },
        ],
        'secure-text'
      );
    }, 300);
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
      <View style={{ 
        flex: 1, 
        backgroundColor: theme.modalOverlay, 
        justifyContent: 'flex-end' 
      }}>
        <View style={{ 
          backgroundColor: theme.bg, 
          borderTopLeftRadius: borderRadius.xl, 
          borderTopRightRadius: borderRadius.xl, 
          padding: spacing.lg,
          maxHeight: '80%'
        }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: spacing.lg 
          }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Beheer</Text>
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <MenuItem 
            icon="download" 
            iconBg={theme.primary}
            title="Backup maken" 
            subtitle="Versleutelde backup exporteren" 
            onPress={handleBackup} 
          />
          
          <MenuItem 
            icon="trash-2" 
            iconBg={theme.danger}
            title="App resetten" 
            subtitle="Verwijder alle data" 
            onPress={handleReset}
            danger
          />
        </View>
      </View>
    </Modal>
  );
};

export default BeheerMenuModal;
