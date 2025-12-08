import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { APP_MODES } from '../../context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * StartupModeModal - Keuze modal voor Expert vs Gebruikersmodus
 * 
 * Verschijnt bij eerste start of als mode niet is ingesteld.
 * Moderne UI met grote, toegankelijke knoppen en duidelijke iconen.
 */
const StartupModeModal = ({ visible, onSelectMode }) => {
  const [rememberChoice, setRememberChoice] = useState(true);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleConfirm = () => {
    if (selectedMode) {
      onSelectMode(selectedMode, rememberChoice);
    }
  };

  const ModeCard = ({ mode, title, icon, color }) => {
    const isSelected = selectedMode === mode;
    
    return (
      <TouchableOpacity
        style={[
          styles.modeCard,
          isSelected && styles.modeCardSelected,
          isSelected && { borderColor: color },
        ]}
        onPress={() => setSelectedMode(mode)}
        activeOpacity={0.8}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        {/* Selection indicator */}
        <View style={[styles.selectionRing, isSelected && styles.selectionRingSelected, isSelected && { backgroundColor: color, borderColor: color }]}>
          {isSelected && <Feather name="check" size={18} color="#fff" />}
        </View>

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}> 
          <Feather name={icon} size={40} color={color} />
        </View>

        {/* Title */}
        <Text style={styles.modeTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather name="message-circle" size={32} color={theme.primary} />
            </View>
            <Text style={styles.title}>Welkom bij Tala</Text>
            <Text style={styles.description}>
              Kies hoe je de app wilt gebruiken. Je kunt dit later altijd wijzigen.
            </Text>
          </View>

          {/* Mode Cards */}
          <View style={styles.cardsContainer}>
            <ModeCard
              mode={APP_MODES.GEBRUIK}
              title="Gewoon"
              icon="smile"
              color="#10B981"
            />

            <ModeCard
              mode={APP_MODES.EXPERT}
              title="Uitgebreid"
              icon="sliders"
              color="#6366F1"
            />
          </View>

          {/* Remember choice toggle */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberChoice(!rememberChoice)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberChoice }}
          >
            <View style={[styles.checkbox, rememberChoice && styles.checkboxChecked]}>
              {rememberChoice && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Onthoud mijn keuze</Text>
          </TouchableOpacity>

          {/* Confirm button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedMode && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedMode}
            activeOpacity={0.8}
            accessibilityLabel="Start de app"
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>
              {selectedMode ? 'Start' : 'Maak een keuze'}
            </Text>
            {selectedMode && <Feather name="arrow-right" size={20} color="#fff" />}
          </TouchableOpacity>

          {/* Info text */}
          <Text style={styles.infoText}>
            💡 Tip: Partners kunnen Expert gebruiken om de app in te stellen
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeCard: {
    width: '48%',
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
  },
  modeCardSelected: {
    // Slight highlight when selected
    borderColor: theme.primary,
  },
  selectionRing: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionRingSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modeSubtitle: {
    fontSize: 14,
    color: theme.textDim,
    marginBottom: 12,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 13,
    color: theme.text,
    flex: 1,
    marginLeft: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  rememberText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: theme.border,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  infoText: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default StartupModeModal;
