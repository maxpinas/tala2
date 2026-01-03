import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../../theme';

const IconTile = ({ icon = 'smile', label, onPress, size = 64, color = '#fff', bg, accessibilityLabel }) => {
  const { theme } = useTheme();
  const bgColor = bg || theme.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.wrap, { width: size + 24, height: size + 44, borderRadius: 14, backgroundColor: bgColor }]}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.iconInner}>
        <Feather name={icon} size={size / 2} color={color} />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    margin: 6,
  },
  iconInner: {
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default IconTile;
