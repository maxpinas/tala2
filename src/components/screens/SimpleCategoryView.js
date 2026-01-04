import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';
import { renderPhrase, shouldShowPhrase, hasPlaceholders } from '../../data';
import { Header, Grid, Tile } from '../common';

/**
 * SimpleCategoryView - Redesigned category view for Gewoon modus
 * 
 * Features:
 * - New Header component with back button
 * - Photo thumbnails in horizontal scroll
 * - Phrase tiles in 2-column grid
 * - Light theme styling
 */

const SimpleCategoryView = ({
  categoryName,
  phrases = [],
  phraseContext = {},
  photos = [],
  onBack,
  onPhrasePress,
  onPhraseLongPress,
  onPhotoPress,
  onPhotoLongPress,
  onAddPhoto,
  onAddPhrase,
  // Context props - now handled via FilterModal in SimpleHome
  activeLocation,
  activePerson,
  onLocationPress,
  onPersonPress,
}) => {
  const { theme } = useTheme();
  const hasPhotos = photos.length > 0;
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // Check if filter is active
  const isFilterActive = activeLocation?.id !== 'geen' || activePerson?.id !== 'geen';

  // Filter phrases die niet getoond moeten worden (placeholder zonder context)
  // en render de zichtbare phrases met placeholder vervanging
  const visiblePhrases = phrases
    .map((phrase, originalIndex) => {
      const rendered = renderPhrase(phrase, phraseContext);
      const shouldShow = shouldShowPhrase(phrase, phraseContext);
      const hasVars = hasPlaceholders(phrase);
      return {
        original: phrase,
        rendered,
        originalIndex,
        shouldShow,
        hasVars,
      };
    })
    .filter(p => p.shouldShow);
    // Geen sortering meer - behoud de volgorde zoals ingesteld in het beheer scherm

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header with back button and filter toggle */}
      <Header
        title={categoryName}
        showBack={true}
        showFilter={true}
        showMenu={false}
        filterActive={isFilterActive || showFilterOptions}
        showFilterOptions={showFilterOptions}
        activeLocation={activeLocation}
        activePerson={activePerson}
        onBack={onBack}
        onFilter={() => setShowFilterOptions(!showFilterOptions)}
        onLocationPress={onLocationPress}
        onPersonPress={onPersonPress}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add phrase button */}
        {onAddPhrase && (
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={onAddPhrase}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={20} color={theme.textInverse} />
            <Text style={[styles.addButtonText, { color: theme.textInverse }]}>Zin toevoegen</Text>
          </TouchableOpacity>
        )}

        {/* Photos section */}
        {hasPhotos && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textDim }]}>Foto's</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScroll}
            >
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={[styles.photoTile, { backgroundColor: theme.surface }]}
                  onPress={() => onPhotoPress(photo)}
                  onLongPress={() => onPhotoLongPress && onPhotoLongPress(photo)}
                  delayLongPress={500}
                  activeOpacity={0.7}
                >
                  {photo.uri ? (
                    <Image 
                      source={{ uri: photo.uri }} 
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.photoPlaceholder, { backgroundColor: theme.surfaceHighlight }]}>
                      <Feather name="image" size={32} color={theme.textDim} />
                    </View>
                  )}
                  {photo.text && (
                    <View style={styles.photoCaptionContainer}>
                      <Text style={[styles.photoCaption, { color: theme.textInverse }]} numberOfLines={1}>
                        {photo.text}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              {/* Add photo button */}
              <TouchableOpacity
                style={[styles.addPhotoTile, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                onPress={onAddPhoto}
                activeOpacity={0.7}
              >
                <Feather name="plus" size={28} color={theme.primary} />
                <Text style={[styles.addPhotoText, { color: theme.primary }]}>Foto</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Add photo link if no photos yet */}
        {!hasPhotos && (
          <TouchableOpacity
            style={styles.addPhotoLink}
            onPress={onAddPhoto}
            activeOpacity={0.7}
          >
            <Feather name="camera" size={18} color={theme.primary} />
            <Text style={[styles.addPhotoLinkText, { color: theme.primary }]}>Foto toevoegen</Text>
          </TouchableOpacity>
        )}

        {/* Phrases section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textDim }]}>Zinnen</Text>
          
          {visiblePhrases.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={40} color={theme.textDim} />
              <Text style={[styles.emptyText, { color: theme.textDim }]}>Geen zinnen voor deze context</Text>
            </View>
          ) : (
            <View style={styles.phrasesGrid}>
              {visiblePhrases.map((phraseData) => (
                <TouchableOpacity
                  key={phraseData.originalIndex}
                  style={[styles.phraseTile, { backgroundColor: theme.surface }]}
                  onPress={() => onPhrasePress(phraseData.rendered)}
                  onLongPress={() => onPhraseLongPress && onPhraseLongPress(phraseData.original, phraseData.originalIndex)}
                  delayLongPress={500}
                  activeOpacity={0.7}
                >
                  <View style={[styles.phraseIconContainer, { backgroundColor: theme.bg }]}>
                    <Feather name="volume-2" size={18} color={theme.primary} />
                  </View>
                  <Text style={[styles.phraseText, { color: theme.text }]} numberOfLines={3}>
                    {phraseData.rendered}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  contextPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  contextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  contextPillText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  addButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photosScroll: {
    paddingVertical: spacing.sm,
  },
  photoTile: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCaptionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.xs,
  },
  photoCaption: {
    fontSize: 11,
    fontWeight: '500',
  },
  addPhotoTile: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  addPhotoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  addPhotoLinkText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  phrasesGrid: {
    gap: spacing.md,
  },
  phraseTile: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phraseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  phraseText: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});

export default SimpleCategoryView;
