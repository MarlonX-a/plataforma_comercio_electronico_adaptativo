import {
  ACCESSIBILITY_STORAGE_KEY,
  cursorColorValues,
  cursorModeValues,
  fontScaleValues,
  themeModeValues,
} from '../types/accessibility.types';
import type {
  AccessibilityPreferenceKey,
  AccessibilityPreferences,
  CursorColor,
  CursorMode,
  FontScaleValue,
  ThemeMode,
} from '../types/accessibility.types';

const bodyPreferenceClasses: Record<
  Exclude<
    AccessibilityPreferenceKey,
    | 'fontScale'
    | 'themeMode'
    | 'cursorMode'
    | 'cursorColor'
    | 'captionsEnabled'
    | 'audioDescriptionsEnabled'
    | 'muteAllMedia'
  >,
  string
> = {
  darkMode: 'dark-mode',
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

export const ACCESSIBILITY_SETTINGS_CHANGED_EVENT = 'accessibility-settings-changed';

export const defaultAccessibilitySettings: AccessibilityPreferences = {
  darkMode: true,
  themeMode: 'system',
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
  cursorMode: 'default',
  cursorColor: 'default',
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

const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && themeModeValues.includes(value as ThemeMode);

const isCursorMode = (value: unknown): value is CursorMode =>
  typeof value === 'string' && cursorModeValues.includes(value as CursorMode);

const isCursorColor = (value: unknown): value is CursorColor =>
  typeof value === 'string' && cursorColorValues.includes(value as CursorColor);

const parseBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

const getLegacyThemeMode = (storedSettings: Record<string, unknown>): ThemeMode => {
  if (isThemeMode(storedSettings.themeMode)) {
    return storedSettings.themeMode;
  }

  if (storedSettings.theme === 'dark' || storedSettings.darkMode === true) {
    return 'dark';
  }

  if (storedSettings.theme === 'light' || storedSettings.darkMode === false) {
    return 'light';
  }

  return defaultAccessibilitySettings.themeMode;
};

export const getSystemThemeMode = (): Exclude<ThemeMode, 'system'> => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getResolvedThemeMode = (themeMode: ThemeMode): Exclude<ThemeMode, 'system'> =>
  themeMode === 'system' ? getSystemThemeMode() : themeMode;

const migrateLegacySettings = (
  storedSettings: Record<string, unknown>,
): Partial<AccessibilityPreferences> => ({
  themeMode: getLegacyThemeMode(storedSettings),
  darkMode: getResolvedThemeMode(getLegacyThemeMode(storedSettings)) === 'dark',
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
  cursorMode:
    isCursorMode(storedSettings.cursorMode)
      ? storedSettings.cursorMode
      : parseBoolean(storedSettings.largeCursor, false)
        ? 'large'
        : defaultAccessibilitySettings.cursorMode,
  cursorColor:
    isCursorColor(storedSettings.cursorColor)
      ? storedSettings.cursorColor
      : defaultAccessibilitySettings.cursorColor,
});

export const parseAccessibilitySettings = (value: unknown): AccessibilityPreferences => {
  if (!value || typeof value !== 'object') {
    return defaultAccessibilitySettings;
  }

  const storedSettings = value as Record<string, unknown>;
  const migratedSettings = migrateLegacySettings(storedSettings);

  return {
    darkMode: migratedSettings.darkMode ?? defaultAccessibilitySettings.darkMode,
    themeMode: migratedSettings.themeMode ?? defaultAccessibilitySettings.themeMode,
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
    cursorMode: migratedSettings.cursorMode ?? defaultAccessibilitySettings.cursorMode,
    cursorColor: migratedSettings.cursorColor ?? defaultAccessibilitySettings.cursorColor,
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

  const resolvedThemeMode = getResolvedThemeMode(settings.themeMode);

  documentRoot.style.fontSize = settings.fontScale === 100 ? '' : `${settings.fontScale}%`;
  documentRoot.dataset.theme = resolvedThemeMode;
  documentRoot.dataset.themePreference = settings.themeMode;
  documentBody.classList.toggle('dark-mode', resolvedThemeMode === 'dark');
  documentRoot.dataset.contrast = settings.highContrast ? 'highContrast' : 'default';
  documentRoot.dataset.fontSize =
    settings.fontScale >= 175 ? 'extraLarge' : settings.fontScale >= 125 ? 'large' : 'default';
  documentRoot.dataset.motion = settings.reduceMotion ? 'reduced' : 'default';
  documentRoot.dataset.textSpacing = settings.textSpacing ? 'increased' : 'default';
  documentRoot.dataset.buttons = settings.largeTargets ? 'large' : 'default';
  documentRoot.dataset.cursor = settings.cursorMode;
  documentRoot.dataset.cursorColor = settings.cursorColor;
  documentRoot.removeAttribute('data-cursor-adaptive');
};

export const saveAccessibilitySettings = (settings: AccessibilityPreferences): void => {
  window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  applyAccessibilitySettings(settings);
  window.dispatchEvent(new CustomEvent(ACCESSIBILITY_SETTINGS_CHANGED_EVENT));
};
