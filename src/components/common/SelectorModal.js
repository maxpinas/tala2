import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

const SelectorModal = ({ visible, title, options, selectedId, onSelect, onClose, onManage }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.selectorContainer}>
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>{title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            {onManage && (
              <TouchableOpacity onPress={onManage} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather name="edit-2" size={18} color={theme.primary} />
                <Text style={{color: theme.primary, marginLeft: 6, fontWeight: '600'}}>Aanpassen</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options.map(opt => (
            <TouchableOpacity 
              key={opt.id} 
              style={[styles.selectorItem, selectedId === opt.id && styles.selectorItemActive]} 
              onPress={() => { onSelect(opt.id); onClose(); }}
            >
              <View style={[styles.selectorIcon, selectedId === opt.id && {backgroundColor: theme.primary}]}>
                <Feather name={opt.icon} size={24} color={selectedId === opt.id ? '#000' : theme.text} />
              </View>
              <Text style={styles.selectorLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    justifyContent: 'flex-end' 
  },
  selectorContainer: { 
    backgroundColor: theme.bg, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24, 
    maxHeight: '80%' 
  },
  selectorHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  selectorTitle: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  selectorItem: { 
    alignItems: 'center', 
    marginRight: 24, 
    opacity: 0.5 
  },
  selectorItemActive: { 
    opacity: 1 
  },
  selectorIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: theme.surfaceHighlight, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  selectorLabel: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
});

export default SelectorModal;
