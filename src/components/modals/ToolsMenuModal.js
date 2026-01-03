import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const ToolsMenuModal = ({ visible, onClose, onNavigate }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.selectorContainer}>
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>Hulpmiddelen</Text>
          <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('HISTORY'); }}>
          <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
            <Feather name="clock" size={24} color={theme.text} />
          </View>
          <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Geschiedenis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('PARTNER_SCREEN'); }}>
          <View style={[styles.selectorIcon, {backgroundColor: theme.categories.thuis}]}>
            <Feather name="message-circle" size={24} color={theme.text} />
          </View>
          <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Uitleg voor de ander</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MEDICAL_SCREEN'); }}>
          <View style={[styles.selectorIcon, {backgroundColor: theme.danger}]}>
            <Feather name="activity" size={24} color={theme.textInverse} />
          </View>
          <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Medisch Paspoort</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ToolsMenuModal;
