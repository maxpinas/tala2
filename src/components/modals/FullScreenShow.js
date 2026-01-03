import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';
import styles from '../../styles';

const FullScreenShow = ({ text, onClose }) => (
  <Modal animationType="fade" visible={true}>
    <View style={[styles.fullScreenContainer, {backgroundColor: theme.bg}]}>
      <TouchableOpacity style={[styles.fullScreenClose, {backgroundColor: theme.surface, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center'}]} onPress={onClose}>
        <Feather name="x" size={28} color={theme.text} />
        <Text style={{color: theme.text, marginLeft: spacing.sm, fontWeight: '600'}}>Sluiten</Text>
      </TouchableOpacity>
      <View style={styles.fullScreenContent}>
        <Text style={[styles.fullScreenText, {color: theme.text}]}>{text}</Text>
      </View>
    </View>
  </Modal>
);

export default FullScreenShow;
