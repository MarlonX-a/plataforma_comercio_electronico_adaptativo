import { useCallback, useEffect, useState } from 'react';
import {
  applyAccessibilitySettings,
  defaultAccessibilitySettings,
  loadAccessibilitySettings,
  saveAccessibilitySettings,
} from '../services/accessibilitySettingsService';
import { fontScaleValues } from '../types/accessibility.types';
import type {
  AccessibilityPreferenceKey,
  AccessibilityPreferences,
  FontScaleValue,
} from '../types/accessibility.types';
import {
  muteAllMedia,
  toggleAudioDescriptions,
  toggleCaptions,
  toggleTranscripts,
} from '../utils/mediaAccessibility';

const getNextFontScale = (fontScale: FontScaleValue): FontScaleValue => {
  const currentIndex = fontScaleValues.indexOf(fontScale);
  return fontScaleValues[Math.min(currentIndex + 1, fontScaleValues.length - 1)];
};

const getPreviousFontScale = (fontScale: FontScaleValue): FontScaleValue => {
  const currentIndex = fontScaleValues.indexOf(fontScale);
  return fontScaleValues[Math.max(currentIndex - 1, 0)];
};

const applyMediaPreferences = (preferences: AccessibilityPreferences): void => {
  toggleCaptions(preferences.captionsEnabled);
  toggleAudioDescriptions(preferences.audioDescriptionsEnabled);
  toggleTranscripts(preferences.showTranscripts);
  muteAllMedia(preferences.muteAllMedia);
};

export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() =>
    loadAccessibilitySettings(),
  );

  useEffect(() => {
    applyAccessibilitySettings(preferences);
    applyMediaPreferences(preferences);
  }, [preferences]);

  const updatePreferences = useCallback((updatedPreferences: AccessibilityPreferences) => {
    setPreferences(updatedPreferences);
    saveAccessibilitySettings(updatedPreferences);
    applyMediaPreferences(updatedPreferences);
  }, []);

  const updatePreference = useCallback(
    <PreferenceKey extends AccessibilityPreferenceKey>(
      key: PreferenceKey,
      value: AccessibilityPreferences[PreferenceKey],
    ) => {
      updatePreferences({
        ...preferences,
        [key]: value,
      });
    },
    [preferences, updatePreferences],
  );

  const increaseFont = useCallback(() => {
    updatePreference('fontScale', getNextFontScale(preferences.fontScale));
  }, [preferences.fontScale, updatePreference]);

  const decreaseFont = useCallback(() => {
    updatePreference('fontScale', getPreviousFontScale(preferences.fontScale));
  }, [preferences.fontScale, updatePreference]);

  const resetPreferences = useCallback(() => {
    updatePreferences(defaultAccessibilitySettings);
  }, [updatePreferences]);

  const resetCursorPreferences = useCallback(() => {
    updatePreferences({
      ...preferences,
      cursorMode: defaultAccessibilitySettings.cursorMode,
      cursorColor: defaultAccessibilitySettings.cursorColor,
    });
  }, [preferences, updatePreferences]);

  return {
    preferences,
    updatePreference,
    increaseFont,
    decreaseFont,
    resetPreferences,
    resetCursorPreferences,
  };
};
