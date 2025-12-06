import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import styles from '../../styles';

const MovePhraseModal = ({ visible, onClose, phrase, categories, currentCategory, onMove, onCopy }) => {
  const otherCategories = Object.keys(categories).filter(cat => cat !== currentCategory);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20, maxHeight: '80%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600' }}>Zin verplaatsen</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={theme.textDim} />
            </TouchableOpacity>
          </View>
          
          <View style={{ backgroundColor: theme.card, padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: theme.textDim, fontSize: 12, marginBottom: 4 }}>Geselecteerde zin:</Text>
            <Text style={{ color: theme.text, fontSize: 16 }} numberOfLines={2}>{phrase}</Text>
          </View>

          <Text style={{ color: theme.textDim, fontSize: 14, marginBottom: 12 }}>Kies een onderwerp:</Text>
          
          <ScrollView style={{ maxHeight: 300 }}>
            {otherCategories.map((cat) => (
              <View key={cat} style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: theme.card, 
                borderRadius: 12, 
                padding: 12,
                marginBottom: 8 
              }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: theme.surfaceHighlight, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Feather name={categories[cat].icon || 'folder'} size={20} color={theme.primary} />
                </View>
                <Text style={{ color: theme.text, fontSize: 16, flex: 1 }}>{cat}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity 
                    onPress={() => onCopy(cat)}
                    style={{ 
                      backgroundColor: theme.surfaceHighlight, 
                      paddingHorizontal: 12, 
                      paddingVertical: 8, 
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Feather name="copy" size={14} color={theme.accent} />
                    <Text style={{ color: theme.accent, marginLeft: 4, fontSize: 12, fontWeight: '600' }}>Kopieer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onMove(cat)}
                    style={{ 
                      backgroundColor: theme.primary, 
                      paddingHorizontal: 12, 
                      paddingVertical: 8, 
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Feather name="arrow-right" size={14} color="#000" />
                    <Text style={{ color: '#000', marginLeft: 4, fontSize: 12, fontWeight: '600' }}>Verplaats</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MovePhraseModal;
