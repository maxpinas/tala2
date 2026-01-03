import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Image, 
  Dimensions, Modal, FlatList, Alert, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../theme';
import { useStyles } from '../../styles';
import { useApp } from '../../context';
import { LargeTile, IconTile, BigActionBar } from '../common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tile sizes
const TILE_SIZES = {
  small: { cols: 3, aspectRatio: 1 },      // 3 per rij, vierkant
  medium: { cols: 2, aspectRatio: 1 },     // 2 per rij, vierkant  
  large: { cols: 1, aspectRatio: 0.6 },    // 1 per rij, breed
};

const GalleryScreen = ({ 
  gallery, 
  setGallery, 
  categories, 
  onBack, 
  onSpeak,
  isInstantMode 
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const localStyles = getLocalStyles(theme);
  const { isGebruikMode } = useApp();
  const PINNED_HEIGHT = 200;
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [playlistMode, setPlaylistMode] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Filter photos by category
  const filteredPhotos = activeFilter === 'all'
    ? gallery
    : gallery.filter(p => p.category === activeFilter);

  // Get unique categories from photos
  const photoCategories = ['all', ...new Set(gallery.map(p => p.category).filter(Boolean))];

  // Pick image from camera
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera toegang nodig', 'Geef toegang tot de camera om foto\'s te maken.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Supports video too
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      addNewPhoto(result.assets[0]);
    }
    setShowAddMenu(false);
  };

  // Pick image from library
  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Foto toegang nodig', 'Geef toegang tot je foto\'s.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      addNewPhoto(result.assets[0]);
    }
    setShowAddMenu(false);
  };

  // Add new photo to gallery
  const addNewPhoto = (asset) => {
    const newPhoto = {
      id: Date.now(),
      uri: asset.uri,
      type: asset.type || 'image', // 'image' or 'video'
      text: '', // Caption - user can add later
      category: null,
      size: 'medium', // default size
      createdAt: new Date().toISOString(),
    };
    setGallery(prev => [newPhoto, ...prev]);
    // Open edit modal to add caption
    setEditingPhoto(newPhoto);
    setShowEditModal(true);
  };

  // Update photo
  const updatePhoto = (photoId, updates) => {
    setGallery(prev => prev.map(p => p.id === photoId ? { ...p, ...updates } : p));
  };

  // Delete photo
  const deletePhoto = (photoId) => {
    Alert.alert(
      'Foto verwijderen?',
      'Deze actie kan niet ongedaan worden.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'Verwijderen', style: 'destructive', onPress: () => {
          setGallery(prev => prev.filter(p => p.id !== photoId));
          setShowEditModal(false);
        }},
      ]
    );
  };

  // Handle photo tap
  const handlePhotoTap = (photo, index) => {
    if (isSelectMode) {
      // Toggle selection
      setSelectedPhotos(prev => 
        prev.includes(photo.id) 
          ? prev.filter(id => id !== photo.id)
          : [...prev, photo.id]
      );
    } else {
      // Show fullscreen and speak
      setFullscreenIndex(index);
      setShowFullscreen(true);
      if (photo.text) {
        onSpeak(photo.text);
      }
    }
  };

  // Handle long press - edit mode
  const handleLongPress = (photo) => {
    setEditingPhoto(photo);
    setShowEditModal(true);
  };

  // Play selected photos as slideshow
  const playPlaylist = () => {
    if (selectedPhotos.length === 0) return;
    // Filter to only show selected photos
    const playlistPhotos = filteredPhotos.filter(p => selectedPhotos.includes(p.id));
    if (playlistPhotos.length === 0) return;
    // Start with first selected photo
    setFullscreenIndex(0); // Start at index 0 of filtered list
    setPlaylistMode(true);
    setShowFullscreen(true);
    setIsSelectMode(false);
  };

  // Calculate tile width based on size
  const getTileStyle = (size = 'medium', index = 0) => {
    const config = TILE_SIZES[size] || TILE_SIZES.medium;
    const gap = 8;
    const padding = 16;
    const availableWidth = SCREEN_WIDTH - (padding * 2);
    // Calculate width with gap between items
    const tileWidth = (availableWidth - (gap * (config.cols - 1))) / config.cols;
    
    return {
      width: tileWidth,
      height: tileWidth / config.aspectRatio,
      marginRight: (index + 1) % config.cols === 0 ? 0 : gap, // No margin on last column
      marginBottom: gap,
    };
  };

  // Render photo tile
  const renderPhotoTile = (photo, index) => {
    const tileStyle = getTileStyle(photo.size, index + 1); // +1 because camera button is index 0
    const isSelected = selectedPhotos.includes(photo.id);

    return (
      <TouchableOpacity 
        key={photo.id}
        style={[
          localStyles.photoTile, 
          tileStyle,
          isSelected && localStyles.photoTileSelected
        ]}
        onPress={() => handlePhotoTap(photo, index)}
        onLongPress={() => handleLongPress(photo)}
        activeOpacity={0.8}
      >
        {photo.uri ? (
          <Image source={{ uri: photo.uri }} style={localStyles.photoImage} />
        ) : (
          <View style={[localStyles.photoPlaceholder, { backgroundColor: photo.color || theme.surfaceHighlight }]} />
        )}

        {/* Video indicator */}
        {photo.type === 'video' && (
          <View style={localStyles.videoIndicator}>
            <Feather name="play-circle" size={24} color="#FFF" />
          </View>
        )}
        
        {/* Caption overlay */}
        {photo.text ? (
          <View style={localStyles.captionOverlay}>
            <Text style={localStyles.captionText} numberOfLines={2}>{photo.text}</Text>
          </View>
        ) : null}

        {/* Selection indicator */}
        {isSelectMode && (
          <View style={[localStyles.selectIndicator, isSelected && localStyles.selectIndicatorActive]}>
            {isSelected && <Feather name="check" size={16} color="#FFF" />}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const gridMarginTop = Math.max(12, PINNED_HEIGHT + 12);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Pinned area: header + title + filters */}
      <View style={localStyles.pinnedContainer}>
        <View style={localStyles.header}>
          <TouchableOpacity onPress={onBack} style={localStyles.backBtn}>
            <Feather name="arrow-left" size={20} color={theme.textDim} />
            <Text style={localStyles.backText}>Terug</Text>
          </TouchableOpacity>
          
          <View style={localStyles.headerActions}>
            {isGebruikMode ? (
              <>
                <TouchableOpacity style={localStyles.headerBtnLarge} onPress={() => setShowAddMenu(true)}>
                  <Feather name="plus" size={28} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={localStyles.headerBtnLarge} onPress={() => setIsSelectMode(true)}>
                  <Feather name="check-square" size={26} color={theme.textDim} />
                </TouchableOpacity>
              </>
            ) : (
              isSelectMode ? (
                <>
                  <TouchableOpacity 
                    style={localStyles.headerBtn}
                    onPress={playPlaylist}
                    disabled={selectedPhotos.length === 0}
                  >
                    <Feather name="play" size={20} color={selectedPhotos.length > 0 ? theme.primary : theme.textDim} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={localStyles.headerBtn}
                    onPress={() => { setIsSelectMode(false); setSelectedPhotos([]); }}
                  >
                    <Text style={{ color: theme.primary, fontWeight: '600' }}>Klaar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={localStyles.headerBtn}
                    onPress={() => setIsSelectMode(true)}
                  >
                    <Feather name="check-square" size={20} color={theme.textDim} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={localStyles.headerBtn}
                    onPress={() => setShowAddMenu(true)}
                  >
                    <Feather name="plus" size={24} color={theme.primary} />
                  </TouchableOpacity>
                </>
              )
            )}
          </View>
        </View>

        <Text style={[styles.catHeaderBig, { marginHorizontal: 16 }]}>Laten Zien</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={localStyles.filterRow}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {photoCategories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[localStyles.filterChip, activeFilter === cat && localStyles.filterChipActive]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[
                localStyles.filterText, 
                activeFilter === cat && localStyles.filterTextActive
              ]}>
                {cat === 'all' ? 'Alles' : cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selection info bar */}
      {isSelectMode && selectedPhotos.length > 0 && (
        <View style={[localStyles.selectionBar, { marginTop: gridMarginTop }]}>
          <Text style={localStyles.selectionText}>
            {selectedPhotos.length} foto{selectedPhotos.length !== 1 ? "'s" : ''} geselecteerd
          </Text>
          <TouchableOpacity onPress={playPlaylist} style={localStyles.playBtn}>
            <Feather name="play" size={16} color="#000" />
            <Text style={localStyles.playBtnText}>Afspelen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Photo grid */}
      <ScrollView 
        style={{ marginTop: gridMarginTop }}
        contentContainerStyle={[localStyles.photoGrid, { paddingTop: 0 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick camera button - always visible */}
        <TouchableOpacity 
          style={[localStyles.quickCameraBtn, getTileStyle('medium', 0)]}
          onPress={() => setShowAddMenu(true)}
        >
          <Feather name="plus" size={32} color={theme.primary} />
          <Text style={localStyles.quickCameraText}>Foto Toevoegen</Text>
        </TouchableOpacity>

        {filteredPhotos.map((photo, index) => renderPhotoTile(photo, index))}
        
        {filteredPhotos.length === 0 && (
          <View style={localStyles.emptyState}>
            <Feather name="image" size={48} color={theme.textDim} />
            <Text style={localStyles.emptyText}>Nog geen foto's</Text>
            <Text style={localStyles.emptySubtext}>Tik op + om foto's toe te voegen</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Menu Modal */}
      <Modal visible={showAddMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={localStyles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowAddMenu(false)}
        >
          <View style={localStyles.addMenu}>
            <Text style={localStyles.addMenuTitle}>Foto toevoegen</Text>
            <TouchableOpacity style={localStyles.addMenuItem} onPress={pickFromCamera}>
              <View style={localStyles.addMenuIcon}>
                <Feather name="camera" size={24} color={theme.primary} />
              </View>
              <View>
                <Text style={localStyles.addMenuItemText}>Camera</Text>
                <Text style={localStyles.addMenuItemSub}>Maak een nieuwe foto</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={localStyles.addMenuItem} onPress={pickFromLibrary}>
              <View style={localStyles.addMenuIcon}>
                <Feather name="image" size={24} color={theme.primary} />
              </View>
              <View>
                <Text style={localStyles.addMenuItemText}>Fotorol</Text>
                <Text style={localStyles.addMenuItemSub}>Kies uit bestaande foto's</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Modal */}
      <EditPhotoModal 
        visible={showEditModal}
        photo={editingPhoto}
        categories={categories}
        isSimpleMode={isGebruikMode}
        onClose={() => { setShowEditModal(false); setEditingPhoto(null); }}
        onSave={(updates) => {
          if (editingPhoto) {
            updatePhoto(editingPhoto.id, updates);
          }
          setShowEditModal(false);
          setEditingPhoto(null);
        }}
        onDelete={() => editingPhoto && deletePhoto(editingPhoto.id)}
      />

      {/* Fullscreen Viewer */}
      <FullscreenViewer
        visible={showFullscreen}
        photos={playlistMode ? filteredPhotos.filter(p => selectedPhotos.includes(p.id)) : filteredPhotos}
        initialIndex={fullscreenIndex}
        playlistMode={playlistMode}
        selectedIds={selectedPhotos}
        onClose={() => { setShowFullscreen(false); setPlaylistMode(false); }}
        onSpeak={onSpeak}
      />
    </View>
  );
};

// Edit Photo Modal Component
const EditPhotoModal = ({ visible, photo, categories, isSimpleMode, onClose, onSave, onDelete }) => {
  const { theme } = useTheme();
  const localStyles = getLocalStyles(theme);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(null);
  const [size, setSize] = useState('medium');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCaptionEditor, setShowCaptionEditor] = useState(false);

  useEffect(() => {
    if (photo) {
      setCaption(photo.text || '');
      setCategory(photo.category || null);
      setSize(photo.size || 'medium');
    }
  }, [photo]);

  if (!photo) return null;

  // Simplified mode for Gewoon users
  if (isSimpleMode) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView 
          style={localStyles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={localStyles.editModal}>
            {/* Header with back tile (match onderwerpen style) */}
            <View style={localStyles.simpleEditHeader}>
              <TouchableOpacity onPress={onClose} style={localStyles.backTile}>
                <View style={localStyles.backIcon}>
                  <Feather name="arrow-left" size={20} color="#000" />
                </View>
                <Text style={localStyles.backText}>Terug</Text>
              </TouchableOpacity>
              <Text style={localStyles.simpleEditTitle}>Foto bewerken</Text>
              <View style={{ width: 80 }} />
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" style={{ paddingHorizontal: 16 }}>
              {/* Preview */}
              <View style={localStyles.editPreview}>
                {photo.uri ? (
                  <Image source={{ uri: photo.uri }} style={localStyles.editPreviewImage} />
                ) : (
                  <View style={[localStyles.editPreviewPlaceholder, { backgroundColor: photo.color }]} />
                )}
              </View>

              {/* Four action buttons in simple mode: caption, category, delete, save */}
              <TouchableOpacity
                style={localStyles.longPressOption}
                onPress={() => setShowCaptionEditor(true)}
              >
                <View style={[localStyles.longPressIconBg, { backgroundColor: theme.surfaceHighlight }]}> 
                  <Feather name="message-circle" size={24} color={theme.textDim} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={localStyles.longPressLabel}>Wat wil je zeggen?</Text>
                  <Text style={localStyles.longPressSublabel}>{caption ? caption : 'Geen bijschrift'}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.textDim} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={localStyles.longPressOption}
                onPress={() => setShowCategoryPicker(true)}
              >
                <View style={[localStyles.longPressIconBg, { backgroundColor: '#22C55E' }]}>
                  <Feather name="folder-plus" size={24} color="#000" />
                </View>
                <Text style={localStyles.longPressLabel}>Toevoegen aan onderwerp</Text>
                {category && <Feather name="check" size={20} color={theme.primary} />}
              </TouchableOpacity>

              <TouchableOpacity style={localStyles.longPressOption} onPress={onDelete}>
                <View style={[localStyles.longPressIconBg, { backgroundColor: theme.danger }]}>
                  <Feather name="trash-2" size={24} color="#FFF" />
                </View>
                <Text style={localStyles.longPressLabel}>Foto verwijderen</Text>
              </TouchableOpacity>

              <TouchableOpacity style={localStyles.longPressOption} onPress={() => onSave({ text: caption, category, size })}>
                <View style={[localStyles.longPressIconBg, { backgroundColor: theme.primary }]}>
                  <Feather name="save" size={24} color="#000" />
                </View>
                <Text style={localStyles.longPressLabel}>Opslaan</Text>
              </TouchableOpacity>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* Caption editor modal */}
        <Modal visible={showCaptionEditor} transparent animationType="fade">
          <View style={localStyles.modalOverlay}>
            {/* tappable backdrop that closes modal when pressed outside the sheet */}
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowCaptionEditor(false)} />

            <View style={localStyles.categoryPickerSheet}>
              <Text style={localStyles.categoryPickerTitle}>Wat wil je zeggen?</Text>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 40}>
                <View style={{ backgroundColor: theme.surface, borderRadius: 12, padding: 12 }}>
                  <TextInput
                    style={[localStyles.captionTextInput, { minHeight: 80 }]}
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="Typ hier wat er gezegd moet worden"
                    placeholderTextColor={theme.textDim}
                    multiline
                    autoFocus
                  />
                </View>
                <TouchableOpacity style={localStyles.saveBtn} onPress={() => setShowCaptionEditor(false)}>
                  <Text style={localStyles.saveBtnText}>Gereed</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>

        {/* Category Picker Modal (same style as long-press modal) */}
        <Modal visible={showCategoryPicker} transparent animationType="slide">
          <TouchableOpacity 
            style={localStyles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowCategoryPicker(false)}
          >
            <View style={localStyles.categoryPickerSheet}>
              <Text style={localStyles.categoryPickerTitle}>Kies onderwerp</Text>
              <ScrollView style={{ maxHeight: 350 }}>
                <TouchableOpacity
                  style={localStyles.longPressOption}
                  onPress={() => { setCategory(null); setShowCategoryPicker(false); }}
                >
                  <View style={[localStyles.longPressIconBg, { backgroundColor: theme.surfaceHighlight }]}>
                    <Feather name="x" size={24} color={theme.textDim} />
                  </View>
                  <Text style={localStyles.longPressLabel}>Geen onderwerp</Text>
                  {!category && <Feather name="check" size={20} color={theme.primary} />}
                </TouchableOpacity>
                {Object.keys(categories).map((catKey) => (
                  <TouchableOpacity
                    key={catKey}
                    style={localStyles.longPressOption}
                    onPress={() => { setCategory(catKey); setShowCategoryPicker(false); }}
                  >
                    <View style={[localStyles.longPressIconBg, { backgroundColor: theme.surfaceHighlight }]}>
                      <Feather name={categories[catKey].icon || 'folder'} size={24} color={theme.primary} />
                    </View>
                    <Text style={localStyles.longPressLabel}>{catKey}</Text>
                    {category === catKey && <Feather name="check" size={20} color={theme.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={localStyles.cancelBtn}
                onPress={() => setShowCategoryPicker(false)}
              >
                <Text style={localStyles.cancelBtnText}>Annuleer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </Modal>
    );
  }

  // Expert mode - full options
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        style={localStyles.modalOverlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={localStyles.editModal}>
          <View style={localStyles.editHeader}>
            <Text style={localStyles.editTitle}>Foto bewerken</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {/* Preview */}
            <View style={localStyles.editPreview}>
              {photo.uri ? (
                <Image source={{ uri: photo.uri }} style={localStyles.editPreviewImage} />
              ) : (
                <View style={[localStyles.editPreviewPlaceholder, { backgroundColor: photo.color }]} />
              )}
            </View>

            {/* Caption */}
            <Text style={localStyles.editLabel}>BIJSCHRIFT (wordt uitgesproken)</Text>
            <View style={localStyles.captionInputContainer}>
              <Feather name="message-circle" size={20} color={theme.textDim} />
              <TextInput
                style={localStyles.captionTextInput}
                value={caption}
                onChangeText={setCaption}
                placeholder="Wat wil je zeggen bij deze foto?"
                placeholderTextColor={theme.textDim}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Size */}
            <Text style={localStyles.editLabel}>GROOTTE</Text>
            <View style={localStyles.sizeRow}>
              {Object.keys(TILE_SIZES).map(s => (
                <TouchableOpacity
                  key={s}
                  style={[localStyles.sizeBtn, size === s && localStyles.sizeBtnActive]}
                  onPress={() => setSize(s)}
                >
                  <Feather 
                    name={s === 'small' ? 'grid' : s === 'medium' ? 'square' : 'maximize'} 
                    size={20} 
                    color={size === s ? '#000' : theme.textDim} 
                  />
                  <Text style={[localStyles.sizeBtnText, size === s && { color: '#000' }]}>
                    {s === 'small' ? 'Klein' : s === 'medium' ? 'Normaal' : 'Groot'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category */}
            <Text style={localStyles.editLabel}>CATEGORIE (optioneel)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={localStyles.categoryRow}>
                <TouchableOpacity
                  style={[localStyles.categoryChip, !category && localStyles.categoryChipActive]}
                  onPress={() => setCategory(null)}
                >
                  <Text style={[localStyles.categoryText, !category && { color: '#000' }]}>Geen</Text>
                </TouchableOpacity>
                {Object.keys(categories).map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[localStyles.categoryChip, category === cat && localStyles.categoryChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Feather 
                      name={categories[cat].icon || 'folder'} 
                      size={14} 
                      color={category === cat ? '#000' : theme.textDim}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[localStyles.categoryText, category === cat && { color: '#000' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Save button */}
            <TouchableOpacity 
              style={localStyles.saveBtn}
              onPress={() => onSave({ text: caption, category, size })}
            >
              <Text style={localStyles.saveBtnText}>Opslaan</Text>
            </TouchableOpacity>

            {/* Delete button */}
            <TouchableOpacity style={localStyles.deleteBtn} onPress={onDelete}>
              <Feather name="trash-2" size={18} color={theme.danger} />
              <Text style={localStyles.deleteBtnText}>Foto verwijderen</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Fullscreen Viewer Component
const FullscreenViewer = ({ visible, photos, initialIndex, playlistMode, selectedIds, onClose, onSpeak }) => {
  const { theme } = useTheme();
  const localStyles = getLocalStyles(theme);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = React.useRef(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  // Auto-advance in playlist mode
  useEffect(() => {
    if (!visible || !playlistMode || photos.length === 0) return;
    
    const timer = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < photos.length) {
        setCurrentIndex(nextIndex);
        flatListRef.current?.scrollToIndex?.({ index: nextIndex, animated: true });
        const nextPhoto = photos[nextIndex];
        if (nextPhoto?.text) {
          onSpeak(nextPhoto.text);
        }
      } else {
        // End of playlist - loop or close
        if (photos.length > 1) {
          setCurrentIndex(0);
          const firstPhoto = photos[0];
          if (firstPhoto?.text) {
            onSpeak(firstPhoto.text);
          }
        } else {
          onClose();
        }
      }
    }, 4000); // 4 seconds per photo

    return () => clearTimeout(timer);
  }, [currentIndex, visible, playlistMode, photos.length]);

  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  const handleSwipe = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < photos.length) {
      setCurrentIndex(newIndex);
      const newPhoto = photos[newIndex];
      if (newPhoto?.text) {
        onSpeak(newPhoto.text);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={localStyles.fullscreenContainer}>
        {/* Close button */}
        <TouchableOpacity style={localStyles.fullscreenClose} onPress={onClose}>
          <Feather name="x" size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Photo */}
        <TouchableOpacity 
          style={localStyles.fullscreenImageContainer}
          activeOpacity={1}
          onPress={() => {
            if (currentPhoto.text) onSpeak(currentPhoto.text);
          }}
        >
          {currentPhoto.uri ? (
            <Image 
              source={{ uri: currentPhoto.uri }} 
              style={localStyles.fullscreenImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[localStyles.fullscreenPlaceholder, { backgroundColor: currentPhoto.color }]} />
          )}
        </TouchableOpacity>

        {/* Caption */}
        {currentPhoto.text && (
          <View style={localStyles.fullscreenCaption}>
            <Text style={localStyles.fullscreenCaptionText}>{currentPhoto.text}</Text>
          </View>
        )}

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <TouchableOpacity 
            style={[localStyles.navArrow, localStyles.navArrowLeft]}
            onPress={() => handleSwipe(-1)}
          >
            <Feather name="chevron-left" size={40} color="#FFF" />
          </TouchableOpacity>
        )}
        {currentIndex < photos.length - 1 && (
          <TouchableOpacity 
            style={[localStyles.navArrow, localStyles.navArrowRight]}
            onPress={() => handleSwipe(1)}
          >
            <Feather name="chevron-right" size={40} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Progress dots */}
        <View style={localStyles.progressDots}>
          {photos.slice(0, 10).map((_, i) => (
            <View 
              key={i} 
              style={[
                localStyles.progressDot,
                i === currentIndex && localStyles.progressDotActive
              ]} 
            />
          ))}
          {photos.length > 10 && <Text style={{ color: '#FFF', marginLeft: 8 }}>+{photos.length - 10}</Text>}
        </View>

        {/* Speak button */}
        <TouchableOpacity 
          style={localStyles.speakButton}
          onPress={() => currentPhoto.text && onSpeak(currentPhoto.text)}
        >
          <Feather name="volume-2" size={24} color="#FFF" />
          <Text style={localStyles.speakButtonText}>Spreek uit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Local styles - function to generate theme-dependent styles
const getLocalStyles = (theme) => ({
  pinnedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: theme.bg,
    paddingTop: 12,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: theme.textDim,
    marginLeft: 8,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerBtn: {
    padding: 8,
  },
  filterRow: {
    marginTop: 12,
    marginBottom: 20,
    maxHeight: 44,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.surfaceHighlight,
    marginRight: 8,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: theme.primary,
  },
  filterText: {
    color: theme.textDim,
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#000',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  selectionText: {
    color: theme.text,
    fontWeight: '600',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playBtnText: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 6,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 100,
    justifyContent: 'flex-start',
  },
  photoTile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.surface,
  },
  photoTileSelected: {
    borderWidth: 3,
    borderColor: theme.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  captionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectIndicatorActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  quickCameraBtn: {
    borderRadius: 12,
    backgroundColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.primary,
  },
  quickCameraText: {
    color: theme.primary,
    marginTop: 8,
    fontWeight: '600',
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: theme.textDim,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  addMenu: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  addMenuTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceHighlight,
  },
  addMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addMenuItemText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  addMenuItemSub: {
    color: theme.textDim,
    fontSize: 14,
    marginTop: 2,
  },
  editModal: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceHighlight,
  },
  editTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
  },
  editPreview: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.surfaceHighlight,
  },
  editPreviewImage: {
    width: '100%',
    height: '100%',
  },
  editPreviewPlaceholder: {
    width: '100%',
    height: '100%',
  },
  editLabel: {
    color: theme.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  captionInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.surfaceHighlight,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  captionInput: {
    flex: 1,
    marginLeft: 12,
  },
  captionInputText: {
    color: theme.text,
    fontSize: 16,
  },
  captionTextInput: {
    flex: 1,
    marginLeft: 12,
    color: theme.text,
    fontSize: 16,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  sizeRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
  },
  sizeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surfaceHighlight,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  sizeBtnActive: {
    backgroundColor: theme.primary,
  },
  sizeBtnText: {
    color: theme.textDim,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.surfaceHighlight,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
  },
  categoryText: {
    color: theme.textDim,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: theme.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    padding: 12,
  },
  deleteBtnText: {
    color: theme.danger,
    marginLeft: 8,
    fontWeight: '600',
  },
  // Simple mode styles (long-press style)
  simpleEditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceHighlight,
  },
  simpleEditTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
  },
  simpleEditLabel: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceHighlight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backPillText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  longPressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  longPressIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  longPressLabel: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  longPressSublabel: {
    color: theme.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  categoryPickerSheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  categoryPickerTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: theme.surfaceHighlight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelBtnText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullscreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenPlaceholder: {
    width: '80%',
    height: '60%',
    borderRadius: 12,
  },
  fullscreenCaption: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 12,
  },
  fullscreenCaptionText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    padding: 12,
  },
  navArrowLeft: {
    left: 8,
  },
  navArrowRight: {
    right: 8,
  },
  progressDots: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFF',
    width: 24,
  },
  speakButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  speakButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default GalleryScreen;
