import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import {
  FaArrowUp,
  FaComments,
  FaRobot,
  FaRotateLeft,
  FaXmark,
} from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { askStoreAssistant, assistantMessageMaxLength } from '../services/assistantService';
import type { AssistantMessage } from '../types/assistant.types';
import styles from './StoreAssistantChat.module.css';

const initialMessages: AssistantMessage[] = [
  {
    id: 'assistant-welcome',
    role: 'assistant',
    content:
      'Hola, soy el asistente de Comercio Adaptativo. Puedo ayudarte con productos, carrito, pedidos, cuenta y accesibilidad.',
  },
];

const suggestedQuestions = [
  '¿Cómo busco un producto?',
  '¿Cómo uso las opciones de accesibilidad?',
  '¿Dónde reviso mis pedidos?',
] as const;

const createMessage = (
  role: AssistantMessage['role'],
  content: string,
): AssistantMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
});

export default function StoreAssistantChat() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [messageDraft, setMessageDraft] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  const resetConversation = () => {
    setMessages(initialMessages);
    setMessageDraft('');
    setStatusMessage('Conversación reiniciada.');
  };

  const sendMessage = async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent || isLoading) {
      return;
    }

    const userMessage = createMessage('user', trimmedContent);
    const conversationHistory = messages.map(({ role, content: messageContent }) => ({
      role,
      content: messageContent,
    }));

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setMessageDraft('');
    setStatusMessage('El asistente está preparando una respuesta.');
    setIsLoading(true);

    const result = await askStoreAssistant({
      message: trimmedContent,
      currentPath: location.pathname,
      history: conversationHistory,
    });

    setIsLoading(false);

    if (!result.isSuccess) {
      setStatusMessage(result.message);
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage('assistant', result.answer),
    ]);
    setStatusMessage(
      result.isFallback
        ? 'Respuesta de ayuda local. La conexión con la IA no está disponible.'
        : 'Respuesta recibida.',
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(messageDraft);
  };

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(messageDraft);
    }
  };

  return (
    <div ref={wrapperRef} className={styles.floatingWrapper}>
      {isOpen ? (
        <section
          id="store-assistant-panel"
          className={styles.panel}
          aria-labelledby="store-assistant-title"
        >
          <header className={styles.header}>
            <div className={styles.identity}>
              <span className={styles.avatar} aria-hidden="true">
                <FaRobot />
              </span>
              <div>
                <h2 id="store-assistant-title">Asistente de la tienda</h2>
                <p>Ayuda sobre Comercio Adaptativo</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                aria-label="Reiniciar conversación"
                title="Reiniciar conversación"
                onClick={resetConversation}
              >
                <FaRotateLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Cerrar asistente"
                title="Cerrar asistente"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className={styles.messages} aria-label="Conversación con el asistente">
            {messages.map((message) => (
              <article
                key={message.id}
                className={message.role === 'user' ? styles.userMessage : styles.assistantMessage}
              >
                <span className={styles.messageAuthor}>
                  {message.role === 'user' ? 'Tú' : 'Asistente'}
                </span>
                <p>{message.content}</p>
              </article>
            ))}
            {isLoading ? (
              <div className={styles.typingMessage} role="status">
                <span />
                <span />
                <span />
                <span className={styles.srOnly}>El asistente está escribiendo</span>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 ? (
            <div className={styles.suggestions} aria-label="Preguntas sugeridas">
              {suggestedQuestions.map((question) => (
                <button key={question} type="button" onClick={() => void sendMessage(question)}>
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <label htmlFor="store-assistant-message">Escribe tu pregunta</label>
            <div className={styles.composerControl}>
              <textarea
                id="store-assistant-message"
                name="assistantMessage"
                rows={2}
                maxLength={assistantMessageMaxLength}
                placeholder="Ejemplo: ¿Cómo agrego un producto al carrito?"
                value={messageDraft}
                disabled={isLoading}
                onChange={(event) => setMessageDraft(event.target.value)}
                onKeyDown={handleDraftKeyDown}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={isLoading || !messageDraft.trim()}
                aria-label="Enviar pregunta"
                title="Enviar pregunta"
              >
                <FaArrowUp aria-hidden="true" />
              </button>
            </div>
            <div className={styles.composerMeta}>
              <span>{messageDraft.length}/{assistantMessageMaxLength}</span>
              <Link to="/help" onClick={() => setIsOpen(false)}>
                Centro de Ayuda
              </Link>
            </div>
            <p className={styles.status} role="status" aria-live="polite">
              {statusMessage}
            </p>
          </form>
        </section>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={isOpen ? 'Cerrar asistente de la tienda' : 'Abrir asistente de la tienda'}
        aria-controls="store-assistant-panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <FaComments aria-hidden="true" />
      </button>
    </div>
  );
}
