import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../theme';
import { t } from '../../i18n';

/**
 * FloatingActionButton Component
 * FAB met uitklapmenu voor: Zin, Kijken, Toon, Arts, Nood
 * 
 * @param {function} onZin - Zin bouwen handler
 * @param {function} onKijken - Foto kijken handler
 * @param {function} onToon - Toon tekst handler
 * @param {function} onArts - Arts info handler
 * @param {function} onNood - Noodgeval handler
 */
const FloatingActionButton = ({
  onZin,
  onKijken,
  onToon,
  onArts,
  onNood,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const menuItems = [
    { id: 'nood', label: t('fab.nood'), icon: 'alert-triangle', color: theme.fabMenu.nood, onPress: onNood },
    { id: 'arts', label: t('fab.arts'), icon: 'heart', color: theme.fabMenu.arts, onPress: onArts },
    { id: 'toon', label: t('fab.toon'), icon: 'eye', color: theme.fabMenu.toon, onPress: onToon },
    { id: 'kijken', label: t('fab.kijken'), icon: 'camera', color: theme.fabMenu.kijken, onPress: onKijken },
    { id: 'zin', label: t('fab.zin'), icon: 'edit-3', color: theme.fabMenu.zin, onPress: onZin },
  ];

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
  };

  const handleItemPress = (item) => {
    toggleMenu();
    if (item.onPress) {
      // Kleine vertraging voor animatie
      setTimeout(() => item.onPress(), 100);
    }
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <Animated.View 
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        >
          <Pressable style={styles.backdropPressable} onPress={toggleMenu} />
        </Animated.View>
      )}

      <View style={styles.container}>
        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -((index + 1) * 60)],
          });

          const scale = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
          });

          const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
          });

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.menuItem,
                {
                  transform: [{ translateY }, { scale }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: item.color }]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                <Feather name={item.icon} size={22} color={theme.textInverse} />
              </TouchableOpacity>
              
              <Animated.View style={[styles.labelContainer, { opacity, backgroundColor: theme.surface }]}>
                <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              </Animated.View>
            </Animated.View>
          );
        })}

        {/* Main FAB */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Feather name="plus" size={28} color={theme.textInverse} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 998,
  },
  backdropPressable: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    alignItems: 'center',
    zIndex: 999,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  menuItem: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    ...shadows.md,
  },
  labelContainer: {
    position: 'absolute',
    right: 60,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    ...shadows.sm,
  },
  menuLabel: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
});

export default FloatingActionButton;
