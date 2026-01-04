import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput, Modal, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../theme';
import { useStyles } from '../../styles';

const ManagePhotosScreen = ({ onClose, category, gallery, setGallery, categories }) => {
  const { theme } = useTheme();
  const styles = useStyles();
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
          <Text style={[localStyles.backText, { color: theme.textDim }]}>Terug</Text>
        </TouchableOpacity>
        <Text style={[localStyles.title, { color: theme.text }]}>Foto's Beheren</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={[styles.catHeaderBig, { marginHorizontal: 24 }]}>{category}</Text>

      {/* Add buttons */}
      <View style={localStyles.addButtonsRow}>
        <TouchableOpacity style={[localStyles.addBtn, { backgroundColor: theme.surface }]} onPress={pickFromCamera}>
          <Feather name="camera" size={24} color={theme.primary} />
          <Text style={[localStyles.addBtnText, { color: theme.text }]}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[localStyles.addBtn, { backgroundColor: theme.surface }]} onPress={pickFromLibrary}>
          <Feather name="image" size={24} color={theme.primary} />
          <Text style={[localStyles.addBtnText, { color: theme.text }]}>Fotorol</Text>
        </TouchableOpacity>
      </View>

      {/* Photo list */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        {categoryPhotos.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Feather name="image" size={48} color={theme.textDim} />
            <Text style={[localStyles.emptyText, { color: theme.text }]}>Nog geen foto's</Text>
            <Text style={[localStyles.emptySubtext, { color: theme.textDim }]}>Tik op Camera of Fotorol om toe te voegen</Text>
          </View>
        ) : (
          categoryPhotos.map((photo, index) => (
            <View key={photo.id} style={[localStyles.photoItem, { backgroundColor: '#3D3D3D' }]}>
              {editingPhotoId === photo.id ? (
                // Edit mode
                <View style={localStyles.editContainer}>
                  <View style={[localStyles.editPreview, { backgroundColor: '#4D4D4D' }]}>
                    {photo.uri ? (
                      <Image source={{ uri: photo.uri }} style={localStyles.editImage} />
                    ) : (
                      <View style={[localStyles.editPlaceholder, { backgroundColor: photo.color }]} />
                    )}
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[localStyles.editLabel, { color: '#A0A0A0' }]}>BIJSCHRIFT</Text>
                    <TextInput
                      style={[localStyles.editInput, { backgroundColor: '#4D4D4D', color: '#FFFFFF' }]}
                      value={editCaption}
                      onChangeText={setEditCaption}
                      placeholder="Wat wil je zeggen?"
                      placeholderTextColor="#A0A0A0"
                      multiline
                    />
                    
                    <Text style={[localStyles.editLabel, { marginTop: 12, color: '#A0A0A0' }]}>GROOTTE</Text>
                    <View style={localStyles.sizeRow}>
                      {['small', 'medium', 'large'].map(size => (
                        <TouchableOpacity
                          key={size}
                          style={[localStyles.sizeChip, { backgroundColor: editSize === size ? '#8FBCBB' : '#4D4D4D' }]}
                          onPress={() => setEditSize(size)}
                        >
                          <Text style={[localStyles.sizeText, { color: editSize === size ? '#000' : '#A0A0A0' }]}>
                            {size === 'small' ? 'Klein' : size === 'medium' ? 'Normaal' : 'Groot'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <View style={localStyles.editActions}>
                      <TouchableOpacity style={[localStyles.saveBtn, { backgroundColor: '#8FBCBB' }]} onPress={saveEdit}>
                        <Text style={localStyles.saveBtnText}>Opslaan</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[localStyles.cancelBtn, { backgroundColor: '#4D4D4D' }]} onPress={() => setEditingPhotoId(null)}>
                        <Text style={[localStyles.cancelBtnText, { color: '#FFFFFF' }]}>Annuleren</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                // View mode
                <>
                  <View style={[localStyles.photoPreview, { backgroundColor: '#4D4D4D' }]}>
                    {photo.uri ? (
                      <Image source={{ uri: photo.uri }} style={localStyles.photoImage} />
                    ) : (
                      <View style={[localStyles.photoPlaceholder, { backgroundColor: photo.color }]}>
                        <Feather name="image" size={32} color="#A0A0A0" />
                      </View>
                    )}
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[localStyles.photoCaption, { color: '#FFFFFF' }]} numberOfLines={2}>
                      {photo.text || 'Geen bijschrift'}
                    </Text>
                    <Text style={[localStyles.photoSize, { color: '#A0A0A0' }]}>
                      {photo.size === 'small' ? 'Klein' : photo.size === 'medium' ? 'Normaal' : 'Groot'}
                    </Text>
                  </View>
                  
                  <View style={localStyles.actions}>
                    <TouchableOpacity onPress={() => { setMovingPhoto(photo); setShowMoveModal(true); }} style={localStyles.actionBtn}>
                      <Feather name="folder" size={18} color="#C8D84C" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => startEditing(photo)} style={localStyles.actionBtn}>
                      <Feather name="edit-2" size={18} color="#8FBCBB" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => movePhotoUp(index)} style={localStyles.actionBtn}>
                      <Feather name="arrow-up" size={18} color="#A0A0A0" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => movePhotoDown(index)} style={localStyles.actionBtn}>
                      <Feather name="arrow-down" size={18} color="#A0A0A0" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePhoto(photo.id)} style={localStyles.actionBtn}>
                      <Feather name="trash-2" size={18} color="#FF6B6B" />
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
  const { theme } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={localStyles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[localStyles.moveModal, { backgroundColor: theme.surface }]}>
          <View style={localStyles.moveHeader}>
            <Text style={[localStyles.moveTitle, { color: theme.text }]}>Foto verplaatsen</Text>
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
            <Text style={[localStyles.movePhotoCaption, { color: theme.text }]} numberOfLines={2}>
              {photo.text || 'Geen bijschrift'}
            </Text>
          </View>

          <Text style={[localStyles.moveLabel, { color: theme.textDim }]}>KIES ONDERWERP</Text>
          
          <ScrollView style={localStyles.categoriesList}>
            {Object.keys(categories)
              .filter(cat => cat !== currentCategory)
              .map(cat => (
                <View key={cat} style={[localStyles.categoryItem, { backgroundColor: theme.surfaceHighlight }]}>
                  <View style={localStyles.categoryInfo}>
                    <Feather name={categories[cat].icon || 'folder'} size={20} color={theme.primary} />
                    <Text style={[localStyles.categoryName, { color: theme.text }]}>{cat}</Text>
                  </View>
                  <View style={localStyles.categoryActions}>
                    <TouchableOpacity 
                      style={[localStyles.copyBtn, { backgroundColor: theme.surface }]}
                      onPress={() => onCopy(cat)}
                    >
                      <Feather name="copy" size={16} color={theme.text} />
                      <Text style={[localStyles.actionBtnText, { color: theme.text }]}>Kopieer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[localStyles.moveBtn, { backgroundColor: theme.primary }]}
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
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
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
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    marginTop: 4,
    textAlign: 'center',
  },
  photoItem: {
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoSize: {
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
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  editInput: {
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  sizeText: {
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
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  moveLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesList: {
    maxHeight: 300,
  },
  categoryItem: {
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
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  moveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
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
