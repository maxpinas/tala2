import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../../theme';

const ActionButton = ({ icon, label, onPress, color, theme }) => (
  <TouchableOpacity onPress={onPress} style={[styles.actionButton, { backgroundColor: color }]} activeOpacity={0.8} accessibilityRole="button">
    <Feather name={icon} size={22} color={theme.text} />
    {label && <Text style={[styles.actionLabel, { color: theme.text }]}>{label}</Text>}
  </TouchableOpacity>
);

const BigActionBar = ({ onBack, onPreview, onSpeak, onCopy }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <ActionButton icon="arrow-left" label="Terug" onPress={onBack} color={theme.card} theme={theme} />
      <ActionButton icon="eye" label="Voorbeeld" onPress={onPreview} color={theme.primary} theme={theme} />
      <ActionButton icon="volume-2" label="Spreek" onPress={onSpeak} color={theme.accent} theme={theme} />
      <ActionButton icon="copy" label="Kopieer" onPress={onCopy} color={theme.card} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    backgroundColor: 'transparent',
  },
  actionButton: {
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  actionLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default BigActionBar;
