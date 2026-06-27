export const ACCESSIBILITY_STORAGE_KEY = 'comercio-adaptativo-accessibility-preferences';

export const fontScaleValues = [100, 125, 150, 175, 200] as const;
export const themeModeValues = ['system', 'light', 'dark'] as const;

export const minFontScale = 100;
export const maxFontScale = 200;

export const cursorModeValues = [
  'default',
  'large',
  'contrast',
  'precision',
  'cat',
  'sword',
  'ai',
  'editor',
] as const;
export const cursorColorValues = ['default', 'cyan', 'purple', 'yellow', 'green', 'pink', 'white'] as const;

export type FontScaleValue = (typeof fontScaleValues)[number];
export type ThemeMode = (typeof themeModeValues)[number];
export type CursorMode = (typeof cursorModeValues)[number];
export type CursorColor = (typeof cursorColorValues)[number];

export type AccessibilityPreferences = {
  darkMode: boolean;
  themeMode: ThemeMode;
  noColorReliance: boolean;
  highContrast: boolean;
  fontScale: FontScaleValue;
  textSpacing: boolean;
  showTranscripts: boolean;
  captionsEnabled: boolean;
  audioDescriptionsEnabled: boolean;
  muteAllMedia: boolean;
  enhancedFocus: boolean;
  largeTargets: boolean;
  cursorMode: CursorMode;
  cursorColor: CursorColor;
  reduceMotion: boolean;
  showHints: boolean;
  visibleValidation: boolean;
  confirmationMode: boolean;
  dyslexiaFriendly: boolean;
  readingGuide: boolean;
  hideDecorativeImages: boolean;
};

export type AccessibilityPreferenceKey = keyof AccessibilityPreferences;

export type AccessibilitySettings = AccessibilityPreferences;
