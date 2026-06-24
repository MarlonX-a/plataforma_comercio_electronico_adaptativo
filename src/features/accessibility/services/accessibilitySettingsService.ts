import {
  ACCESSIBILITY_STORAGE_KEY,
  fontScaleValues,
} from '../types/accessibility.types';
import type {
  AccessibilityPreferenceKey,
  AccessibilityPreferences,
  FontScaleValue,
} from '../types/accessibility.types';

const bodyPreferenceClasses: Record<
  Exclude<AccessibilityPreferenceKey, 'fontScale' | 'captionsEnabled' | 'audioDescriptionsEnabled' | 'muteAllMedia'>,
  string
> = {
  noColorReliance: 'no-color-reliance',
  highContrast: 'high-contrast',
  textSpacing: 'text-spacing',
  showTranscripts: 'show-transcripts',
  enhancedFocus: 'enhanced-focus',
  largeTargets: 'large-targets',
  reduceMotion: 'reduce-motion',
  showHints: 'show-hints',
  visibleValidation: 'visible-validation',
  confirmationMode: 'confirmation-mode',
  dyslexiaFriendly: 'dyslexia-friendly',
  readingGuide: 'reading-guide-enabled',
  hideDecorativeImages: 'hide-decorative-images',
};

export const defaultAccessibilitySettings: AccessibilityPreferences = {
  noColorReliance: false,
  highContrast: false,
  fontScale: 100,
  textSpacing: false,
  showTranscripts: false,
  captionsEnabled: false,
  audioDescriptionsEnabled: false,
  muteAllMedia: false,
  enhancedFocus: true,
  largeTargets: false,
  reduceMotion: false,
  showHints: false,
  visibleValidation: false,
  confirmationMode: false,
  dyslexiaFriendly: false,
  readingGuide: false,
  hideDecorativeImages: false,
};

const isFontScaleValue = (value: unknown): value is FontScaleValue =>
  typeof value === 'number' && fontScaleValues.includes(value as FontScaleValue);

const parseBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

const migrateLegacySettings = (storedSettings: Record<string, unknown>): Partial<AccessibilityPreferences> => ({
  highContrast:
    storedSettings.colorContrastMode === 'highContrast'
      ? true
      : parseBoolean(storedSettings.highContrast, defaultAccessibilitySettings.highContrast),
  fontScale:
    storedSettings.fontSizePreference === 'extraLarge'
      ? 175
      : storedSettings.fontSizePreference === 'large'
        ? 150
        : isFontScaleValue(storedSettings.fontScale)
          ? storedSettings.fontScale
          : defaultAccessibilitySettings.fontScale,
  textSpacing:
    storedSettings.textSpacingPreference === 'increased'
      ? true
      : parseBoolean(storedSettings.textSpacing, defaultAccessibilitySettings.textSpacing),
  reduceMotion:
    storedSettings.motionPreference === 'reduced'
      ? true
      : parseBoolean(storedSettings.reduceMotion, defaultAccessibilitySettings.reduceMotion),
  enhancedFocus: parseBoolean(
    storedSettings.isKeyboardNavigationEnhanced,
    parseBoolean(storedSettings.enhancedFocus, defaultAccessibilitySettings.enhancedFocus),
  ),
});

export const parseAccessibilitySettings = (value: unknown): AccessibilityPreferences => {
  if (!value || typeof value !== 'object') {
    return defaultAccessibilitySettings;
  }

  const storedSettings = value as Record<string, unknown>;
  const migratedSettings = migrateLegacySettings(storedSettings);

  return {
    noColorReliance: parseBoolean(
      storedSettings.noColorReliance,
      defaultAccessibilitySettings.noColorReliance,
    ),
    highContrast:
      migratedSettings.highContrast ?? defaultAccessibilitySettings.highContrast,
    fontScale: migratedSettings.fontScale ?? defaultAccessibilitySettings.fontScale,
    textSpacing: migratedSettings.textSpacing ?? defaultAccessibilitySettings.textSpacing,
    showTranscripts: parseBoolean(
      storedSettings.showTranscripts,
      defaultAccessibilitySettings.showTranscripts,
    ),
    captionsEnabled: parseBoolean(
      storedSettings.captionsEnabled,
      defaultAccessibilitySettings.captionsEnabled,
    ),
    audioDescriptionsEnabled: parseBoolean(
      storedSettings.audioDescriptionsEnabled,
      defaultAccessibilitySettings.audioDescriptionsEnabled,
    ),
    muteAllMedia: parseBoolean(
      storedSettings.muteAllMedia,
      defaultAccessibilitySettings.muteAllMedia,
    ),
    enhancedFocus: migratedSettings.enhancedFocus ?? defaultAccessibilitySettings.enhancedFocus,
    largeTargets: parseBoolean(
      storedSettings.largeTargets,
      defaultAccessibilitySettings.largeTargets,
    ),
    reduceMotion: migratedSettings.reduceMotion ?? defaultAccessibilitySettings.reduceMotion,
    showHints: parseBoolean(storedSettings.showHints, defaultAccessibilitySettings.showHints),
    visibleValidation: parseBoolean(
      storedSettings.visibleValidation,
      defaultAccessibilitySettings.visibleValidation,
    ),
    confirmationMode: parseBoolean(
      storedSettings.confirmationMode,
      defaultAccessibilitySettings.confirmationMode,
    ),
    dyslexiaFriendly: parseBoolean(
      storedSettings.dyslexiaFriendly,
      defaultAccessibilitySettings.dyslexiaFriendly,
    ),
    readingGuide: parseBoolean(
      storedSettings.readingGuide,
      defaultAccessibilitySettings.readingGuide,
    ),
    hideDecorativeImages: parseBoolean(
      storedSettings.hideDecorativeImages,
      defaultAccessibilitySettings.hideDecorativeImages,
    ),
  };
};

export const loadAccessibilitySettings = (): AccessibilityPreferences => {
  try {
    const storedValue = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    return storedValue
      ? parseAccessibilitySettings(JSON.parse(storedValue) as unknown)
      : defaultAccessibilitySettings;
  } catch {
    return defaultAccessibilitySettings;
  }
};

export const applyAccessibilitySettings = (settings: AccessibilityPreferences): void => {
  const documentRoot = document.documentElement;
  const documentBody = document.body;

  Object.entries(bodyPreferenceClasses).forEach(([preferenceKey, className]) => {
    const typedPreferenceKey = preferenceKey as keyof typeof bodyPreferenceClasses;
    documentBody.classList.toggle(className, settings[typedPreferenceKey]);
  });

  documentRoot.style.fontSize = settings.fontScale === 100 ? '' : `${settings.fontScale}%`;
  documentRoot.dataset.contrast = settings.highContrast ? 'highContrast' : 'default';
  documentRoot.dataset.fontSize =
    settings.fontScale >= 175 ? 'extraLarge' : settings.fontScale >= 125 ? 'large' : 'default';
  documentRoot.dataset.motion = settings.reduceMotion ? 'reduced' : 'default';
  documentRoot.dataset.textSpacing = settings.textSpacing ? 'increased' : 'default';
  documentRoot.dataset.buttons = settings.largeTargets ? 'large' : 'default';
};

export const saveAccessibilitySettings = (settings: AccessibilityPreferences): void => {
  window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  applyAccessibilitySettings(settings);
};
