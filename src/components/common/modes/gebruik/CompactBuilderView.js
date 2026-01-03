import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../../theme';

const StepButton = ({ label, onPress, theme }) => (
  <TouchableOpacity style={[styles.stepButton, { backgroundColor: theme.primary }]} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
    <Text style={styles.stepLabel}>{label}</Text>
  </TouchableOpacity>
);

const CompactBuilderView = ({ onWho, onDo, onWhat, onWhere }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Zin bouwen</Text>
      <View style={styles.row}>
        <StepButton label="Wie" onPress={onWho} theme={theme} />
        <StepButton label="Doe" onPress={onDo} theme={theme} />
        <StepButton label="Wat" onPress={onWhat} theme={theme} />
        <StepButton label="Waar" onPress={onWhere} theme={theme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CompactBuilderView;
