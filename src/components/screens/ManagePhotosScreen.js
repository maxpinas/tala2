import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput, Modal, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../theme';
import styles from '../../styles';

const ManagePhotosScreen = ({ onClose, category, gallery, setGallery, categories }) => {
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editSize, setEditSize] = useState('medium');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingPhoto, setMovingPhoto] = useState(null);

  // Filter photos for this category
  const categoryPhotos = gallery.filter(p => p.category === category);

  // Pick image from camera
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera toegang nodig', 'Geef toegang tot de camera om foto\'s te maken.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      addNewPhoto(result.assets[0]);
    }
  };

  // Pick image from library
  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Foto toegang nodig', 'Geef toegang tot je foto\'s.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      addNewPhoto(result.assets[0]);
    }
  };

  // Add new photo to gallery
  const addNewPhoto = (asset) => {
    const newPhoto = {
      id: Date.now(),
      uri: asset.uri,
      type: 'image',
      text: '',
      category: category,
      size: 'medium',
      createdAt: new Date().toISOString(),
    };
    setGallery(prev => [newPhoto, ...prev]);
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
          if (editingPhotoId === photoId) {
            setEditingPhotoId(null);
          }
        }},
      ]
    );
  };

  // Move photo up in list
  const movePhotoUp = (index) => {
    if (index === 0) return;
    const newGallery = [...gallery];
    const photoIndex = newGallery.findIndex(p => p.id === categoryPhotos[index].id);
    const prevPhotoIndex = newGallery.findIndex(p => p.id === categoryPhotos[index - 1].id);
    [newGallery[photoIndex], newGallery[prevPhotoIndex]] = [newGallery[prevPhotoIndex], newGallery[photoIndex]];
    setGallery(newGallery);
  };

  // Move photo down in list
  const movePhotoDown = (index) => {
    if (index === categoryPhotos.length - 1) return;
    const newGallery = [...gallery];
    const photoIndex = newGallery.findIndex(p => p.id === categoryPhotos[index].id);
    const nextPhotoIndex = newGallery.findIndex(p => p.id === categoryPhotos[index + 1].id);
    [newGallery[photoIndex], newGallery[nextPhotoIndex]] = [newGallery[nextPhotoIndex], newGallery[photoIndex]];
    setGallery(newGallery);
  };

  // Start editing
  const startEditing = (photo) => {
    setEditingPhotoId(photo.id);
    setEditCaption(photo.text || '');
    setEditSize(photo.size || 'medium');
  };

  // Save edit
  const saveEdit = () => {
    if (editingPhotoId) {
      updatePhoto(editingPhotoId, { text: editCaption, size: editSize });
      setEditingPhotoId(null);
    }
  };

  // Move or copy photo to another category
  const movePhotoToCategory = (photoId, targetCategory, copy = false) => {
    if (copy) {
      // Copy: duplicate photo and add to target category
      const originalPhoto = gallery.find(p => p.id === photoId);
      if (originalPhoto) {
        const newPhoto = { ...originalPhoto, id: Date.now(), category: targetCategory };
        setGallery(prev => [newPhoto, ...prev]);
      }
    } else {
      // Move: change category of existing photo
      updatePhoto(photoId, { category: targetCategory });
    }
    setShowMoveModal(false);
    setMovingPhoto(null);
  };

  return (
    <Modal visible={true} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
        {/* Header */}
        <View style={localStyles.header}>
        <TouchableOpacity onPress={onClose} style={localStyles.backBtn}>
          <Feather name="arrow-left" size={20} color={theme.textDim} />
          <Text style={localStyles.backText}>Terug</Text>
        </TouchableOpacity>
        <Text style={localStyles.title}>Foto's Beheren</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={[styles.catHeaderBig, { marginHorizontal: 24 }]}>{category}</Text>

      {/* Add buttons */}
      <View style={localStyles.addButtonsRow}>
        <TouchableOpacity style={localStyles.addBtn} onPress={pickFromCamera}>
          <Feather name="camera" size={24} color={theme.primary} />
          <Text style={localStyles.addBtnText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.addBtn} onPress={pickFromLibrary}>
          <Feather name="image" size={24} color={theme.primary} />
          <Text style={localStyles.addBtnText}>Fotorol</Text>
        </TouchableOpacity>
      </View>

      {/* Photo list */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        {categoryPhotos.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Feather name="image" size={48} color={theme.textDim} />
            <Text style={localStyles.emptyText}>Nog geen foto's</Text>
            <Text style={localStyles.emptySubtext}>Tik op Camera of Fotorol om toe te voegen</Text>
          </View>
        ) : (
          categoryPhotos.map((photo, index) => (
            <View key={photo.id} style={localStyles.photoItem}>
              {editingPhotoId === photo.id ? (
                // Edit mode
                <View style={localStyles.editContainer}>
                  <View style={localStyles.editPreview}>
                    {photo.uri ? (
                      <Image source={{ uri: photo.uri }} style={localStyles.editImage} />
                    ) : (
                      <View style={[localStyles.editPlaceholder, { backgroundColor: photo.color }]} />
                    )}
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={localStyles.editLabel}>BIJSCHRIFT</Text>
                    <TextInput
                      style={localStyles.editInput}
                      value={editCaption}
                      onChangeText={setEditCaption}
                      placeholder="Wat wil je zeggen?"
                      placeholderTextColor={theme.textDim}
                      multiline
                    />
                    
                    <Text style={[localStyles.editLabel, { marginTop: 12 }]}>GROOTTE</Text>
                    <View style={localStyles.sizeRow}>
                      {['small', 'medium', 'large'].map(size => (
                        <TouchableOpacity
                          key={size}
                          style={[localStyles.sizeChip, editSize === size && localStyles.sizeChipActive]}
                          onPress={() => setEditSize(size)}
                        >
                          <Text style={[localStyles.sizeText, editSize === size && { color: '#000' }]}>
                            {size === 'small' ? 'Klein' : size === 'medium' ? 'Normaal' : 'Groot'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <View style={localStyles.editActions}>
                      <TouchableOpacity style={localStyles.saveBtn} onPress={saveEdit}>
                        <Text style={localStyles.saveBtnText}>Opslaan</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={localStyles.cancelBtn} onPress={() => setEditingPhotoId(null)}>
                        <Text style={localStyles.cancelBtnText}>Annuleren</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                // View mode
                <>
                  <View style={localStyles.photoPreview}>
                    {photo.uri ? (
                      <Image source={{ uri: photo.uri }} style={localStyles.photoImage} />
                    ) : (
                      <View style={[localStyles.photoPlaceholder, { backgroundColor: photo.color }]}>
                        <Feather name="image" size={32} color={theme.textDim} />
                      </View>
                    )}
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={localStyles.photoCaption} numberOfLines={2}>
                      {photo.text || 'Geen bijschrift'}
                    </Text>
                    <Text style={localStyles.photoSize}>
                      {photo.size === 'small' ? 'Klein' : photo.size === 'medium' ? 'Normaal' : 'Groot'}
                    </Text>
                  </View>
                  
                  <View style={localStyles.actions}>
                    <TouchableOpacity onPress={() => { setMovingPhoto(photo); setShowMoveModal(true); }} style={localStyles.actionBtn}>
                      <Feather name="folder" size={18} color={theme.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => startEditing(photo)} style={localStyles.actionBtn}>
                      <Feather name="edit-2" size={18} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => movePhotoUp(index)} style={localStyles.actionBtn}>
                      <Feather name="arrow-up" size={18} color={theme.textDim} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => movePhotoDown(index)} style={localStyles.actionBtn}>
                      <Feather name="arrow-down" size={18} color={theme.textDim} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePhoto(photo.id)} style={localStyles.actionBtn}>
                      <Feather name="trash-2" size={18} color={theme.danger} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
      
      {/* Move/Copy Modal */}
      {showMoveModal && movingPhoto && (
        <MoveCategoryModal
          visible={showMoveModal}
          onClose={() => { setShowMoveModal(false); setMovingPhoto(null); }}
          photo={movingPhoto}
          categories={categories}
          currentCategory={category}
          onMove={(targetCat) => movePhotoToCategory(movingPhoto.id, targetCat, false)}
          onCopy={(targetCat) => movePhotoToCategory(movingPhoto.id, targetCat, true)}
        />
      )}
      </SafeAreaView>
    </Modal>
  );
};

// Move Category Modal Component
const MoveCategoryModal = ({ visible, onClose, photo, categories, currentCategory, onMove, onCopy }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={localStyles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={localStyles.moveModal}>
          <View style={localStyles.moveHeader}>
            <Text style={localStyles.moveTitle}>Foto verplaatsen</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Photo preview */}
          <View style={localStyles.movePhotoPreview}>
            {photo.uri ? (
              <Image source={{ uri: photo.uri }} style={localStyles.movePhotoImage} />
            ) : (
              <View style={[localStyles.movePhotoPlaceholder, { backgroundColor: photo.color }]} />
            )}
            <Text style={localStyles.movePhotoCaption} numberOfLines={2}>
              {photo.text || 'Geen bijschrift'}
            </Text>
          </View>

          <Text style={localStyles.moveLabel}>KIES ONDERWERP</Text>
          
          <ScrollView style={localStyles.categoriesList}>
            {Object.keys(categories)
              .filter(cat => cat !== currentCategory)
              .map(cat => (
                <View key={cat} style={localStyles.categoryItem}>
                  <View style={localStyles.categoryInfo}>
                    <Feather name={categories[cat].icon || 'folder'} size={20} color={theme.primary} />
                    <Text style={localStyles.categoryName}>{cat}</Text>
                  </View>
                  <View style={localStyles.categoryActions}>
                    <TouchableOpacity 
                      style={localStyles.copyBtn}
                      onPress={() => onCopy(cat)}
                    >
                      <Feather name="copy" size={16} color={theme.text} />
                      <Text style={localStyles.actionBtnText}>Kopieer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={localStyles.moveBtn}
                      onPress={() => onMove(cat)}
                    >
                      <Feather name="arrow-right" size={16} color="#000" />
                      <Text style={localStyles.moveBtnText}>Verplaats</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const localStyles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
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
  title: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addBtnText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
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
    textAlign: 'center',
  },
  photoItem: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.surfaceHighlight,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCaption: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoSize: {
    color: theme.textDim,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  editPreview: {
    width: 100,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.surfaceHighlight,
  },
  editImage: {
    width: '100%',
    height: '100%',
  },
  editPlaceholder: {
    width: '100%',
    height: '100%',
  },
  editLabel: {
    color: theme.textDim,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: theme.surfaceHighlight,
    color: theme.text,
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 40,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  sizeChip: {
    flex: 1,
    backgroundColor: theme.surfaceHighlight,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  sizeChipActive: {
    backgroundColor: theme.primary,
  },
  sizeText: {
    color: theme.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: theme.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: theme.surfaceHighlight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveModal: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  moveTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
  },
  movePhotoPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  movePhotoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  movePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  movePhotoCaption: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  moveLabel: {
    color: theme.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesList: {
    maxHeight: 300,
  },
  categoryItem: {
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  moveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 14,
  },
  moveBtnText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
};

export default ManagePhotosScreen;
