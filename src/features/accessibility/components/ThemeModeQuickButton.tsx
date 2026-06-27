import { FaDisplay, FaMoon, FaSun } from 'react-icons/fa6';
import { useAccessibilityPreferences } from '../hooks/useAccessibilityPreferences';
import type { ThemeMode } from '../types/accessibility.types';
import styles from './ThemeModeQuickButton.module.css';

type ThemeModeButtonOption = {
  value: ThemeMode;
  label: string;
  icon: React.ReactNode;
};

const themeModeButtonOptions: ThemeModeButtonOption[] = [
  { value: 'system', label: 'Sistema', icon: <FaDisplay /> },
  { value: 'light', label: 'Claro', icon: <FaSun /> },
  { value: 'dark', label: 'Oscuro', icon: <FaMoon /> },
];

const getNextThemeMode = (themeMode: ThemeMode): ThemeMode => {
  const currentIndex = themeModeButtonOptions.findIndex((option) => option.value === themeMode);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeModeButtonOptions.length;

  return themeModeButtonOptions[nextIndex].value;
};

export default function ThemeModeQuickButton() {
  const { preferences, updatePreference } = useAccessibilityPreferences();
  const selectedOption =
    themeModeButtonOptions.find((option) => option.value === preferences.themeMode) ??
    themeModeButtonOptions[0];

  const changeThemeMode = () => {
    updatePreference('themeMode', getNextThemeMode(preferences.themeMode));
  };

  return (
    <button
      type="button"
      className={styles.themeButton}
      aria-label={`Cambiar tema de color. Modo actual: ${selectedOption.label}`}
      title={`Tema: ${selectedOption.label}`}
      onClick={changeThemeMode}
    >
      <span className={styles.icon} aria-hidden="true">
        {selectedOption.icon}
      </span>
      <span className={styles.label}>{selectedOption.label}</span>
    </button>
  );
}
