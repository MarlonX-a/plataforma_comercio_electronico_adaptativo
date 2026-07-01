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

const mediaSelector = 'video, audio, track, .transcripcion, .transcript, [data-transcript]';

const hasRelevantMediaNode = (addedNode: Node): boolean => {
  if (addedNode instanceof HTMLVideoElement || addedNode instanceof HTMLAudioElement) {
    return true;
  }

  if (!(addedNode instanceof HTMLElement)) {
    return false;
  }

  return addedNode.matches(mediaSelector) || addedNode.querySelector(mediaSelector) !== null;
};

const mutationAddsMediaNodes = (mutations: MutationRecord[]): boolean =>
  mutations.some((mutation) => Array.from(mutation.addedNodes).some(hasRelevantMediaNode));

export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() =>
    loadAccessibilitySettings(),
  );

  useEffect(() => {
    applyAccessibilitySettings(preferences);
    applyMediaPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    const scheduleMediaPreferencesApply = () => {
      globalThis.requestAnimationFrame(() => {
        applyMediaPreferences(preferences);
      });
    };

    const handleMediaMetadataLoaded = (event: Event) => {
      if (
        event.target instanceof HTMLVideoElement ||
        event.target instanceof HTMLAudioElement ||
        event.target instanceof HTMLTrackElement
      ) {
        scheduleMediaPreferencesApply();
      }
    };

    const observer = new MutationObserver((mutations) => {
      if (mutationAddsMediaNodes(mutations)) {
        scheduleMediaPreferencesApply();
      }
    });

    document.addEventListener('loadedmetadata', handleMediaMetadataLoaded, true);
    document.addEventListener('load', handleMediaMetadataLoaded, true);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('loadedmetadata', handleMediaMetadataLoaded, true);
      document.removeEventListener('load', handleMediaMetadataLoaded, true);
      observer.disconnect();
    };
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
