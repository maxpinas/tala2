import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';

/**
 * QuickActionTile Component
 * Tile voor favorieten / quick responses
 * 
 * @param {string} label - Tekst label
 * @param {string} icon - Feather icon naam
 * @param {string} color - Achtergrondkleur (uit theme.quickActions)
 * @param {function} onPress - Tap handler
 * @param {function} onLongPress - Long press handler
 */
const QuickActionTile = ({
  label,
  icon,
  color,
  onPress,
  onLongPress,
}) => {
  const { theme } = useTheme();
  
  // Bepaal kleur op basis van label
  const getColor = () => {
    if (color) return color;
    
    const lowerLabel = label?.toLowerCase() || '';
    if (lowerLabel === 'ja') return theme.quickActions.ja;
    if (lowerLabel === 'nee') return theme.quickActions.nee;
    if (lowerLabel === 'misschien') return theme.quickActions.misschien;
    if (lowerLabel === 'hallo') return theme.quickActions.hallo;
    return theme.quickActions.default;
  };

  // Bepaal icoon op basis van label
  const getIcon = () => {
    if (icon) return icon;
    
    const lowerLabel = label?.toLowerCase() || '';
    if (lowerLabel === 'ja') return 'check';
    if (lowerLabel === 'nee') return 'x';
    if (lowerLabel === 'misschien') return 'help-circle';
    if (lowerLabel === 'hallo') return 'smile';
    if (lowerLabel.includes('wacht')) return 'clock';
    if (lowerLabel.includes('herhaal')) return 'repeat';
    if (lowerLabel.includes('langzaam')) return 'arrow-down';
    return 'message-circle';
  };

  const backgroundColor = getColor();
  const iconName = getIcon();

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Feather name={iconName} size={28} color={theme.textInverse} />
      </View>
      <Text style={[styles.label, { color: theme.textInverse }]} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.tileLabel.fontSize,
    fontWeight: typography.tileLabel.fontWeight,
    textAlign: 'center',
  },
});

export default QuickActionTile;
