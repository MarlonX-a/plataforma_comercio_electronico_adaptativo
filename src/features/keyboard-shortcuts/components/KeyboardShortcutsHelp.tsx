import { useEffect, useMemo, useRef, useState } from 'react';
import { FaKeyboard } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import styles from './KeyboardShortcutsHelp.module.css';

type KeyboardShortcutAction =
  | 'openHelp'
  | 'goHome'
  | 'goProducts'
  | 'focusProductSearch'
  | 'goCart'
  | 'goOrders'
  | 'openAccessibility'
  | 'openAssistant'
  | 'focusMainContent';

type KeyboardShortcut = {
  id: KeyboardShortcutAction;
  keys: string[];
  title: string;
  description: string;
};

const shortcutHelpEventName = 'open-keyboard-shortcuts-help';
const assistantOpenEventName = 'open-store-assistant-chat';

const shortcuts: KeyboardShortcut[] = [
  {
    id: 'openHelp',
    keys: ['Alt', 'H'],
    title: 'Abrir ayuda de atajos',
    description: 'Muestra esta ventana con todos los comandos disponibles.',
  },
  {
    id: 'goHome',
    keys: ['Alt', '1'],
    title: 'Ir al inicio',
    description: 'Vuelve a la página principal de Comercio Adaptativo.',
  },
  {
    id: 'goProducts',
    keys: ['Alt', '2'],
    title: 'Ir al catálogo',
    description: 'Abre la pantalla de productos.',
  },
  {
    id: 'focusProductSearch',
    keys: ['Alt', 'B'],
    title: 'Buscar productos',
    description: 'Abre el catálogo y coloca el foco en el buscador.',
  },
  {
    id: 'goCart',
    keys: ['Alt', '3'],
    title: 'Ir al carrito',
    description: 'Revisa los productos seleccionados.',
  },
  {
    id: 'goOrders',
    keys: ['Alt', '4'],
    title: 'Ir a pedidos',
    description: 'Abre el historial básico de compras.',
  },
  {
    id: 'openAccessibility',
    keys: ['Alt', 'A'],
    title: 'Abrir accesibilidad',
    description: 'Muestra el menú de preferencias visuales y de lectura.',
  },
  {
    id: 'openAssistant',
    keys: ['Alt', 'J'],
    title: 'Abrir asistente',
    description: 'Abre el chat de ayuda sobre la página.',
  },
  {
    id: 'focusMainContent',
    keys: ['Alt', 'M'],
    title: 'Saltar al contenido',
    description: 'Coloca el foco en el contenido principal de la página actual.',
  },
];

const isEditableTarget = (eventTarget: EventTarget | null): boolean => {
  if (!(eventTarget instanceof HTMLElement)) {
    return false;
  }

  const tagName = eventTarget.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    eventTarget.isContentEditable
  );
};

const focusElementById = (elementId: string): boolean => {
  const targetElement = document.getElementById(elementId);

  if (!(targetElement instanceof HTMLElement)) {
    return false;
  }

  targetElement.focus({ preventScroll: true });
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
};

export default function KeyboardShortcutsHelp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const shouldFocusProductSearchRef = useRef(false);

  const shortcutMap = useMemo(
    () =>
      new Map<KeyboardShortcutAction, KeyboardShortcut>(
        shortcuts.map((shortcut) => [shortcut.id, shortcut]),
      ),
    [],
  );

  useEffect(() => {
    const openHelp = () => {
      setIsOpen(true);
      setStatusMessage('Ventana de atajos abierta.');
    };

    window.addEventListener(shortcutHelpEventName, openHelp);

    return () => {
      window.removeEventListener(shortcutHelpEventName, openHelp);
    };
  }, []);

  useEffect(() => {
    if (!shouldFocusProductSearchRef.current || location.pathname !== '/products') {
      return;
    }

    shouldFocusProductSearchRef.current = false;

    const focusFrame = window.requestAnimationFrame(() => {
      const wasFocused = focusElementById('product-search');
      setStatusMessage(
        wasFocused
          ? 'Buscador de productos enfocado.'
          : 'No se encontró el buscador en esta pantalla.',
      );
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
    };
  }, [location.pathname]);

  useEffect(() => {
    const runShortcut = (shortcutAction: KeyboardShortcutAction) => {
      const shortcut = shortcutMap.get(shortcutAction);

      switch (shortcutAction) {
        case 'openHelp':
          setIsOpen(true);
          setStatusMessage('Ventana de atajos abierta.');
          break;
        case 'goHome':
          navigate('/');
          setStatusMessage(`${shortcut?.title ?? 'Atajo'} activado.`);
          break;
        case 'goProducts':
          navigate('/products');
          setStatusMessage(`${shortcut?.title ?? 'Atajo'} activado.`);
          break;
        case 'focusProductSearch':
          shouldFocusProductSearchRef.current = true;
          navigate('/products');
          if (location.pathname === '/products') {
            window.requestAnimationFrame(() => {
              const wasFocused = focusElementById('product-search');
              setStatusMessage(
                wasFocused
                  ? 'Buscador de productos enfocado.'
                  : 'No se encontró el buscador en esta pantalla.',
              );
            });
          }
          break;
        case 'goCart':
          navigate('/cart');
          setStatusMessage(`${shortcut?.title ?? 'Atajo'} activado.`);
          break;
        case 'goOrders':
          navigate('/orders');
          setStatusMessage(`${shortcut?.title ?? 'Atajo'} activado.`);
          break;
        case 'openAccessibility':
          window.dispatchEvent(new CustomEvent('open-accessibility-menu'));
          setStatusMessage('Menú de accesibilidad abierto.');
          break;
        case 'openAssistant':
          window.dispatchEvent(new CustomEvent(assistantOpenEventName));
          setStatusMessage('Asistente de la tienda abierto.');
          break;
        case 'focusMainContent':
          focusElementById('main-content');
          setStatusMessage('Contenido principal enfocado.');
          break;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isEditing = isEditableTarget(event.target);
      const pressedKey = event.key.toLowerCase();

      if (event.altKey && pressedKey === 'h') {
        event.preventDefault();
        runShortcut('openHelp');
        return;
      }

      if (event.key === 'F1') {
        event.preventDefault();
        runShortcut('openHelp');
        return;
      }

      if (isEditing || !event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const shortcutActionByKey: Record<string, KeyboardShortcutAction | undefined> = {
        '1': 'goHome',
        '2': 'goProducts',
        '3': 'goCart',
        '4': 'goOrders',
        a: 'openAccessibility',
        b: 'focusProductSearch',
        j: 'openAssistant',
        m: 'focusMainContent',
      };

      const shortcutAction = shortcutActionByKey[pressedKey];

      if (!shortcutAction) {
        return;
      }

      event.preventDefault();
      runShortcut(shortcutAction);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location.pathname, navigate, shortcutMap]);

  return (
    <>
      <div className={styles.floatingWrapper}>
        <button
          type="button"
          className={styles.trigger}
          aria-haspopup="dialog"
          aria-controls="keyboard-shortcuts-help"
          aria-expanded={isOpen}
          aria-label="Abrir ayuda de atajos de teclado"
          title="Atajos de teclado"
          onClick={() => {
            setIsOpen(true);
            setStatusMessage('Ventana de atajos abierta.');
          }}
        >
          <FaKeyboard aria-hidden="true" />
          <span className={styles.triggerText}>Atajos</span>
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Atajos de teclado"
        description="Usa estos comandos para navegar más rápido por Comercio Adaptativo."
        closeLabel="Cerrar ayuda de atajos"
        footer={
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        }
      >
        <p className={styles.helpIntro}>
          Los atajos funcionan desde cualquier página. Cuando estés escribiendo en un formulario,
          solo se mantiene activo <strong>Alt + H</strong> o <strong>F1</strong> para abrir esta ayuda.
        </p>

        <div id="keyboard-shortcuts-help" className={styles.shortcutList}>
          {shortcuts.map((shortcut) => (
            <article key={shortcut.id} className={styles.shortcutItem}>
              <div className={styles.shortcutKeys} aria-label={`Atajo ${shortcut.keys.join(' más ')}`}>
                {shortcut.keys.map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </div>
              <div className={styles.shortcutInfo}>
                <strong>{shortcut.title}</strong>
                <span>{shortcut.description}</span>
              </div>
            </article>
          ))}
          <article className={styles.shortcutItem}>
            <div className={styles.shortcutKeys} aria-label="Atajo F1">
              <kbd>F1</kbd>
            </div>
            <div className={styles.shortcutInfo}>
              <strong>Abrir esta ayuda</strong>
              <span>Alternativa rápida si prefieres una sola tecla.</span>
            </div>
          </article>
        </div>

        <p className={styles.status} role="status" aria-live="polite">
          {statusMessage}
        </p>
      </Modal>
    </>
  );
}
