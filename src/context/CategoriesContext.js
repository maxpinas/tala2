import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_CATEGORIES } from '../data';

const CategoriesContext = createContext(null);

export const CategoriesProvider = ({ children }) => {
  // Categories state
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(INITIAL_CATEGORIES)[0]
  );
  const [isEditingCategory, setIsEditingCategory] = useState(null);

  // Helper functions
  const addCategory = useCallback((name, icon = '📁') => {
    const id = name.toLowerCase().replace(/\s/g, '_') + Date.now();
    setCategories((prev) => ({
      ...prev,
      [id]: { name, icon, items: [], custom: true },
    }));
    return id;
  }, []);

  const renameCategory = useCallback((categoryId, newName) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], name: newName },
    }));
  }, []);

  const deleteCategory = useCallback((categoryId) => {
    setCategories((prev) => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
    // Reset active category if deleted
    setActiveCategory((prev) => {
      if (prev === categoryId) {
        return Object.keys(categories)[0];
      }
      return prev;
    });
  }, [categories]);

  const addWordToCategory = useCallback((categoryId, word) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        items: [...prev[categoryId].items, word],
      },
    }));
  }, []);

  const removeWordFromCategory = useCallback((categoryId, wordIndex) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        items: prev[categoryId].items.filter((_, i) => i !== wordIndex),
      },
    }));
  }, []);

  const updateWordInCategory = useCallback((categoryId, wordIndex, newWord) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        items: prev[categoryId].items.map((item, i) =>
          i === wordIndex ? newWord : item
        ),
      },
    }));
  }, []);

  // Get current category data
  const currentCategory = categories[activeCategory];
  const categoryItems = currentCategory?.items || [];

  const value = {
    // Categories
    categories,
    setCategories,
    activeCategory,
    setActiveCategory,
    isEditingCategory,
    setIsEditingCategory,

    // Current category helpers
    currentCategory,
    categoryItems,

    // Helper functions
    addCategory,
    renameCategory,
    deleteCategory,
    addWordToCategory,
    removeWordFromCategory,
    updateWordInCategory,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export default CategoriesContext;
