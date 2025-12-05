import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CONTEXTS, DEFAULT_QUICK } from '../data';

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

export const AppProvider = ({ children, initialName = '', initialPartner = '' }) => {
  // Profile state
  const [profile, setProfile] = useState({
    ...INITIAL_PROFILE,
    name: initialName,
    partnerName: initialPartner,
  });
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
