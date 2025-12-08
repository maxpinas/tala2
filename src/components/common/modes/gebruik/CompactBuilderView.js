import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../../theme';

const StepButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.stepButton} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
    <Text style={styles.stepLabel}>{label}</Text>
  </TouchableOpacity>
);

const CompactBuilderView = ({ onWho, onDo, onWhat, onWhere }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Zin bouwen</Text>
    <View style={styles.row}>
      <StepButton label="Wie" onPress={onWho} />
      <StepButton label="Doe" onPress={onDo} />
      <StepButton label="Wat" onPress={onWhat} />
      <StepButton label="Waar" onPress={onWhere} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.card,
    marginVertical: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: theme.text,
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
    backgroundColor: theme.primary,
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
