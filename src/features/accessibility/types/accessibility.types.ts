export const ACCESSIBILITY_STORAGE_KEY = 'comercio-adaptativo-accessibility-preferences';

export const fontScaleValues = [100, 125, 150, 175, 200] as const;

export const minFontScale = 100;
export const maxFontScale = 200;

export type FontScaleValue = (typeof fontScaleValues)[number];

export type AccessibilityPreferences = {
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
