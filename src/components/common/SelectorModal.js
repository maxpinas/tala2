import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';

const SelectorModal = ({ visible, title, options, selectedId, onSelect, onClose, onManage }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.selectorContainer}>
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>{title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: spacing.lg}}>
            {onManage && (
              <TouchableOpacity onPress={onManage} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather name="edit-2" size={18} color={theme.primary} />
                <Text style={{color: theme.primary, marginLeft: spacing.xs, fontWeight: '600'}}>Aanpassen</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
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
                <Feather name={opt.icon} size={24} color={theme.text} />
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
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  selectorContainer: { 
    backgroundColor: theme.bg, 
    borderTopLeftRadius: borderRadius.lg, 
    borderTopRightRadius: borderRadius.lg, 
    padding: spacing.xl, 
    maxHeight: '80%' 
  },
  selectorHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: spacing.xl 
  },
  selectorTitle: { 
    color: theme.text, 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  selectorItem: { 
    alignItems: 'center', 
    marginRight: spacing.xl, 
    opacity: 0.5 
  },
  selectorItemActive: { 
    opacity: 1 
  },
  selectorIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: borderRadius.full, 
    backgroundColor: theme.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: spacing.sm 
  },
  selectorLabel: { 
    color: theme.text, 
    fontWeight: 'bold' 
  },
});

export default SelectorModal;
