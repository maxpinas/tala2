import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';
import { clearAllData } from '../../utils/storage';

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

const SettingsMenuModal = ({ visible, onClose, onProfileMenu, onContentMenu, onReset }) => {
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
        
        <MenuItem 
          icon="user" 
          title="Mijn Profiel" 
          subtitle="Persoonlijke gegevens en uitleg" 
          onPress={() => { onClose(); onProfileMenu(); }} 
        />
        
        <MenuItem 
          icon="layers" 
          title="Inhoud Beheren" 
          subtitle="Snel reageren, onderwerpen, personen" 
          onPress={() => { onClose(); onContentMenu(); }} 
        />
        
        <MenuItem 
          icon="trash-2" 
          iconBg={theme.danger}
          title="App Resetten" 
          subtitle="Alle gegevens wissen"
          onPress={handleReset}
          danger
        />
      </View>
    </View>
  </Modal>
  );
};

export default SettingsMenuModal;
