import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_CONTEXTS, DEFAULT_QUICK } from '../data';
import {
  saveProfile,
  saveExtendedProfile,
  saveContexts,
  saveCustomPartners,
  saveQuickResponses,
  saveGallery,
  saveHistory,
  saveCurrentContext,
  saveCurrentPartner,
  saveAppMode,
  saveModeRemember,
  saveUserPresets,
  loadAllData,
  loadAppMode,
  loadModeRemember,
  loadUserPresets,
} from '../utils/storage';

// Initial profile state
const INITIAL_PROFILE = {
  name: '',
  partnerName: '',
  phone: '',
  email: '',
  address: '',
  partnerPhone: '',
  partnerEmail: '',
  contact2Name: '',
  contact2Phone: '',
  hospitalName: '',
  doctorPhone: '',
  medication: '',
  allergies: '',
  customPartnerText: '',
  customMedicalText: '',
  // Stem instelling
  voiceId: 'claire', // 'claire' of 'xander' (later ook cloud providers)
};

const AppContext = createContext(null);

// Mode constants
export const APP_MODES = {
  EXPERT: 'expert',
  GEBRUIK: 'gebruik',
};

export const AppProvider = ({ children }) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  // App mode state (null = not yet chosen, show startup modal)
  const [appMode, setAppModeState] = useState(null);
  const [modeRemember, setModeRememberState] = useState(false);
  const [userPresets, setUserPresetsState] = useState({});

  // Profile state
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [extendedProfile, setExtendedProfile] = useState({});

  // Dynamic lists
  const [contexts, setContexts] = useState(DEFAULT_CONTEXTS);
  const [customPartners, setCustomPartners] = useState([]);
  const [quickResponses, setQuickResponses] = useState(DEFAULT_QUICK);

  // Current selections
  const [currentContext, setCurrentContext] = useState('thuis');
  const [currentPartner, setCurrentPartner] = useState('partner');

  // History
  const [history, setHistory] = useState([]);

  // Gallery
  const [gallery, setGallery] = useState([]);

  // Load data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const defaults = {
          profile: INITIAL_PROFILE,
          extendedProfile: {},
          contexts: DEFAULT_CONTEXTS,
          customPartners: [],
          quickResponses: DEFAULT_QUICK,
          gallery: [],
          history: [],
          currentContext: 'thuis',
          currentPartner: 'partner',
        };

        // Load mode settings in parallel with other data
        const [data, storedMode, storedModeRemember, storedUserPresets] = await Promise.all([
          loadAllData(defaults),
          loadAppMode(),
          loadModeRemember(),
          loadUserPresets({}),
        ]);

        // Set mode state (null means not yet chosen - will trigger startup modal)
        setAppModeState(storedMode);
        setModeRememberState(storedModeRemember || false);
        setUserPresetsState(storedUserPresets || {});
        
        // Load stored profile data
        if (data.profile) {
          setProfile(data.profile);
        }
        if (data.extendedProfile) setExtendedProfile(data.extendedProfile);
        if (data.contexts) setContexts(data.contexts);
        if (data.customPartners) setCustomPartners(data.customPartners);
        if (data.quickResponses) setQuickResponses(data.quickResponses);
        if (data.gallery) setGallery(data.gallery);
        if (data.history) setHistory(data.history);
        if (data.currentContext) setCurrentContext(data.currentContext);
        if (data.currentPartner) setCurrentPartner(data.currentPartner);

        isInitialized.current = true;
      } catch (error) {
        console.error('Error loading stored data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []); // Run once on mount

  // Auto-save effects (only after initial load)
  useEffect(() => {
    if (isInitialized.current) saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (isInitialized.current) saveExtendedProfile(extendedProfile);
  }, [extendedProfile]);

  useEffect(() => {
    if (isInitialized.current) saveContexts(contexts);
  }, [contexts]);

  useEffect(() => {
    if (isInitialized.current) saveCustomPartners(customPartners);
  }, [customPartners]);

  useEffect(() => {
    if (isInitialized.current) saveQuickResponses(quickResponses);
  }, [quickResponses]);

  useEffect(() => {
    if (isInitialized.current) saveGallery(gallery);
  }, [gallery]);

  useEffect(() => {
    if (isInitialized.current) saveHistory(history);
  }, [history]);

  useEffect(() => {
    if (isInitialized.current) saveCurrentContext(currentContext);
  }, [currentContext]);

  useEffect(() => {
    if (isInitialized.current) saveCurrentPartner(currentPartner);
  }, [currentPartner]);

  // Auto-save mode settings
  useEffect(() => {
    // Only persist the selected app mode when the user chose to remember it
    if (isInitialized.current && appMode !== null && modeRemember === true) saveAppMode(appMode);
  }, [appMode, modeRemember]);

  useEffect(() => {
    if (isInitialized.current) saveModeRemember(modeRemember);
  }, [modeRemember]);

  useEffect(() => {
    if (isInitialized.current) saveUserPresets(userPresets);
  }, [userPresets]);

  // Mode helper functions
  const setAppMode = useCallback((mode) => {
    if (mode === APP_MODES.EXPERT || mode === APP_MODES.GEBRUIK) {
      setAppModeState(mode);
    }
  }, []);

  const setModeRemember = useCallback((remember) => {
    const val = Boolean(remember);
    setModeRememberState(val);
    // If user enabled 'remember' and an appMode is already set, persist it immediately
    if (val && appMode !== null && isInitialized.current) {
      saveAppMode(appMode);
    }
  }, [appMode]);

  const setUserPresets = useCallback((presets) => {
    setUserPresetsState(presets);
  }, []);

  // Helper to check if we're in expert mode
  const isExpertMode = appMode === APP_MODES.EXPERT;
  const isGebruikMode = appMode === APP_MODES.GEBRUIK;

  // Computed: active partners list
  const activePartners = [
    { id: 'niemand', label: 'Niemand', icon: 'user' },
    { id: 'partner', label: profile.partnerName || 'Partner', icon: 'heart' },
    { id: 'dokter', label: 'Arts', icon: 'plus-circle' },
    ...customPartners,
  ];

  // Helper functions
  const addToHistory = (text) => {
    const now = new Date();
    const newEntry = {
      text,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(), // For filtering by period
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const clearHistory = (period = 'all') => {
    if (period === 'all') {
      setHistory([]);
      return;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    let cutoffTime;
    switch (period) {
      case 'today':
        // Remove items from today (after midnight)
        cutoffTime = todayStart;
        break;
      case 'week':
        // Remove items from the last 7 days
        cutoffTime = todayStart - (6 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        // Remove items from the last 30 days
        cutoffTime = todayStart - (29 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = 0;
    }

    setHistory((prev) => prev.filter((item) => {
      // Items without timestamp were added before this feature - keep them unless 'all'
      if (!item.timestamp) return true;
      // Keep items that are OLDER than the cutoff (before the selected period)
      return item.timestamp < cutoffTime;
    }));
  };

  const addContext = (name) => {
    const newId = name.toLowerCase().replace(/\s/g, '_') + Date.now();
    setContexts([...contexts, { id: newId, label: name, icon: 'map-pin' }]);
  };

  const addPartner = (name) => {
    const newId = name.toLowerCase().replace(/\s/g, '_') + Date.now();
    setCustomPartners([...customPartners, { id: newId, label: name, icon: 'user' }]);
  };

  const addQuickResponse = (text) => {
    setQuickResponses([...quickResponses, text]);
  };

  const addPhoto = (caption, category) => {
    const newPhoto = {
      id: Date.now(),
      color: ['#F59E0B', '#10B981', '#3B82F6'][Math.floor(Math.random() * 3)],
      text: caption || 'Kijk eens',
      category,
    };
    setGallery((prev) => [...prev, newPhoto]);
    return newPhoto;
  };

  const updatePhoto = (photoId, caption, category) => {
    setGallery((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, text: caption, category } : p))
    );
  };

  const value = {
    // App Mode
    appMode,
    setAppMode,
    modeRemember,
    setModeRemember,
    userPresets,
    setUserPresets,
    isExpertMode,
    isGebruikMode,

    // Profile
    profile,
    setProfile,
    extendedProfile,
    setExtendedProfile,

    // Lists
    contexts,
    setContexts,
    customPartners,
    setCustomPartners,
    quickResponses,
    setQuickResponses,
    activePartners,

    // Current selections
    currentContext,
    setCurrentContext,
    currentPartner,
    setCurrentPartner,

    // History
    history,
    setHistory,
    addToHistory,
    clearHistory,

    // Gallery
    gallery,
    setGallery,
    addPhoto,
    updatePhoto,

    // Helper functions
    addContext,
    addPartner,
    addQuickResponse,

    // Loading state
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
