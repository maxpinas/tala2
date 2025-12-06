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
  loadAllData,
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
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

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

        const data = await loadAllData(defaults);
        
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

  // Computed: active partners list
  const activePartners = [
    { id: 'niemand', label: 'Niemand', icon: 'user' },
    { id: 'partner', label: profile.partnerName || 'Partner', icon: 'heart' },
    { id: 'dokter', label: 'Arts', icon: 'plus-circle' },
    ...customPartners,
  ];

  // Helper functions
  const addToHistory = (text) => {
    const newEntry = {
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory((prev) => [newEntry, ...prev]);
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
