import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const ContentMenuModal = ({ visible, onClose, onNavigate, onShowPartners, onShowLocations }) => {
  const MenuItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
        <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
          <Feather name={icon} size={22} color="#000" />
        </View>
        <View style={{flex: 1, marginLeft: 16}}>
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
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <MenuItem 
              icon="zap" 
              title="Snel Reageren" 
              subtitle="Snelle antwoorden aanpassen" 
              onPress={() => { onClose(); onNavigate('MANAGE_QUICK'); }} 
            />
            
            <MenuItem 
              icon="grid" 
              title="Onderwerpen" 
              subtitle="Categorieën en zinnen beheren" 
              onPress={() => { onClose(); onNavigate('TOPIC_MANAGER'); }} 
            />
            
            <MenuItem 
              icon="users" 
              title="Gesprekspartners" 
              subtitle="Mensen en rollen toevoegen" 
              onPress={() => { onClose(); onShowPartners(); }} 
            />
            
            <MenuItem 
              icon="map-pin" 
              title="Locaties" 
              subtitle="Plaatsen en situaties beheren" 
              onPress={() => { onClose(); onShowLocations(); }} 
            />
            
            <View style={{height: 20}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ContentMenuModal;
