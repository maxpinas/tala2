import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../../theme';

const LargeTile = ({ icon = 'message-circle', label, onPress, background = theme.surfaceHighlight, color = '#FFFFFF', accessibilityLabel }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tile, { backgroundColor: background }]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.iconWrap}>
        <Feather name={icon} size={34} color={color} />
      </View>
      <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    minHeight: 84,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    elevation: 2,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff44',
    marginRight: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
});

export default LargeTile;
