import { useState } from 'react';
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
  const icons: { [key: string]: React.ReactNode } = {
    email: <MdEmail />,
    headset: <MdHeadset />,
  };
  return icons[iconType] || null;
};

const getCategoryIcon = (categoryId: string) => {
  const icons: { [key: string]: React.ReactNode } = {
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

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
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
