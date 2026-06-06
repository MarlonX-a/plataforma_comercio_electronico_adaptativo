import type {
  AccessibilitySettings,
  ColorContrastMode,
  FontSizePreference,
  MotionPreference,
  TextSpacingPreference,
} from '../types/accessibility.types';

const accessibilitySettingsStorageKey = 'comercio-adaptativo-accessibility-settings';

export const defaultAccessibilitySettings: AccessibilitySettings = {
  colorContrastMode: 'default',
  fontSizePreference: 'default',
  motionPreference: 'default',
  textSpacingPreference: 'default',
  isKeyboardNavigationEnhanced: true,
};

const isColorContrastMode = (value: unknown): value is ColorContrastMode =>
  value === 'default' || value === 'highContrast';

const isFontSizePreference = (value: unknown): value is FontSizePreference =>
  value === 'default' || value === 'large' || value === 'extraLarge';

const isMotionPreference = (value: unknown): value is MotionPreference =>
  value === 'default' || value === 'reduced';

const isTextSpacingPreference = (value: unknown): value is TextSpacingPreference =>
  value === 'default' || value === 'increased';

const parseAccessibilitySettings = (value: unknown): AccessibilitySettings => {
  if (!value || typeof value !== 'object') {
    return defaultAccessibilitySettings;
  }

  const storedSettings = value as Record<string, unknown>;

  return {
    colorContrastMode: isColorContrastMode(storedSettings.colorContrastMode)
      ? storedSettings.colorContrastMode
      : defaultAccessibilitySettings.colorContrastMode,
    fontSizePreference: isFontSizePreference(storedSettings.fontSizePreference)
      ? storedSettings.fontSizePreference
      : defaultAccessibilitySettings.fontSizePreference,
    motionPreference: isMotionPreference(storedSettings.motionPreference)
      ? storedSettings.motionPreference
      : defaultAccessibilitySettings.motionPreference,
    textSpacingPreference: isTextSpacingPreference(storedSettings.textSpacingPreference)
      ? storedSettings.textSpacingPreference
      : defaultAccessibilitySettings.textSpacingPreference,
    isKeyboardNavigationEnhanced:
      typeof storedSettings.isKeyboardNavigationEnhanced === 'boolean'
        ? storedSettings.isKeyboardNavigationEnhanced
        : defaultAccessibilitySettings.isKeyboardNavigationEnhanced,
  };
};

export const loadAccessibilitySettings = (): AccessibilitySettings => {
  try {
    const storedValue = window.localStorage.getItem(accessibilitySettingsStorageKey);
    return storedValue
      ? parseAccessibilitySettings(JSON.parse(storedValue) as unknown)
      : defaultAccessibilitySettings;
  } catch {
    return defaultAccessibilitySettings;
  }
};

export const applyAccessibilitySettings = (settings: AccessibilitySettings): void => {
  const documentRoot = document.documentElement;

  documentRoot.dataset.contrast = settings.colorContrastMode;
  documentRoot.dataset.fontSize = settings.fontSizePreference;
  documentRoot.dataset.motion = settings.motionPreference;
  documentRoot.dataset.textSpacing = settings.textSpacingPreference;
};

export const saveAccessibilitySettings = (settings: AccessibilitySettings): void => {
  window.localStorage.setItem(accessibilitySettingsStorageKey, JSON.stringify(settings));
  applyAccessibilitySettings(settings);
};
