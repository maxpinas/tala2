import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { APP_MODES } from '../../context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * StartupModeModal - Welkom modal voor eerste start
 * 
 * Stap 1: Welkom + keuze demo data of leeg beginnen
 * Stap 2: Naam en partner invoeren (alleen bij leeg beginnen)
 * Mode is altijd 'gebruik' (gewone modus).
 */
const StartupModeModal = ({ visible, onSelectMode }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1); // 1 = welkom, 2 = naam/partner
  const [fillDemoData, setFillDemoData] = useState(null); // null = nog niet gekozen
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const handleNext = () => {
    if (fillDemoData === true) {
      // Met demo data - direct starten
      onSelectMode(APP_MODES.GEBRUIK, true, true, '', '');
    } else {
      // Leeg beginnen - ga naar stap 2 voor naam/partner
      setStep(2);
    }
  };

  const handleComplete = () => {
    // Leeg beginnen met ingevoerde naam/partner
    onSelectMode(APP_MODES.GEBRUIK, true, false, userName, partnerName);
  };

  const handleBack = () => {
    setStep(1);
  };

  // Stap 1: Welkom + keuze
  if (step === 1) {
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
                Tala helpt je om te communiceren met de mensen om je heen.
              </Text>
            </View>

            {/* Demo data choice - main focus */}
            <View style={styles.choiceContainer}>
              <Text style={[styles.choiceTitle, { color: theme.text }]}>
                Hoe wil je beginnen?
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.choiceCard,
                  { backgroundColor: theme.surfaceHighlight },
                  fillDemoData === true && { borderColor: theme.primary, borderWidth: 2 }
                ]}
                onPress={() => setFillDemoData(true)}
                activeOpacity={0.8}
              >
                <View style={[styles.choiceIconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <Feather name="zap" size={28} color={theme.primary} />
                </View>
                <View style={styles.choiceTextContainer}>
                  <Text style={[styles.choiceCardTitle, { color: theme.text }]}>Met voorbeelden</Text>
                  <Text style={[styles.choiceCardSubtitle, { color: theme.textDim }]}>
                    Start met demo zinnen en foto's om de app te ontdekken
                  </Text>
                </View>
                {fillDemoData === true && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                    <Feather name="check" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choiceCard,
                  { backgroundColor: theme.surfaceHighlight },
                  fillDemoData === false && { borderColor: theme.primary, borderWidth: 2 }
                ]}
                onPress={() => setFillDemoData(false)}
                activeOpacity={0.8}
              >
                <View style={[styles.choiceIconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <Feather name="edit-3" size={28} color={theme.primary} />
                </View>
                <View style={styles.choiceTextContainer}>
                  <Text style={[styles.choiceCardTitle, { color: theme.text }]}>Leeg beginnen</Text>
                  <Text style={[styles.choiceCardSubtitle, { color: theme.textDim }]}>
                    Vul zelf je gegevens en zinnen in
                  </Text>
                </View>
                {fillDemoData === false && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                    <Feather name="check" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm button */}
            <TouchableOpacity
              style={[
                styles.confirmButton, 
                { backgroundColor: fillDemoData !== null ? theme.primary : theme.border }
              ]}
              onPress={handleNext}
              disabled={fillDemoData === null}
              activeOpacity={0.8}
              accessibilityLabel="Volgende"
              accessibilityRole="button"
            >
              <Text style={styles.confirmButtonText}>
                {fillDemoData === null ? 'Maak een keuze' : 'Volgende'}
              </Text>
              {fillDemoData !== null && <Feather name="arrow-right" size={20} color="#fff" />}
            </TouchableOpacity>

            {/* Info text */}
            <Text style={[styles.infoText, { color: theme.textDim }]}>
              💡 Je kunt later altijd je instellingen aanpassen via het menu
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  // Stap 2: Naam en partner invoeren
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {/* Header met terug knop */}
          <View style={styles.step2Header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.step2Title, { color: theme.text }]}>Over jou</Text>
            <View style={styles.backButton} />
          </View>

          {/* Naam invoer */}
          <View style={styles.inputSection}>
            <View style={[styles.inputIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="user" size={28} color={theme.primary} />
            </View>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Hoe heet je?</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.surfaceHighlight, 
                color: theme.text,
                borderColor: theme.border
              }]}
              placeholder="Jouw naam"
              placeholderTextColor={theme.textDim}
              value={userName}
              onChangeText={setUserName}
              autoFocus
            />
          </View>

          {/* Partner invoer */}
          <View style={styles.inputSection}>
            <View style={[styles.inputIconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="heart" size={28} color={theme.primary} />
            </View>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Wie is je partner of verzorger?</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.surfaceHighlight, 
                color: theme.text,
                borderColor: theme.border
              }]}
              placeholder="Naam partner (optioneel)"
              placeholderTextColor={theme.textDim}
              value={partnerName}
              onChangeText={setPartnerName}
            />
          </View>

          {/* Complete button */}
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: theme.primary, marginTop: 24 }]}
            onPress={handleComplete}
            activeOpacity={0.8}
            accessibilityLabel="Beginnen"
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>Beginnen</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Skip hint */}
          <Text style={[styles.infoText, { color: theme.textDim }]}>
            Je kunt dit later altijd aanpassen in je profiel
          </Text>
        </View>
      </KeyboardAvoidingView>
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
  choiceContainer: {
    marginBottom: 24,
  },
  choiceTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  choiceCardSubtitle: {
    fontSize: 14,
    lineHeight: 19,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
  // Step 2 styles
  step2Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  step2Title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    fontSize: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
  },
});

export default StartupModeModal;
