import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';
import { t } from '../../i18n';
import { 
  Header, 
  SubNavigation, 
  FloatingActionButton, 
  Grid,
  Tile,
  QuickActionTile,
  HistoryItem,
} from '../common';

/**
 * SimpleHome - Redesigned home screen for Gewoon modus
 * New tab-based navigation: Praat | Zien | Herhaal | Favoriet
 * Features:
 * - Header with filter and menu
 * - Tab navigation
 * - FAB with expandable menu
 * - Filter modal for location/person context
 */

const SimpleHome = ({
  // Data
  quickResponses = [],
  categories = {},
  history = [],
  gallery = [], // Photos from App.js
  userName,
  
  // Original handlers (backwards compatible)
  onQuickResponse,
  onQuickResponseLongPress,
  onPraat,
  onLatenZien,
  onCategory,
  onHerhaal,
  onSettings,
  onSnel,
  
  // Photo handlers
  onPhotoPress,
  onPhotoLongPress,
  
  // History handlers (new)
  onHistoryItemPress,
  onHistoryItemLongPress,
  
  // Context - original props
  activeLocation,
  activePerson,
  onLocationPress,
  onPersonPress,
  
  // B2: Filter via screen navigation instead of modal
  onOpenFilter,
  
  // Context - new props for FilterModal (kept for backward compatibility)
  locations = [],
  persons = [],
  onLocationSelect,
  onPersonSelect,
}) => {
  const { theme } = useTheme();
  
  // A2: Alle home tiles krijgen dezelfde groene kleur als 'Eten en Drinken'
  // Dit maakt de interface rustiger en uniformer
  const getHomeTileColor = () => {
    return theme.categories.etenDrinken; // Uniform groen voor alle home tiles
  };
  
  // A3: Favoriet tiles krijgen dezelfde groene kleur (Ja tile kleur)
  const getFavoriteTileColor = () => {
    return theme.categories.etenDrinken; // Zelfde groen als home tiles
  };
  
  // State
  const [activeTab, setActiveTab] = useState('praat');
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Check if filter is active
  const isFilterActive = activeLocation?.id !== 'geen' || activePerson?.id !== 'geen';

  // Filter categories - exclude special ones for main grid
  const SPECIAL_CATEGORIES = ['Persoonlijk', 'Aangepast', 'Herhaal'];
  const normalCategories = Object.keys(categories).filter(
    key => !SPECIAL_CATEGORIES.includes(key)
  );

  // Handlers
  const handleTabChange = (tab) => {
    // B1: "Zien" tab navigates directly to GalleryScreen (same as FAB → Kijken)
    if (tab === 'zien' && onLatenZien) {
      onLatenZien();
      return; // Don't change tab, navigate instead
    }
    
    // Animate tab transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setActiveTab(tab);
    // Backwards compatibility: trigger original handlers for certain tabs
    if (tab === 'herhaal' && onHerhaal) {
      // Don't navigate away, just switch tab
    }
  };

  const handleFilterPress = () => {
    // B2: Navigate to FilterScreen instead of showing modal
    if (onOpenFilter) {
      onOpenFilter();
    } else if (onLocationPress) {
      // Fallback: show location selector
      onLocationPress();
    }
  };

  const handleHistoryPress = (item) => {
    if (onHistoryItemPress) {
      onHistoryItemPress(item);
    } else if (onQuickResponse) {
      // Fallback: use quick response handler to speak
      onQuickResponse(item.text);
    }
  };

  const handleHistoryLongPress = (item) => {
    if (onHistoryItemLongPress) {
      onHistoryItemLongPress(item);
    }
  };

  // Render Praat Tab (Categories)
  const renderPraatTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* A7: Section title removed - tiles speak for themselves */}

      {/* Categories Grid */}
      <Grid columns={2}>
        {normalCategories.map((catKey) => (
          <Tile
            key={catKey}
            label={catKey}
            icon={categories[catKey].icon || 'grid'}
            backgroundColor={getHomeTileColor()}
            textColor={theme.textInverse}
            iconColor={theme.textInverse}
            onPress={() => onCategory(catKey)}
          />
        ))}
      </Grid>
    </ScrollView>
  );

  // Render Zien Tab (Photos/Kijken style - focus on text)
  const renderZienTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {gallery.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="image" size={48} color={theme.textDim} />
          <Text style={[styles.emptyStateText, { color: theme.textDim }]}>{t('gallery.empty')}</Text>
          <TouchableOpacity 
            style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
            onPress={onLatenZien}
          >
            <Feather name="plus" size={18} color={theme.textInverse} />
            <Text style={[styles.emptyStateButtonText, { color: theme.textInverse }]}>{t('gallery.addPhoto')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        gallery.map((photo, index) => (
          <TouchableOpacity
            key={photo.id || index}
            style={[styles.photoListItem, { backgroundColor: theme.surface }]}
            onPress={() => onPhotoPress && onPhotoPress(photo)}
            onLongPress={() => onPhotoLongPress && onPhotoLongPress(photo)}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: photo.uri }} 
              style={styles.photoListImage}
              resizeMode="cover"
            />
            <View style={styles.photoListTextContainer}>
              <Text style={[styles.photoListCaption, { color: theme.text }]} numberOfLines={2}>
                {photo.caption || t('gallery.noCaption')}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.textDim} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  // Render Herhaal Tab (History)
  const renderHerhaalTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="clock" size={48} color={theme.textDim} />
          <Text style={[styles.emptyStateText, { color: theme.textDim }]}>{t('history.empty')}</Text>
        </View>
      ) : (
        history.map((item, index) => (
          <HistoryItem
            key={item.timestamp || index}
            text={item.text}
            time={item.time}
            onPress={() => handleHistoryPress(item)}
            onLongPress={() => handleHistoryLongPress(item)}
          />
        ))
      )}
    </ScrollView>
  );

  // Render Favoriet Tab (Quick Responses)
  const renderFavorietTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {quickResponses.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="star" size={48} color={theme.textDim} />
          <Text style={[styles.emptyStateText, { color: theme.textDim }]}>{t('favorites.empty')}</Text>
        </View>
      ) : (
        <Grid columns={2}>
          {quickResponses.map((qr, index) => (
            <QuickActionTile
              key={index}
              label={qr}
              backgroundColor={getFavoriteTileColor()}
              textColor={theme.textInverse}
              onPress={() => onQuickResponse && onQuickResponse(qr)}
              onLongPress={() => onQuickResponseLongPress && onQuickResponseLongPress(qr)}
            />
          ))}
        </Grid>
      )}
    </ScrollView>
  );

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'praat':
        return renderPraatTab();
      case 'zien':
        return renderZienTab();
      case 'herhaal':
        return renderHerhaalTab();
      case 'favoriet':
        return renderFavorietTab();
      default:
        return renderPraatTab();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <Header
        userName={userName}
        showFilter={true}
        showMenu={true}
        filterActive={isFilterActive}
        onFilter={handleFilterPress}
        onMenu={onSettings}
      />

      {/* Sub Navigation Tabs */}
      <SubNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badges={{
          herhaal: history.length,
          favoriet: quickResponses.length,
        }}
      />

      {/* Tab Content with Animation */}
      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        {renderTabContent()}
      </Animated.View>

      {/* Floating Action Button */}
      <FloatingActionButton
        onZin={onPraat}
        onKijken={onLatenZien}
        onToon={() => onSnel && onSnel('toon')}
        onArts={() => onSnel && onSnel('arts')}
        onNood={() => onSnel && onSnel('nood')}
      />

      {/* B2: FilterModal removed - now using FilterScreen via onOpenFilter */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  specialRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  specialTile: {
    flex: 1,
    paddingVertical: spacing.lg,
    aspectRatio: undefined,
    minHeight: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: typography.body.fontSize,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  emptyStateButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  photoTile: {
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.tileGap,
  },
  photoImage: {
    flex: 1,
    width: '100%',
  },
  photoCaptionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.sm,
  },
  photoCaption: {
    fontSize: typography.caption.fontSize,
  },
  // New list style for Kijken/Zien tab
  photoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  photoListImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
  },
  photoListTextContainer: {
    flex: 1,
  },
  photoListCaption: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
});

export default SimpleHome;
