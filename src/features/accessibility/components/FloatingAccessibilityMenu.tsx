import { useEffect, useRef, useState } from 'react';
import { FaUndo, FaUniversalAccess } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import uiStyles from '../../../components/ui/UiPrimitives.module.css';
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
import styles from './FloatingAccessibilityMenu.module.css';

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

export default function FloatingAccessibilityMenu() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() =>
    loadAccessibilitySettings(),
  );
  const [statusMessage, setStatusMessage] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

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
    <div ref={wrapperRef} className={styles.floatingWrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.floatingButton}
        aria-label={isOpen ? 'Cerrar menú de accesibilidad' : 'Abrir menú de accesibilidad'}
        aria-controls="floating-accessibility-panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <FaUniversalAccess aria-hidden="true" />
      </button>

      {isOpen ? (
        <section
          ref={panelRef}
          id="floating-accessibility-panel"
          className={`${styles.panel} ${uiStyles.sectionCard}`}
          aria-label="Menú de accesibilidad"
        >
          <header className={styles.panelHeader}>
            <h2>Accesibilidad</h2>
            <p>Ajusta la interfaz sin salir de la página actual.</p>
          </header>

          <div className={styles.settingsList}>
            <section className={styles.settingRow} aria-labelledby="floating-font-size-title">
              <h3 id="floating-font-size-title">Tamaño del texto</h3>
              <p className={styles.settingDescription}>
                Aumenta el texto sin perder contenido ni funcionalidad.
              </p>
              {renderOptions(
                'Tamaño del texto',
                fontSizeOptions,
                settings.fontSizePreference,
                (fontSizePreference) => updateSettings({ ...settings, fontSizePreference }),
              )}
            </section>

            <section className={styles.settingRow} aria-labelledby="floating-contrast-title">
              <h3 id="floating-contrast-title">Contraste</h3>
              <p className={styles.settingDescription}>
                Refuerza la diferencia entre texto, controles y fondo.
              </p>
              {renderOptions(
                'Contraste de la interfaz',
                contrastOptions,
                settings.colorContrastMode,
                (colorContrastMode) => updateSettings({ ...settings, colorContrastMode }),
              )}
            </section>

            <section className={styles.settingRow} aria-labelledby="floating-spacing-title">
              <h3 id="floating-spacing-title">Espaciado</h3>
              <p className={styles.settingDescription}>
                Amplía el espacio entre letras, palabras y líneas.
              </p>
              {renderOptions(
                'Espaciado del texto',
                spacingOptions,
                settings.textSpacingPreference,
                (textSpacingPreference) => updateSettings({ ...settings, textSpacingPreference }),
              )}
            </section>

            <section className={styles.settingRow} aria-labelledby="floating-motion-title">
              <h3 id="floating-motion-title">Movimiento</h3>
              <p className={styles.settingDescription}>
                Reduce transiciones y animaciones no esenciales.
              </p>
              {renderOptions(
                'Movimiento de la interfaz',
                motionOptions,
                settings.motionPreference,
                (motionPreference) => updateSettings({ ...settings, motionPreference }),
              )}
            </section>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.resetButton} ${uiStyles.secondaryButton}`}
              type="button"
              onClick={resetSettings}
            >
              <FaUndo aria-hidden="true" />
              Restablecer
            </button>
            <p className={styles.statusMessage} role="status" aria-live="polite">
              {statusMessage}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}