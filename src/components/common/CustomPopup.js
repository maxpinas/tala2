import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius } from '../../theme';

const CustomPopup = ({ visible, title, message, onClose, type = 'info' }) => {
  const { theme } = useTheme();
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.popupCard, { backgroundColor: theme.bg, borderColor: theme.surfaceHighlight }, type === 'danger' && {borderColor: theme.danger}]}>
          <View style={{alignItems: 'center', marginBottom: spacing.lg}}>
             <View style={[styles.popupIcon, {backgroundColor: type === 'danger' ? theme.danger : theme.primary}]}>
               <Feather name={type === 'danger' ? "alert-circle" : type === 'copy' ? "copy" : "volume-2"} size={32} color={type === 'danger' ? theme.textInverse : theme.text} />
             </View>
          </View>
          <Text style={[styles.popupTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.popupMessage, { color: theme.textDim }]}>{message}</Text>
          <TouchableOpacity style={[styles.popupBtn, { backgroundColor: theme.primary }]} onPress={onClose}>
            <Text style={[styles.popupBtnText, { color: theme.text }]}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  popupCard: { 
    width: '90%', 
    alignSelf: 'center', 
    padding: spacing.xl, 
    borderRadius: borderRadius.lg, 
    alignItems: 'center', 
    borderWidth: 1, 
    marginBottom: '50%' 
  },
  popupTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: spacing.sm, 
    textAlign: 'center' 
  },
  popupMessage: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: spacing.xl 
  },
  popupBtn: { 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.xxl, 
    borderRadius: borderRadius.full 
  },
  popupBtnText: { 
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
