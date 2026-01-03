import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const EditToolbar = ({ word, onMoveLeft, onMoveRight, onDelete, onDeselect }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.editToolbar, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
      <View style={styles.editInfo}>
        <Text style={[styles.editLabel, { color: theme.textDim }]}>Geselecteerd: </Text>
        <Text style={[styles.editWord, { color: theme.primary }]}>"{word}"</Text>
      </View>
      <View style={styles.editActions}>
         <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.surfaceHighlight }]} onPress={onMoveLeft}>
           <Feather name="arrow-left" size={24} color="#FFF" />
         </TouchableOpacity>
         <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.surfaceHighlight }]} onPress={onMoveRight}>
           <Feather name="arrow-right" size={24} color="#FFF" />
         </TouchableOpacity>
         <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.danger }]} onPress={onDelete}>
           <Feather name="trash-2" size={20} color="#FFF" />
         </TouchableOpacity>
         <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.surfaceHighlight }]} onPress={onDeselect}>
           <Feather name="check" size={20} color={theme.success} />
         </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editToolbar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 12, 
    marginHorizontal: 24, 
    borderRadius: 16, 
    marginBottom: 16, 
    borderWidth: 1 
  },
  editInfo: { 
    flex: 1 
  },
  editLabel: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  },
  editWord: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  editActions: { 
    flexDirection: 'row' 
  },
  editBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 8 
  },
});

export default EditToolbar;
