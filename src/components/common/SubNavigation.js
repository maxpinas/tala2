import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius, typography } from '../../theme';
import { t } from '../../i18n';

/**
 * SubNavigation Component
 * Tab navigatie: Praat | Zien | Herhaal | Favoriet
 * 
 * @param {string} activeTab - Huidige actieve tab ('praat', 'zien', 'herhaal', 'favoriet')
 * @param {function} onTabChange - Handler wanneer tab verandert
 * @param {object} badges - Object met badges per tab: { herhaal: 5, favoriet: 3 }
 */
const SubNavigation = ({
  activeTab = 'praat',
  onTabChange,
  badges = {},
}) => {
  const tabs = [
    { id: 'praat', label: t('navigation.praat'), icon: 'message-square' },
    { id: 'zien', label: t('navigation.zien'), icon: 'image' },
    { id: 'herhaal', label: t('navigation.herhaal'), icon: 'clock' },
    { id: 'favoriet', label: t('navigation.favoriet'), icon: 'star' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const badge = badges[tab.id];

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange && onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Feather 
                name={tab.icon} 
                size={20} 
                color={isActive ? theme.tab.active : theme.tab.inactive} 
              />
              <Text style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
              
              {badge !== undefined && badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
              )}
            </View>
            
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceHighlight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    position: 'relative',
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tabLabel: {
    fontSize: typography.nav.fontSize,
    fontWeight: typography.nav.fontWeight,
    color: theme.tab.inactive,
  },
  tabLabelActive: {
    color: theme.tab.active,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 3,
    backgroundColor: theme.tab.indicator,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  badge: {
    backgroundColor: theme.primary,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginLeft: spacing.xs,
  },
  badgeText: {
    color: theme.textInverse,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SubNavigation;
