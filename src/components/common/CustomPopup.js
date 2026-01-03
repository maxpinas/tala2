import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';

const CustomPopup = ({ visible, title, message, onClose, type = 'info' }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={[styles.popupCard, type === 'danger' && {borderColor: theme.danger}]}>
        <View style={{alignItems: 'center', marginBottom: spacing.lg}}>
           <View style={[styles.popupIcon, {backgroundColor: type === 'danger' ? theme.danger : theme.primary}]}>
             <Feather name={type === 'danger' ? "alert-circle" : type === 'copy' ? "copy" : "volume-2"} size={32} color={type === 'danger' ? theme.textInverse : theme.text} />
           </View>
        </View>
        <Text style={styles.popupTitle}>{title}</Text>
        <Text style={styles.popupMessage}>{message}</Text>
        <TouchableOpacity style={styles.popupBtn} onPress={onClose}>
          <Text style={styles.popupBtnText}>Sluiten</Text>
        </TouchableOpacity>
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
  popupCard: { 
    backgroundColor: theme.bg, 
    width: '90%', 
    alignSelf: 'center', 
    padding: spacing.xl, 
    borderRadius: borderRadius.lg, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: theme.surfaceHighlight, 
    marginBottom: '50%' 
  },
  popupTitle: { 
    color: theme.text, 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: spacing.sm, 
    textAlign: 'center' 
  },
  popupMessage: { 
    color: theme.textDim, 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: spacing.xl 
  },
  popupBtn: { 
    backgroundColor: theme.primary, 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.xxl, 
    borderRadius: borderRadius.full 
  },
  popupBtnText: { 
    color: theme.text, 
    fontWeight: 'bold' 
  },
  popupIcon: { 
    width: 64, 
    height: 64, 
    borderRadius: borderRadius.full, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default CustomPopup;
