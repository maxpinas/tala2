import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  // Navigation state
  const [currentView, setCurrentView] = useState('home');

  // Popup state
  const [popup, setPopup] = useState({ visible: false, message: '' });

  // Menu visibility
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  // Modal states
  const [showAddContext, setShowAddContext] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showAddQuick, setShowAddQuick] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPhotoEditModal, setShowPhotoEditModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditWordModal, setShowEditWordModal] = useState(false);
  const [editingWordIndex, setEditingWordIndex] = useState(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);

  // Helper functions
  const showPopup = useCallback((message, duration = 2000) => {
    setPopup({ visible: true, message });
    setTimeout(() => {
      setPopup({ visible: false, message: '' });
    }, duration);
  }, []);

  const hidePopup = useCallback(() => {
    setPopup({ visible: false, message: '' });
  }, []);

  const navigateTo = useCallback((view) => {
    setCurrentView(view);
    // Close any open menus when navigating
    setShowSettingsMenu(false);
    setShowToolsMenu(false);
  }, []);

  const closeAllModals = useCallback(() => {
    setShowAddContext(false);
    setShowAddPartner(false);
    setShowAddQuick(false);
    setShowPhotoModal(false);
    setShowPhotoEditModal(false);
    setShowAddWordModal(false);
    setShowAddCategoryModal(false);
    setShowEditWordModal(false);
    setShowCategorySelector(false);
    setEditingWordIndex(null);
    setEditingPhoto(null);
  }, []);

  const value = {
    // Navigation
    currentView,
    setCurrentView,
    navigateTo,

    // Popup
    popup,
    setPopup,
    showPopup,
    hidePopup,

    // Menus
    showSettingsMenu,
    setShowSettingsMenu,
    showToolsMenu,
    setShowToolsMenu,

    // Modal states
    showAddContext,
    setShowAddContext,
    showAddPartner,
    setShowAddPartner,
    showAddQuick,
    setShowAddQuick,
    showPhotoModal,
    setShowPhotoModal,
    showPhotoEditModal,
    setShowPhotoEditModal,
    showAddWordModal,
    setShowAddWordModal,
    showAddCategoryModal,
    setShowAddCategoryModal,
    showEditWordModal,
    setShowEditWordModal,
    editingWordIndex,
    setEditingWordIndex,
    showCategorySelector,
    setShowCategorySelector,
    selectedPhotoCategory,
    setSelectedPhotoCategory,
    photoCaption,
    setPhotoCaption,
    editingPhoto,
    setEditingPhoto,

    // Helpers
    closeAllModals,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
