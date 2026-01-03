import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const AddOrEditPhotoModal = ({ visible, onClose, onSave, categories, initialData, onTriggerPopup }) => {
  const [caption, setCaption] = useState(initialData ? initialData.text : '');
  const [selectedTag, setSelectedTag] = useState(initialData ? initialData.category : null);
  
  useEffect(() => { 
    if(visible) { 
      setCaption(initialData ? initialData.text : ''); 
      setSelectedTag(initialData ? initialData.category : null); 
    } 
  }, [visible, initialData]);
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.selectorContainer}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>{initialData ? "Foto Bewerken" : "Foto Toevoegen"}</Text>
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
              <Feather name="x" size={24} color={theme.text}/>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {!initialData && (
                <View style={styles.photoSourceRow}>
                   <TouchableOpacity style={[styles.photoSourceBtn, {borderWidth: 1, borderColor: theme.surfaceHighlight}]} onPress={() => onTriggerPopup("Camera", "Klik! (Simulatie)", "info")}>
                      <Feather name="camera" size={32} color={theme.primary} />
                      <Text style={styles.sourceText}>Camera</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.photoSourceBtn, {borderWidth: 1, borderColor: theme.surfaceHighlight}]} onPress={() => onTriggerPopup("Fotorol", "Galerij opent... (Simulatie)", "info")}>
                      <Feather name="image" size={32} color={theme.primary} />
                      <Text style={styles.sourceText}>Fotorol</Text>
                   </TouchableOpacity>
                </View>
            )}
            <Text style={styles.label}>CATEGORIE (Optioneel)</Text>
            <View style={styles.tagContainer}>
              {Object.keys(categories).map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.tagChip, selectedTag === cat && styles.tagChipActive]} 
                  onPress={() => setSelectedTag(cat)}
                >
                   <Feather name={categories[cat].icon} size={14} color={selectedTag === cat ? theme.textInverse : theme.textDim} style={{marginRight: spacing.xs}}/>
                   <Text style={[styles.tagText, selectedTag === cat && {color: theme.textInverse, fontWeight:'bold'}]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, {marginTop: spacing.xl}]}>BIJSCHRIFT</Text>
            <TextInput 
              style={styles.builderInput} 
              placeholder="Bijv. Onze hond Max..." 
              placeholderTextColor={theme.textDim} 
              value={caption} 
              onChangeText={setCaption} 
            />
            <TouchableOpacity style={styles.saveBtn} onPress={() => { onSave(caption, selectedTag); onClose(); }}>
              <Text style={styles.saveBtnText}>Opslaan</Text>
            </TouchableOpacity>
            <View style={{height: spacing.xxl}}/>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddOrEditPhotoModal;
