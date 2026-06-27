import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  FaArrowPointer,
  FaBullseye,
  FaCat,
  FaCode,
  FaComputerMouse,
  FaDisplay,
  FaClosedCaptioning,
  FaEye,
  FaFileLines,
  FaKeyboard,
  FaLocationCrosshairs,
  FaPalette,
  FaRobot,
  FaMinus,
  FaMoon,
  FaPause,
  FaPlus,
  FaRotateLeft,
  FaSun,
  FaUniversalAccess,
  FaVolumeXmark,
  FaXmark,
} from 'react-icons/fa6';
import { GiPointySword } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useAccessibilityPreferences } from '../hooks/useAccessibilityPreferences';
import { detectMediaElements } from '../utils/mediaAccessibility';
import type { MediaDetectionResult } from '../utils/mediaAccessibility';
import type { CursorColor, CursorMode, ThemeMode } from '../types/accessibility.types';
import styles from './AccessibilityFloatingMenu.module.css';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const emptyMediaDetection: MediaDetectionResult = {
  mediaCount: 0,
  videoCount: 0,
  audioCount: 0,
  captionsTrackCount: 0,
  descriptionTrackCount: 0,
  transcriptCount: 0,
};

type PreferenceSwitchProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
};

function PreferenceSwitch({
  id,
  label,
  description,
  checked,
  onChange,
  icon,
}: PreferenceSwitchProps) {
  return (
    <label className={styles.switchRow} htmlFor={id}>
      <span className={styles.switchIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.switchText}>
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.switchTrack} aria-hidden="true">
        <span />
      </span>
    </label>
  );
}

type ThemeModeOption = {
  value: ThemeMode;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const themeModeOptions: ThemeModeOption[] = [
  {
    value: 'system',
    label: 'Sistema',
    description: 'Usa el modo claro u oscuro de tu dispositivo.',
    icon: <FaDisplay />,
  },
  {
    value: 'light',
    label: 'Claro',
    description: 'Activa la version clara con blancos y lilas suaves.',
    icon: <FaSun />,
  },
  {
    value: 'dark',
    label: 'Oscuro',
    description: 'Mantiene el estilo oscuro para reducir brillo.',
    icon: <FaMoon />,
  },
];

type ThemeModeSelectorProps = {
  selectedThemeMode: ThemeMode;
  onChange: (themeMode: ThemeMode) => void;
};

function ThemeModeSelector({ selectedThemeMode, onChange }: ThemeModeSelectorProps) {
  const descriptionId = useId();

  return (
    <fieldset className={styles.themeFieldset} aria-describedby={descriptionId}>
      <legend>
        <FaMoon aria-hidden="true" />
        Tema de color
      </legend>
      <p id={descriptionId}>Elige el tema de la tienda o deja que siga la configuracion del sistema.</p>
      <div className={styles.themeOptions}>
        {themeModeOptions.map((option) => {
          const inputId = `theme-mode-${option.value}`;

          return (
            <label
              key={option.value}
              className={styles.themeOption}
              data-selected={selectedThemeMode === option.value}
              htmlFor={inputId}
            >
              <input
                id={inputId}
                type="radio"
                name="theme-mode"
                value={option.value}
                checked={selectedThemeMode === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className={styles.themeOptionIcon} aria-hidden="true">
                {option.icon}
              </span>
              <span className={styles.themeOptionText}>
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
type CursorOption = {
  value: CursorMode;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const cursorOptions: CursorOption[] = [
  {
    value: 'default',
    label: 'Normal',
    description: 'Usa el puntero habitual del sistema.',
    icon: <FaArrowPointer />,
  },
  {
    value: 'large',
    label: 'Grande',
    description: 'Aumenta la flecha para encontrarla con menos esfuerzo.',
    icon: <FaComputerMouse />,
  },
  {
    value: 'contrast',
    label: 'Alto contraste',
    description: 'Usa un puntero amarillo con borde oscuro.',
    icon: <FaBullseye />,
  },
  {
    value: 'precision',
    label: 'Precision',
    description: 'Muestra una cruz fina para ubicar mejor el punto de clic.',
    icon: <FaLocationCrosshairs />,
  },
  {
    value: 'cat',
    label: 'Gatito',
    description: 'Un cursor jugueton con orejitas para hacerlo mas divertido.',
    icon: <FaCat />,
  },
  {
    value: 'sword',
    label: 'Espada',
    description: 'Una espada pixelada para navegar en modo aventura.',
    icon: <GiPointySword />,
  },
  {
    value: 'ai',
    label: 'IA',
    description: 'Un simbolo inspirado en asistentes inteligentes.',
    icon: <FaRobot />,
  },
  {
    value: 'editor',
    label: 'Cursor editor',
    description: 'Un puntero futurista inspirado en editores de codigo.',
    icon: <FaCode />,
  },
];

type CursorModeSelectorProps = {
  selectedCursorMode: CursorMode;
  onChange: (cursorMode: CursorMode) => void;
};

function CursorModeSelector({ selectedCursorMode, onChange }: CursorModeSelectorProps) {
  const descriptionId = useId();

  return (
    <fieldset className={styles.cursorFieldset} aria-describedby={descriptionId}>
      <legend>
        <FaComputerMouse aria-hidden="true" />
        Tipo de puntero
      </legend>
      <p id={descriptionId}>Elige un cursor util o divertido para seguirlo mejor en pantalla.</p>
      <div className={styles.cursorOptions}>
        {cursorOptions.map((option) => {
          const inputId = `cursor-mode-${option.value}`;

          return (
            <label
              key={option.value}
              className={styles.cursorOption}
              data-selected={selectedCursorMode === option.value}
              htmlFor={inputId}
            >
              <input
                id={inputId}
                type="radio"
                name="cursor-mode"
                value={option.value}
                checked={selectedCursorMode === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className={styles.cursorOptionIcon} aria-hidden="true">
                {option.icon}
              </span>
              <span className={styles.cursorOptionText}>
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type CursorColorOption = {
  value: CursorColor;
  label: string;
  swatch: string;
};

const cursorColorOptions: CursorColorOption[] = [
  { value: 'default', label: 'Sistema', swatch: 'linear-gradient(135deg, #ffffff, #111827)' },
  { value: 'cyan', label: 'Cian', swatch: '#00d9ff' },
  { value: 'purple', label: 'Lila', swatch: '#a78bfa' },
  { value: 'yellow', label: 'Amarillo', swatch: '#fde047' },
  { value: 'green', label: 'Verde', swatch: '#34d399' },
  { value: 'pink', label: 'Rosa', swatch: '#f472b6' },
  { value: 'white', label: 'Blanco', swatch: '#ffffff' },
];

type CursorColorPaletteProps = {
  selectedCursorColor: CursorColor;
  onChange: (cursorColor: CursorColor) => void;
};

function CursorColorPalette({ selectedCursorColor, onChange }: CursorColorPaletteProps) {
  const descriptionId = useId();

  return (
    <fieldset className={styles.cursorPaletteFieldset} aria-describedby={descriptionId}>
      <legend>
        <FaPalette aria-hidden="true" />
        Paleta del puntero
      </legend>
      <p id={descriptionId}>Cambia solo el color. El tamano y la forma se ajustan en Tipo de puntero.</p>
      <div className={styles.cursorPalette}>
        {cursorColorOptions.map((option) => {
          const inputId = `cursor-color-${option.value}`;

          return (
            <label
              key={option.value}
              className={styles.cursorColorOption}
              data-selected={selectedCursorColor === option.value}
              htmlFor={inputId}
              title={option.label}
            >
              <input
                id={inputId}
                type="radio"
                name="cursor-color"
                value={option.value}
                checked={selectedCursorColor === option.value}
                onChange={() => onChange(option.value)}
              />
              <span
                className={styles.cursorColorSwatch}
                style={{ background: option.swatch }}
                aria-hidden="true"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function AccessibilityFloatingMenu() {
  const titleId = useId();
  const descriptionId = useId();
  const {
    preferences,
    updatePreference,
    increaseFont,
    decreaseFont,
    resetPreferences,
    resetCursorPreferences,
  } = useAccessibilityPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mediaDetection, setMediaDetection] =
    useState<MediaDetectionResult>(emptyMediaDetection);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    setMediaDetection(detectMediaElements());
    setIsOpen(true);
    setStatusMessage('Menú de accesibilidad abierto.');
  }, []);

  useEffect(() => {
    window.addEventListener('open-accessibility-menu', openMenu);

    return () => {
      window.removeEventListener('open-accessibility-menu', openMenu);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusableElement =
        panelRef.current?.querySelector<HTMLElement>(focusableSelector);
      (firstFocusableElement ?? panelRef.current)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!preferences.readingGuide) {
      return;
    }

    const updateReadingGuidePosition = (clientY: number) => {
      document.body.style.setProperty('--reading-guide-y', `${clientY}px`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateReadingGuidePosition(event.clientY);
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const targetRect = event.target.getBoundingClientRect();
      updateReadingGuidePosition(targetRect.top + targetRect.height / 2);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('focusin', handleFocusIn);
      document.body.style.removeProperty('--reading-guide-y');
    };
  }, [preferences.readingGuide]);


  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const resetAllPreferences = () => {
    resetPreferences();
    setStatusMessage('Preferencias de accesibilidad restablecidas.');
  };

  const resetCursorSettings = () => {
    resetCursorPreferences();
    setStatusMessage('Opciones del cursor restablecidas.');
  };

  const skipToContent = () => {
    document.getElementById('main-content')?.focus({ preventScroll: true });
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  const openKeyboardShortcuts = () => {
    window.dispatchEvent(new CustomEvent('open-keyboard-shortcuts-help'));
    setStatusMessage('Guía de atajos de teclado abierta.');
  };

  const mediaWasDetected = mediaDetection.mediaCount > 0;

  return (
    <div className={styles.floatingWrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.floatingButton}
        aria-label="Abrir menú de accesibilidad"
        aria-controls="accessibility-floating-panel"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }

          openMenu();
        }}
      >
        <FaUniversalAccess aria-hidden="true" />
      </button>

      {isOpen ? (
        <section
          ref={panelRef}
          id="accessibility-floating-panel"
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
        >
          <header className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>WCAG 2.2 A/AA</p>
              <h2 id={titleId}>Menú de accesibilidad</h2>
              <p id={descriptionId}>Opciones visuales, auditivas, motrices y cognitivas.</p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Cerrar menú de accesibilidad"
              onClick={closeMenu}
            >
              <FaXmark aria-hidden="true" />
            </button>
          </header>

          <div className={styles.settingsContent}>
            <section className={styles.category} aria-labelledby="visual-accessibility-title">
              <h3 id="visual-accessibility-title">Accesibilidad visual</h3>
              <ThemeModeSelector
                selectedThemeMode={preferences.themeMode}
                onChange={(themeMode) => updatePreference('themeMode', themeMode)}
              />
              <PreferenceSwitch
                id="no-color-reliance"
                label="Modo sin dependencia de color"
                description="Añade subrayados, bordes y patrones para reforzar estados."
                checked={preferences.noColorReliance}
                onChange={(checked) => updatePreference('noColorReliance', checked)}
                icon={<FaEye />}
              />
              <PreferenceSwitch
                id="high-contrast"
                label="Alto contraste"
                description="Refuerza texto, enlaces, botones e inputs."
                checked={preferences.highContrast}
                onChange={(checked) => updatePreference('highContrast', checked)}
                icon={<FaEye />}
              />
              <div className={styles.fontControls} role="group" aria-label="Escala del texto">
                <button type="button" onClick={decreaseFont} aria-label="Reducir texto">
                  <FaMinus aria-hidden="true" />
                  Reducir texto
                </button>
                <strong aria-live="polite">Texto: {preferences.fontScale}%</strong>
                <button type="button" onClick={increaseFont} aria-label="Aumentar texto">
                  <FaPlus aria-hidden="true" />
                  Aumentar texto
                </button>
              </div>
              <PreferenceSwitch
                id="text-spacing"
                label="Espaciado de texto"
                description="Aumenta espacio entre letras, palabras y líneas."
                checked={preferences.textSpacing}
                onChange={(checked) => updatePreference('textSpacing', checked)}
              />
              <PreferenceSwitch
                id="dyslexia-friendly"
                label="Fuente amigable para dislexia"
                description="Usa una pila tipográfica clara sin descargar fuentes externas."
                checked={preferences.dyslexiaFriendly}
                onChange={(checked) => updatePreference('dyslexiaFriendly', checked)}
              />
              <PreferenceSwitch
                id="hide-decorative-images"
                label="Ocultar imágenes decorativas"
                description="Oculta solo imágenes marcadas como decorativas."
                checked={preferences.hideDecorativeImages}
                onChange={(checked) => updatePreference('hideDecorativeImages', checked)}
              />
            </section>

            <section className={styles.category} aria-labelledby="audio-accessibility-title">
              <h3 id="audio-accessibility-title">Accesibilidad auditiva</h3>
              {mediaWasDetected ? (
                <>
                  <p className={styles.mediaStatus} role="status">
                    Medios detectados: {mediaDetection.videoCount} video(s),{' '}
                    {mediaDetection.audioCount} audio(s), {mediaDetection.captionsTrackCount}{' '}
                    pista(s) de subtítulos, {mediaDetection.descriptionTrackCount}{' '}
                    audiodescripción(es).
                  </p>
                  <PreferenceSwitch
                    id="show-transcripts"
                    label="Mostrar transcripciones"
                    description={`${mediaDetection.transcriptCount} bloque(s) de transcripción detectado(s).`}
                    checked={preferences.showTranscripts}
                    onChange={(checked) => updatePreference('showTranscripts', checked)}
                    icon={<FaFileLines />}
                  />
                  <PreferenceSwitch
                    id="captions-enabled"
                    label="Activar subtítulos"
                    description="Activa pistas captions o subtitles cuando existan."
                    checked={preferences.captionsEnabled}
                    onChange={(checked) => updatePreference('captionsEnabled', checked)}
                    icon={<FaClosedCaptioning />}
                  />
                  <PreferenceSwitch
                    id="audio-descriptions"
                    label="Activar audiodescripción"
                    description="Activa pistas kind=descriptions si están disponibles."
                    checked={preferences.audioDescriptionsEnabled}
                    onChange={(checked) => updatePreference('audioDescriptionsEnabled', checked)}
                    icon={<FaUniversalAccess />}
                  />
                  <PreferenceSwitch
                    id="mute-all-media"
                    label="Silenciar todo"
                    description="Silencia video y audio; también pausa audios."
                    checked={preferences.muteAllMedia}
                    onChange={(checked) => updatePreference('muteAllMedia', checked)}
                    icon={<FaVolumeXmark />}
                  />
                </>
              ) : (
                <p className={styles.emptyMedia}>
                  No se detectaron audios o videos en esta página.
                </p>
              )}
            </section>

            <section className={styles.category} aria-labelledby="motor-accessibility-title">
              <h3 id="motor-accessibility-title">Accesibilidad motriz</h3>
              <PreferenceSwitch
                id="enhanced-focus"
                label="Foco visible mejorado"
                description="Aumenta el contorno de foco para teclado."
                checked={preferences.enhancedFocus}
                onChange={(checked) => updatePreference('enhancedFocus', checked)}
                icon={<FaKeyboard />}
              />
              <PreferenceSwitch
                id="large-targets"
                label="Controles grandes"
                description="Aumenta áreas táctiles a un mínimo de 44x44px."
                checked={preferences.largeTargets}
                onChange={(checked) => updatePreference('largeTargets', checked)}
              />
              <CursorModeSelector
                selectedCursorMode={preferences.cursorMode}
                onChange={(cursorMode) => updatePreference('cursorMode', cursorMode)}
              />
              <CursorColorPalette
                selectedCursorColor={preferences.cursorColor}
                onChange={(cursorColor) => updatePreference('cursorColor', cursorColor)}
              />
              <button type="button" className={styles.actionButton} onClick={resetCursorSettings}>
                <FaRotateLeft aria-hidden="true" />
                Restablecer puntero
              </button>
              <button type="button" className={styles.actionButton} onClick={openKeyboardShortcuts}>
                <FaKeyboard aria-hidden="true" />
                Guía de atajos de teclado
              </button>
              <p className={styles.keyboardNotice}>
                Este menú se usa con Tab, Enter y Escape. El foco queda dentro del panel mientras
                está abierto.
              </p>
              <button type="button" className={styles.actionButton} onClick={skipToContent}>
                Saltar al contenido
              </button>
            </section>

            <section className={styles.category} aria-labelledby="cognitive-accessibility-title">
              <h3 id="cognitive-accessibility-title">Accesibilidad cognitiva</h3>
              <PreferenceSwitch
                id="reduce-motion"
                label="Pausar animaciones"
                description="Reduce transiciones y animaciones no esenciales."
                checked={preferences.reduceMotion}
                onChange={(checked) => updatePreference('reduceMotion', checked)}
                icon={<FaPause />}
              />
              <PreferenceSwitch
                id="show-hints"
                label="Mostrar instrucciones expandidas"
                description="Muestra textos de ayuda ocultos con la clase field-hint."
                checked={preferences.showHints}
                onChange={(checked) => updatePreference('showHints', checked)}
              />
              <PreferenceSwitch
                id="visible-validation"
                label="Validación visible de formularios"
                description="Refuerza campos inválidos con texto, bordes y patrones."
                checked={preferences.visibleValidation}
                onChange={(checked) => updatePreference('visibleValidation', checked)}
              />
              <PreferenceSwitch
                id="confirmation-mode"
                label="Confirmación antes de acciones críticas"
                description="Solicita confirmación accesible en acciones sensibles integradas."
                checked={preferences.confirmationMode}
                onChange={(checked) => updatePreference('confirmationMode', checked)}
              />
              <PreferenceSwitch
                id="reading-guide"
                label="Guía de lectura"
                description="Muestra una barra visual que sigue el mouse o el foco."
                checked={preferences.readingGuide}
                onChange={(checked) => updatePreference('readingGuide', checked)}
              />
              <Link className={styles.helpLink} to="/help" onClick={closeMenu}>
                Ir a Ayuda / Soporte
              </Link>
            </section>
          </div>

          <footer className={styles.panelFooter}>
            <button type="button" className={styles.resetButton} onClick={resetAllPreferences}>
              <FaRotateLeft aria-hidden="true" />
              Restablecer accesibilidad
            </button>
            <p className={styles.statusMessage} role="status" aria-live="polite">
              {statusMessage}
            </p>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
