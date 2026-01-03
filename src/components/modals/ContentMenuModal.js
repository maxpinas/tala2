import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const ContentMenuModal = ({ visible, onClose, onNavigate, onShowPartners, onShowLocations }) => {
  const MenuItem = ({ icon, title, subtitle, onPress, iconBg }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
        <View style={[styles.selectorIcon, {backgroundColor: iconBg || theme.primary}]}>
          <Feather name={icon} size={22} color={iconBg === theme.accent || iconBg === theme.categories.etenDrinken ? theme.textInverse : theme.text} />
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
        <View style={[styles.selectorContainer, {maxHeight: '85%'}]}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>Inhoud Beheren</Text>
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
