import { FaClosedCaptioning, FaFileLines, FaUniversalAccess } from 'react-icons/fa6';
import styles from './AccessiblePromoVideo.module.css';

const transcriptParagraphs = [
  'Presentamos Comercio Adaptativo, una plataforma de comercio electrónico accesible.',
  'Permite explorar productos mediante una interfaz moderna e intuitiva.',
  'Incorpora opciones de accesibilidad como alto contraste, tamaños de texto ajustables y otras herramientas que facilitan la navegación.',
  'Sus formularios y procesos de compra siguen principios de accesibilidad web para ofrecer una mejor experiencia a todos los usuarios.',
  'Comercio Adaptativo es una solución enfocada en la inclusión, la usabilidad y la experiencia del usuario.',
] as const;

export default function AccessiblePromoVideo() {
  return (
    <section className={styles.section} aria-labelledby="accessible-video-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Experiencia inclusiva</p>
        <h2 id="accessible-video-title">Conoce Comercio Adaptativo</h2>
        <p id="accessible-video-description">
          Descubre cómo la plataforma combina compras, personalización y accesibilidad en una
          experiencia moderna.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.videoPanel}>
          <div className={styles.videoFrame}>
            <video
              className={styles.video}
              controls
              preload="metadata"
              playsInline
              aria-label="Presentación de la plataforma Comercio Adaptativo"
              aria-describedby="accessible-video-description"
            >
              <source src="/media/comercio-adaptativo.mp4" type="video/mp4" />
              <track
                default
                kind="subtitles"
                src="/media/comercio-adaptativo-subtitulos.vtt"
                srcLang="es"
                label="Español"
              />
              <track
                kind="descriptions"
                src="/media/comercio-adaptativo-audiodescripcion.vtt"
                srcLang="es"
                label="Audiodescripción en español"
              />
              Tu navegador no puede reproducir este video. Puedes consultar la transcripción
              disponible a continuación.
            </video>
          </div>

          <ul className={styles.accessibilityFeatures} aria-label="Recursos del video">
            <li>
              <FaClosedCaptioning aria-hidden="true" />
              Subtítulos en español
            </li>
            <li>
              <FaUniversalAccess aria-hidden="true" />
              Audiodescripción
            </li>
            <li>
              <FaFileLines aria-hidden="true" />
              Transcripción completa
            </li>
          </ul>
        </div>

        <details className={`${styles.transcript} transcripcion`} data-transcript>
          <summary>Leer transcripción del video</summary>
          <div className={styles.transcriptContent}>
            <h3>Transcripción</h3>
            {transcriptParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a href="/media/comercio-adaptativo-transcripcion.txt" download>
              Descargar transcripción en formato TXT
            </a>
          </div>
        </details>
      </div>
    </section>
  );
}
