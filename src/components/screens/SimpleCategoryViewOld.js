import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { renderPhrase, shouldShowPhrase } from '../../data';

/**
 * SimpleCategoryView - Simplified category view for Gewoon modus
 * 
 * Features:
 * - Big back tile at top
 * - Photo thumbnails only if photos exist (real images, not icons)
 * - Phrase tiles that speak when tapped
 * - Placeholder rendering for {locatie} and {persoon}
 * - No clutter, no small buttons
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
  // Context props
  activeLocation,
  activePerson,
  onLocationPress,
  onPersonPress,
}) => {
  const hasPhotos = photos.length > 0;

  // DEBUG: Log the phraseContext
  console.log('[SimpleCategoryView] phraseContext:', JSON.stringify(phraseContext));
  console.log('[SimpleCategoryView] phrases count:', phrases.length);

  // Filter phrases die niet getoond moeten worden (placeholder zonder context)
  // en render de zichtbare phrases met placeholder vervanging
  const visiblePhrases = phrases
    .map((phrase, originalIndex) => {
      const rendered = renderPhrase(phrase, phraseContext);
      const shouldShow = shouldShowPhrase(phrase, phraseContext);
      // DEBUG: Log each phrase
      if (phrase.includes('{')) {
        console.log('[SimpleCategoryView] Placeholder phrase:', phrase, '→', rendered, 'shouldShow:', shouldShow);
      }
      return {
        original: phrase,
        rendered,
        originalIndex,
        shouldShow,
      };
    })
    .filter(p => p.shouldShow);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Context Knoppen - Compacte versie bovenaan */}
      <View style={styles.contextBar}>
        <TouchableOpacity 
          style={[
            styles.contextButton,
            activeLocation?.id !== 'geen' && styles.contextButtonActive
          ]}
          onPress={onLocationPress}
          activeOpacity={0.7}
        >
          <View style={[
            styles.contextIconCircle,
            activeLocation?.id !== 'geen' && { backgroundColor: theme.primary }
          ]}>
            <Feather 
              name={activeLocation?.icon || 'map-pin'} 
              size={24} 
              color={activeLocation?.id !== 'geen' ? '#000' : theme.textDim} 
            />
          </View>
          <Text style={[
            styles.contextButtonLabel,
            activeLocation?.id !== 'geen' && styles.contextButtonLabelActive
          ]} numberOfLines={1}>
            {activeLocation?.id !== 'geen' ? activeLocation?.label : 'Waar?'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.contextButton,
            activePerson?.id !== 'geen' && styles.contextButtonActive
          ]}
          onPress={onPersonPress}
          activeOpacity={0.7}
        >
          <View style={[
            styles.contextIconCircle,
            activePerson?.id !== 'geen' && { backgroundColor: theme.accent }
          ]}>
            <Feather 
              name={activePerson?.icon || 'user'} 
              size={24} 
              color={activePerson?.id !== 'geen' ? '#000' : theme.textDim} 
            />
          </View>
          <Text style={[
            styles.contextButtonLabel,
            activePerson?.id !== 'geen' && styles.contextButtonLabelActive
          ]} numberOfLines={1}>
            {activePerson?.id !== 'geen' ? (activePerson?.name || activePerson?.label) : 'Met wie?'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back tile - prominent at top */}
        <TouchableOpacity 
          style={styles.backTile}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <View style={styles.backIcon}>
            <Feather name="arrow-left" size={24} color="#000" />
          </View>
          <Text style={styles.backText}>Terug</Text>
        </TouchableOpacity>

        {/* Category title */}
        <Text style={styles.categoryTitle}>{categoryName}</Text>

        {/* Action button: Zin Toevoegen */}
        {onAddPhrase && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={onAddPhrase}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={20} color="#000" />
            <Text style={styles.actionButtonTextDark}>Zin Toevoegen</Text>
          </TouchableOpacity>
        )}

        {/* Photos section - only show if photos exist */}
        {hasPhotos && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto's</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoTile}
                  onPress={() => onPhotoPress(photo)}
                  onLongPress={() => onPhotoLongPress && onPhotoLongPress(photo)}
                  delayLongPress={500}
                  activeOpacity={0.8}
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
                    <View style={styles.photoCaption}>
                      <Text style={styles.photoCaptionText} numberOfLines={1}>
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
                activeOpacity={0.8}
              >
                <Feather name="plus" size={32} color={theme.primary} />
                <Text style={styles.addPhotoText}>Foto</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Add photo tile if no photos yet - small discrete button */}
        {!hasPhotos && (
          <TouchableOpacity
            style={styles.addFirstPhotoBtn}
            onPress={onAddPhoto}
            activeOpacity={0.8}
          >
            <Feather name="camera" size={20} color={theme.primary} />
            <Text style={styles.addFirstPhotoText}>Foto toevoegen</Text>
          </TouchableOpacity>
        )}

        {/* Phrases section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zinnen</Text>
          <View style={styles.phrasesGrid}>
            {visiblePhrases.map((phraseData) => (
              <TouchableOpacity
                key={phraseData.originalIndex}
                style={styles.phraseTile}
                onPress={() => onPhrasePress(phraseData.rendered)}
                onLongPress={() => onPhraseLongPress && onPhraseLongPress(phraseData.original, phraseData.originalIndex)}
                delayLongPress={500}
                activeOpacity={0.8}
              >
                <View style={styles.phraseIcon}>
                  <Feather name="volume-2" size={20} color={theme.primary} />
                </View>
                <Text style={styles.phraseText}>{phraseData.rendered}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {visiblePhrases.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={32} color={theme.textDim} />
              <Text style={styles.emptyText}>Geen zinnen voor deze context</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backTile: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  // Action buttons row styles
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonPrimary: {
    backgroundColor: theme.accent,
  },
  actionButtonLocations: {
    backgroundColor: theme.catPlace,
  },
  actionButtonPeople: {
    backgroundColor: theme.primary,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextDark: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  addPhraseTile: {
    backgroundColor: theme.accent,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addPhraseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addPhraseText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.textDim,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photoTile: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 12,
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
  photoCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  photoCaptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addPhotoTile: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  addFirstPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingVertical: 8,
  },
  addFirstPhotoText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  phrasesGrid: {
    gap: 12,
  },
  phraseTile: {
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phraseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  phraseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.textDim,
    fontSize: 16,
    marginTop: 12,
  },
  /* Context button styles */
  contextBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  contextButton: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contextButtonActive: {
    borderColor: theme.primary,
    backgroundColor: theme.surfaceHighlight,
  },
  contextIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextButtonLabel: {
    flex: 1,
    color: theme.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  contextButtonLabelActive: {
    color: theme.text,
    fontWeight: '700',
  },
});

export default SimpleCategoryView;
