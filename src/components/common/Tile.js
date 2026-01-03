import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius, typography, shadows } from '../../theme';

/**
 * Tile Component
 * Base tile component voor alle tile varianten
 * 
 * @param {string} label - Tekst label
 * @param {string} sublabel - Optionele subtekst
 * @param {string} icon - Feather icon naam
 * @param {string} backgroundColor - Achtergrondkleur
 * @param {string} iconColor - Icoon kleur
 * @param {string} textColor - Tekst kleur
 * @param {function} onPress - Tap handler
 * @param {function} onLongPress - Long press handler
 * @param {boolean} square - Of de tile vierkant moet zijn (aspect ratio 1:1)
 * @param {string} size - Grootte: 'small', 'medium', 'large'
 * @param {number} badge - Optioneel badge nummer
 * @param {object} style - Extra styling
 */
const Tile = ({
  label,
  sublabel,
  icon,
  backgroundColor = theme.surfaceHighlight,
  iconColor = theme.textInverse,
  textColor = theme.textInverse,
  onPress,
  onLongPress,
  square = true,
  size = 'medium',
  badge,
  style,
  children,
}) => {
  const sizeStyles = {
    small: {
      padding: spacing.md,
      iconSize: 24,
      fontSize: typography.bodySmall.fontSize,
    },
    medium: {
      padding: spacing.lg,
      iconSize: 32,
      fontSize: typography.tileLabel.fontSize,
    },
    large: {
      padding: spacing.xl,
      iconSize: 48,
      fontSize: typography.title.fontSize,
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        {
          backgroundColor,
          padding: currentSize.padding,
        },
        square && styles.square,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {badge !== undefined && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {icon && (
        <View style={styles.iconContainer}>
          <Feather name={icon} size={currentSize.iconSize} color={iconColor} />
        </View>
      )}

      {children}

      {label && (
        <Text 
          style={[
            styles.label, 
            { color: textColor, fontSize: currentSize.fontSize }
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      )}

      {sublabel && (
        <Text style={[styles.sublabel, { color: textColor }]} numberOfLines={1}>
          {sublabel}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  square: {
    aspectRatio: 1,
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    fontWeight: typography.tileLabel.fontWeight,
    textAlign: 'center',
  },
  sublabel: {
    fontSize: typography.caption.fontSize,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: theme.primary,
    borderRadius: borderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: theme.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Tile;
