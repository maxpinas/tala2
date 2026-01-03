import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius, typography } from '../../theme';
import { renderPhrase, shouldShowPhrase } from '../../data';
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
  const hasPhotos = photos.length > 0;

  // Filter phrases die niet getoond moeten worden (placeholder zonder context)
  // en render de zichtbare phrases met placeholder vervanging
  const visiblePhrases = phrases
    .map((phrase, originalIndex) => {
      const rendered = renderPhrase(phrase, phraseContext);
      const shouldShow = shouldShowPhrase(phrase, phraseContext);
      return {
        original: phrase,
        rendered,
        originalIndex,
        shouldShow,
      };
    })
    .filter(p => p.shouldShow);

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <Header
        title={categoryName}
        showBack={true}
        showFilter={false}
        showMenu={false}
        onBack={onBack}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Context pills - show active filters */}
        {(activeLocation?.id !== 'geen' || activePerson?.id !== 'geen') && (
          <View style={styles.contextPills}>
            {activeLocation?.id !== 'geen' && (
              <TouchableOpacity 
                style={styles.contextPill}
                onPress={onLocationPress}
              >
                <Feather name="map-pin" size={14} color={theme.primary} />
                <Text style={styles.contextPillText}>{activeLocation?.label}</Text>
              </TouchableOpacity>
            )}
            {activePerson?.id !== 'geen' && (
              <TouchableOpacity 
                style={styles.contextPill}
                onPress={onPersonPress}
              >
                <Feather name="user" size={14} color={theme.primary} />
                <Text style={styles.contextPillText}>{activePerson?.name || activePerson?.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Add phrase button */}
        {onAddPhrase && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddPhrase}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={20} color={theme.textInverse} />
            <Text style={styles.addButtonText}>Zin toevoegen</Text>
          </TouchableOpacity>
        )}

        {/* Photos section */}
        {hasPhotos && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto's</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScroll}
            >
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoTile}
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
                    <View style={styles.photoPlaceholder}>
                      <Feather name="image" size={32} color={theme.textDim} />
                    </View>
                  )}
                  {photo.text && (
                    <View style={styles.photoCaptionContainer}>
                      <Text style={styles.photoCaption} numberOfLines={1}>
                        {photo.text}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              {/* Add photo button */}
              <TouchableOpacity
                style={styles.addPhotoTile}
                onPress={onAddPhoto}
                activeOpacity={0.7}
              >
                <Feather name="plus" size={28} color={theme.primary} />
                <Text style={styles.addPhotoText}>Foto</Text>
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
            <Text style={styles.addPhotoLinkText}>Foto toevoegen</Text>
          </TouchableOpacity>
        )}

        {/* Phrases section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zinnen</Text>
          
          {visiblePhrases.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={40} color={theme.textDim} />
              <Text style={styles.emptyText}>Geen zinnen voor deze context</Text>
            </View>
          ) : (
            <View style={styles.phrasesGrid}>
              {visiblePhrases.map((phraseData) => (
                <TouchableOpacity
                  key={phraseData.originalIndex}
                  style={styles.phraseTile}
                  onPress={() => onPhrasePress(phraseData.rendered)}
                  onLongPress={() => onPhraseLongPress && onPhraseLongPress(phraseData.original, phraseData.originalIndex)}
                  delayLongPress={500}
                  activeOpacity={0.7}
                >
                  <View style={styles.phraseIconContainer}>
                    <Feather name="volume-2" size={18} color={theme.primary} />
                  </View>
                  <Text style={styles.phraseText} numberOfLines={3}>
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
    backgroundColor: theme.bg,
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
    backgroundColor: theme.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  contextPillText: {
    color: theme.primary,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: theme.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  addButtonText: {
    color: theme.textInverse,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: theme.textDim,
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
    backgroundColor: theme.surface,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surfaceHighlight,
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
    color: theme.textInverse,
    fontSize: 11,
    fontWeight: '500',
  },
  addPhotoTile: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.md,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: theme.primary,
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
    color: theme.primary,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  phrasesGrid: {
    gap: spacing.md,
  },
  phraseTile: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phraseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  phraseText: {
    color: theme.text,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.textDim,
    fontSize: typography.body.fontSize,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});

export default SimpleCategoryView;
