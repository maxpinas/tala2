import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius, typography } from '../../theme';

/**
 * Header Component
 * Nieuwe header met logo, titel, filter en hamburger menu
 * 
 * @param {string} title - Titel tekst (optioneel, anders wordt welkomstbericht getoond)
 * @param {string} userName - Gebruikersnaam voor welkomstbericht
 * @param {boolean} showBack - Toon terug knop
 * @param {boolean} showFilter - Toon filter knop
 * @param {boolean} showMenu - Toon hamburger menu
 * @param {boolean} filterActive - Is er een filter actief?
 * @param {function} onBack - Terug knop handler
 * @param {function} onFilter - Filter knop handler
 * @param {function} onMenu - Menu knop handler
 */
const Header = ({
  title,
  userName,
  showBack = false,
  showFilter = true,
  showMenu = true,
  filterActive = false,
  onBack,
  onFilter,
  onMenu,
}) => {
  // Bepaal begroeting op basis van tijdstip
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
  };

  const displayTitle = title || (userName ? `${getGreeting()}, ${userName}` : 'Welkom');

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Tala</Text>
          </View>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title} numberOfLines={1}>
          {displayTitle}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {showFilter && (
          <TouchableOpacity 
            style={[styles.iconButton, filterActive && styles.iconButtonActive]}
            onPress={onFilter}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather 
              name="sliders" 
              size={22} 
              color={filterActive ? theme.textInverse : theme.text} 
            />
          </TouchableOpacity>
        )}
        
        {showMenu && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="menu" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + spacing.md : spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: theme.bg,
  },
  leftSection: {
    minWidth: 60,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  rightSection: {
    minWidth: 90,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  logoContainer: {
    paddingVertical: spacing.xs,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: theme.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
  },
  iconButtonActive: {
    backgroundColor: theme.primary,
  },
});

export default Header;
