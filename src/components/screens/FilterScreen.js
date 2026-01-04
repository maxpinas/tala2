import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';
import { t } from '../../i18n';
import { Grid, Tile } from '../common';

/**
 * FilterScreen Component (B2)
 * Full-screen filter met tabs (locatie/persoon) en terug knop
 * Vervangt FilterModal voor betere navigatie flow
 * 
 * @param {function} onBack - Terug naar vorige scherm
 * @param {string} initialTab - 'locatie' of 'persoon'
 * @param {array} locations - Array van locatie objecten
 * @param {array} persons - Array van persoon objecten
 * @param {object} activeLocation - Huidige geselecteerde locatie
 * @param {object} activePerson - Huidige geselecteerde persoon
 * @param {function} onLocationSelect - Locatie selectie handler
 * @param {function} onPersonSelect - Persoon selectie handler
 */
const FilterScreen = ({
  onBack,
  initialTab = 'locatie',
  locations = [],
  persons = [],
  activeLocation,
  activePerson,
  onLocationSelect,
  onPersonSelect,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSelect = (item) => {
    if (activeTab === 'locatie') {
      onLocationSelect && onLocationSelect(item);
    } else {
      onPersonSelect && onPersonSelect(item);
    }
    // Navigate back after selection
    onBack && onBack();
  };

  const items = activeTab === 'locatie' ? locations : persons;
  const activeItem = activeTab === 'locatie' ? activeLocation : activePerson;

  // Voeg "Geen" optie toe bovenaan
  const noneOption = {
    id: 'geen',
    label: activeTab === 'locatie' ? t('filter.noLocation') : t('filter.noPerson'),
    icon: 'x-circle',
  };

  const allItems = [noneOption, ...items];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header with back button */}
      <View style={[styles.header, { borderBottomColor: theme.surfaceHighlight }]}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{t('filter.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab, 
            { backgroundColor: activeTab === 'locatie' ? theme.primary : theme.surface }
          ]}
          onPress={() => setActiveTab('locatie')}
        >
          <Feather 
            name="map-pin" 
            size={18} 
            color={activeTab === 'locatie' ? theme.textInverse : theme.textDim} 
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'locatie' ? theme.textInverse : theme.textDim }
          ]}>
            {t('filter.location')}
          </Text>
          {activeLocation && activeLocation.id !== 'geen' && (
            <View style={[styles.activeDot, { backgroundColor: theme.success }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: activeTab === 'persoon' ? theme.primary : theme.surface }
          ]}
          onPress={() => setActiveTab('persoon')}
        >
          <Feather 
            name="user" 
            size={18} 
            color={activeTab === 'persoon' ? theme.textInverse : theme.textDim} 
          />
          <Text style={[
            styles.tabLabel,
            { color: activeTab === 'persoon' ? theme.textInverse : theme.textDim }
          ]}>
            {t('filter.person')}
          </Text>
          {activePerson && activePerson.id !== 'geen' && (
            <View style={[styles.activeDot, { backgroundColor: theme.success }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Grid columns={2}>
          {allItems.map((item) => {
            const isActive = activeItem?.id === item.id || 
              (item.id === 'geen' && !activeItem);
            
            return (
              <Tile
                key={item.id}
                label={item.label || item.name}
                icon={item.icon || (activeTab === 'locatie' ? 'map-pin' : 'user')}
                backgroundColor={isActive ? theme.primary : theme.surface}
                iconColor={isActive ? theme.textInverse : theme.text}
                textColor={isActive ? theme.textInverse : theme.text}
                onPress={() => handleSelect(item.id === 'geen' ? null : item)}
                style={[
                  styles.tile,
                  { borderColor: isActive ? theme.primary : theme.surfaceHighlight },
                ]}
              />
            );
          })}
        </Grid>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    position: 'relative',
  },
  tabLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  tile: {
    borderWidth: 1,
  },
});

export default FilterScreen;
