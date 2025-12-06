import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const QuickAccessModal = ({ visible, onClose, onNavigate }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.selectorContainer}>
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>Snel</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('PARTNER_SCREEN'); }}>
          <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="user" size={24} color="#000" />
            </View>
            <View style={{flex: 1, marginLeft: 16}}>
              <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Over mij</Text>
              <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>Uitleg voor de ander</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MEDICAL_SCREEN'); }}>
          <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.accent}]}>
              <Feather name="activity" size={24} color="#FFF" />
            </View>
            <View style={{flex: 1, marginLeft: 16}}>
              <Text style={[styles.menuItemTitle, {marginLeft: 0}]}>Medisch Paspoort</Text>
              <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>Medische informatie</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('EMERGENCY'); }}>
          <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.danger}]}>
              <Feather name="shield" size={24} color="#FFF" />
            </View>
            <View style={{flex: 1, marginLeft: 16}}>
              <Text style={[styles.menuItemTitle, {marginLeft: 0, color: theme.danger}]}>Nood</Text>
              <Text style={{color: theme.textDim, fontSize: 12, marginTop: 2}}>Noodoproep & hulpdiensten</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default QuickAccessModal;
