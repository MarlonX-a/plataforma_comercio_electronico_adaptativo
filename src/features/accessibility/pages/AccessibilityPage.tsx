import { useState } from 'react';
import {
  defaultAccessibilitySettings,
  loadAccessibilitySettings,
  saveAccessibilitySettings,
} from '../services/accessibilitySettingsService';
import type {
  AccessibilitySettings,
  ColorContrastMode,
  FontSizePreference,
  MotionPreference,
  TextSpacingPreference,
} from '../types/accessibility.types';
import styles from './AccessibilityPage.module.css';

type SettingsOption<Value extends string> = {
  label: string;
  value: Value;
};

const fontSizeOptions: SettingsOption<FontSizePreference>[] = [
  { label: 'Normal', value: 'default' },
  { label: 'Grande', value: 'large' },
  { label: 'Muy grande', value: 'extraLarge' },
];

const contrastOptions: SettingsOption<ColorContrastMode>[] = [
  { label: 'Predeterminado', value: 'default' },
  { label: 'Alto contraste', value: 'highContrast' },
];

const spacingOptions: SettingsOption<TextSpacingPreference>[] = [
  { label: 'Normal', value: 'default' },
  { label: 'Ampliado', value: 'increased' },
];

const motionOptions: SettingsOption<MotionPreference>[] = [
  { label: 'Normal', value: 'default' },
  { label: 'Reducido', value: 'reduced' },
];

export default function AccessibilityPage() {
  const [settings, setSettings] = useState<AccessibilitySettings>(() =>
    loadAccessibilitySettings(),
  );
  const [statusMessage, setStatusMessage] = useState('');

  const updateSettings = (updatedSettings: AccessibilitySettings) => {
    setSettings(updatedSettings);
    saveAccessibilitySettings(updatedSettings);
    setStatusMessage('Preferencias aplicadas.');
  };

  const resetSettings = () => {
    setSettings(defaultAccessibilitySettings);
    saveAccessibilitySettings(defaultAccessibilitySettings);
    setStatusMessage('Preferencias restablecidas.');
  };

  const renderOptions = <Value extends string>(
    groupLabel: string,
    options: SettingsOption<Value>[],
    selectedValue: Value,
    onChange: (value: Value) => void,
  ) => (
    <div className={styles.segmentedControl} role="group" aria-label={groupLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            selectedValue === option.value
              ? `${styles.segmentButton} ${styles.segmentButtonActive}`
              : styles.segmentButton
          }
          aria-pressed={selectedValue === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <section className={styles.page} aria-labelledby="accessibility-title">
      <header className={styles.pageHeader}>
        <p className={styles.kicker}>Preferencias personales</p>
        <h1 id="accessibility-title">Accesibilidad</h1>
        <p>Personaliza la presentación de la tienda según tus necesidades.</p>
      </header>

      <div className={styles.settingsList}>
        <section className={styles.settingRow} aria-labelledby="font-size-title">
          <div>
            <h2 id="font-size-title">Tamaño del texto</h2>
            <p>Aumenta el texto sin perder contenido ni funcionalidad.</p>
          </div>
          {renderOptions(
            'Tamaño del texto',
            fontSizeOptions,
            settings.fontSizePreference,
            (fontSizePreference) => updateSettings({ ...settings, fontSizePreference }),
          )}
        </section>

        <section className={styles.settingRow} aria-labelledby="contrast-title">
          <div>
            <h2 id="contrast-title">Contraste</h2>
            <p>Refuerza la diferencia entre texto, controles y fondo.</p>
          </div>
          {renderOptions(
            'Contraste de la interfaz',
            contrastOptions,
            settings.colorContrastMode,
            (colorContrastMode) => updateSettings({ ...settings, colorContrastMode }),
          )}
        </section>

        <section className={styles.settingRow} aria-labelledby="spacing-title">
          <div>
            <h2 id="spacing-title">Espaciado del texto</h2>
            <p>Amplía el espacio entre letras, palabras y líneas.</p>
          </div>
          {renderOptions(
            'Espaciado del texto',
            spacingOptions,
            settings.textSpacingPreference,
            (textSpacingPreference) => updateSettings({ ...settings, textSpacingPreference }),
          )}
        </section>

        <section className={styles.settingRow} aria-labelledby="motion-title">
          <div>
            <h2 id="motion-title">Movimiento</h2>
            <p>Reduce transiciones y animaciones no esenciales.</p>
          </div>
          {renderOptions(
            'Movimiento de la interfaz',
            motionOptions,
            settings.motionPreference,
            (motionPreference) => updateSettings({ ...settings, motionPreference }),
          )}
        </section>
      </div>

      <div className={styles.actions}>
        <button className={styles.resetButton} type="button" onClick={resetSettings}>
          Restablecer preferencias
        </button>
        <p className={styles.statusMessage} role="status" aria-live="polite">
          {statusMessage}
        </p>
      </div>
    </section>
  );
}
