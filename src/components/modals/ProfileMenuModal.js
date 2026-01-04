import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

const ProfileMenuModal = ({ visible, onClose, onNavigate, onMedicalSettings }) => {
  const { theme } = useTheme();

  const MenuItem = ({ icon, title, subtitle, onPress, iconBg }) => (
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
          {/* C5: Icons altijd wit op gekleurde achtergrond */}
          <Feather name={icon} size={22} color={theme.textInverse} />
        </View>
        <View style={{flex: 1, marginLeft: spacing.lg}}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{title}</Text>
          {subtitle && <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>{subtitle}</Text>}
        </View>
        <Feather name="chevron-right" size={20} color={theme.textDim} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'flex-end' 
      }}>
        <View style={{ 
          backgroundColor: theme.surface, 
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
            <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Mijn Profiel</Text>
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.background, borderRadius: borderRadius.full}}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <MenuItem 
            icon="user" 
            iconBg={theme.primary}
            title="Persoonlijke Gegevens" 
            subtitle="Naam, adres en contactpersonen" 
            onPress={() => { onClose(); onNavigate('PROFILE_SETUP'); }} 
          />
          
          <MenuItem 
            icon="heart" 
            iconBg={theme.primary}
            title="Medisch Paspoort" 
            subtitle="Bloedgroep, medicijnen, allergieën" 
            onPress={() => { onClose(); if (onMedicalSettings) onMedicalSettings(); }} 
          />
          
          <MenuItem 
            icon="message-square" 
            iconBg={theme.primary}
            title="Uitleg Teksten" 
            subtitle="Over mij en medisch paspoort" 
            onPress={() => { onClose(); onNavigate('CUSTOM_TEXTS'); }} 
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProfileMenuModal;