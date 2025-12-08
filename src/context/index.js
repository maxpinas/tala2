// Context exports
export { AppProvider, useApp, APP_MODES } from './AppContext';
export { SentenceProvider, useSentence } from './SentenceContext';
export { CategoriesProvider, useCategories } from './CategoriesContext';
export { UIProvider, useUI } from './UIContext';

// Combined provider component for wrapping the app
import React from 'react';
import { AppProvider } from './AppContext';
import { SentenceProvider } from './SentenceContext';
import { CategoriesProvider } from './CategoriesContext';
import { UIProvider } from './UIContext';

export const AppProviders = ({ children }) => {
  return (
    <AppProvider>
      <CategoriesProvider>
        <SentenceProvider>
          <UIProvider>{children}</UIProvider>
        </SentenceProvider>
      </CategoriesProvider>
    </AppProvider>
  );
};
