import { useEffect, useRef, useState } from 'react';
import type { Dispatch, KeyboardEvent, SetStateAction, SyntheticEvent } from 'react';
import {
  FaArrowUp,
  FaComments,
  FaRobot,
  FaMicrophone,
  FaMicrophoneSlash,
  FaRotateLeft,
  FaXmark,
} from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { askStoreAssistant, assistantMessageMaxLength } from '../services/assistantService';
import type { AssistantMessage } from '../types/assistant.types';
import styles from './StoreAssistantChat.module.css';

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionResultEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionController = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionController;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type SpeechRecognitionGlobal = typeof globalThis & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

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

const useSpeechDictation = (
  setMessageDraft: Dispatch<SetStateAction<string>>,
  setStatusMessage: Dispatch<SetStateAction<string>>,
) => {
  const [isDictating, setIsDictating] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognitionController | null>(null);

  useEffect(() => {
    const speechGlobal = globalThis as SpeechRecognitionGlobal;
    const SpeechRecognition = speechGlobal.SpeechRecognition ?? speechGlobal.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join('')
        .trim();

      if (transcript) {
        setMessageDraft(transcript);
      }

      const lastResult = event.results[event.results.length - 1];
      setStatusMessage(
        lastResult?.isFinal
          ? 'Dictado transcrito. Revisa el texto antes de enviarlo.'
          : 'Escuchando...',
      );
    };
    recognition.onerror = (event) => {
      setIsDictating(false);

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setStatusMessage('Permite el acceso al micrófono para dictar tu pregunta.');
        return;
      }

      if (event.error === 'no-speech') {
        setStatusMessage('No se detectó voz. Intenta de nuevo.');
        return;
      }

      setStatusMessage('No se pudo iniciar el dictado por voz.');
    };
    recognition.onend = () => {
      setIsDictating(false);
    };

    speechRecognitionRef.current = recognition;
    setSpeechRecognitionSupported(true);

    return () => {
      recognition.abort();
      speechRecognitionRef.current = null;
    };
  }, [setMessageDraft, setStatusMessage]);

  const stopDictation = () => {
    speechRecognitionRef.current?.stop();
  };

  const toggleDictation = (isLoading: boolean) => {
    if (!speechRecognitionSupported || !speechRecognitionRef.current || isLoading) {
      return;
    }

    if (isDictating) {
      stopDictation();
      setStatusMessage('Dictado detenido.');
      return;
    }

    try {
      speechRecognitionRef.current.start();
      setIsDictating(true);
      setStatusMessage('Escuchando...');
    } catch {
      setIsDictating(false);
      setStatusMessage('No se pudo activar el micrófono.');
    }
  };

  return {
    isDictating,
    speechRecognitionSupported,
    stopDictation,
    toggleDictation,
  };
};

type SendAssistantMessageParams = {
  content: string;
  currentPath: string;
  currentMessages: AssistantMessage[];
  isLoading: boolean;
  stopDictation: () => void;
  setMessages: Dispatch<SetStateAction<AssistantMessage[]>>;
  setMessageDraft: Dispatch<SetStateAction<string>>;
  setStatusMessage: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const sendAssistantMessage = async ({
  content,
  currentPath,
  currentMessages,
  isLoading,
  stopDictation,
  setMessages,
  setMessageDraft,
  setStatusMessage,
  setIsLoading,
}: SendAssistantMessageParams): Promise<void> => {
  const trimmedContent = content.trim();

  if (!trimmedContent || isLoading) {
    return;
  }

  stopDictation();

  const userMessage = createMessage('user', trimmedContent);
  const conversationHistory = currentMessages.map(({ role, content: messageContent }) => ({
    role,
    content: messageContent,
  }));

  setMessages((currentConversation) => [...currentConversation, userMessage]);
  setMessageDraft('');
  setStatusMessage('El asistente está preparando una respuesta.');
  setIsLoading(true);

  const result = await askStoreAssistant({
    message: trimmedContent,
    currentPath,
    history: conversationHistory,
  });

  setIsLoading(false);

  if (!result.isSuccess) {
    setStatusMessage(result.message);
    return;
  }

  setMessages((currentConversation) => [
    ...currentConversation,
    createMessage('assistant', result.answer),
  ]);
  setStatusMessage(
    result.isFallback
      ? 'Respuesta de ayuda local. La conexión con la IA no está disponible.'
      : 'Respuesta recibida.',
  );
};

const handleAssistantDraftKeyDown = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  sendMessage: () => void,
): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const getMicButtonLabel = (supported: boolean, isDictating: boolean): string => {
  if (!supported) {
    return 'Dictado por voz no disponible en este navegador';
  }

  return isDictating ? 'Detener dictado por voz' : 'Dictar pregunta por voz';
};

const getMicButtonTitle = (supported: boolean, isDictating: boolean): string => {
  if (!supported) {
    return 'Dictado no disponible en este navegador';
  }

  return isDictating ? 'Detener dictado' : 'Dictar pregunta';
};

export default function StoreAssistantChat() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [messageDraft, setMessageDraft] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDictating, speechRecognitionSupported, stopDictation, toggleDictation } =
    useSpeechDictation(setMessageDraft, setStatusMessage);

  const closeAssistant = () => {
    stopDictation();
    setIsOpen(false);
  };

  const sendMessage = (content: string) => {
    sendAssistantMessage({
      content,
      currentPath: location.pathname,
      currentMessages: messages,
      isLoading,
      stopDictation,
      setMessages,
      setMessageDraft,
      setStatusMessage,
      setIsLoading,
    });
  };

  const micButtonAriaLabel = getMicButtonLabel(speechRecognitionSupported, isDictating);
  const micButtonTitle = getMicButtonTitle(speechRecognitionSupported, isDictating);

  useEffect(() => {
    const openAssistant = () => {
      setIsOpen(true);

      globalThis.requestAnimationFrame(() => {
        messageInputRef.current?.focus();
      });
    };

    globalThis.addEventListener('open-store-assistant-chat', openAssistant);

    return () => {
      globalThis.removeEventListener('open-store-assistant-chat', openAssistant);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      closeAssistant();
      triggerRef.current?.focus();
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        closeAssistant();
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
    stopDictation();
    setMessages(initialMessages);
    setMessageDraft('');
    setStatusMessage('Conversación reiniciada.');
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(messageDraft);
  };

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    handleAssistantDraftKeyDown(event, () => sendMessage(messageDraft));
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
              <output className={styles.typingMessage} aria-live="polite" aria-label="El asistente está escribiendo">
                <span />
                <span />
                <span />
                <span className={styles.srOnly}>El asistente está escribiendo</span>
              </output>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 ? (
            <div className={styles.suggestions} aria-label="Preguntas sugeridas">
              {suggestedQuestions.map((question) => (
                <button key={question} type="button" onClick={() => sendMessage(question)}>
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <label htmlFor="store-assistant-message">Escribe o dicta tu pregunta</label>
            <div className={styles.composerControl}>
              <textarea
                ref={messageInputRef}
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
                type="button"
                className={`${styles.micButton} ${isDictating ? styles.micButtonActive : ''}`}
                onClick={() => toggleDictation(isLoading)}
                disabled={isLoading || !speechRecognitionSupported}
                aria-pressed={isDictating}
                aria-label={micButtonAriaLabel}
                title={micButtonTitle}
              >
                {isDictating ? (
                  <FaMicrophoneSlash aria-hidden="true" />
                ) : (
                  <FaMicrophone aria-hidden="true" />
                )}
              </button>
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
        onClick={() => (isOpen ? closeAssistant() : setIsOpen(true))}
      >
        <FaComments aria-hidden="true" />
      </button>
    </div>
  );
}
