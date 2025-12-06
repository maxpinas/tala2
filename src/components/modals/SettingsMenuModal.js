import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';
import { clearAllData } from '../../utils/storage';

const SettingsMenuModal = ({ visible, onClose, onNavigate, onReset }) => {
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
          <Text style={styles.selectorTitle}>Profiel & Instellingen</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('BASIC_SETUP'); }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="user" size={24} color="#000" />
            </View>
            <Text style={styles.menuItemTitle}>Profiel</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('EXTENDED_SETUP'); }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="layers" size={24} color="#000" />
            </View>
            <Text style={styles.menuItemTitle}>Profiel uitgebreid</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MANAGE_PEOPLE_LOCATIONS'); }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="map-pin" size={24} color="#000" />
            </View>
            <Text style={styles.menuItemTitle}>Personen & Locaties</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('MANAGE_QUICK'); }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="zap" size={24} color="#000" />
            </View>
            <Text style={styles.menuItemTitle}>Snel Reageren</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('TOPIC_MANAGER'); }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="grid" size={24} color="#000" />
            </View>
            <Text style={styles.menuItemTitle}>Onderwerpen Beheer</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); onNavigate('CUSTOM_TEXTS'); }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.primary}]}>
              <Feather name="message-square" size={24} color="#000" />
            </View>
            <Text style={styles.menuItemTitle}>Uitleg Teksten</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, {marginTop: 20, borderTopWidth: 1, borderTopColor: theme.surfaceHighlight, paddingTop: 20}]} onPress={handleReset}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.selectorIcon, {backgroundColor: theme.danger}]}>
              <Feather name="trash-2" size={24} color="#FFF" />
            </View>
            <Text style={[styles.menuItemTitle, {color: theme.danger}]}>App Resetten</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  );
};

export default SettingsMenuModal;
