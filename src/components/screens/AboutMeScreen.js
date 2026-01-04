import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, typography } from '../../theme';
import { t } from '../../i18n';

/**
 * AboutMeScreen Component (B3)
 * Shows "Over mij" info + personal explanation texts
 * Accessible via FAB → Toon
 * 
 * @param {function} onBack - Back navigation handler
 * @param {object} profile - User profile data
 * @param {function} onSpeak - Text-to-speech handler
 */
const AboutMeScreen = ({
  onBack,
  profile = {},
  onSpeak,
}) => {
  const { theme } = useTheme();

  // Sections to display
  const sections = [
    {
      id: 'intro',
      title: 'Over mij',
      content: profile.name ? `Ik ben ${profile.name}${profile.condition ? `. Ik heb ${profile.condition}` : ''}.` : null,
      icon: 'user',
    },
    {
      id: 'afasie',
      title: 'Uitleg: Ik heb afasie',
      content: profile.customPartnerText || 'Ik heb afasie. Dit betekent dat ik moeite heb met spreken, maar ik begrijp u wel. Geef mij alstublieft de tijd.',
      icon: 'message-circle',
      speakable: true,
    },
    {
      id: 'medical',
      title: 'Medisch Paspoort Intro',
      content: profile.customMedicalText || 'Dit is mijn medisch paspoort met belangrijke informatie voor zorgverleners.',
      icon: 'heart',
      speakable: true,
    },
  ].filter(s => s.content);

  const handleSpeak = (text) => {
    if (onSpeak && text) {
      onSpeak(text);
    }
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

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Summary Card */}
        {profile.name && (
          <View style={[styles.profileCard, { backgroundColor: theme.primary }]}>
            <View style={styles.profileIcon}>
              <Feather name="user" size={32} color={theme.textInverse} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textInverse }]}>
                {profile.name}
              </Text>
              {profile.condition && (
                <Text style={[styles.profileCondition, { color: theme.textInverse }]}>
                  {profile.condition}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Explanation Texts */}
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[styles.section, { backgroundColor: theme.surface }]}
            onPress={() => section.speakable && handleSpeak(section.content)}
            activeOpacity={section.speakable ? 0.7 : 1}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.surfaceHighlight }]}>
                <Feather name={section.icon} size={20} color={theme.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {section.title}
              </Text>
              {section.speakable && (
                <Feather name="volume-2" size={20} color={theme.textDim} />
              )}
            </View>
            <Text style={[styles.sectionContent, { color: theme.textDim }]}>
              {section.content}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Empty state */}
        {sections.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="info" size={48} color={theme.textDim} />
            <Text style={[styles.emptyStateText, { color: theme.textDim }]}>
              Geen profielinformatie ingesteld.
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.textDim }]}>
              Ga naar Instellingen → Profiel om je gegevens in te vullen.
            </Text>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCondition: {
    fontSize: 16,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    flex: 1,
  },
  sectionContent: {
    fontSize: typography.body.fontSize,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: typography.body.fontSize,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: typography.caption.fontSize,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default AboutMeScreen;
