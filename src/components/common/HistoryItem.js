import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius, typography, shadows } from '../../theme';

/**
 * HistoryItem Component
 * Horizontaal item voor geschiedenis weergave
 * 
 * @param {string} text - Gesproken tekst
 * @param {string} time - Tijd (HH:mm formaat)
 * @param {function} onPress - Tap handler (spreekt opnieuw uit)
 * @param {function} onLongPress - Long press handler (opties)
 */
const HistoryItem = ({
  text,
  time,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Feather name="clock" size={20} color={theme.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.text} numberOfLines={2}>
          {text}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <View style={styles.actionContainer}>
        <Feather name="volume-2" size={20} color={theme.textDim} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  text: {
    color: theme.text,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    marginBottom: spacing.xs,
  },
  time: {
    color: theme.textDim,
    fontSize: typography.caption.fontSize,
  },
  actionContainer: {
    padding: spacing.sm,
  },
});

export default HistoryItem;
