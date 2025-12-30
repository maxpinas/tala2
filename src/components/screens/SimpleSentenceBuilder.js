import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { WORD_CATEGORIES } from '../../data';

/**
 * SimpleSentenceBuilder - Step-by-step sentence builder for Gewoon modus
 * 
 * Flow:
 * 1. Start screen with current sentence preview
 * 2. Choose category (Wie, Doe, Wat, Waar) as big tiles
 * 3. Pick words from that category
 * 4. Preview and speak
 */

const STEPS = {
  OVERVIEW: 'overview',
  CATEGORY: 'category',
};

const CATEGORY_CONFIG = {
  WIE: { label: 'Wie', icon: 'user', color: theme.catPeople, description: 'Personen' },
  DOE: { label: 'Doe', icon: 'zap', color: theme.catAction, description: 'Acties' },
  WAT: { label: 'Wat', icon: 'box', color: theme.catThing, description: 'Dingen' },
  WAAR: { label: 'Waar', icon: 'map-pin', color: theme.catPlace, description: 'Plaatsen' },
  EMOJI: { label: 'Emoji', icon: 'smile', color: '#FFD166', description: 'Emoticons' },
};

const dedupeList = (items = []) => {
  const seen = new Set();
  return items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => {
      if (!item) return false;
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const SimpleSentenceBuilder = ({
  visible,
  onClose,
  onSpeak,
  onAddToCategory,
  categories = {},
  initialSentence = [],
  peopleSuggestions = [],
  locationSuggestions = [],
}) => {
  const [sentence, setSentence] = useState(initialSentence);
  const [step, setStep] = useState(STEPS.OVERVIEW);
  const [activeCategory, setActiveCategory] = useState(null);
  const [customText, setCustomText] = useState('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const whoWords = useMemo(() => dedupeList([...(WORD_CATEGORIES.WIE || []), ...peopleSuggestions]), [peopleSuggestions]);
  const whereWords = useMemo(() => dedupeList([...(WORD_CATEGORIES.WAAR || []), ...locationSuggestions]), [locationSuggestions]);

  const getWordsForCategory = useCallback(
    (key) => {
      if (!key) return [];
      if (key === 'WIE') return whoWords;
      if (key === 'WAAR') return whereWords;
      return WORD_CATEGORIES[key] || [];
    },
    [whoWords, whereWords]
  );

  const addWord = (word) => {
    setSentence([...sentence, word]);
  };

  const removeLastWord = () => {
    if (sentence.length > 0) {
      setSentence(sentence.slice(0, -1));
    }
  };

  const clearSentence = () => {
    setSentence([]);
  };

  const handleSpeak = () => {
    // Do not speak emoji tokens — filter them out for TTS
    const emojis = WORD_CATEGORIES.EMOJI || [];
    const filtered = sentence.filter(w => !emojis.includes(w));
    const text = filtered.join(' ');
    if (text.trim()) {
      onSpeak(text);
      // Don't close - user should press back button to close
    }
  };
  
  const handleSpeakAndSave = (targetCategory) => {
    const text = sentence.join(' ');
    if (text.trim()) {
      onSpeak(text);
      if (onAddToCategory && targetCategory) {
        onAddToCategory(text, targetCategory);
      }
      setShowCategorySelector(false);
      onClose();
    }
  };
  
  const handleAddToCategory = (targetCategory) => {
    const text = sentence.join(' ');
    if (text.trim() && onAddToCategory) {
      onAddToCategory(text, targetCategory);
      setShowCategorySelector(false);
      setSaveSuccess(true);
      // Auto-hide success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const openCategory = (cat) => {
    setActiveCategory(cat);
    setStep(STEPS.CATEGORY);
  };

  const backToOverview = () => {
    setStep(STEPS.OVERVIEW);
    setActiveCategory(null);
  };

  const addCustomWord = () => {
    if (customText.trim()) {
      addWord(customText.trim());
      setCustomText('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Success message */}
          {saveSuccess && (
            <View style={styles.successBanner}>
              <Feather name="check-circle" size={20} color="#000" />
              <Text style={styles.successText}>Opgeslagen!</Text>
            </View>
          )}
          
          {step === STEPS.OVERVIEW ? (
            // OVERVIEW - Show sentence and category buttons
            <>
              {/* Header with back pill */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backPill}>
                  <Feather name="arrow-left" size={20} color={theme.text} />
                  <Text style={styles.backPillText}>Terug</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Zin Bouwen</Text>
                <View style={{ width: 80 }} />
              </View>

            {/* Sentence Preview */}
            <View style={styles.sentencePreview}>
              {sentence.length === 0 ? (
                <Text style={styles.placeholderText}>Tik op een categorie om te beginnen...</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {sentence.map((word, i) => (
                    <View key={i} style={styles.wordChip}>
                      <Text style={styles.wordChipText}>{word}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Quick actions if sentence has words */}
            {sentence.length > 0 && (
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionBtn} onPress={removeLastWord}>
                  <Feather name="delete" size={20} color={theme.warning} />
                  <Text style={styles.quickActionText}>Laatste weg</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionBtn} onPress={clearSentence}>
                  <Feather name="trash-2" size={20} color={theme.danger} />
                  <Text style={[styles.quickActionText, { color: theme.danger }]}>Alles wissen</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Category Grid */}
            <ScrollView contentContainerStyle={styles.categoryGrid}>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.categoryTile, { borderColor: config.color }]}
                  onPress={() => openCategory(key)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: config.color }]}>
                    <Feather name={config.icon} size={32} color="#000" />
                  </View>
                  <Text style={styles.categoryLabel}>{config.label}</Text>
                  <Text style={styles.categoryDescription}>{config.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Custom input */}
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
              <View style={styles.customInputRow}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Of typ zelf..."
                  placeholderTextColor={theme.textDim}
                  value={customText}
                  onChangeText={setCustomText}
                  onSubmitEditing={addCustomWord}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
                <TouchableOpacity 
                  style={[styles.addCustomBtn, !customText.trim() && { opacity: 0.5 }]} 
                  onPress={() => {
                    addCustomWord();
                    Keyboard.dismiss();
                  }}
                  disabled={!customText.trim()}
                >
                  <Feather name="plus" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>

            {/* Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              {/* Speak Button */}
              <TouchableOpacity
                style={[styles.speakButton, sentence.length === 0 && styles.speakButtonDisabled]}
                onPress={handleSpeak}
                disabled={sentence.length === 0}
                activeOpacity={0.8}
              >
                <Feather name="volume-2" size={28} color={sentence.length > 0 ? '#000' : theme.textDim} />
                <Text style={[styles.speakButtonText, sentence.length === 0 && { color: theme.textDim }]}>
                  Zeg het
                </Text>
              </TouchableOpacity>
              
              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, sentence.length === 0 && styles.saveButtonDisabled]}
                onPress={() => setShowCategorySelector(true)}
                disabled={sentence.length === 0}
                activeOpacity={0.8}
              >
                <Feather name="bookmark" size={24} color={sentence.length > 0 ? '#000' : theme.textDim} />
                <Text style={[styles.saveButtonText, sentence.length === 0 && { color: theme.textDim }]}>
                  Opslaan
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Selector Modal - Long-press style */}
            <Modal
              visible={showCategorySelector}
              transparent
              animationType="slide"
              onRequestClose={() => setShowCategorySelector(false)}
            >
              <TouchableOpacity 
                style={styles.categoryModalOverlay}
                activeOpacity={1}
                onPress={() => setShowCategorySelector(false)}
              >
                <View style={styles.categorySheet}>
                  <Text style={styles.categorySheetTitle}>Toevoegen aan onderwerp</Text>
                  <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
                    {/* Aangepast (eigen zinnen) eerst */}
                    <TouchableOpacity
                      style={styles.longPressOption}
                      onPress={() => handleAddToCategory('Aangepast')}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.longPressIconBg, { backgroundColor: theme.accent }]}>
                        <Feather name="edit-3" size={24} color="#000" />
                      </View>
                      <Text style={styles.longPressLabel}>Aangepast (eigen zinnen)</Text>
                    </TouchableOpacity>
                    
                    {/* Andere categorieën */}
                    {Object.entries(categories)
                      .filter(([key]) => key !== 'Aangepast' && key !== 'aangepast')
                      .map(([key, cat]) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.longPressOption}
                        onPress={() => handleAddToCategory(key)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.longPressIconBg, { backgroundColor: theme.surfaceHighlight }]}>
                          <Feather name={cat.icon || 'folder'} size={24} color={theme.primary} />
                        </View>
                        <Text style={styles.longPressLabel}>{cat.label || key}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowCategorySelector(false)}
                  >
                    <Text style={styles.cancelButtonText}>Annuleren</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        ) : (
          // CATEGORY VIEW - Show words from selected category
          <>
            {/* Header with back */}
            <View style={styles.header}>
              <TouchableOpacity onPress={backToOverview} style={styles.backButton}>
                <Feather name="arrow-left" size={28} color={theme.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{CATEGORY_CONFIG[activeCategory]?.label}</Text>
              <View style={{ width: 44 }} />
            </View>

            {/* Mini sentence preview */}
            <View style={styles.miniPreview}>
              <Text style={styles.miniPreviewText}>
                {sentence.length > 0 ? sentence.join(' ') : 'Kies woorden...'}
              </Text>
            </View>

            {/* Word Grid */}
            <ScrollView contentContainerStyle={styles.wordGrid}>
              {getWordsForCategory(activeCategory).map((word, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.wordTile, { borderColor: CATEGORY_CONFIG[activeCategory]?.color }]}
                  onPress={() => addWord(word)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.wordTileText}>{word}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Done button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={backToOverview}
              activeOpacity={0.8}
            >
              <Feather name="check" size={24} color="#000" />
              <Text style={styles.doneButtonText}>Klaar</Text>
            </TouchableOpacity>
          </>
        )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  successBanner: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  successText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  backPillText: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '500',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '700',
  },
  sentencePreview: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.textDim,
    fontSize: 16,
    textAlign: 'center',
  },
  wordChip: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  wordChipText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 12,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionText: {
    color: theme.warning,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  categoryTile: {
    width: '47%',
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    color: theme.textDim,
    fontSize: 14,
  },
  customInputRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  customInput: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.text,
    fontSize: 16,
  },
  addCustomBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 32,
    gap: 12,
  },
  speakButton: {
    flex: 2,
    backgroundColor: theme.accent,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  speakButtonDisabled: {
    backgroundColor: theme.surface,
  },
  speakButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  saveButtonDisabled: {
    backgroundColor: theme.surface,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  categorySheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  categorySheetTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 350,
  },
  longPressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  cancelButton: {
    backgroundColor: theme.surfaceHighlight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  miniPreview: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  miniPreviewText: {
    color: theme.text,
    fontSize: 16,
    textAlign: 'center',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
  },
  wordTile: {
    backgroundColor: theme.surfaceHighlight,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
  },
  wordTileText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: theme.primary,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  doneButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SimpleSentenceBuilder;
