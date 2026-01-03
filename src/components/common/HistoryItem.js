import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../theme';

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
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
        <Feather name="clock" size={20} color={theme.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text }]} numberOfLines={2}>
          {text}
        </Text>
        <Text style={[styles.time, { color: theme.textDim }]}>{time}</Text>
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
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: typography.caption.fontSize,
  },
  actionContainer: {
    padding: spacing.sm,
  },
});

export default HistoryItem;
