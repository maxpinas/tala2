import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { WORD_CATEGORIES } from '../../data';
import speechService from '../../services/speechService';

/**
 * SimpleSentenceBuilder - Vereenvoudigde zin bouwer voor Gewoon modus
 * 
 * Flow:
 * 1. Typ een zin of kies woorden uit categorieën
 * 2. Preview en spreek
 * 3. Optioneel: opslaan in een onderwerp
 */

const STEPS = {
  OVERVIEW: 'overview',
  CATEGORY: 'category',
};

const getCategoryConfig = (theme) => ({
  WIE: { label: 'Wie', icon: 'user', color: theme.catPeople, description: 'Personen' },
  DOE: { label: 'Doe', icon: 'zap', color: theme.catAction, description: 'Acties' },
  WAT: { label: 'Wat', icon: 'box', color: theme.catThing, description: 'Dingen' },
  WAAR: { label: 'Waar', icon: 'map-pin', color: theme.catPlace, description: 'Plaatsen' },
  EMOJI: { label: 'Emoji', icon: 'smile', color: '#FFD166', description: 'Emoticons' },
});

const SimpleSentenceBuilder = ({
  visible,
  onClose,
  onSpeak,
  onAddToCategory,
  categories = {},
  initialSentence = [],
}) => {
  const [sentence, setSentence] = useState(initialSentence);
  const [step, setStep] = useState(STEPS.OVERVIEW);
  const [activeCategory, setActiveCategory] = useState(null);
  const [customText, setCustomText] = useState('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get theme from context
  const { theme } = useTheme();
  const CATEGORY_CONFIG = getCategoryConfig(theme);
  
  // Ref for timeout cleanup
  const timeoutRef = useRef(null);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setStep(STEPS.OVERVIEW);
      setActiveCategory(null);
      setShowCategorySelector(false);
    }
  }, [visible]);

  const sentenceText = sentence.join(' ');

  // Handle word selection
  const handleWordSelect = useCallback((word) => {
    setSentence(prev => [...prev, word]);
  }, []);

  // Handle word removal
  const handleWordRemove = useCallback((index) => {
    setSentence(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle speak
  const handleSpeak = useCallback(() => {
    const textToSpeak = customText.trim() || sentenceText;
    if (textToSpeak) {
      // Let the parent handle speaking via callback to avoid double-speak
      if (onSpeak) onSpeak(textToSpeak);
    }
  }, [customText, sentenceText, onSpeak]);

  // Handle save to category
  const handleSaveToCategory = useCallback((targetCategory) => {
    const textToSave = customText.trim() || sentenceText;
    if (textToSave && onAddToCategory) {
      onAddToCategory(textToSave, targetCategory);
      setShowCategorySelector(false);
      setSaveSuccess(true);
      // Auto-hide success message
      timeoutRef.current = setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }
  }, [customText, sentenceText, onAddToCategory]);

  // Clear sentence
  const handleClear = useCallback(() => {
    setSentence([]);
    setCustomText('');
  }, []);

  // Word categories data
  const wordCategories = {
    WIE: WORD_CATEGORIES.WIE || [],
    DOE: WORD_CATEGORIES.DOE || [],
    WAT: WORD_CATEGORIES.WAT || [],
    WAAR: WORD_CATEGORIES.WAAR || [],
    EMOJI: WORD_CATEGORIES.EMOJI || [],
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
          {/* Success message - Opgeslagen */}
          {saveSuccess && (
            <View style={[styles.successBanner, { backgroundColor: theme.primary }]}>
              <Feather name="check-circle" size={20} color="#000" />
              <Text style={styles.successText}>Opgeslagen!</Text>
            </View>
          )}
          
          {step === STEPS.OVERVIEW ? (
            // OVERVIEW - Show sentence and category buttons
            <>
              {/* Header with back pill */}
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={onClose} style={[styles.backPill, { backgroundColor: theme.surface }]}>
                  <Feather name="arrow-left" size={20} color={theme.text} />
                  <Text style={[styles.backPillText, { color: theme.text }]}>Terug</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Zin Bouwen</Text>
                <View style={{ width: 80 }} />
              </View>

              <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              >
                <ScrollView 
                  contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Custom text input */}
                  <View style={styles.inputSection}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Typ je zin</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: theme.surface, color: theme.text }]}
                      placeholder="Of kies woorden hieronder..."
                      placeholderTextColor={theme.textDim}
                      value={customText}
                      onChangeText={setCustomText}
                      multiline
                    />
                  </View>

                  {/* Current sentence preview */}
                  {sentence.length > 0 && (
                    <View style={styles.previewSection}>
                      <Text style={[styles.previewLabel, { color: theme.textDim }]}>Gekozen woorden</Text>
                      <View style={styles.wordsRow}>
                        {sentence.map((word, i) => (
                          <TouchableOpacity
                            key={i}
                            style={[styles.wordChip, { backgroundColor: theme.surface }]}
                            onPress={() => handleWordRemove(i)}
                          >
                            <Text style={[styles.wordChipText, { color: theme.text }]}>{word}</Text>
                            <Feather name="x" size={14} color={theme.textDim} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Word category tiles */}
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Kies woorden</Text>
                  <View style={styles.categoryGrid}>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.categoryTile, { backgroundColor: theme.surface, borderColor: config.color }]}
                        onPress={() => {
                          setActiveCategory(key);
                          setStep(STEPS.CATEGORY);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.categoryIcon, { backgroundColor: config.color }]}>
                          <Feather name={config.icon} size={24} color="#000" />
                        </View>
                        <Text style={[styles.categoryLabel, { color: theme.text }]}>{config.label}</Text>
                        <Text style={[styles.categoryDesc, { color: theme.textDim }]}>{config.description}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Action bar */}
                <View style={[styles.actionBar, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
                  {(customText.trim() || sentence.length > 0) && (
                    <TouchableOpacity 
                      style={[styles.clearButton, { backgroundColor: theme.surface }]}
                      onPress={handleClear}
                    >
                      <Feather name="trash-2" size={20} color={theme.danger} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: theme.surface }]}
                    onPress={() => setShowCategorySelector(true)}
                    disabled={!customText.trim() && sentence.length === 0}
                  >
                    <Feather name="folder-plus" size={20} color="#000" />
                    <Text style={[styles.saveButtonText, { color: theme.text }]}>Opslaan</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.speakButton,
                      { backgroundColor: theme.primary },
                      (!customText.trim() && sentence.length === 0) && styles.speakButtonDisabled
                    ]}
                    onPress={handleSpeak}
                    disabled={!customText.trim() && sentence.length === 0}
                  >
                    <Feather name="volume-2" size={24} color="#000" />
                    <Text style={styles.speakButtonText}>Spreek</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </>
          ) : step === STEPS.CATEGORY ? (
            // CATEGORY - Show words from selected category
            <>
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity 
                  onPress={() => setStep(STEPS.OVERVIEW)} 
                  style={[styles.backPill, { backgroundColor: theme.surface }]}
                >
                  <Feather name="arrow-left" size={20} color={theme.text} />
                  <Text style={[styles.backPillText, { color: theme.text }]}>Terug</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  {CATEGORY_CONFIG[activeCategory]?.label || 'Woorden'}
                </Text>
                <View style={{ width: 80 }} />
              </View>

              <ScrollView 
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.wordsGrid}>
                  {wordCategories[activeCategory]?.map((word, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.wordTile, { backgroundColor: theme.surface }]}
                      onPress={() => {
                        handleWordSelect(word);
                        setStep(STEPS.OVERVIEW);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.wordTileText, { color: theme.text }]}>{word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </>
          ) : null}

          {/* Category Selector Modal */}
          <Modal
            visible={showCategorySelector}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCategorySelector(false)}
          >
            <View style={styles.categoryModalOverlay}>
              <TouchableOpacity 
                style={styles.modalDismissArea}
                activeOpacity={1}
                onPress={() => setShowCategorySelector(false)}
              />
              <View style={[styles.categorySheet, { backgroundColor: theme.surface }]}>
                <Text style={[styles.categorySheetTitle, { color: theme.text }]}>Opslaan in onderwerp</Text>
                <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
                  {/* Aangepast eerst */}
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => handleSaveToCategory('Aangepast')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryOptionIcon, { backgroundColor: theme.accent }]}>
                      <Feather name="edit-3" size={24} color="#000" />
                    </View>
                    <Text style={[styles.categoryOptionLabel, { color: theme.text }]}>Aangepast (eigen zinnen)</Text>
                  </TouchableOpacity>
                  
                  {/* Andere categorieën */}
                  {Object.entries(categories)
                    .filter(([key]) => key !== 'Aangepast' && key !== 'aangepast')
                    .map(([key, cat]) => (
                    <TouchableOpacity
                      key={key}
                      style={styles.categoryOption}
                      onPress={() => handleSaveToCategory(key)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.categoryOptionIcon, { backgroundColor: theme.surfaceHighlight }]}>
                        <Feather name={cat.icon || 'folder'} size={24} color={theme.primary} />
                      </View>
                      <Text style={[styles.categoryOptionLabel, { color: theme.text }]}>{cat.label || key}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowCategorySelector(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textDim }]}>Annuleren</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  successBanner: {
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  backPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewSection: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  wordChipText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryTile: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wordTile: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  wordTileText: {
    fontSize: 18,
    fontWeight: '500',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    gap: 12,
  },
  clearButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  speakButtonDisabled: {
    opacity: 0.5,
  },
  speakButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  categorySheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  categorySheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  categoryOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryOptionLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
  },
});

export default SimpleSentenceBuilder;
