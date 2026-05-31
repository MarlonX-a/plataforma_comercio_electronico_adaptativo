export type ColorContrastMode = 'default' | 'highContrast';

export type FontSizePreference = 'default' | 'large' | 'extraLarge';

export type MotionPreference = 'default' | 'reduced';

export type AccessibilitySettings = {
  colorContrastMode: ColorContrastMode;
  fontSizePreference: FontSizePreference;
  motionPreference: MotionPreference;
  isKeyboardNavigationEnhanced: boolean;
};
