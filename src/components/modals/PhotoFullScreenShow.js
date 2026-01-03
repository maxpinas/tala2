import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '../../theme';

const PhotoFullScreenShow = ({ photo, onClose, onSpeak, isMuted, onToggleMute }) => {
  // Auto-speak on open if not muted
  useEffect(() => {
    if (!isMuted && photo?.text) {
      onSpeak(photo.text);
    }
  }, []); // Only on mount

  return (
    <Modal visible={true} animationType="fade" statusBarTranslucent>
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={32} color={theme.text} />
        </TouchableOpacity>

        {/* Mute toggle button */}
        <TouchableOpacity 
          style={[styles.muteBtn, isMuted && styles.muteBtnActive]} 
          onPress={onToggleMute}
        >
          <Feather 
            name={isMuted ? "volume-x" : "volume-2"} 
            size={24} 
            color={isMuted ? theme.textInverse : theme.text} 
          />
        </TouchableOpacity>

        {/* Photo */}
        <View style={styles.photoContainer}>
          {photo.uri ? (
            <Image 
              source={{ uri: photo.uri }} 
              style={styles.photo}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: photo.color || theme.surfaceHighlight }]}>
              <Feather name="image" size={80} color={theme.textDim} />
            </View>
          )}
        </View>

        {/* Caption - always visible at bottom */}
        {photo.text && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{photo.text}</Text>
          </View>
        )}

        {/* Speak button (bottom right) */}
        <TouchableOpacity 
          style={styles.speakBtn}
          onPress={() => photo.text && onSpeak(photo.text)}
        >
          <Feather name="volume-2" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: spacing.md,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.full,
  },
  muteBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: spacing.md,
    backgroundColor: theme.primary,
    borderRadius: borderRadius.full,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteBtnActive: {
    backgroundColor: theme.danger,
  },
  photoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: theme.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.surfaceHighlight,
  },
  caption: {
    color: theme.text,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 36,
  },
  speakBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: theme.primary,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows?.md,
  },
});

export default PhotoFullScreenShow;
