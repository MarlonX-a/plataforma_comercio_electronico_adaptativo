import uiStyles from '../../../components/ui/UiPrimitives.module.css';
import { useAccessibilityPreferences } from '../hooks/useAccessibilityPreferences';
import styles from './AccessibilityPage.module.css';

export default function AccessibilityPage() {
  const { preferences, updatePreference, increaseFont, decreaseFont, resetPreferences } =
    useAccessibilityPreferences();

  return (
    <section className={styles.page} aria-labelledby="accessibility-title">
      <header className={styles.pageHeader}>
        <p className={styles.kicker}>Preferencias personales</p>
        <h1 id="accessibility-title">Accesibilidad</h1>
        <p>Personaliza la presentación de la tienda según tus necesidades.</p>
      </header>

      <div className={styles.settingsList}>
        <section
          className={`${styles.settingRow} ${uiStyles.sectionCard}`}
          aria-labelledby="font-size-title"
        >
          <div>
            <h2 id="font-size-title">Tamaño del texto</h2>
            <p>Escala actual: {preferences.fontScale}%</p>
          </div>
          <div className={styles.segmentedControl} role="group" aria-label="Tamaño del texto">
            <button className={styles.segmentButton} type="button" onClick={decreaseFont}>
              Reducir
            </button>
            <button className={styles.segmentButton} type="button" onClick={increaseFont}>
              Aumentar
            </button>
          </div>
        </section>

        <section
          className={`${styles.settingRow} ${uiStyles.sectionCard}`}
          aria-labelledby="visual-options-title"
        >
          <div>
            <h2 id="visual-options-title">Opciones visuales</h2>
            <p>Contraste, espaciado, foco y lectura visual.</p>
          </div>
          <div className={styles.segmentedControl} role="group" aria-label="Opciones visuales">
            <button
              className={
                preferences.highContrast
                  ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                  : styles.segmentButton
              }
              type="button"
              aria-pressed={preferences.highContrast}
              onClick={() => updatePreference('highContrast', !preferences.highContrast)}
            >
              Alto contraste
            </button>
            <button
              className={
                preferences.textSpacing
                  ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                  : styles.segmentButton
              }
              type="button"
              aria-pressed={preferences.textSpacing}
              onClick={() => updatePreference('textSpacing', !preferences.textSpacing)}
            >
              Espaciado
            </button>
            <button
              className={
                preferences.enhancedFocus
                  ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                  : styles.segmentButton
              }
              type="button"
              aria-pressed={preferences.enhancedFocus}
              onClick={() => updatePreference('enhancedFocus', !preferences.enhancedFocus)}
            >
              Foco visible
            </button>
          </div>
        </section>

        <section
          className={`${styles.settingRow} ${uiStyles.sectionCard}`}
          aria-labelledby="cognitive-options-title"
        >
          <div>
            <h2 id="cognitive-options-title">Opciones cognitivas y motrices</h2>
            <p>Reduce movimiento, aumenta controles y muestra guías.</p>
          </div>
          <div className={styles.segmentedControl} role="group" aria-label="Opciones cognitivas">
            <button
              className={
                preferences.reduceMotion
                  ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                  : styles.segmentButton
              }
              type="button"
              aria-pressed={preferences.reduceMotion}
              onClick={() => updatePreference('reduceMotion', !preferences.reduceMotion)}
            >
              Pausar animaciones
            </button>
            <button
              className={
                preferences.largeTargets
                  ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                  : styles.segmentButton
              }
              type="button"
              aria-pressed={preferences.largeTargets}
              onClick={() => updatePreference('largeTargets', !preferences.largeTargets)}
            >
              Controles grandes
            </button>
            <button
              className={
                preferences.readingGuide
                  ? `${styles.segmentButton} ${styles.segmentButtonActive}`
                  : styles.segmentButton
              }
              type="button"
              aria-pressed={preferences.readingGuide}
              onClick={() => updatePreference('readingGuide', !preferences.readingGuide)}
            >
              Guía de lectura
            </button>
          </div>
        </section>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.resetButton} ${uiStyles.secondaryButton}`}
          type="button"
          onClick={resetPreferences}
        >
          Restablecer preferencias
        </button>
        <p className={styles.statusMessage} role="status" aria-live="polite">
          Las preferencias se guardan automáticamente en este navegador.
        </p>
      </div>
    </section>
  );
}
