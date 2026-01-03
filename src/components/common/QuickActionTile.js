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
 * @param {string} color - Achtergrondkleur (deprecated, use backgroundColor)
 * @param {string} backgroundColor - Achtergrondkleur override
 * @param {string} textColor - Tekstkleur override
 * @param {function} onPress - Tap handler
 * @param {function} onLongPress - Long press handler
 */
const QuickActionTile = ({
  label,
  icon,
  color,
  backgroundColor: bgColorProp,
  textColor: textColorProp,
  onPress,
  onLongPress,
}) => {
  const { theme } = useTheme();
  
  // A3: Gebruik provided backgroundColor als die gegeven is, anders default naar uniform groen
  const getColor = () => {
    if (bgColorProp) return bgColorProp;
    if (color) return color;
    
    // Default: uniform groen voor alle favorieten (A3 requirement)
    return theme.categories.etenDrinken;
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

  const tileBackgroundColor = getColor();
  const iconName = getIcon();
  const txtColor = textColorProp || theme.textInverse;

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: tileBackgroundColor }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Feather name={iconName} size={28} color={txtColor} />
      </View>
      <Text style={[styles.label, { color: txtColor }]} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    aspectRatio: 1.43, // A1: 30% less height than square
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
