import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

const ContentMenuModal = ({ visible, onClose, onNavigate, onShowPartners, onShowLocations }) => {
  const { theme } = useTheme();

  const MenuItem = ({ icon, title, subtitle, onPress, iconBg }) => (
    <TouchableOpacity 
      style={{
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: iconBg || theme.primary
        }}>
          <Feather name={icon} size={22} color={iconBg === theme.accent || iconBg === theme.categories.etenDrinken ? theme.textInverse : theme.text} />
        </View>
        <View style={{flex: 1, marginLeft: spacing.lg}}>
          <Text style={{fontSize: 17, fontWeight: '600', color: theme.text}}>{title}</Text>
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
          paddingTop: spacing.lg,
          maxHeight: '85%'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.border
          }}>
            <Text style={{fontSize: 20, fontWeight: '700', color: theme.text}}>Inhoud Beheren</Text>
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <MenuItem 
              icon="star" 
              iconBg={theme.primary}
              title="Favorieten" 
              subtitle="Favoriete zinnen beheren" 
              onPress={() => { onClose(); onNavigate('MANAGE_QUICK'); }} 
            />
            
            <MenuItem 
              icon="grid" 
              iconBg={theme.categories.thuis}
              title="Onderwerpen" 
              subtitle="Categorieën en zinnen beheren" 
              onPress={() => { onClose(); onNavigate('TOPIC_MANAGER'); }} 
            />
            
            <MenuItem 
              icon="users" 
              iconBg={theme.categories.etenDrinken}
              title="Gesprekspartners" 
              subtitle="Mensen en rollen toevoegen" 
              onPress={() => { onClose(); onShowPartners(); }} 
            />
            
            <MenuItem 
              icon="map-pin" 
              iconBg={theme.accent}
              title="Locaties" 
              subtitle="Plaatsen en situaties beheren" 
              onPress={() => { onClose(); onShowLocations(); }} 
            />
            
            <View style={{height: spacing.xl}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ContentMenuModal;
