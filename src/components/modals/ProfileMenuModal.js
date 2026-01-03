import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const ProfileMenuModal = ({ visible, onClose, onNavigate }) => {
  const MenuItem = ({ icon, title, subtitle, onPress, iconBg }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
        <View style={[styles.selectorIcon, {backgroundColor: iconBg || theme.primary}]}>
          <Feather name={icon} size={22} color={iconBg === theme.accent ? theme.textInverse : theme.text} />
        </View>
        <View style={{flex: 1, marginLeft: spacing.lg}}>
          <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>{title}</Text>
          {subtitle && <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>{subtitle}</Text>}
        </View>
        <Feather name="chevron-right" size={20} color={theme.textDim} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.selectorContainer}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>Mijn Profiel</Text>
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <MenuItem 
            icon="user" 
            iconBg={theme.primary}
            title="Gegevens" 
            subtitle="Naam, adres, contacten & medisch" 
            onPress={() => { onClose(); onNavigate('PROFILE_SETUP'); }} 
          />
          
          <MenuItem 
            icon="message-square" 
            iconBg={theme.categories.etenDrinken}
            title="Uitleg Teksten" 
            subtitle="Over mij en medisch paspoort" 
            onPress={() => { onClose(); onNavigate('CUSTOM_TEXTS'); }} 
          />

          <MenuItem 
            icon="volume-2" 
            iconBg={theme.accent}
            title="Stem" 
            subtitle="Kies Claire of Xander" 
            onPress={() => { onClose(); onNavigate('VOICE_SETTINGS'); }} 
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProfileMenuModal;
