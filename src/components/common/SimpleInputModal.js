import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const SimpleInputModal = ({ visible, title, placeholder, onSave, onClose }) => {
    const { theme } = useTheme();
    const [val, setVal] = useState("");
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.selectorContainer, { backgroundColor: theme.bg }]}>
                    <View style={styles.selectorHeader}>
                        <Text style={styles.selectorTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#FFF"/>
                        </TouchableOpacity>
                    </View>
                    <TextInput 
                        style={[styles.inputField, { backgroundColor: theme.surface }]} 
                        placeholder={placeholder} 
                        placeholderTextColor={theme.textDim}
                        value={val}
                        onChangeText={setVal}
                        autoFocus
                    />
                    <TouchableOpacity 
                        style={[styles.saveBtn, { backgroundColor: theme.primary }]} 
                        onPress={() => { 
                            if(val.trim()){ 
                                onSave(val.trim()); 
                                setVal(""); 
                                onClose(); 
                            } 
                        }}
                    >
                        <Text style={styles.saveBtnText}>Toevoegen</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    justifyContent: 'flex-end' 
  },
  selectorContainer: { 
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
  inputField: { 
    color: '#FFF', 
    padding: 16, 
    borderRadius: 12, 
    fontSize: 16, 
    marginBottom: 16 
  },
  saveBtn: { 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 10 
  },
  saveBtnText: { 
    fontWeight: 'bold', 
    fontSize: 18 
  },
});

export default SimpleInputModal;
