import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, StyleSheet, ActivityIndicator, Image, Alert, Modal } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';

// --- THEMA ---
import { theme, ThemeProvider, useTheme } from './src/theme';

// --- DATA ---
import { INITIAL_CATEGORIES, DEFAULT_CONTEXTS, DEFAULT_QUICK, LOCATIONS, PEOPLE, renderPhrase, shouldShowPhrase, getLocationById, getPersonById } from './src/data';
import { buildDemoState } from './src/demo/demoData';

// --- STORAGE ---
import { loadOnboarded, saveOnboarded, saveCategories, saveQuickResponses, loadTileCustomizations, saveTileCustomizations } from './src/storage';

// --- CONTEXT ---
import { AppProviders, useApp, useCategories } from './src/context';

// --- COMMON COMPONENTS ---
import { CustomPopup, SimpleInputModal, EditToolbar, OutputBar, SelectorModal, SpeakingIndicator, Toast, StartupModeModal, LargeTile, IconTile, BigActionBar, CompactBuilderView } from './src/components/common';

// --- SCREENS ---
import { 
  OnboardingFlow, 
  BasicSetupFlow, 
  CustomTextsFlow, 
  HistoryView, 
  ListManagerScreen, 
  ManageTopicsScreen, 
  ManagePeopleLocations, 
  ManagePartnersScreen,
  ManageLocationsScreen,
  ManagePhotosScreen,
  ExtendedModeSetup, 
  SmartSentenceBuilder,
  ProfileSetupFlow,
  MedicalSetupFlow,
  VoiceSettingsScreen,
  SimpleHome,
  SimpleSentenceBuilder,
  SimpleCategoryView,
  FilterScreen,
  AboutMeScreen
} from './src/components/screens';
import GalleryScreen from './src/components/screens/GalleryScreen';

// --- SPEECH SERVICE ---
import speechService from './src/services/speechService';

// --- TEST COMPONENTS ---
import SpeechTest from './src/components/test/SpeechTest';

// --- MODALS ---
import { 
  SettingsMenuModal,
  ProfileMenuModal,
  ContentMenuModal,
  BeheerMenuModal,
  QuickAccessModal,
  EmergencyModal, 
  MedicalScreen, 
  PartnerScreen, 
  HistoryOptionsModal, 
  AddOrEditPhotoModal, 
  FullScreenShow,
  PhotoFullScreenShow,
  MovePhraseModal,
  TileCustomizationModal
} from './src/components/modals';

// --- Helper: get icon for quick responses based on text ---
const getQuickResponseIcon = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText === 'ja') return 'check';
  if (lowerText === 'nee') return 'x';
  if (lowerText === 'moment' || lowerText === 'wacht') return 'clock';
  if (lowerText === 'misschien') return 'help-circle';
  if (lowerText === 'dank' || lowerText === 'bedankt') return 'heart';
  if (lowerText === 'sorry' || lowerText === 'pardon') return 'frown';
  if (lowerText === 'hoi' || lowerText === 'hallo') return 'smile';
  if (lowerText === 'oké' || lowerText === 'ok') return 'thumbs-up';
  return 'message-circle'; // fallback
};

// --- MAIN APP WRAPPER (checks loading state and mode selection) ---
const MainAppWrapper = ({ onReset }) => {
  const { theme, isDark } = useTheme();
  const {
    isLoading,
    appMode,
    setAppMode,
    setModeRemember,
    setProfile,
    setContexts,
    setCustomPartners,
    setQuickResponses,
    setGallery,
    setHistory,
    setCurrentContext,
    setCurrentPartner,
  } = useApp();
  const { setCategories, setActiveCategory } = useCategories();

  // Handle mode selection from startup modal
  const handleModeSelect = (mode, remember, fillDemo = false, userName = '', partnerName = '') => {
    if (fillDemo) {
      const demoState = buildDemoState();
      setProfile(demoState.profile);
      setContexts(demoState.contexts);
      setCustomPartners(demoState.customPartners);
      setQuickResponses(demoState.quickResponses);
      setGallery(demoState.gallery);
      setHistory(demoState.history);
      setCurrentContext(demoState.contexts[0]?.id || 'thuis');
      setCurrentPartner('partner');
      setCategories(demoState.categories);
      setActiveCategory(Object.keys(demoState.categories)[0]);
    } else if (userName || partnerName) {
      // Leeg beginnen met ingevoerde naam/partner
      setProfile(prev => ({
        ...prev,
        name: userName || prev.name,
        partnerName: partnerName || prev.partnerName,
      }));
    }

    // Set remember flag first so persistence effect can act when appMode is set
    setModeRemember(remember);
    setAppMode(mode);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  // Show mode selection modal if mode is not set
  if (appMode === null) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <StartupModeModal
          visible={true}
          onSelectMode={handleModeSelect}
        />
      </SafeAreaView>
    );
  }

  return <MainApp onReset={onReset} />;
};

// --- MAIN APP ---
const MainApp = ({ onReset }) => {
  // Get theme from context
  const { theme, isDark } = useTheme();
  
  // Get shared state from AppContext
  const { 
    profile, setProfile,
    contexts, setContexts,
    customPartners, setCustomPartners,
    quickResponses, setQuickResponses,
    activePartners,
    currentContext, setCurrentContext,
    currentPartner, setCurrentPartner,
    history, addToHistory, clearHistory,
    gallery, setGallery, addPhoto, updatePhoto,
    appMode, isExpertMode, isGebruikMode
  } = useApp();

  // Get categories state from CategoriesContext
  const {
    categories,
    setCategories,
    activeCategory,
    setActiveCategory,
    isEditingCategory,
    setIsEditingCategory
  } = useCategories();

  // Local UI state
  const [currentView, setCurrentView] = useState('HOME');
  const [sentence, setSentence] = useState([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [builderMode, setBuilderMode] = useState('SENTENCE');
  const [isInstantMode, setIsInstantMode] = useState(false);

  // POPUP & MODAL STATE
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', type: 'info' });
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  
  // Note: Add modals removed - now using full manage screens instead

  const triggerPopup = (title, message, type = 'info') => {
      setPopup({ visible: true, title, message, type });
  };

  useEffect(() => {
      if(categories['Persoonlijk']) {
          const personalItems = [
              profile.name ? `Ik heet ${profile.name}` : null,
              profile.address ? `Ik woon in ${profile.address}` : null,
              profile.partnerName ? `Mijn partner heet ${profile.partnerName}` : null,
              profile.contact2Name ? `Bel ${profile.contact2Name}` : null,
              "Ik heb afasie"
          ].filter(Boolean);
          setCategories(prev => ({...prev, Persoonlijk: { ...prev.Persoonlijk, items: personalItems } }));
      }
  }, [profile]);

  // In gebruikersmodus: altijd direct mode aan (woorden worden direct uitgesproken)
  useEffect(() => {
      if (isGebruikMode) {
          setIsInstantMode(true);
      }
  }, [isGebruikMode]);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showBeheerMenu, setShowBeheerMenu] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);       
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showPartnersScreen, setShowPartnersScreen] = useState(false);
  const [showLocationsScreen, setShowLocationsScreen] = useState(false);
  const [partnersLocationsSource, setPartnersLocationsSource] = useState(null); // 'content' | 'selector' - where we came from
  const [showManagePhotos, setShowManagePhotos] = useState(false);
  const [managePhotosCategory, setManagePhotosCategory] = useState(null);
  const [showSpeechTest, setShowSpeechTest] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [profileSetupKey, setProfileSetupKey] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'check' });
  
  // D1-D8: Tile customization state
  const [showTileCustomization, setShowTileCustomization] = useState(false);
  const [selectedTileForCustomization, setSelectedTileForCustomization] = useState(null);
  const [tileCustomizations, setTileCustomizations] = useState({}); // { categoryKey: { customName, colorId, darkColorId, textColor, backgroundPhotoId } }
  const [tileCustomizationsLoaded, setTileCustomizationsLoaded] = useState(false);
  
  // Load tile customizations on mount
  useEffect(() => {
    loadTileCustomizations().then((loaded) => {
      if (loaded) setTileCustomizations(loaded);
      setTileCustomizationsLoaded(true);
    });
  }, []);
  
  // Save tile customizations when they change
  useEffect(() => {
    if (tileCustomizationsLoaded && Object.keys(tileCustomizations).length > 0) {
      saveTileCustomizations(tileCustomizations);
    }
  }, [tileCustomizations, tileCustomizationsLoaded]);
  
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showPartnerScreen, setShowPartnerScreen] = useState(false);
  const [showMedicalScreen, setShowMedicalScreen] = useState(false);
  const [showMedicalSetup, setShowMedicalSetup] = useState(false);
  const [medicalSetupSource, setMedicalSetupSource] = useState(null); // 'profile' or 'medical'
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [fullScreenText, setFullScreenText] = useState(''); // Dedicated text for fullscreen show
  const [showPhotoFullScreen, setShowPhotoFullScreen] = useState(false);
  const [fullScreenPhoto, setFullScreenPhoto] = useState(null);
  const [photoMuted, setPhotoMuted] = useState(false); // Persistent mute state
  // currentContext and currentPartner now come from AppContext
  const [showContextModal, setShowContextModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  // Move phrase modal state
  const [movePhraseModal, setMovePhraseModal] = useState({ visible: false, phrase: '', index: -1 });
  
  // Simple mode states
  const [showSimpleSentenceBuilder, setShowSimpleSentenceBuilder] = useState(false);
  const [builderInitialTopic, setBuilderInitialTopic] = useState(null); // 'locations' | 'people' | null
  
  // Long-press actie modal state (Kopieer/Toon/Verwijder/Verplaats opties)
  const [longPressModal, setLongPressModal] = useState({ visible: false, text: '', type: 'phrase', index: -1, category: null, photoId: null });
  
  // Category phrases manager - voor "Aanpassen" vanuit longpress
  const [manageCategoryPhrases, setManageCategoryPhrases] = useState({ visible: false, category: null, returnToLongPress: null });
  
  // Favorieten manager - voor "Aanpassen" vanuit longpress op favorieten
  const [manageFavoritesFromLongPress, setManageFavoritesFromLongPress] = useState({ visible: false, returnToLongPress: null });
  
  // Category picker voor toevoegen aan onderwerp
  const [showCategoryPicker, setShowCategoryPicker] = useState({ visible: false, text: '', action: 'add' }); // action: 'add' | 'move'

  const openProfileSetupWizard = useCallback(() => {
    setProfileSetupKey((prev) => prev + 1);
    setShowProfileMenu(false);
    setShowProfileSetup(true);
  }, []);

  const closeProfileSetupWizard = useCallback(() => {
    setShowProfileSetup(false);
    setShowProfileMenu(true);
  }, []);

  useEffect(() => {
    setCurrentView('HOME');
    setIsBuilding(false);
    setShowSimpleSentenceBuilder(false);
    setSentence([]);
    setSelectedWordIndex(null);
  }, [appMode]);

  const peopleSuggestions = useMemo(() => {
    const entries = [
      profile?.name,
      profile?.partnerName,
      profile?.contact2Name,
      profile?.emergencyName2,
      ...(customPartners || []).map((partner) => partner?.label),
    ];
    const seen = new Set();
    return entries
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter((entry) => {
        if (!entry) return false;
        const key = entry.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [profile?.name, profile?.partnerName, profile?.contact2Name, profile?.emergencyName2, customPartners]);

  const locationSuggestions = useMemo(() => {
    const labels = (contexts || []).map((context) => (typeof context?.label === 'string' ? context.label.trim() : ''));
    const seen = new Set();
    return labels.filter((label) => {
      if (!label) return false;
      const key = label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [contexts]);

  // Actieve context objecten voor placeholder vervanging
  const activeLocationObject = useMemo(() => {
    // Vind de context uit de aanpasbare contexts lijst
    const context = (contexts || []).find(c => c.id === currentContext);
    if (!context) return null;
    // Probeer grammatica varianten te vinden uit LOCATIONS
    const locationWithVariants = getLocationById(currentContext);
    return {
      ...context,
      variants: locationWithVariants?.variants || { bij: context.label, naar: context.label, van: context.label }
    };
  }, [currentContext, contexts]);

  const activePersonObject = useMemo(() => {
    // Vind de persoon uit activePartners
    const person = (activePartners || []).find(p => p.id === currentPartner);
    if (!person) return null;
    // Voeg naam toe (voor editable partners)
    const name = person.label || person.defaultName || 'Partner';
    return {
      ...person,
      name,
      variants: { naam: name, met: `met ${name}`, voor: `voor ${name}` }
    };
  }, [currentPartner, activePartners]);

  // Context object voor renderPhrase
  const phraseContext = useMemo(() => ({
    location: activeLocationObject?.id !== 'geen' ? activeLocationObject : null,
    person: activePersonObject?.id !== 'geen' ? activePersonObject : null,
  }), [activeLocationObject, activePersonObject]);

  const handleBackFromSettings = () => { setCurrentView('HOME'); };
  const handleBackToContentMenu = () => { setCurrentView('HOME'); setShowContentMenu(true); };
  const handleBackToProfileMenu = () => { setCurrentView('HOME'); setShowProfileMenu(true); };
  const addPhraseToCategory = (text, targetCategory = activeCategory) => { 
    if(!targetCategory) return; 
    setCategories(prev => ({ ...prev, [targetCategory]: { ...prev[targetCategory], items: [...prev[targetCategory].items, text] } })); 
  };
  const deletePhraseFromCategory = (idx) => { setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items: prev[activeCategory].items.filter((_, i) => i !== idx) } })); };
  const movePhrase = (idx, dir) => { const items = [...categories[activeCategory].items]; const newIdx = idx + dir; if(newIdx < 0 || newIdx >= items.length) return; [items[idx], items[newIdx]] = [items[newIdx], items[idx]]; setCategories(prev => ({ ...prev, [activeCategory]: { ...prev[activeCategory], items } })); };
  const movePhraseToCategory = (idx, targetCategory, copy = false) => {
    const text = categories[activeCategory].items[idx];
    // Voeg toe aan doelcategorie
    setCategories(prev => ({ 
      ...prev, 
      [targetCategory]: { ...prev[targetCategory], items: [...prev[targetCategory].items, text] },
      // Verwijder uit huidige categorie als het geen kopie is
      ...(copy ? {} : { [activeCategory]: { ...prev[activeCategory], items: prev[activeCategory].items.filter((_, i) => i !== idx) } })
    }));
  };
  const handleSaveBuilder = (text) => { 
    if (builderMode === 'ADD_TO_CATEGORY') { 
      addPhraseToCategory(text); 
      setIsBuilding(false); 
    } else { 
      // In SENTENCE mode: voeg ook toe aan "Aangepast" categorie
      setSentence(text.split(' ')); 
      addPhraseToCategory(text, 'Aangepast');
      setIsBuilding(false); 
    } 
  };
  
  // Initialiseer speech service met opgeslagen stem
  useEffect(() => {
    // Initialize speech service (discovers available voices)
    speechService.initialize().then(() => {
      if (profile.voiceId) {
        speechService.setVoice(profile.voiceId);
      }
    });
    speechService.setSpeakingChangeCallback(setIsSpeaking);
  }, [profile.voiceId]);

  const handleSpeak = (textToSpeak) => {
    let txt = textToSpeak || sentence.join(' ');
    if (!txt) return;
    
    // Filter emoji's uit de tekst voordat deze wordt uitgesproken
    // Verwijder emoji's en extra spaties
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu;
    txt = txt.replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
    
    if (!txt) return; // Als er alleen emoji's waren, niets uitspreken
    
    // Toon speaking indicator met de tekst
    setSpeakingText(txt);
    
    // Spreek de tekst uit met de gekozen stem
    speechService.speak(txt, {
      onDone: () => setSpeakingText(''),
      onStopped: () => setSpeakingText(''),
      onError: () => setSpeakingText(''),
    });
    
    // Voeg toe aan geschiedenis (met originele tekst inclusief emoji's)
    addToHistory(textToSpeak || sentence.join(' '));
  };
  
  const showToast = (message, icon = 'check') => {
    setToast({ visible: true, message, icon });
  };
  
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  
  const handleSaveVoice = (voiceId) => {
    setProfile(prev => ({ ...prev, voiceId }));
    setShowVoiceSettings(false);
    setShowProfileMenu(true);
  };

  const handlePhrasePress = (text) => { if (isInstantMode) { handleSpeak(text); } else { setSentence(prev => [...prev, text]); } };
  
  // Long-press handler: toont opties modal voor zinnen
  const handlePhraseLongPress = (text, index = -1, category = null) => {
    const isQuick = quickResponses.includes(text);
    setLongPressModal({ visible: true, text, type: 'phrase', index, category: category || activeCategory, photoId: null, isQuick });
  };
  
  // Long-press handler voor foto's
  const handlePhotoLongPress = (photo) => {
    setLongPressModal({ visible: true, text: photo.text || '', type: 'photo', index: -1, category: photo.category, photoId: photo.id });
  };
  
  // Long-press handler voor history items
  const handleHistoryLongPress = (item) => {
    setLongPressModal({ visible: true, text: item.text, type: 'history', index: -1, category: null, photoId: null });
  };
  
  // Sluit long-press modal
  const closeLongPressModal = () => {
    setLongPressModal({ visible: false, text: '', type: 'phrase', index: -1, category: null, photoId: null });
  };
  
  // Kopieer naar klembord
  const handleCopyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    closeLongPressModal();
    setToast({ visible: true, message: 'Gekopieerd!', icon: 'copy' });
  };
  
  // Toon in fullscreen
  const handleShowFullscreen = (text) => {
    closeLongPressModal();
    // Sluit ook SimpleSentenceBuilder als die open is
    setShowSimpleSentenceBuilder(false);
    setBuilderInitialTopic(null);
    // Render placeholders naar echte waarden
    const renderedText = renderPhrase(text, phraseContext);
    setFullScreenText(renderedText);
    setShowFullScreen(true);
  };
  
  // Verwijder zin uit categorie
  const handleDeletePhrase = () => {
    const { index, category } = longPressModal;
    if (index >= 0 && category) {
      setCategories(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          items: prev[category].items.filter((_, i) => i !== index)
        }
      }));
      setToast({ visible: true, message: 'Verwijderd', icon: 'trash-2' });
    }
    closeLongPressModal();
  };
  
  // Verwijder foto
  const handleDeletePhoto = () => {
    const { photoId } = longPressModal;
    if (photoId) {
      setGallery(prev => prev.filter(p => p.id !== photoId));
      setToast({ visible: true, message: 'Foto verwijderd', icon: 'trash-2' });
    }
    closeLongPressModal();
  };
  
  // Open category picker om zin toe te voegen aan onderwerp
  const handleAddToCategory = () => {
    const { text } = longPressModal;
    closeLongPressModal();
    // Sluit ook SimpleSentenceBuilder als die open is
    setShowSimpleSentenceBuilder(false);
    setBuilderInitialTopic(null);
    setShowCategoryPicker({ visible: true, text, action: 'add' });
  };

  // Quick responses management
  const handleAddQuickResponse = (text) => {
    if (!text) return;
    if (!quickResponses.includes(text)) {
      const updated = [text, ...quickResponses];
      setQuickResponses(updated);
      saveQuickResponses(updated);
      setToast({ visible: true, message: 'Toegevoegd aan Favorieten', icon: 'check' });
    }
    closeLongPressModal();
  };

  const handleDeleteQuickResponse = (text) => {
    if (!text) return;
    const updated = quickResponses.filter(q => q !== text);
    setQuickResponses(updated);
    saveQuickResponses(updated);
    setToast({ visible: true, message: 'Snel antwoord verwijderd', icon: 'trash-2' });
    closeLongPressModal();
  };
  
  // Open favorieten manager vanuit longpress "Aanpassen" optie
  const handleOpenFavoritesManager = () => {
    const { text } = longPressModal;
    setManageFavoritesFromLongPress({ 
      visible: true, 
      returnToLongPress: { text } 
    });
    closeLongPressModal();
  };
  
  // Sluit favorieten manager en keer terug naar longpress modal
  const handleCloseFavoritesManager = () => {
    const { returnToLongPress } = manageFavoritesFromLongPress;
    setManageFavoritesFromLongPress({ visible: false, returnToLongPress: null });
    
    // Open de longpress modal weer met de opgeslagen info
    if (returnToLongPress) {
      setTimeout(() => {
        setLongPressModal({ 
          visible: true, 
          text: returnToLongPress.text, 
          type: 'phrase', 
          index: -1, 
          category: null, 
          photoId: null,
          isQuick: true
        });
      }, 100);
    }
  };
  
  // Open category phrases manager vanuit longpress "Aanpassen" optie
  const handleOpenCategoryManager = () => {
    const { category, text, index } = longPressModal;
    if (category && categories[category]) {
      // Sla longpress info op voor terugkeer
      setManageCategoryPhrases({ 
        visible: true, 
        category, 
        returnToLongPress: { text, index, category } 
      });
      closeLongPressModal();
    }
  };
  
  // Sluit category phrases manager en keer terug naar longpress modal
  const handleCloseCategoryManager = () => {
    const { returnToLongPress } = manageCategoryPhrases;
    setManageCategoryPhrases({ visible: false, category: null, returnToLongPress: null });
    
    // Open de longpress modal weer met de opgeslagen info
    if (returnToLongPress) {
      setTimeout(() => {
        setLongPressModal({ 
          visible: true, 
          text: returnToLongPress.text, 
          type: 'phrase', 
          index: returnToLongPress.index, 
          category: returnToLongPress.category, 
          photoId: null 
        });
      }, 100);
    }
  };
  
  // Update category items vanuit de manager
  const handleUpdateCategoryPhrases = (newItems) => {
    const { category } = manageCategoryPhrases;
    if (category && categories[category]) {
      setCategories(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          items: newItems
        }
      }));
    }
  };
  
  // Voeg zin toe aan geselecteerde categorie
  const handleAddToCategoryConfirm = (targetCategory) => {
    const { text } = showCategoryPicker;
    if (text && targetCategory && categories[targetCategory]) {
      setCategories(prev => ({
        ...prev,
        [targetCategory]: {
          ...prev[targetCategory],
          items: [...prev[targetCategory].items, text]
        }
      }));
      // Voeg ook toe aan Aangepast als het daar nog niet staat
      if (targetCategory !== 'Aangepast' && !categories['Aangepast']?.items.includes(text)) {
        setCategories(prev => ({
          ...prev,
          Aangepast: {
            ...prev.Aangepast,
            items: [...(prev.Aangepast?.items || []), text]
          }
        }));
      }
      setToast({ visible: true, message: `Toegevoegd aan ${targetCategory}`, icon: 'check' });
    }
    setShowCategoryPicker({ visible: false, text: '', action: 'add' });
  };

  const handleSavePhoto = (caption, category) => {
    const finalCaption = caption.trim() || "Kijk eens";
    if (photoToEdit) {
        updatePhoto(photoToEdit.id, finalCaption, category);
        setPhotoToEdit(null);
    } else {
        addPhoto(finalCaption, category);
        if(category && categories[category]) {
            setCategories(prev => ({ ...prev, [category]: { ...prev[category], items: [...prev[category].items, finalCaption + " 📷"] } }));
        }
    }
    if (category) setActiveCategory(category);
    setCurrentView(category ? 'CATEGORY' : 'GALLERY');
  };

  const handleCopy = () => { 
    if(sentence.length > 0) {
      showToast(`Gekopieerd: ${sentence.join(' ')}`, 'copy');
    }
  };
  const handleShow = () => { if(sentence.length > 0) setShowFullScreen(true); };
  
  const handlePhotoShow = (photo) => {
    setFullScreenPhoto(photo);
    setShowPhotoFullScreen(true);
    // Auto-speak wordt gedaan in PhotoFullScreenShow component
  };

  const handleHistoryAction = (action) => {
     if (!selectedHistoryItem) return;
     const text = selectedHistoryItem.text;
     setSelectedHistoryItem(null);
     
     if (action === 'speak') {
         handleSpeak(text);
     } else if (action === 'copy') {
         showToast(`Gekopieerd: ${text}`, 'copy');
     } else if (action === 'show') {
         setSentence(text.split(' ')); 
         setShowFullScreen(true);
     }
  };

  const moveWordMain = (dir) => { if (selectedWordIndex === null) return; const newIdx = selectedWordIndex + dir; if (newIdx >= 0 && newIdx < sentence.length) { const newS = [...sentence]; [newS[selectedWordIndex], newS[newIdx]] = [newS[newIdx], newS[selectedWordIndex]]; setSentence(newS); setSelectedWordIndex(newIdx); } };
  const deleteWordMain = () => { if (selectedWordIndex !== null) { setSentence(sentence.filter((_, i) => i !== selectedWordIndex)); setSelectedWordIndex(null); } };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      {/* Speaking indicator - Siri-achtige animatie */}
      <SpeakingIndicator visible={isSpeaking || speakingText !== ''} text={speakingText} />
      
      {/* Toast notificatie voor kopiëren etc */}
      <Toast visible={toast.visible} message={toast.message} icon={toast.icon} onHide={hideToast} />
      
      <CustomPopup visible={popup.visible} title={popup.title} message={popup.message} type={popup.type} onClose={() => setPopup(prev => ({ ...prev, visible: false }))} />
      <HistoryOptionsModal visible={!!selectedHistoryItem} item={selectedHistoryItem} onClose={() => setSelectedHistoryItem(null)} onAction={handleHistoryAction} />
      <MovePhraseModal 
        visible={movePhraseModal.visible} 
        onClose={() => setMovePhraseModal({ visible: false, phrase: '', index: -1 })}
        phrase={movePhraseModal.phrase}
        categories={categories}
        currentCategory={activeCategory}
        onMove={(targetCat) => { movePhraseToCategory(movePhraseModal.index, targetCat, false); setMovePhraseModal({ visible: false, phrase: '', index: -1 }); }}
        onCopy={(targetCat) => { movePhraseToCategory(movePhraseModal.index, targetCat, true); setMovePhraseModal({ visible: false, phrase: '', index: -1 }); }}
      />

      <AddOrEditPhotoModal visible={showPhotoModal} onClose={() => { setShowPhotoModal(false); setPhotoToEdit(null); }} onSave={handleSavePhoto} categories={categories} initialData={photoToEdit} onTriggerPopup={triggerPopup} />
      <SettingsMenuModal visible={showSettingsMenu} onClose={() => setShowSettingsMenu(false)} onProfileMenu={(target) => { if (target === 'BASIC_SETUP') { openProfileSetupWizard(); } else { setShowProfileMenu(true); } }} onContentMenu={() => setShowContentMenu(true)} onBeheerMenu={() => setShowBeheerMenu(true)} onReset={onReset} onSpeechTest={() => setShowSpeechTest(true)} onVoiceSettings={() => setShowVoiceSettings(true)} />
      <BeheerMenuModal visible={showBeheerMenu} onClose={() => setShowBeheerMenu(false)} onReset={onReset} />
      <ProfileMenuModal
        visible={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        onMedicalSettings={() => { setShowProfileMenu(false); setMedicalSetupSource('profile'); setShowMedicalSetup(true); }}
        onNavigate={(v) => {
          if (v === 'PROFILE_SETUP') {
            openProfileSetupWizard();
          } else if (v === 'CUSTOM_TEXTS') {
            setCurrentView(v);
          } else if (v === 'VOICE_SETTINGS') {
            setShowVoiceSettings(true);
          } else if (v === 'MANAGE_QUICK') {
            setCurrentView('MANAGE_QUICK');
          }
        }}
      />
      <ContentMenuModal visible={showContentMenu} onClose={() => setShowContentMenu(false)} onNavigate={(v) => { setCurrentView(v); }} onShowPartners={() => { setPartnersLocationsSource('content'); setShowPartnersScreen(true); }} onShowLocations={() => { setPartnersLocationsSource('content'); setShowLocationsScreen(true); }} onVoiceSettings={() => setShowVoiceSettings(true)} />
      
      {/* D1-D8: Tile Customization Modal */}
      <TileCustomizationModal
        visible={showTileCustomization}
        onClose={() => {
          setShowTileCustomization(false);
          setSelectedTileForCustomization(null);
        }}
        tile={selectedTileForCustomization}
        gallery={gallery}
        onSave={(updatedTile) => {
          const customization = {
            customName: updatedTile.customName,
            colorId: updatedTile.colorId,
            darkColorId: updatedTile.darkColorId,
            textColorLight: updatedTile.textColorLight,
            textColorDark: updatedTile.textColorDark,
            iconColorLight: updatedTile.iconColorLight,
            iconColorDark: updatedTile.iconColorDark,
            backgroundPhotoId: updatedTile.backgroundPhotoId,
          };
          
          if (updatedTile.applyToAll) {
            // Apply to all category tiles
            const allCustomizations = {};
            Object.keys(categories).forEach(catKey => {
              allCustomizations[catKey] = {
                ...customization,
                // Keep individual names, only apply colors
                customName: tileCustomizations[catKey]?.customName,
              };
            });
            setTileCustomizations(prev => ({
              ...prev,
              ...allCustomizations,
            }));
          } else {
            // Save customization for this tile only
            setTileCustomizations(prev => ({
              ...prev,
              [updatedTile.id]: customization,
            }));
          }
        }}
        tileType={selectedTileForCustomization?.type || 'category'}
      />
      {showProfileSetup && (
        <ProfileSetupFlow
          key={profileSetupKey}
          profile={profile}
          onSaveProfile={setProfile}
          onClose={closeProfileSetupWizard}
          onTriggerPopup={triggerPopup}
        />
      )}
      {showPartnersScreen && <ManagePartnersScreen onClose={() => { 
        setShowPartnersScreen(false); 
        if (partnersLocationsSource === 'selector') {
          setShowPartnerModal(true);
        } else {
          setShowContentMenu(true); 
        }
        setPartnersLocationsSource(null);
      }} partners={customPartners} setPartners={setCustomPartners} />}
      {showLocationsScreen && <ManageLocationsScreen onClose={() => { 
        setShowLocationsScreen(false); 
        if (partnersLocationsSource === 'selector') {
          setShowContextModal(true);
        } else {
          setShowContentMenu(true); 
        }
        setPartnersLocationsSource(null);
      }} contexts={contexts} setContexts={setContexts} />}
      {showSpeechTest && <SpeechTest onClose={() => setShowSpeechTest(false)} />}
      {showVoiceSettings && <VoiceSettingsScreen currentVoiceId={profile.voiceId} onSave={handleSaveVoice} onClose={() => { setShowVoiceSettings(false); setShowContentMenu(true); }} onSaveAndClose={() => { setShowVoiceSettings(false); setShowContentMenu(true); }} />}
      <QuickAccessModal visible={showQuickAccess} onClose={() => setShowQuickAccess(false)} onNavigate={(v) => { if(v === 'PARTNER_SCREEN') setShowPartnerScreen(true); else if(v === 'MEDICAL_SCREEN') setShowMedicalScreen(true); else if(v === 'EMERGENCY') setShowEmergency(true); }} />
      <EmergencyModal visible={showEmergency} onClose={() => setShowEmergency(false)} profile={profile} onTriggerPopup={triggerPopup} onShowMedical={() => setShowMedicalScreen(true)} />
      <PartnerScreen visible={showPartnerScreen} onClose={() => setShowPartnerScreen(false)} text={profile.customPartnerText} name={profile.name} />
      <MedicalScreen visible={showMedicalScreen} onClose={() => setShowMedicalScreen(false)} profile={profile} onOpenSetup={() => { setShowMedicalScreen(false); setMedicalSetupSource('medical'); setShowMedicalSetup(true); }} />
      {showMedicalSetup && <MedicalSetupFlow profile={profile} onSaveProfile={setProfile} onClose={() => { setShowMedicalSetup(false); if (medicalSetupSource === 'medical') { setShowMedicalScreen(true); } else { setShowProfileMenu(true); } }} onTriggerPopup={triggerPopup} />}
      {showFullScreen && <FullScreenShow text={fullScreenText || sentence.join(' ')} onClose={() => { setShowFullScreen(false); setFullScreenText(''); }} />}
      {showPhotoFullScreen && fullScreenPhoto && (
        <PhotoFullScreenShow 
          photo={fullScreenPhoto} 
          onClose={() => { setShowPhotoFullScreen(false); setFullScreenPhoto(null); }} 
          onSpeak={handleSpeak}
          isMuted={photoMuted}
          onToggleMute={() => setPhotoMuted(!photoMuted)}
        />
      )}
      
      {/* ManagePhotosScreen as fullscreen modal */}
      {showManagePhotos && (
        <ManagePhotosScreen 
          onClose={() => { setShowManagePhotos(false); setManagePhotosCategory(null); }} 
          category={managePhotosCategory} 
          gallery={gallery} 
          setGallery={setGallery} 
          categories={categories} 
        />
      )}
      
      <SelectorModal visible={showContextModal} title="Waar ben je?" options={contexts} selectedId={currentContext} onSelect={setCurrentContext} onClose={() => setShowContextModal(false)} onManage={() => { setShowContextModal(false); setPartnersLocationsSource('selector'); setShowLocationsScreen(true); }} />
      <SelectorModal visible={showPartnerModal} title="Met wie praat je?" options={activePartners.filter(p => p.id !== 'geen')} selectedId={currentPartner} onSelect={setCurrentPartner} onClose={() => setShowPartnerModal(false)} onManage={() => { setShowPartnerModal(false); setPartnersLocationsSource('selector'); setShowPartnersScreen(true); }} />

      {currentView === 'TOPIC_MANAGER' && <ManageTopicsScreen onClose={handleBackToContentMenu} categories={categories} setCategories={setCategories} />}
      {currentView === 'MANAGE_QUICK' && <ListManagerScreen title="Beheer Favorieten" items={quickResponses} onUpdate={setQuickResponses} onClose={handleBackToContentMenu} type="string" />}
      
      {/* Category phrases manager - geopend vanuit longpress "Aanpassen" */}
      {manageCategoryPhrases.visible && manageCategoryPhrases.category && (
        <ListManagerScreen 
          title={`Beheer ${manageCategoryPhrases.category}`} 
          items={categories[manageCategoryPhrases.category]?.items || []} 
          onUpdate={handleUpdateCategoryPhrases} 
          onClose={handleCloseCategoryManager} 
          type="string" 
        />
      )}
      
      {/* Favorieten manager - geopend vanuit longpress "Aanpassen" op favorieten */}
      {manageFavoritesFromLongPress.visible && (
        <ListManagerScreen 
          title="Beheer Favorieten" 
          items={quickResponses} 
          onUpdate={(newItems) => {
            setQuickResponses(newItems);
            saveQuickResponses(newItems);
          }} 
          onClose={handleCloseFavoritesManager} 
          type="string" 
        />
      )}

      {/* SimpleSentenceBuilder Modal for Gewoon mode */}
      <SimpleSentenceBuilder 
        visible={showSimpleSentenceBuilder} 
        onClose={() => { setShowSimpleSentenceBuilder(false); setBuilderInitialTopic(null); }}
        onSpeak={handleSpeak}
        initialSentence={sentence}
        categories={categories}
        onAddToCategory={(text, targetCategory) => {
          // Add the sentence to the target category
          if (categories[targetCategory]) {
            const updatedCategories = { ...categories };
            if (!updatedCategories[targetCategory].items) {
              updatedCategories[targetCategory].items = [];
            }
            // Add to beginning so it appears first
            updatedCategories[targetCategory].items.unshift(text);
            setCategories(updatedCategories);
            // Save to storage
            saveCategories(updatedCategories);
            // Show toast
            setToast({ visible: true, message: `Opgeslagen in ${categories[targetCategory].label || targetCategory}`, icon: 'check' });
          } else if (targetCategory === 'aangepast') {
            // Create or update "Aangepast" category for custom sentences
            const updatedCategories = { ...categories };
            if (!updatedCategories.Aangepast) {
              updatedCategories.Aangepast = {
                label: 'Aangepast',
                icon: 'edit-3',
                color: theme.accent,
                items: []
              };
            }
            if (!updatedCategories.Aangepast.items) {
              updatedCategories.Aangepast.items = [];
            }
            updatedCategories.Aangepast.items.unshift(text);
            setCategories(updatedCategories);
            saveCategories(updatedCategories);
            setToast({ visible: true, message: 'Opgeslagen in Aangepast', icon: 'check' });
          }
        }}
      />

      {/* Long-press actie modal voor Kopieer/Toon/Verwijder/Toevoegen - NA SimpleSentenceBuilder zodat het bovenop komt */}
      <Modal visible={longPressModal.visible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.longPressOverlay} 
          activeOpacity={1} 
          onPress={closeLongPressModal}
        >
          <View style={[styles.longPressSheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.longPressText, { color: theme.text }]} numberOfLines={3}>{longPressModal.text ? renderPhrase(longPressModal.text, phraseContext) : (longPressModal.type === 'photo' ? 'Foto' : '')}</Text>
            
            {/* Kopieer - alleen voor tekst */}
            {longPressModal.text && (
              <TouchableOpacity 
                style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                onPress={() => handleCopyToClipboard(longPressModal.text)}
              >
                <View style={[styles.longPressIconBg, { backgroundColor: '#64748B' }]}>
                  <Feather name="copy" size={24} color="#FFF" />
                </View>
                <Text style={[styles.longPressLabel, { color: theme.text }]}>Kopieer</Text>
              </TouchableOpacity>
            )}
            
            {/* Toon Groot - alleen voor tekst */}
            {longPressModal.text && (
              <TouchableOpacity 
                style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                onPress={() => handleShowFullscreen(longPressModal.text)}
              >
                <View style={[styles.longPressIconBg, { backgroundColor: theme.accent }]}>
                  <Feather name="maximize-2" size={24} color="#000" />
                </View>
                <Text style={[styles.longPressLabel, { color: theme.text }]}>Toon Groot</Text>
              </TouchableOpacity>
            )}
            
            {/* Toevoegen aan onderwerp - voor history en zinnen */}
            {(longPressModal.type === 'history' || longPressModal.type === 'phrase') && longPressModal.text && (
              <TouchableOpacity 
                style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                onPress={handleAddToCategory}
              >
                <View style={[styles.longPressIconBg, { backgroundColor: '#22C55E' }]}>
                  <Feather name="folder-plus" size={24} color="#000" />
                </View>
                <Text style={[styles.longPressLabel, { color: theme.text }]}>Toevoegen aan onderwerp</Text>
              </TouchableOpacity>
            )}

            {/* Quick responses: add/remove from quick responses */}
            {(longPressModal.type === 'history' || longPressModal.type === 'phrase') && longPressModal.text && (
              longPressModal.isQuick ? (
                <TouchableOpacity
                  style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                  onPress={handleOpenFavoritesManager}
                >
                  <View style={[styles.longPressIconBg, { backgroundColor: '#F59E0B' }]}>
                    <Feather name="edit-3" size={24} color="#000" />
                  </View>
                  <Text style={[styles.longPressLabel, { color: theme.text }]}>Aanpassen</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                  onPress={() => handleAddQuickResponse(longPressModal.text)}
                >
                  <View style={[styles.longPressIconBg, { backgroundColor: theme.primary }]}>
                    <Feather name="plus" size={24} color="#000" />
                  </View>
                  <Text style={[styles.longPressLabel, { color: theme.text }]}>Toevoegen aan Favorieten</Text>
                </TouchableOpacity>
              )
            )}
            
            {/* Aanpassen - voor zinnen in een categorie */}
            {longPressModal.type === 'phrase' && longPressModal.index >= 0 && longPressModal.category && (
              <TouchableOpacity 
                style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                onPress={handleOpenCategoryManager}
              >
                <View style={[styles.longPressIconBg, { backgroundColor: '#F59E0B' }]}>
                  <Feather name="edit-3" size={24} color="#000" />
                </View>
                <Text style={[styles.longPressLabel, { color: theme.text }]}>Aanpassen</Text>
              </TouchableOpacity>
            )}
            
            {/* Verwijderen - voor foto's */}
            {longPressModal.type === 'photo' && longPressModal.photoId && (
              <TouchableOpacity 
                style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                onPress={handleDeletePhoto}
              >
                <View style={[styles.longPressIconBg, { backgroundColor: theme.danger }]}>
                  <Feather name="trash-2" size={24} color="#FFF" />
                </View>
                <Text style={[styles.longPressLabel, { color: theme.text }]}>Foto verwijderen</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.longPressCancelBtn}
              onPress={closeLongPressModal}
            >
              <Text style={[styles.longPressCancelText, { color: theme.text }]}>Annuleer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Category picker modal */}
      <Modal visible={showCategoryPicker.visible} transparent animationType="slide">
        <TouchableOpacity 
          style={[styles.longPressOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]} 
          activeOpacity={1} 
          onPress={() => setShowCategoryPicker({ visible: false, text: '', action: 'add' })}
        >
          <View style={[styles.longPressSheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.longPressText, { color: theme.text }]}>Kies onderwerp</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {Object.keys(categories).map((catKey) => (
                <TouchableOpacity
                  key={catKey}
                  style={[styles.longPressOption, { backgroundColor: theme.bg }]}
                  onPress={() => handleAddToCategoryConfirm(catKey)}
                >
                  <View style={[styles.longPressIconBg, { backgroundColor: theme.surfaceHighlight }]}>
                    <Feather name={categories[catKey].icon || 'folder'} size={24} color={theme.primary} />
                  </View>
                  <Text style={[styles.longPressLabel, { color: theme.text }]}>{catKey}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.longPressCancelBtn}
              onPress={() => setShowCategoryPicker({ visible: false, text: '', action: 'add' })}
            >
              <Text style={[styles.longPressCancelText, { color: theme.primary }]}>Annuleer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.container}>
        {/* Header en sentence bar alleen in Expert modus */}
        {!isGebruikMode && !isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'GALLERY'].includes(currentView) && (
          <View style={styles.header}>
            <View style={{flex: 1, paddingRight: 10}}>
                <TouchableOpacity onPress={() => setCurrentView('HOME')}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.greeting}>Hoi {profile.name}</Text></TouchableOpacity>
                <View style={styles.statusRowNew}><TouchableOpacity style={styles.statusPill} onPress={() => setShowContextModal(true)}><Feather name="home" size={12} color={theme.primary}/><Text style={styles.statusText}>{contexts.find(c=>c.id===currentContext)?.label || "Locatie"}</Text></TouchableOpacity><TouchableOpacity style={styles.statusPill} onPress={() => setShowPartnerModal(true)}><Feather name="user" size={12} color={theme.accent}/><Text style={[styles.statusText, {fontWeight:'bold'}]}>{activePartners.find(p=>p.id===currentPartner)?.label || "Partner"}</Text></TouchableOpacity></View>
            </View>
            <TouchableOpacity style={styles.profileBadge} onPress={() => setShowSettingsMenu(true)}><Text style={styles.profileText}>{profile.name ? profile.name[0] : '?'}</Text></TouchableOpacity>
          </View>
        )}

        {/* Sentence bar alleen in Expert modus */}
        {!isGebruikMode && !isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'GALLERY'].includes(currentView) && (
          <><View style={styles.sentenceContainer}>{sentence.length === 0 ? <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => { setBuilderMode('SENTENCE'); setIsBuilding(true); }}><Text style={styles.placeholderText}>Zin wordt hier gebouwd...</Text></TouchableOpacity> : <ScrollView horizontal style={{flex: 1}}>{sentence.map((w, i) => (<TouchableOpacity key={i} style={[styles.wordBubble, selectedWordIndex === i && {backgroundColor: theme.primary}]} onPress={() => setSelectedWordIndex(selectedWordIndex === i ? null : i)}><Text style={[styles.wordText, selectedWordIndex === i && {color:'#FFF'}]}>{w}</Text></TouchableOpacity>))}</ScrollView>}{sentence.length > 0 && <TouchableOpacity onPress={() => setSentence([])}><Feather name="x" size={24} color={theme.textDim}/></TouchableOpacity>}</View>{selectedWordIndex !== null && (<EditToolbar word={sentence[selectedWordIndex]} onMoveLeft={() => moveWordMain(-1)} onMoveRight={() => moveWordMain(1)} onDelete={deleteWordMain} onDeselect={() => setSelectedWordIndex(null)} />)}</>
        )}

        {/* Gewoon modus: SimpleHome en SimpleCategoryView buiten de ScrollView */}
        {isGebruikMode && currentView === 'HOME' && !isBuilding && (
          <SimpleHome
            // Data
            quickResponses={quickResponses}
            categories={categories}
            history={history}
            gallery={gallery}
            userName={profile?.name}
            tileCustomizations={tileCustomizations}
            
            // Original handlers
            onQuickResponse={handlePhrasePress}
            onQuickResponseLongPress={handlePhraseLongPress}
            onPraat={() => setShowSimpleSentenceBuilder(true)}
            onLatenZien={() => setCurrentView('GALLERY')}
            onCategory={(catKey) => { setActiveCategory(catKey); setCurrentView('CATEGORY'); setIsEditingCategory(false); }}
            onCategoryLongPress={(catKey) => {
              // D1-D8: Open tile customization modal
              const customization = tileCustomizations[catKey] || {};
              setSelectedTileForCustomization({
                id: catKey,
                label: catKey,
                type: 'category',
                ...customization,
              });
              setShowTileCustomization(true);
            }}
            onHerhaal={() => setCurrentView('HISTORY')}
            onSettings={() => setShowSettingsMenu(true)}
            onSnel={(type) => {
              // Handle different quick access types from FAB
              if (type === 'nood') {
                setShowEmergency(true);
              } else if (type === 'arts') {
                setShowMedicalScreen(true);
              } else if (type === 'toon') {
                // B3: Navigate to AboutMeScreen with profile info
                setCurrentView('ABOUT_ME');
              } else {
                // Default: open quick access modal
                setShowQuickAccess(true);
              }
            }}
            
            // Photo handlers
            onPhotoPress={handlePhotoShow}
            onPhotoLongPress={handlePhotoLongPress}
            
            // History handlers
            onHistoryItemPress={(item) => handlePhrasePress(item.text)}
            onHistoryItemLongPress={(item) => handleHistoryLongPress(item)}
            
            // Context - original props
            activeLocation={activeLocationObject}
            activePerson={activePersonObject}
            onLocationPress={() => setShowContextModal(true)}
            onPersonPress={() => setShowPartnerModal(true)}
            
            // B2: Navigate to FilterScreen instead of modal
            onOpenFilter={() => setCurrentView('FILTER')}
            
            // Context - new props for FilterModal (kept for backwards compat)
            locations={contexts}
            persons={activePartners}
            onLocationSelect={(loc) => {
              setCurrentContext(loc?.id || 'geen');
            }}
            onPersonSelect={(person) => {
              setCurrentPartner(person?.id || 'geen');
            }}
          />
        )}

        {isGebruikMode && currentView === 'CATEGORY' && !isBuilding && (
          <SimpleCategoryView
            categoryName={activeCategory}
            phrases={categories[activeCategory]?.items || []}
            phraseContext={phraseContext}
            photos={gallery.filter(p => p.category === activeCategory)}
            onBack={() => setCurrentView('HOME')}
            onPhrasePress={handlePhrasePress}
            onPhraseLongPress={(text, index) => handlePhraseLongPress(text, index, activeCategory)}
            onPhotoPress={handlePhotoShow}
            onPhotoLongPress={handlePhotoLongPress}
            onAddPhoto={() => { setManagePhotosCategory(activeCategory); setShowManagePhotos(true); }}
            onAddPhrase={() => { setActiveCategory(activeCategory); setBuilderInitialTopic(null); setShowSimpleSentenceBuilder(true); }}
            activeLocation={activeLocationObject}
            activePerson={activePersonObject}
            onLocationPress={() => setShowContextModal(true)}
            onPersonPress={() => setShowPartnerModal(true)}
          />
        )}

        {/* B2: FilterScreen - full-screen filter with tabs and back button */}
        {isGebruikMode && currentView === 'FILTER' && !isBuilding && (
          <FilterScreen
            onBack={() => setCurrentView('HOME')}
            locations={contexts}
            persons={activePartners}
            activeLocation={activeLocationObject}
            activePerson={activePersonObject}
            onLocationSelect={(loc) => {
              setCurrentContext(loc?.id || 'geen');
            }}
            onPersonSelect={(person) => {
              setCurrentPartner(person?.id || 'geen');
            }}
          />
        )}

        {/* B3: AboutMeScreen - shows "Over mij" info + personal explanation texts */}
        {isGebruikMode && currentView === 'ABOUT_ME' && !isBuilding && (
          <AboutMeScreen
            onBack={() => setCurrentView('HOME')}
            profile={profile}
            onSpeak={handleSpeak}
            onUpdateProfile={(updatedProfile) => setProfile(updatedProfile)}
            onOpenMedical={() => setShowMedicalScreen(true)}
          />
        )}

        {currentView !== 'GALLERY' && !(isGebruikMode && (currentView === 'HOME' || currentView === 'CATEGORY' || currentView === 'FILTER' || currentView === 'ABOUT_ME')) && (
          <ScrollView contentContainerStyle={[styles.scrollContent, {paddingBottom: 100}]} showsVerticalScrollIndicator={false}>
            {currentView === 'BASIC_SETUP' && <BasicSetupFlow onBack={handleBackFromSettings} initialData={profile} onSave={(d) => { setProfile(d); handleBackFromSettings(); }} onTriggerPopup={triggerPopup} />}
            {currentView === 'CUSTOM_TEXTS' && <CustomTextsFlow onBack={handleBackToProfileMenu} initialData={profile} onSave={(d) => { setProfile(d); handleBackToProfileMenu(); }} onTriggerPopup={triggerPopup} />}
            {currentView === 'EXTENDED_SETUP' && <ExtendedModeSetup profile={profile} onSave={(d) => { setProfile(d); handleBackFromSettings(); }} onClose={handleBackFromSettings} onTriggerPopup={triggerPopup} />}
            {currentView === 'HISTORY' && <HistoryView history={history} onBack={() => setCurrentView('HOME')} onSelect={(item) => { if (isInstantMode) { handleSpeak(item.text); } else { setSelectedHistoryItem(item); } }} onLongPress={(item) => handleHistoryLongPress(item)} onClear={clearHistory} />}
          
          {isBuilding && <SmartSentenceBuilder initialSentence={builderMode === 'ADD_TO_CATEGORY' ? [] : sentence} mode={builderMode} onCancel={() => setIsBuilding(false)} onSave={handleSaveBuilder} />}
          
          {currentView === 'HOME' && !isBuilding && !isGebruikMode && (
                 <>
                   <View style={styles.section}>
                     <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                       <Text style={styles.label}>SNEL REAGEREN</Text>
                       <TouchableOpacity onPress={() => setCurrentView('MANAGE_QUICK')} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 4}}>
                         <Feather name="edit-2" size={14} color={theme.primary} />
                         <Text style={{color: theme.primary, marginLeft: 4, fontSize: 12, fontWeight: '600'}}>Aanpassen</Text>
                       </TouchableOpacity>
                     </View>
                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                       {quickResponses.map((qr, i) => (<TouchableOpacity key={i} style={styles.quickBtn} onPress={() => handlePhrasePress(qr)}><Text style={styles.quickText}>{qr}</Text></TouchableOpacity>))}
                     </ScrollView>
                   </View>
                   <View style={styles.section}>
                     <TouchableOpacity style={styles.galleryBannerLarge} onPress={() => setCurrentView('GALLERY')}>
                       <View style={{flexDirection:'row', alignItems:'center'}}>
                         <View style={styles.galleryIconBadge}><Feather name="image" size={18} color="#FFF"/></View>
                         <Text style={styles.galleryBannerText}>Laten Zien</Text>
                       </View>
                       <Feather name="chevron-right" size={20} color="#FFF" />
                     </TouchableOpacity>
                   </View>
                   <View style={styles.section}><Text style={styles.label}>ONDERWERPEN</Text><View style={styles.catGrid}>{Object.keys(categories).map(catKey => (<TouchableOpacity key={catKey} style={styles.catTile} onPress={() => { setActiveCategory(catKey); setCurrentView('CATEGORY'); setIsEditingCategory(false); }}><Feather name={categories[catKey].icon || 'grid'} size={24} color={theme.primary} /><Text style={styles.catTitle}>{catKey}</Text></TouchableOpacity>))}</View></View>
                 </>
          )}
          
          {currentView === 'CATEGORY' && !isBuilding && !isGebruikMode && (
             <View style={styles.section}>
                   <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
                     <TouchableOpacity onPress={() => setCurrentView('HOME')} style={{flexDirection:'row'}}>
                       <Feather name="arrow-left" size={20} color={theme.textDim}/>
                       <Text style={{color:theme.textDim, marginLeft:10}}>Terug</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                       onPress={() => setIsEditingCategory(!isEditingCategory)} 
                       style={{flexDirection: 'row', alignItems: 'center', backgroundColor: isEditingCategory ? theme.primary : theme.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20}}
                     >
                       <Feather name={isEditingCategory ? "check" : "edit-2"} size={16} color={isEditingCategory ? '#000' : theme.primary} />
                       <Text style={{color: isEditingCategory ? '#000' : theme.primary, fontWeight: '600', fontSize: 14, marginLeft: 6}}>{isEditingCategory ? "Klaar" : "Aanpassen"}</Text>
                     </TouchableOpacity>
                   </View>
                   <Text style={styles.catHeaderBig}>{activeCategory}</Text>
                   <TouchableOpacity style={styles.addPhraseBtn} onPress={() => { setBuilderMode('ADD_TO_CATEGORY'); setIsBuilding(true); }}><Feather name="plus" size={24} color={theme.text} /><Text style={styles.addPhraseText}>Nieuwe zin toevoegen</Text></TouchableOpacity>
                   
                   {/* Foto's in deze categorie */}
                   <View style={{marginBottom: 20}}>
                     <Text style={styles.label}>FOTO'S</Text>
                     {gallery.filter(p => p.category === activeCategory).length > 0 ? (
                       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                         <View style={{flexDirection: 'row', gap: 8}}>
                           {gallery.filter(p => p.category === activeCategory).map((photo) => (
                             <View key={photo.id} style={{position: 'relative'}}>
                               <TouchableOpacity
                                 style={{width: 100, height: 100, borderRadius: 12, overflow: 'hidden', backgroundColor: theme.surface}}
                                 onPress={() => handlePhotoShow(photo)}
                                 onLongPress={() => { setManagePhotosCategory(activeCategory); setShowManagePhotos(true); }}
                               >
                               {photo.uri ? (
                                 <View style={{flex: 1}}>
                                   <Image source={{uri: photo.uri}} style={{width: '100%', height: '100%'}} resizeMode="cover" />
                                   {photo.text && (
                                     <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 4}}>
                                       <Text style={{color: '#FFF', fontSize: 10, fontWeight: '600'}} numberOfLines={2}>{photo.text}</Text>
                                     </View>
                                   )}
                                 </View>
                               ) : (
                                 <View style={{flex: 1, backgroundColor: photo.color || theme.surfaceHighlight, justifyContent: 'center', alignItems: 'center'}}>
                                   <Feather name="image" size={24} color={theme.textDim} />
                                 </View>
                               )}
                               </TouchableOpacity>
                               {/* Edit overlay met folder icon */}
                               {isEditingCategory && (
                                 <TouchableOpacity 
                                   style={{position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: 4}}
                                   onPress={() => { setManagePhotosCategory(activeCategory); setShowManagePhotos(true); }}
                                 >
                                   <Feather name="settings" size={16} color="#FFF" />
                                 </TouchableOpacity>
                               )}
                             </View>
                           ))}
                         </View>
                       </ScrollView>
                     ) : (
                       <Text style={{color: theme.textDim, fontStyle: 'italic', marginTop: 8}}>Nog geen foto's in deze categorie</Text>
                     )}
                   </View>

                   {/* Zinnen sectie */}
                   <Text style={styles.label}>ZINNEN</Text>
                   
                   {!isEditingCategory && (gallery.filter(p => p.category === activeCategory).length > 0 || categories[activeCategory].items.length > 0) && (
                     <Text style={{color: theme.textDim, fontSize: 12, fontStyle: 'italic', marginBottom: 12}}>
                       Tik op "Aanpassen" rechtsboven om te bewerken
                     </Text>
                   )}

                   <View style={styles.wordList}>{categories[activeCategory].items.map((item, i) => (<View key={i} style={styles.phraseRow}><TouchableOpacity style={{flex:1}} onPress={() => handlePhrasePress(item)}><Text style={styles.phraseText}>{item}</Text></TouchableOpacity>{isEditingCategory && (<View style={{flexDirection:'row', gap: 12}}><TouchableOpacity onPress={() => setMovePhraseModal({ visible: true, phrase: item, index: i })}><Feather name="folder" size={18} color={theme.accent}/></TouchableOpacity><TouchableOpacity onPress={() => movePhrase(i, -1)}><Feather name="arrow-up" size={18} color={theme.textDim}/></TouchableOpacity><TouchableOpacity onPress={() => movePhrase(i, 1)}><Feather name="arrow-down" size={18} color={theme.textDim}/></TouchableOpacity><TouchableOpacity onPress={() => deletePhraseFromCategory(i)}><Feather name="trash-2" size={18} color={theme.danger}/></TouchableOpacity></View>)}</View>))}</View>
             </View>
            )}
          </ScrollView>
        )}
        
        {/* Gallery screen buiten de ScrollView omdat het zijn eigen scroll heeft */}
        {currentView === 'GALLERY' && !isBuilding && (
          <GalleryScreen 
            gallery={gallery}
            setGallery={setGallery}
            categories={categories}
            onBack={() => setCurrentView('HOME')}
            onSpeak={handleSpeak}
            isInstantMode={isInstantMode}
          />
        )}

        {/* Bottom bar alleen in Expert modus */}
        {!isGebruikMode && (
          sentence.length > 0 && selectedWordIndex === null && !isBuilding && !['BASIC_SETUP', 'CUSTOM_TEXTS', 'EXTENDED_SETUP', 'TOPIC_MANAGER', 'MANAGE_QUICK', 'MANAGE_PEOPLE_LOCATIONS', 'PROFILE_SETUP', 'GALLERY'].includes(currentView) ? (
            <OutputBar onSpeak={() => handleSpeak()} onCopy={handleCopy} onShow={handleShow} onClear={() => setSentence([])} />
          ) : !isBuilding && (currentView === 'HOME' || currentView === 'CATEGORY' || currentView === 'HISTORY') ? (
             <View style={styles.fixedBottomNav}>
                <TouchableOpacity style={[styles.navBtn, styles.navBtnPrimary]} onPress={() => { setBuilderMode('SENTENCE'); setIsBuilding(true); }}>
                    <Feather name="message-circle" size={28} color="#000" />
                    <Text style={styles.navLabelPrimary}>Praten</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentView('HISTORY')}>
                    <View style={styles.navIconContainer}><Feather name="clock" size={24} color={theme.text} /></View>
                    <Text style={styles.navLabel}>Herhaal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn} onPress={() => setIsInstantMode(!isInstantMode)}>
                    <View style={styles.navIconContainer}><Feather name={isInstantMode ? "zap" : "circle"} size={24} color={isInstantMode ? theme.warning : theme.textDim} /></View>
                    <Text style={[styles.navLabel, isInstantMode && {color: theme.warning}]}>Direct</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn} onPress={() => setShowQuickAccess(true)}>
                    <View style={styles.navIconContainer}><Feather name="shield" size={24} color={theme.danger} /></View>
                    <Text style={[styles.navLabel, {color: theme.danger}]}>Snel</Text>
                </TouchableOpacity>
             </View>
          ) : null
        )}
      </View>
    </SafeAreaView>
  );
};

export default function App() { 
  const [onboarded, setOnboarded] = useState(null); // null = loading
  const [appKey, setAppKey] = useState(0); // Key to force re-mount

  // Check onboarding status on mount
  useEffect(() => {
    loadOnboarded().then(value => setOnboarded(value === true));
  }, [appKey]); // Re-check when appKey changes

  // Handle app reset
  const handleReset = () => {
    setOnboarded(null);
    setAppKey(prev => prev + 1); // Force re-mount
  };

  // Wrap everything in ThemeProvider for consistent theming
  return (
    <ThemeProvider>
      <AppContent 
        onboarded={onboarded}
        setOnboarded={setOnboarded}
        appKey={appKey}
        handleReset={handleReset}
      />
    </ThemeProvider>
  );
}

// Separate component that can use useTheme
const AppContent = ({ onboarded, setOnboarded, appKey, handleReset }) => {
  const { theme: currentTheme, isDark } = useTheme();

  // Skip legacy onboarding - nu geïntegreerd in StartupModeModal
  useEffect(() => {
    if (onboarded === false) {
      saveOnboarded(true);
      setOnboarded(true);
    }
  }, [onboarded, setOnboarded]);

  // Show loading while checking onboarding status or transitioning
  if (onboarded === null || onboarded === false) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </SafeAreaView>
    );
  }

  // Profile data is now loaded from AsyncStorage in AppContext
  return (
    <AppProviders key={appKey}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MainAppWrapper onReset={handleReset} />
    </AppProviders>
  );
};

// --- STYLES ---
// Note: These styles use static theme for backwards compatibility.
// Components using these should use inline styles with dynamic theme for colors.
const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 35 : 0 },
  container: { flex: 1 },
  header: { padding: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  statusRowNew: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginTop: 4, borderWidth: 1 },
  statusText: { fontSize: 12, marginLeft: 6, fontWeight: '600' },
  profileBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginTop: 4 },
  profileText: { fontSize: 18, fontWeight: 'bold' },
  phraseRow: { padding: 16, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  phraseText: { fontSize: 18 },
  sentenceContainer: { marginHorizontal: 24, marginBottom: 16, height: 70, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, justifyContent:'space-between' },
  wordBubble: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, height: 46, justifyContent: 'center' },
  wordText: { fontSize: 16, fontWeight: '600' },
  placeholderText: { fontStyle: 'italic', marginLeft: 8 },
  scrollContent: { paddingHorizontal: 24 },
  section: { marginBottom: 32 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 12, letterSpacing: 1.2 },
  
  // GALLERY & GRID FIXES
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catTile: { width: '48%', padding: 20, borderRadius: 20, marginBottom: 16, height: 110, justifyContent: 'space-between' },
  catTitle: { fontSize: 16, fontWeight: 'bold' },
  galleryBannerLarge: { width: '100%', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  galleryIconBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', marginRight: 12 },
  galleryBannerText: { fontSize: 16, fontWeight: 'bold' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  addPhotoCard: { width: '48%', aspectRatio: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderStyle: 'dashed', borderWidth: 2 },
  photoCard: { width: '48%', aspectRatio: 1, borderRadius: 16, padding: 8, marginBottom: 16 },
  photoPlaceholder: { flex: 1, borderRadius: 8, marginBottom: 8 },
  photoCaption: { fontWeight: 'bold', flex: 1, marginRight: 4 },

  listItemRow: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  
  // FIXED BOTTOM NAV (NEW)
  fixedBottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10, paddingHorizontal: 10 },
  navBtn: { alignItems: 'center', flex: 1, paddingVertical: 10 },
  navBtnPrimary: { borderRadius: 16, flex: 1.2, marginHorizontal: 5, paddingVertical: 10, height: 60, justifyContent: 'center', transform: [{translateY: -5}] },
  navIconContainer: { marginBottom: 4 },
  navLabel: { fontSize: 11, fontWeight: '600' },
  navLabelPrimary: { fontSize: 12, fontWeight: 'bold' },

  quickBtn: { paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, marginRight: 10, borderWidth:1 },
  quickText: { fontWeight:'bold', fontSize: 16 },
  addPhraseBtn: { flexDirection:'row', alignItems:'center', padding: 16, borderRadius: 12, marginBottom: 20 },
  addPhraseText: { fontWeight:'bold', marginLeft: 10 },
  catHeaderBig: { fontSize: 28, fontWeight:'bold', marginBottom: 20 },
  
  // Long-press modal styles
  longPressOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  longPressSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  longPressText: { fontSize: 18, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  longPressOption: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12 },
  longPressIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  longPressLabel: { fontSize: 18, fontWeight: '600' },
  longPressCancelBtn: { marginTop: 8, padding: 16, alignItems: 'center' },
  longPressCancelText: { fontSize: 16, fontWeight: '600' },
});
