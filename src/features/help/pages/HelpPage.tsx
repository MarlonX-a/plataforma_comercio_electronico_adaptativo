import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  MdEmail,
  MdHeadset,
  MdExpandMore,
  MdExpandLess,
  MdSearch,
  MdPlayArrow,
  MdShoppingCart,
  MdPerson,
  MdShoppingBag,
  MdPayments,
  MdUndo,
  MdAccessibility,
} from 'react-icons/md';
import { FaClosedCaptioning, FaFileLines, FaUniversalAccess } from 'react-icons/fa6';
import type { FAQ, ContactMethod } from '../types/help.types';
import styles from './HelpPage.module.css';

const faqs: FAQ[] = [
  {
    id: 'q1',
    category: 'getting-started',
    question: '¿Cómo registrarme en la plataforma?',
    answer: 'Haz clic en "Registrarse" en la esquina superior derecha. Completa tu email, crea una contraseña segura y verifica tu cuenta. ¡Listo! Podrás acceder a ofertas personalizadas, guardar tu carrito y rastrear pedidos desde el primer día.',
  },
  {
    id: 'q2',
    category: 'shopping',
    question: '¿Cómo buscar productos?',
    answer: 'Utiliza la barra de búsqueda en la página de productos para escribir lo que buscas. También puedes filtrar por categoría, precio, o usar nuestro sistema recomendador. Prueba búsquedas como "laptops", "accesorios" o especificaciones técnicas.',
  },
  { 
    id: 'q3', 
    category: 'account', 
    question: '¿Puedo editar mi perfil?', 
    answer: 'Claro. Inicia sesión, ve a tu perfil (ícono de usuario), y haz clic en "Editar". Puedes cambiar tu foto, nombre, email y dirección de envío. Los cambios se guardan automáticamente.' 
  },
  {
    id: 'q4',
    category: 'orders',
    question: '¿Cómo consultar el estado de mi pedido?',
    answer: 'Accede a "Mis pedidos" desde el menú principal. Verás todos tus pedidos con su estado actual (procesando, enviado, en camino, entregado). Haz clic en un pedido para ver detalles del envío, número de seguimiento y fecha estimada de entrega.',
  },
  {
    id: 'q5',
    category: 'payment',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjeta de crédito/débito (Visa, MasterCard, American Express), transferencia bancaria directa y pago contra entrega en zonas seleccionadas. Todos los pagos son procesados de forma segura y encriptada.',
  },
  {
    id: 'q6',
    category: 'shipping',
    question: '¿Cuánto tarda la entrega?',
    answer: 'El tiempo varía según tu ubicación. Dentro de la ciudad: 1-2 días hábiles. En otras provincias: 2-5 días hábiles. Verás el tiempo estimado exacto al confirmar tu pedido. Utilizamos transportistas confiables con opción de seguimiento real.',
  },
  {
    id: 'q7',
    category: 'returns',
    question: '¿Cuál es la política de devoluciones?',
    answer: 'Puedes devolver productos en 30 días si están sin usar y en su empaque original. Inicia el proceso desde "Mis pedidos" → "Solicitar devolución". Recibirás instrucciones para enviar el producto. Una vez verificado, reembolsamos tu dinero en 3-5 días hábiles.',
  },
  {
    id: 'q8',
    category: 'accessibility',
    question: '¿Cómo personalizar la accesibilidad?',
    answer: 'Haz clic en el ícono de accesibilidad (♿) en el menú principal. Aquí puedes aumentar/reducir tamaño de texto, activar alto contraste, reducir animaciones, cambiar el espaciado de texto, ampliar botones, y más. Todos los cambios se guardan automáticamente.',
  },
];

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    name: 'Correo Electrónico',
    description: 'Respuesta en 24 horas',
    value: 'soporte@comercioadaptativo.local',
    icon: 'email',
  },
  {
    id: 'support',
    name: 'Soporte en Vivo',
    description: 'Lunes a Viernes, 9:00 - 18:00',
    value: '+1-800-SOPORTE',
    icon: 'headset',
  },
];

const getContactIcon = (iconType: string) => {
  const icons: { [key: string]: ReactNode } = {
    email: <MdEmail />,
    headset: <MdHeadset />,
  };
  return icons[iconType] || null;
};

const getCategoryIcon = (categoryId: string) => {
  const icons: { [key: string]: ReactNode } = {
    'getting-started': <MdPlayArrow />,
    'shopping': <MdShoppingCart />,
    'account': <MdPerson />,
    'orders': <MdShoppingBag />,
    'payment': <MdPayments />,
    'shipping': <MdSearch />,
    'returns': <MdUndo />,
    'accessibility': <MdAccessibility />,
  };
  return icons[categoryId] || null;
};

// Agrupar FAQs por categoría
const faqsByCategory = faqs.reduce(
  (acc, faq) => {
    const cat = faq.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  },
  {} as Record<string, FAQ[]>
);

const categoryLabels: Record<string, string> = {
  'getting-started': 'Comenzar',
  'shopping': 'Compras',
  'account': 'Cuenta',
  'orders': 'Pedidos',
  'payment': 'Pago',
  'shipping': 'Envíos',
  'returns': 'Devoluciones',
  'accessibility': 'Accesibilidad',
};

type TranscriptPayload = {
  title: string;
  paragraphs: string[];
};

const parseTranscriptPayload = (content: string): TranscriptPayload => {
  const normalizedContent = content.replaceAll('\r', '').trim();
  if (!normalizedContent) {
    return { title: 'Transcripción', paragraphs: [] };
  }

  const rawBlocks = normalizedContent.split(/\n\s*\n/);
  const blocks: string[] = [];

  for (const rawBlock of rawBlocks) {
    const lineParts: string[] = [];
    for (const rawLine of rawBlock.split('\n')) {
      const cleanedLine = rawLine.trim();
      if (cleanedLine) {
        lineParts.push(cleanedLine);
      }
    }

    const joinedBlock = lineParts.join(' ').trim();
    if (joinedBlock) {
      blocks.push(joinedBlock);
    }
  }

  if (blocks.length === 0) {
    return { title: 'Transcripción', paragraphs: [] };
  }

  const firstBlock = blocks[0];
  if (firstBlock.toLowerCase().includes('transcripcion')) {
    return {
      title: firstBlock,
      paragraphs: blocks.slice(1),
    };
  }

  return {
    title: 'Transcripción',
    paragraphs: blocks,
  };
};

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatboxTranscriptTitle, setChatboxTranscriptTitle] = useState('Transcripción');
  const [chatboxTranscriptParagraphs, setChatboxTranscriptParagraphs] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadChatboxTranscript = async () => {
      try {
        const response = await fetch('/media/chatbox-cliente-transcripcion.txt', {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const content = await response.text();
        const parsedTranscript = parseTranscriptPayload(content);

        if (!isActive) {
          return;
        }

        setChatboxTranscriptTitle(parsedTranscript.title);
        setChatboxTranscriptParagraphs(parsedTranscript.paragraphs);
      } catch {
        // Si falla la carga, se mantiene el contenido por defecto.
      }
    };

    void loadChatboxTranscript();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  // Filtrar FAQs por búsqueda
  let filteredFAQs = faqs;
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredFAQs = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Centro de Ayuda</h1>
        <p>Encuentra respuestas a tus preguntas frecuentes</p>
      </header>

      <form className={styles.searchBox} onSubmit={handleSearch}>
        <input 
          type="search" 
          placeholder="Busca una pregunta o palabra clave..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar en el Centro de Ayuda"
        />
        <button type="submit" aria-label="Enviar búsqueda">
          <MdSearch aria-hidden="true" />
          <span>Buscar</span>
        </button>
      </form>

      <section className={styles.faqContainer}>
        <h2 className={styles.faqTitle}>Preguntas Frecuentes</h2>

        {searchTerm.trim() && filteredFAQs.length === 0 ? (
          <div className={styles.noResults}>
            <p>No encontramos resultados para "{searchTerm}"</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Intenta buscar con otras palabras
            </p>
          </div>
        ) : (
          <div className={styles.faqContent}>
            {searchTerm.trim() ? (
              // Mostrar resultados de búsqueda sin agrupar
              <ul className={styles.faqList}>
                {filteredFAQs.map((faq) => (
                  <li key={faq.id}>
                    <button
                      className={styles.faqBtn}
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      aria-expanded={expandedFAQ === faq.id}
                    >
                      <span>{faq.question}</span>
                      <span className={styles.icon} aria-hidden="true">
                        {expandedFAQ === faq.id ? <MdExpandLess /> : <MdExpandMore />}
                      </span>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className={styles.faqAnswer}>{faq.answer}</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              // Mostrar FAQs agrupadas por categoría
              <div className={styles.categorizedFAQs}>
                {Object.entries(faqsByCategory).map(([categoryId, categoryFAQs]) => (
                  <div key={categoryId} className={styles.categoryGroup}>
                    <h3 className={styles.categoryTitle}>
                      <span className={styles.categoryIcon} aria-hidden="true">
                        {getCategoryIcon(categoryId)}
                      </span>
                      {categoryLabels[categoryId]}
                    </h3>
                    <ul className={styles.faqList}>
                      {categoryFAQs.map((faq) => (
                        <li key={faq.id}>
                          <button
                            className={styles.faqBtn}
                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                            aria-expanded={expandedFAQ === faq.id}
                          >
                            <span>{faq.question}</span>
                            <span className={styles.icon} aria-hidden="true">
                              {expandedFAQ === faq.id ? <MdExpandLess /> : <MdExpandMore />}
                            </span>
                          </button>
                          {expandedFAQ === faq.id && (
                            <div className={styles.faqAnswer}>{faq.answer}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className={styles.chatboxSection} aria-labelledby="chatbox-help-title">
        <h2 id="chatbox-help-title">Funcionamiento del Asistente Virtual</h2>
        <p>
          El asistente de la tienda te guía durante tu compra con respuestas rápidas sobre productos, carrito,
          pagos, pedidos y accesibilidad.
        </p>

        <ol className={styles.chatboxSteps}>
          <li>
            <strong>Abre el chat:</strong> pulsa el botón flotante de chat en la esquina inferior
            derecha.
          </li>
          <li>
            <strong>Escribe tu duda:</strong> puedes preguntar, por ejemplo, cómo filtrar productos,
            agregar al carrito o rastrear un pedido.
          </li>
          <li>
            <strong>Recibe orientación:</strong> el asistente responde en lenguaje simple y te
            sugiere la ruta dentro de la plataforma.
          </li>
          <li>
            <strong>Si necesitas más ayuda:</strong> usa las opciones de contacto para hablar con
            soporte humano.
          </li>
        </ol>

        <div className={styles.chatboxTips} role="note" aria-label="Recomendaciones de uso del chatbox">
          <p>
            <strong>Recomendación:</strong> no compartas contraseñas, códigos de verificación ni datos
            completos de tarjetas en el chat.
          </p>
        </div>
      </section>

      <section className={styles.chatboxVideoSection} aria-labelledby="chatbox-video-title">
        <h2 id="chatbox-video-title">Video explicativo</h2>

        <div className={styles.chatboxVideoLayout}>
          <div>
            <div className={styles.chatboxVideoFrame}>
              <video
                className={styles.chatboxVideo}
                controls
                preload="metadata"
                aria-label="Video explicativo"
              >
                <source src="/media/chatbox-cliente-explicativo.mp4" type="video/mp4" />
                <track
                  default
                  kind="captions"
                  src="/media/chatbox-cliente-explicativo.vtt"
                  srcLang="es"
                  label="Español (CC)"
                />
                <track
                  kind="descriptions"
                  src="/media/chatbox-cliente-audiodescripcion.vtt"
                  srcLang="es"
                  label="Audiodescripción"
                />
                Tu navegador no soporta video HTML5. Puedes descargar el archivo directamente desde la carpeta media.
              </video>
            </div>

            <ul className={styles.videoResources} aria-label="Recursos del video del chatbox">
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

          <details className={`${styles.chatboxTranscript} transcripcion`} data-transcript>
            <summary>Leer transcripción del video</summary>
            <div className={styles.chatboxTranscriptContent}>
              <h3>{chatboxTranscriptTitle}</h3>
              {chatboxTranscriptParagraphs.length > 0 ? (
                chatboxTranscriptParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>
                  Aún no hay contenido en la transcripción. Puedes actualizar
                  /media/chatbox-cliente-transcripcion.txt para mostrar el texto completo del video.
                </p>
              )}
              <a href="/media/chatbox-cliente-transcripcion.txt" download>
                Descargar transcripción en formato TXT
              </a>
            </div>
          </details>
        </div>
      </section>

      <section className={styles.contactSection}>
        <h2>¿Necesitas más ayuda?</h2>
        <p>Si no encontraste la respuesta, nuestro equipo está listo para ayudarte.</p>

        <div className={styles.contactCards}>
          {contactMethods.map((method) => (
            <div key={method.id} className={styles.contactCard}>
              <span className={styles.contactIcon} aria-hidden="true">
                {getContactIcon(method.icon)}
              </span>
              <h3>{method.name}</h3>
              <p className={styles.description}>{method.description}</p>
              <p className={styles.value}>{method.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
