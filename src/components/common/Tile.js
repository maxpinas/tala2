import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../theme';

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
 * @param {boolean} square - Of de tile vierkant moet zijn (aspect ratio 1:1) - DEPRECATED, use wide instead
 * @param {boolean} wide - Of de tile breed/rechthoekig moet zijn (aspect ratio 1.4:1, 30% minder hoog)
 * @param {string} size - Grootte: 'small', 'medium', 'large'
 * @param {number} badge - Optioneel badge nummer
 * @param {string} backgroundImage - D6-D7: Optional background image URI
 * @param {object} style - Extra styling
 */
const Tile = ({
  label,
  sublabel,
  icon,
  backgroundColor,
  iconColor,
  textColor,
  onPress,
  onLongPress,
  square = false, // Changed default to false
  wide = true, // New default: wide tiles (A1 requirement)
  size = 'medium',
  badge,
  backgroundImage, // D6-D7: Background image support
  style,
  children,
}) => {
  const { theme } = useTheme();
  
  // Use theme defaults if not provided
  const bgColor = backgroundColor || theme.surfaceHighlight;
  const iconClr = iconColor || theme.textInverse;
  const txtClr = textColor || theme.textInverse;
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

  // D6-D7: Content wrapper for both normal and image background tiles
  const tileContent = (
    <>
      {badge !== undefined && (
        <View style={[styles.badgeContainer, { backgroundColor: theme.primary }]}>
          <Text style={[styles.badgeText, { color: theme.textInverse }]}>{badge}</Text>
        </View>
      )}

      {icon && (
        <View style={styles.iconContainer}>
          <Feather name={icon} size={currentSize.iconSize} color={iconClr} />
        </View>
      )}

      {children}

      {label && (
        <Text 
          style={[
            styles.label, 
            { color: txtClr, fontSize: currentSize.fontSize }
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      )}

      {sublabel && (
        <Text style={[styles.sublabel, { color: txtClr }]} numberOfLines={1}>
          {sublabel}
        </Text>
      )}
    </>
  );

  // D6-D7: If we have a background image, use ImageBackground
  if (backgroundImage) {
    return (
      <TouchableOpacity
        style={[
          styles.tile,
          wide && styles.wide,
          square && styles.square,
          { overflow: 'hidden' },
          style,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
            <View style={{ padding: currentSize.padding, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {tileContent}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        {
          backgroundColor: bgColor,
          padding: currentSize.padding,
        },
        wide && styles.wide, // A1: 30% less height (aspect ratio ~1.4:1)
        square && styles.square, // Legacy: perfect square
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {tileContent}
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
  wide: {
    aspectRatio: 1.43, // A1: 30% less height than square (1 / 0.7 = 1.43)
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
    borderRadius: borderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  // D6-D7: Image background styles
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: borderRadius.md,
  },
  imageOverlay: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
});

export default Tile;
