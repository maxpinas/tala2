import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const OutputBar = ({ onSpeak, onCopy, onShow, onClear }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.outputBar}>
      <TouchableOpacity style={[styles.outputBtnDestructive, { backgroundColor: theme.surfaceHighlight }]} onPress={onClear}>
        <Feather name="trash-2" size={24} color={theme.textDim} />
      </TouchableOpacity>
      <View style={styles.outputActions}>
        <TouchableOpacity style={[styles.outputBtn, {backgroundColor: theme.primary}]} onPress={onSpeak}>
          <Feather name="volume-2" size={24} color="#000" />
          <Text style={styles.outputBtnTextDark}>Spreek</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.outputBtn, {backgroundColor: theme.surfaceHighlight}]} onPress={onCopy}>
          <Feather name="copy" size={24} color="#FFF" />
          <Text style={styles.outputBtnText}>Kopieer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.outputBtn, {backgroundColor: theme.surfaceHighlight}]} onPress={onShow}>
          <Feather name="monitor" size={24} color="#FFF" />
          <Text style={styles.outputBtnText}>Toon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outputBar: { 
    position: 'absolute', 
    bottom: 30, 
    left: 24, 
    right: 24, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  outputActions: { 
    flexDirection: 'row', 
    backgroundColor: '#162032', 
    borderRadius: 30, 
    padding: 6, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 20, 
    elevation: 10 
  },
  outputBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 24, 
    marginLeft: 6 
  },
  outputBtnTextDark: { 
    color: '#000', 
    fontWeight: 'bold', 
    marginLeft: 6 
  },
  outputBtnText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    marginLeft: 6 
  },
  outputBtnDestructive: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default OutputBar;
