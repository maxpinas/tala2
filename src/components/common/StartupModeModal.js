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
import { useTheme } from '../../theme';
import { APP_MODES } from '../../context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * StartupModeModal - Keuze modal voor Expert vs Gebruikersmodus
 * 
 * Verschijnt bij eerste start of als mode niet is ingesteld.
 * Moderne UI met grote, toegankelijke knoppen en duidelijke iconen.
 */
const StartupModeModal = ({ visible, onSelectMode }) => {
  const { theme } = useTheme();
  const [rememberChoice, setRememberChoice] = useState(false);
  const [fillDemoData, setFillDemoData] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleConfirm = () => {
    if (selectedMode) {
      onSelectMode(selectedMode, rememberChoice, fillDemoData);
    }
  };

  const ModeCard = ({ mode, title, icon, color }) => {
    const isSelected = selectedMode === mode;
    
    return (
      <TouchableOpacity
        style={[
          styles.modeCard,
          { backgroundColor: theme.surfaceHighlight },
          isSelected && { borderColor: color },
        ]}
        onPress={() => setSelectedMode(mode)}
        activeOpacity={0.8}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        {/* Selection indicator */}
        <View style={[styles.selectionRing, { borderColor: theme.surfaceHighlight }, isSelected && { backgroundColor: color, borderColor: color }]}>
          {isSelected && <Feather name="check" size={18} color="#fff" />}
        </View>

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}> 
          <Feather name={icon} size={40} color={color} />
        </View>

        {/* Title */}
        <Text style={[styles.modeTitle, { color: theme.text }]}>{title}</Text>
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
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="message-circle" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Welkom bij Tala</Text>
            <Text style={[styles.description, { color: theme.textDim }]}>
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

          {/* Demo data toggle */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setFillDemoData(!fillDemoData)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: fillDemoData }}
          >
            <View style={[styles.checkbox, { borderColor: theme.surfaceHighlight }, fillDemoData && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
              {fillDemoData && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text style={[styles.rememberText, { color: theme.text }]}>Vul met demo informatie</Text>
          </TouchableOpacity>

          {/* Remember choice toggle */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberChoice(!rememberChoice)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberChoice }}
          >
            <View style={[styles.checkbox, { borderColor: theme.surfaceHighlight }, rememberChoice && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
              {rememberChoice && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text style={[styles.rememberText, { color: theme.text }]}>Onthoud mijn keuze</Text>
          </TouchableOpacity>

          {/* Confirm button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: theme.primary },
              !selectedMode && { backgroundColor: theme.border },
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
          <Text style={[styles.infoText, { color: theme.textDim }]}>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  modeSubtitle: {
    fontSize: 14,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 15,
    marginLeft: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default StartupModeModal;
