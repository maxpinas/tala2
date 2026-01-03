import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const MovePhraseModal = ({ visible, onClose, phrase, categories, currentCategory, onMove, onCopy }) => {
  const otherCategories = Object.keys(categories).filter(cat => cat !== currentCategory);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.xl }}>
        <View style={{ backgroundColor: theme.bg, borderRadius: borderRadius.lg, padding: spacing.xl, maxHeight: '80%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600' }}>Zin verplaatsen</Text>
            <TouchableOpacity onPress={onClose} style={{padding: spacing.sm, backgroundColor: theme.surface, borderRadius: borderRadius.full}}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <View style={{ backgroundColor: theme.surface, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: theme.surfaceHighlight }}>
            <Text style={{ color: theme.textDim, fontSize: 12, marginBottom: spacing.xs }}>Geselecteerde zin:</Text>
            <Text style={{ color: theme.text, fontSize: 16 }} numberOfLines={2}>{phrase}</Text>
          </View>

          <Text style={{ color: theme.textDim, fontSize: 14, marginBottom: spacing.md }}>Kies een onderwerp:</Text>
          
          <ScrollView style={{ maxHeight: 300 }}>
            {otherCategories.map((cat) => (
              <View key={cat} style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: theme.surface, 
                borderRadius: borderRadius.md, 
                padding: spacing.md,
                marginBottom: spacing.sm,
                borderWidth: 1,
                borderColor: theme.surfaceHighlight
              }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: borderRadius.full, 
                  backgroundColor: theme.categories.thuis || theme.primary, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginRight: spacing.md
                }}>
                  <Feather name={categories[cat].icon || 'folder'} size={20} color={theme.text} />
                </View>
                <Text style={{ color: theme.text, fontSize: 16, flex: 1 }}>{cat}</Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <TouchableOpacity 
                    onPress={() => onCopy(cat)}
                    style={{ 
                      backgroundColor: theme.surface, 
                      paddingHorizontal: spacing.md, 
                      paddingVertical: spacing.sm, 
                      borderRadius: borderRadius.sm,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.surfaceHighlight
                    }}
                  >
                    <Feather name="copy" size={14} color={theme.accent} />
                    <Text style={{ color: theme.accent, marginLeft: spacing.xs, fontSize: 12, fontWeight: '600' }}>Kopieer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onMove(cat)}
                    style={{ 
                      backgroundColor: theme.primary, 
                      paddingHorizontal: spacing.md, 
                      paddingVertical: spacing.sm, 
                      borderRadius: borderRadius.sm,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Feather name="arrow-right" size={14} color={theme.text} />
                    <Text style={{ color: theme.text, marginLeft: spacing.xs, fontSize: 12, fontWeight: '600' }}>Verplaats</Text>
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
