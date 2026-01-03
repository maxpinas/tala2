// Theme barrel export
// Importeer alles vanuit deze index file

import { colors, spacing, borderRadius, typography, shadows } from './colors';

export { colors, spacing, borderRadius, typography, shadows };

// Legacy: theme object voor backwards compatibility
export const theme = {
  ...colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
