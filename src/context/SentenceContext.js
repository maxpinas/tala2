import React, { createContext, useContext, useState, useCallback } from 'react';

const SentenceContext = createContext(null);

export const SentenceProvider = ({ children }) => {
  // Sentence state
  const [sentence, setSentence] = useState([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [isInstantMode, setIsInstantMode] = useState(false);

  // Builder state
  const [isBuilding, setIsBuilding] = useState(false);
  const [builderMode, setBuilderMode] = useState('word');

  // Helper functions
  const addWord = useCallback((word) => {
    setSentence((prev) => [...prev, word]);
  }, []);

  const removeWord = useCallback((index) => {
    setSentence((prev) => prev.filter((_, i) => i !== index));
    setSelectedWordIndex(null);
  }, []);

  const clearSentence = useCallback(() => {
    setSentence([]);
    setSelectedWordIndex(null);
  }, []);

  const getSentenceText = useCallback(() => {
    return sentence.map((w) => w.text || w).join(' ');
  }, [sentence]);

  const selectWord = useCallback((index) => {
    setSelectedWordIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleWordTap = useCallback(
    (word) => {
      if (isInstantMode) {
        // In instant mode, return the word for immediate use
        return word;
      } else {
        // Normal mode: add to sentence
        addWord(word);
        return null;
      }
    },
    [isInstantMode, addWord]
  );

  const value = {
    // Sentence
    sentence,
    setSentence,
    selectedWordIndex,
    setSelectedWordIndex,
    isInstantMode,
    setIsInstantMode,

    // Builder
    isBuilding,
    setIsBuilding,
    builderMode,
    setBuilderMode,

    // Helpers
    addWord,
    removeWord,
    clearSentence,
    getSentenceText,
    selectWord,
    handleWordTap,
  };

  return (
    <SentenceContext.Provider value={value}>{children}</SentenceContext.Provider>
  );
};

export const useSentence = () => {
  const context = useContext(SentenceContext);
  if (!context) {
    throw new Error('useSentence must be used within a SentenceProvider');
  }
  return context;
};

export default SentenceContext;
