import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../theme';
import { t } from '../../i18n';
import Grid from './Grid';
import Tile from './Tile';

/**
 * FilterModal Component
 * Context selectie modal met 2 tabs: Locatie en Persoon
 * 
 * @param {boolean} visible - Modal zichtbaar
 * @param {function} onClose - Sluit handler
 * @param {string} activeTab - 'locatie' of 'persoon'
 * @param {array} locations - Array van locatie objecten
 * @param {array} persons - Array van persoon objecten
 * @param {object} activeLocation - Huidige geselecteerde locatie
 * @param {object} activePerson - Huidige geselecteerde persoon
 * @param {function} onLocationSelect - Locatie selectie handler
 * @param {function} onPersonSelect - Persoon selectie handler
 */
const FilterModal = ({
  visible,
  onClose,
  activeTab: initialTab = 'locatie',
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.surfaceHighlight }]}>
            <Text style={[styles.title, { color: theme.text }]}>{t('filter.title')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
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
                const isActive = activeItem?.id === item.id;
                
                return (
                  <Tile
                    key={item.id}
                    label={item.label || item.name}
                    icon={item.icon || (activeTab === 'locatie' ? 'map-pin' : 'user')}
                    backgroundColor={isActive ? theme.primary : theme.surface}
                    iconColor={isActive ? theme.textInverse : theme.text}
                    textColor={isActive ? theme.textInverse : theme.text}
                    onPress={() => {
                      handleSelect(item);
                      onClose();
                    }}
                    style={[
                      styles.tile,
                      { borderColor: isActive ? theme.primary : theme.surfaceHighlight },
                    ]}
                  />
                );
              })}
            </Grid>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '80%',
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
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
  },
  tabLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
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

export default FilterModal;
