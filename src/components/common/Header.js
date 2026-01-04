import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';

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
  showFilterOptions = false,
  activeLocation,
  activePerson,
  onBack,
  onFilter,
  onMenu,
  onLocationPress,
  onPersonPress,
}) => {
  const { theme } = useTheme();
  
  // Bepaal begroeting op basis van tijdstip
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
  };

  const displayTitle = title || (userName ? `${getGreeting()}, ${userName}` : 'Welkom');

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Left section: back button or filter pills */}
      <View style={[styles.leftSection, (showFilterOptions && !showBack) && styles.leftSectionExpanded]}>
        {showBack ? (
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.surface }]}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : showFilterOptions ? (
          // Home page: Filter options mode - show location and person buttons
          <View style={styles.filterOptionsRow}>
            <TouchableOpacity 
              style={[styles.filterPill, { backgroundColor: activeLocation?.id !== 'geen' ? theme.primary : theme.surface }]}
              onPress={onLocationPress}
            >
              <Feather name="map-pin" size={20} color={activeLocation?.id !== 'geen' ? theme.textInverse : theme.text} />
              <Text style={[styles.filterPillText, { color: activeLocation?.id !== 'geen' ? theme.textInverse : theme.text }]} numberOfLines={1}>
                {activeLocation?.id !== 'geen' ? activeLocation?.label : 'Locatie'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterPill, { backgroundColor: activePerson?.id !== 'geen' ? theme.primary : theme.surface }]}
              onPress={onPersonPress}
            >
              <Feather name="user" size={20} color={activePerson?.id !== 'geen' ? theme.textInverse : theme.text} />
              <Text style={[styles.filterPillText, { color: activePerson?.id !== 'geen' ? theme.textInverse : theme.text }]} numberOfLines={1}>
                {activePerson?.id !== 'geen' ? (activePerson?.name || activePerson?.label) : 'Persoon'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // A4: Logo verwijderd, welkomsttekst naar links
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {displayTitle}
          </Text>
        )}
      </View>

      {/* Center section: filter pills when showBack is true, or title */}
      {showBack && (
        <View style={[styles.centerSection, showFilterOptions && styles.centerSectionExpanded]}>
          {showFilterOptions ? (
            // Category page: show location and person buttons next to back button
            <View style={styles.filterOptionsRow}>
              <TouchableOpacity 
                style={[styles.filterPill, { backgroundColor: activeLocation?.id !== 'geen' ? theme.primary : theme.surface }]}
                onPress={onLocationPress}
              >
                <Feather name="map-pin" size={20} color={activeLocation?.id !== 'geen' ? theme.textInverse : theme.text} />
                <Text style={[styles.filterPillText, { color: activeLocation?.id !== 'geen' ? theme.textInverse : theme.text }]} numberOfLines={1}>
                  {activeLocation?.id !== 'geen' ? activeLocation?.label : 'Locatie'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterPill, { backgroundColor: activePerson?.id !== 'geen' ? theme.primary : theme.surface }]}
                onPress={onPersonPress}
              >
                <Feather name="user" size={20} color={activePerson?.id !== 'geen' ? theme.textInverse : theme.text} />
                <Text style={[styles.filterPillText, { color: activePerson?.id !== 'geen' ? theme.textInverse : theme.text }]} numberOfLines={1}>
                  {activePerson?.id !== 'geen' ? (activePerson?.name || activePerson?.label) : 'Persoon'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {displayTitle}
            </Text>
          )}
        </View>
      )}

      <View style={styles.rightSection}>
        {showFilter && (
          <TouchableOpacity 
            style={[
              styles.iconButton, 
              { backgroundColor: filterActive ? theme.primary : theme.surface }
            ]}
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
            style={[styles.iconButton, { backgroundColor: theme.surface }]}
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
  },
  leftSection: {
    minWidth: 60,
    alignItems: 'flex-start',
  },
  leftSectionExpanded: {
    flex: 1,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    flex: 1,
    minHeight: 48,
  },
  filterPillText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  centerSectionExpanded: {
    alignItems: 'stretch',
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
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
