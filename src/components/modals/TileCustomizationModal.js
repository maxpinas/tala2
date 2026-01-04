import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Modal, ScrollView, 
  TextInput, StyleSheet, Image, Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';

/**
 * TileCustomizationModal Component (D1-D8)
 * Allows customization of home and favorite tiles via long press
 * 
 * @param {boolean} visible - Modal visibility
 * @param {function} onClose - Close handler
 * @param {object} tile - Current tile data to customize
 * @param {function} onSave - Save handler (receives updated tile data)
 * @param {function} onDelete - Delete handler (optional)
 * @param {function} onMoveUp - Move up handler (optional)
 * @param {function} onMoveDown - Move down handler (optional)
 * @param {array} gallery - Available photos for background selection
 * @param {string} tileType - 'category' | 'favorite' | 'quickResponse'
 */

// Available color options for tiles (14 colors)
const COLOR_OPTIONS = [
  { id: 'green', lightColor: '#7A9A8A', darkColor: '#8FBCBB', label: 'Groen' },
  { id: 'blue', lightColor: '#2196F3', darkColor: '#1976D2', label: 'Blauw' },
  { id: 'purple', lightColor: '#9C27B0', darkColor: '#7B1FA2', label: 'Paars' },
  { id: 'orange', lightColor: '#FF9800', darkColor: '#F57C00', label: 'Oranje' },
  { id: 'red', lightColor: '#F44336', darkColor: '#D32F2F', label: 'Rood' },
  { id: 'teal', lightColor: '#009688', darkColor: '#00796B', label: 'Teal' },
  { id: 'pink', lightColor: '#E91E63', darkColor: '#C2185B', label: 'Roze' },
  { id: 'indigo', lightColor: '#3F51B5', darkColor: '#303F9F', label: 'Indigo' },
  { id: 'cyan', lightColor: '#00BCD4', darkColor: '#0097A7', label: 'Cyaan' },
  { id: 'amber', lightColor: '#FFC107', darkColor: '#FFA000', label: 'Amber' },
  { id: 'lime', lightColor: '#CDDC39', darkColor: '#AFB42B', label: 'Limoen' },
  { id: 'brown', lightColor: '#795548', darkColor: '#5D4037', label: 'Bruin' },
  { id: 'grey', lightColor: '#9E9E9E', darkColor: '#616161', label: 'Grijs' },
  { id: 'deepPurple', lightColor: '#673AB7', darkColor: '#512DA8', label: 'Diep Paars' },
];

// Available text/icon color options (8 colors)
const TEXT_COLOR_OPTIONS = [
  { id: 'white', color: '#FFFFFF', label: 'Wit' },
  { id: 'black', color: '#000000', label: 'Zwart' },
  { id: 'yellow', color: '#FFEB3B', label: 'Geel' },
  { id: 'red', color: '#F44336', label: 'Rood' },
  { id: 'blue', color: '#2196F3', label: 'Blauw' },
  { id: 'green', color: '#8FBCBB', label: 'Groen' },
  { id: 'orange', color: '#FF9800', label: 'Oranje' },
  { id: 'purple', color: '#9C27B0', label: 'Paars' },
];

const TileCustomizationModal = ({
  visible,
  onClose,
  tile,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  gallery = [],
  tileType = 'category',
}) => {
  const { theme, isDark } = useTheme();
  
  // Local state for editing
  const [name, setName] = useState('');
  const [colorId, setColorId] = useState('green');
  const [darkColorId, setDarkColorId] = useState('green');
  const [textColorLight, setTextColorLight] = useState('white'); // 'white' or 'black'
  const [textColorDark, setTextColorDark] = useState('white'); // 'white' or 'black'
  const [iconColorLight, setIconColorLight] = useState('white'); // 'white' or 'black'
  const [iconColorDark, setIconColorDark] = useState('white'); // 'white' or 'black'
  const [backgroundPhotoId, setBackgroundPhotoId] = useState(null);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false); // Apply to all tiles

  // Initialize state from tile data
  useEffect(() => {
    if (tile) {
      setName(tile.customName || tile.label || tile.text || '');
      setColorId(tile.colorId || 'green');
      setDarkColorId(tile.darkColorId || tile.colorId || 'green');
      // Support old textColor field for backwards compatibility
      const legacyTextColor = tile.hasOwnProperty && tile.hasOwnProperty('textColor') ? tile.textColor : 'white';
      setTextColorLight(tile.textColorLight || legacyTextColor);
      setTextColorDark(tile.textColorDark || 'white');
      setIconColorLight(tile.iconColorLight || 'white');
      setIconColorDark(tile.iconColorDark || 'white');
      setBackgroundPhotoId(tile.backgroundPhotoId || null);
      setApplyToAll(false); // Reset when opening new tile
    }
  }, [tile]);

  const handleSave = () => {
    if (!tile) return;
    
    const updatedTile = {
      ...tile,
      customName: name !== (tile.label || tile.text) ? name : undefined,
      colorId,
      darkColorId,
      textColorLight,
      textColorDark,
      iconColorLight,
      iconColorDark,
      backgroundPhotoId,
      applyToAll, // Flag to indicate if should apply to all tiles
    };
    
    onSave && onSave(updatedTile);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Verwijderen',
      'Weet je zeker dat je dit item wilt verwijderen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'Verwijderen', style: 'destructive', onPress: () => {
          onDelete && onDelete(tile);
          onClose();
        }},
      ]
    );
  };

  const handleRemovePhoto = () => {
    setBackgroundPhotoId(null);
  };

  const getSelectedColor = (id) => {
    return COLOR_OPTIONS.find(c => c.id === id) || COLOR_OPTIONS[0];
  };

  const getTextColorValue = (id) => {
    const found = TEXT_COLOR_OPTIONS.find(c => c.id === id);
    return found ? found.color : '#FFFFFF';
  };

  const selectedLightColor = getSelectedColor(colorId);
  const selectedDarkColor = getSelectedColor(darkColorId);
  const backgroundPhoto = gallery.find(p => p.id === backgroundPhotoId);

  // Preview tile appearance - use appropriate color based on current mode
  const previewBgColor = isDark 
    ? selectedDarkColor.darkColor 
    : selectedLightColor.lightColor;
  const currentTextColor = isDark ? textColorDark : textColorLight;
  const currentIconColor = isDark ? iconColorDark : iconColorLight;
  const previewTextColor = getTextColorValue(currentTextColor);
  const previewIconColor = getTextColorValue(currentIconColor);

  if (!tile) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.surfaceHighlight }]}>
            <Text style={[styles.title, { color: theme.text }]}>Tile Aanpassen</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={[styles.closeButton, { backgroundColor: theme.surface }]}
            >
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Voorbeeld ({isDark ? 'Dark Mode' : 'Light Mode'})</Text>
              <View 
                style={[
                  styles.previewTile, 
                  { backgroundColor: previewBgColor },
                  backgroundPhoto && styles.previewTileWithImage
                ]}
              >
                {backgroundPhoto && (
                  <Image 
                    source={{ uri: backgroundPhoto.uri }} 
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                )}
                <View style={[styles.previewOverlay, backgroundPhoto && styles.previewOverlayWithImage]}>
                  <Feather name="grid" size={28} color={previewIconColor} style={{ marginBottom: 8 }} />
                  <Text style={[styles.previewText, { color: previewTextColor }]}>
                    {name || 'Tile naam'}
                  </Text>
                </View>
              </View>
            </View>

            {/* D1: Naam aanpassen */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Naam</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.surfaceHighlight }]}
                value={name}
                onChangeText={setName}
                placeholder="Tile naam"
                placeholderTextColor={theme.textDim}
              />
            </View>

            {/* D2: Volgorde aanpassen */}
            {(onMoveUp || onMoveDown) && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Volgorde</Text>
                <View style={styles.orderButtons}>
                  <TouchableOpacity
                    style={[styles.orderButton, { backgroundColor: theme.surface }]}
                    onPress={() => onMoveUp && onMoveUp(tile)}
                    disabled={!onMoveUp}
                  >
                    <Feather name="arrow-up" size={24} color={onMoveUp ? theme.primary : theme.textDim} />
                    <Text style={[styles.orderButtonText, { color: onMoveUp ? theme.text : theme.textDim }]}>Omhoog</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.orderButton, { backgroundColor: theme.surface }]}
                    onPress={() => onMoveDown && onMoveDown(tile)}
                    disabled={!onMoveDown}
                  >
                    <Feather name="arrow-down" size={24} color={onMoveDown ? theme.primary : theme.textDim} />
                    <Text style={[styles.orderButtonText, { color: onMoveDown ? theme.text : theme.textDim }]}>Omlaag</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* D3: Kleur light mode */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Kleur (Light Mode)</Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color.id}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.lightColor },
                      colorId === color.id && styles.colorOptionSelected,
                    ]}
                    onPress={() => setColorId(color.id)}
                  >
                    {colorId === color.id && (
                      <Feather name="check" size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* D4: Kleur dark mode */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Kleur (Dark Mode)</Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color.id}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.darkColor },
                      darkColorId === color.id && styles.colorOptionSelected,
                    ]}
                    onPress={() => setDarkColorId(color.id)}
                  >
                    {darkColorId === color.id && (
                      <Feather name="check" size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Light Mode - Tekst & Icon kleur */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Kleuren Light Mode</Text>
              <View style={styles.dualColorRow}>
                {/* Tekstkleur */}
                <View style={styles.colorColumn}>
                  <Text style={[styles.colorColumnLabel, { color: theme.textDim }]}>Tekst</Text>
                  <View style={styles.colorGrid}>
                    {TEXT_COLOR_OPTIONS.map((colorOpt) => (
                      <TouchableOpacity
                        key={colorOpt.id}
                        style={[
                          styles.smallColorOption,
                          { backgroundColor: colorOpt.color },
                          colorOpt.id === 'white' && { borderWidth: 1, borderColor: '#E0E0E0' },
                          textColorLight === colorOpt.id && styles.colorOptionSelected,
                        ]}
                        onPress={() => setTextColorLight(colorOpt.id)}
                      >
                        {textColorLight === colorOpt.id && (
                          <Feather name="check" size={14} color={colorOpt.id === 'white' || colorOpt.id === 'yellow' ? '#000' : '#FFF'} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Icon kleur */}
                <View style={styles.colorColumn}>
                  <Text style={[styles.colorColumnLabel, { color: theme.textDim }]}>Icon</Text>
                  <View style={styles.colorGrid}>
                    {TEXT_COLOR_OPTIONS.map((colorOpt) => (
                      <TouchableOpacity
                        key={colorOpt.id}
                        style={[
                          styles.smallColorOption,
                          { backgroundColor: colorOpt.color },
                          colorOpt.id === 'white' && { borderWidth: 1, borderColor: '#E0E0E0' },
                          iconColorLight === colorOpt.id && styles.colorOptionSelected,
                        ]}
                        onPress={() => setIconColorLight(colorOpt.id)}
                      >
                        {iconColorLight === colorOpt.id && (
                          <Feather name="check" size={14} color={colorOpt.id === 'white' || colorOpt.id === 'yellow' ? '#000' : '#FFF'} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Dark Mode - Tekst & Icon kleur */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Kleuren Dark Mode</Text>
              <View style={styles.dualColorRow}>
                {/* Tekstkleur */}
                <View style={styles.colorColumn}>
                  <Text style={[styles.colorColumnLabel, { color: theme.textDim }]}>Tekst</Text>
                  <View style={styles.colorGrid}>
                    {TEXT_COLOR_OPTIONS.map((colorOpt) => (
                      <TouchableOpacity
                        key={colorOpt.id}
                        style={[
                          styles.smallColorOption,
                          { backgroundColor: colorOpt.color },
                          colorOpt.id === 'white' && { borderWidth: 1, borderColor: '#E0E0E0' },
                          textColorDark === colorOpt.id && styles.colorOptionSelected,
                        ]}
                        onPress={() => setTextColorDark(colorOpt.id)}
                      >
                        {textColorDark === colorOpt.id && (
                          <Feather name="check" size={14} color={colorOpt.id === 'white' || colorOpt.id === 'yellow' ? '#000' : '#FFF'} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Icon kleur */}
                <View style={styles.colorColumn}>
                  <Text style={[styles.colorColumnLabel, { color: theme.textDim }]}>Icon</Text>
                  <View style={styles.colorGrid}>
                    {TEXT_COLOR_OPTIONS.map((colorOpt) => (
                      <TouchableOpacity
                        key={colorOpt.id}
                        style={[
                          styles.smallColorOption,
                          { backgroundColor: colorOpt.color },
                          colorOpt.id === 'white' && { borderWidth: 1, borderColor: '#E0E0E0' },
                          iconColorDark === colorOpt.id && styles.colorOptionSelected,
                        ]}
                        onPress={() => setIconColorDark(colorOpt.id)}
                      >
                        {iconColorDark === colorOpt.id && (
                          <Feather name="check" size={14} color={colorOpt.id === 'white' || colorOpt.id === 'yellow' ? '#000' : '#FFF'} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* D6 & D7: Achtergrond foto */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Achtergrond Foto</Text>
              {backgroundPhoto ? (
                <View style={styles.selectedPhoto}>
                  <Image 
                    source={{ uri: backgroundPhoto.uri }} 
                    style={styles.selectedPhotoImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={[styles.removePhotoButton, { backgroundColor: theme.danger }]}
                    onPress={handleRemovePhoto}
                  >
                    <Feather name="x" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addPhotoButton, { backgroundColor: theme.surface, borderColor: theme.surfaceHighlight }]}
                  onPress={() => setShowPhotoSelector(true)}
                >
                  <Feather name="image" size={24} color={theme.textDim} />
                  <Text style={[styles.addPhotoText, { color: theme.textDim }]}>Kies uit galerij</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Photo Selector Grid */}
            {showPhotoSelector && (
              <View style={styles.photoSelector}>
                <View style={styles.photoSelectorHeader}>
                  <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Kies een foto</Text>
                  <TouchableOpacity onPress={() => setShowPhotoSelector(false)}>
                    <Feather name="x" size={20} color={theme.textDim} />
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {gallery.map((photo) => (
                    <TouchableOpacity
                      key={photo.id}
                      style={[
                        styles.photoOption,
                        backgroundPhotoId === photo.id && styles.photoOptionSelected,
                      ]}
                      onPress={() => {
                        setBackgroundPhotoId(photo.id);
                        setShowPhotoSelector(false);
                      }}
                    >
                      <Image 
                        source={{ uri: photo.uri }} 
                        style={styles.photoOptionImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                  {gallery.length === 0 && (
                    <Text style={[styles.noPhotosText, { color: theme.textDim }]}>
                      Geen foto's beschikbaar. Voeg eerst foto's toe via Kijken.
                    </Text>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Delete button */}
            {onDelete && (
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: theme.danger }]}
                onPress={handleDelete}
              >
                <Feather name="trash-2" size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Verwijderen</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Apply to all checkbox */}
          <TouchableOpacity 
            style={[styles.applyToAllRow, { borderTopColor: theme.surfaceHighlight }]}
            onPress={() => setApplyToAll(!applyToAll)}
          >
            <View style={[
              styles.checkbox, 
              { borderColor: theme.primary },
              applyToAll && { backgroundColor: theme.primary }
            ]}>
              {applyToAll && <Feather name="check" size={16} color="#FFFFFF" />}
            </View>
            <Text style={[styles.applyToAllText, { color: theme.text }]}>
              Toepassen op alle tiles
            </Text>
          </TouchableOpacity>

          {/* Save button */}
          <View style={[styles.footer, { borderTopColor: theme.surfaceHighlight }]}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Opslaan</Text>
            </TouchableOpacity>
          </View>
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
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
    minHeight: '70%',
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
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  previewTile: {
    height: 100,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTileWithImage: {
    position: 'relative',
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },
  previewOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  previewOverlayWithImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    borderWidth: 1,
  },
  orderButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  orderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  orderButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallColorOption: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dualColorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorColumn: {
    flex: 1,
    marginRight: spacing.md,
  },
  colorColumnLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  textColorOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  textColorOption: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textColorOptionSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  textColorLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textColorCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    height: 80,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addPhotoText: {
    fontSize: typography.body.fontSize,
  },
  selectedPhoto: {
    height: 120,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedPhotoImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSelector: {
    marginBottom: spacing.lg,
  },
  photoSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  photoOption: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  photoOptionSelected: {
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  photoOptionImage: {
    width: '100%',
    height: '100%',
  },
  noPhotosText: {
    paddingVertical: spacing.lg,
    fontSize: typography.caption.fontSize,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  applyToAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  applyToAllText: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  saveButton: {
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});

export default TileCustomizationModal;
