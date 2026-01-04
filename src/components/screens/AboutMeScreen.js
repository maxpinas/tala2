import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, TextInput, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../theme';
import { t } from '../../i18n';

/**
 * AboutMeScreen Component (B3)
 * Shows "Over mij" info + personal explanation texts
 * Accessible via FAB → Toon
 * 
 * @param {function} onBack - Back navigation handler
 * @param {object} profile - User profile data
 * @param {function} onSpeak - Text-to-speech handler
 * @param {function} onUpdateProfile - Handler to update profile data
 * @param {object} activePartner - Current active partner object
 * @param {function} onOpenMedical - Handler to open medical passport
 */
const AboutMeScreen = ({
  onBack,
  profile = {},
  onSpeak,
  onUpdateProfile,
  activePartner,
  onOpenMedical,
}) => {
  const { theme, isDark } = useTheme();
  const [editModal, setEditModal] = useState({ visible: false, field: '', value: '', title: '' });

  // Theme-dependent colors
  const overMijBg = isDark ? '#2E7D32' : '#C8E6C9'; // Dark: dark green, Light: very light green
  const uitlegBg = isDark ? '#5C6BC0' : '#FFFFFF'; // Dark: indigo, Light: white
  const cardTextColor = isDark ? '#FFFFFF' : '#1A1A1A'; // Dark: white, Light: black
  const cardIconBg = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)';

  // Over mij text
  const aboutMeText = profile.customAboutMeText || 
    (profile.name ? `Ik ben ${profile.name}${profile.condition ? `. Ik heb ${profile.condition}` : ''}.` : 'Geen informatie ingesteld.');
  
  // Uitleg text
  const explanationText = profile.customPartnerText || 
    'Ik heb afasie. Dit betekent dat ik moeite heb met spreken, maar ik begrijp u wel. Geef mij alstublieft de tijd.';

  const handleSpeak = (text) => {
    if (onSpeak && text) {
      onSpeak(text);
    }
  };

  const handleLongPress = (field, currentValue, title) => {
    setEditModal({
      visible: true,
      field,
      value: currentValue,
      title,
    });
  };

  const handleSaveEdit = () => {
    if (onUpdateProfile && editModal.field) {
      onUpdateProfile({
        ...profile,
        [editModal.field]: editModal.value,
      });
    }
    setEditModal({ visible: false, field: '', value: '', title: '' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header with back button */}
      <View style={[styles.header, { borderBottomColor: theme.surfaceHighlight }]}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Toon</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content - Flex to fill space */}
      <View style={styles.mainContent}>
        {/* Over mij Section - Speakable & Editable */}
        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: overMijBg }]}
          onPress={() => handleSpeak(aboutMeText)}
          onLongPress={() => handleLongPress('customAboutMeText', aboutMeText, 'Over mij')}
          activeOpacity={0.8}
          delayLongPress={500}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconContainer, { backgroundColor: cardIconBg }]}>
              <Feather name="user" size={32} color={cardTextColor} />
            </View>
            <Text style={[styles.cardTitle, { color: cardTextColor }]}>Over mij</Text>
            <TouchableOpacity 
              style={[styles.speakButton, { backgroundColor: cardIconBg }]}
              onPress={() => handleSpeak(aboutMeText)}
            >
              <Feather name="volume-2" size={26} color={cardTextColor} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardContent, { color: cardTextColor }]}>
            {aboutMeText}
          </Text>
        </TouchableOpacity>

        {/* Uitleg Section - Speakable & Editable - Grows to fill space */}
        <TouchableOpacity
          style={[styles.uitlegCard, { backgroundColor: uitlegBg }]}
          onPress={() => handleSpeak(explanationText)}
          onLongPress={() => handleLongPress('customPartnerText', explanationText, 'Uitleg')}
          activeOpacity={0.8}
          delayLongPress={500}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconContainer, { backgroundColor: cardIconBg }]}>
              <Feather name="message-circle" size={32} color={cardTextColor} />
            </View>
            <Text style={[styles.cardTitle, { color: cardTextColor }]}>Uitleg</Text>
            <TouchableOpacity 
              style={[styles.speakButton, { backgroundColor: cardIconBg }]}
              onPress={() => handleSpeak(explanationText)}
            >
              <Feather name="volume-2" size={26} color={cardTextColor} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardContent, { color: cardTextColor }]}>
            {explanationText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Actions - Fixed at bottom */}
      <View style={styles.bottomActions}>
        {/* Medical Passport Link */}
        <TouchableOpacity
          style={[styles.bottomActionCard, { backgroundColor: theme.surface }]}
          onPress={onOpenMedical}
          activeOpacity={0.7}
        >
          <View style={[styles.bottomActionIcon, { backgroundColor: isDark ? '#EF5350' : '#FFCDD2' }]}>
            <Feather name="heart" size={28} color={isDark ? '#FFFFFF' : '#C62828'} />
          </View>
          <Text style={[styles.bottomActionLabel, { color: theme.text }]}>Medisch{'\n'}Paspoort</Text>
        </TouchableOpacity>

        {/* Partner Contact */}
        {activePartner && activePartner.id !== 'geen' ? (
          <View style={[styles.bottomActionCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.bottomActionIcon, { backgroundColor: isDark ? '#42A5F5' : '#BBDEFB' }]}>
              <Feather name="phone" size={28} color={isDark ? '#FFFFFF' : '#1565C0'} />
            </View>
            <Text style={[styles.bottomActionLabel, { color: theme.text }]} numberOfLines={2}>
              {activePartner.name || activePartner.label || 'Partner'}
            </Text>
          </View>
        ) : (
          <View style={[styles.bottomActionCard, { backgroundColor: theme.surface, opacity: 0.5 }]}>
            <View style={[styles.bottomActionIcon, { backgroundColor: isDark ? '#42A5F5' : '#BBDEFB' }]}>
              <Feather name="phone" size={28} color={isDark ? '#FFFFFF' : '#1565C0'} />
            </View>
            <Text style={[styles.bottomActionLabel, { color: theme.text }]}>Geen{'\n'}Partner</Text>
          </View>
        )}
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModal({ visible: false, field: '', value: '', title: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editModal.title} bewerken
            </Text>
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: theme.bg, 
                color: theme.text,
                borderColor: theme.surfaceHighlight 
              }]}
              value={editModal.value}
              onChangeText={(text) => setEditModal(prev => ({ ...prev, value: text }))}
              multiline
              autoFocus
              placeholder="Voer tekst in..."
              placeholderTextColor={theme.textDim}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.surfaceHighlight }]}
                onPress={() => setEditModal({ visible: false, field: '', value: '', title: '' })}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.modalButtonText, { color: theme.textInverse }]}>Opslaan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    textAlign: 'center',
  },
  // Main content area - fills space between header and bottom actions
  mainContent: {
    flex: 1,
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  // Main Cards (Over mij)
  mainCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  // Uitleg card - grows to fill remaining space
  uitlegCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
  },
  speakButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    fontSize: 22,
    lineHeight: 32,
  },
  // Bottom Actions - Fixed at bottom
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  bottomActionCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  bottomActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bottomActionLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AboutMeScreen;
