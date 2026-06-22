import { supabase } from '../../../lib/supabaseClient';
import type {
  AssistantRequest,
  AssistantResponsePayload,
  AssistantServiceResult,
} from '../types/assistant.types';

export const assistantMessageMaxLength = 500;

const getLocalHelpAnswer = (message: string): string | null => {
  const normalizedMessage = message.toLocaleLowerCase('es');

  if (/accesibilidad|contraste|texto|letra|animaci/.test(normalizedMessage)) {
    return 'Abre el botón de accesibilidad ubicado en la esquina inferior derecha. Allí puedes cambiar el tamaño del texto, contraste, espaciado y movimiento.';
  }

  if (/producto|buscar|catálogo|catalogo|comparar/.test(normalizedMessage)) {
    return 'Ve a Productos desde el menú principal. Puedes buscar por nombre, filtrar por categoría y seleccionar hasta tres productos para compararlos.';
  }

  if (/carrito|cantidad|comprar|checkout|pago/.test(normalizedMessage)) {
    return 'Agrega un producto disponible al carrito, revisa sus cantidades y usa el botón de finalizar compra para continuar al checkout.';
  }

  if (/cuenta|registro|registrar|perfil|sesión|sesion/.test(normalizedMessage)) {
    return 'Usa Registrarse para crear una cuenta. Después de verificar tu correo e iniciar sesión, completa tu nombre desde la pantalla de perfil.';
  }

  if (/pedido|orden|historial/.test(normalizedMessage)) {
    return 'Puedes consultar el historial desde Pedidos en el menú principal o desde la opción Mis pedidos del menú de perfil.';
  }

  if (/hola|buenas|ayuda/.test(normalizedMessage)) {
    return 'Hola. Puedo orientarte sobre productos, carrito, compras, pedidos, cuenta y opciones de accesibilidad de Comercio Adaptativo.';
  }

  return null;
};

export async function askStoreAssistant(
  request: AssistantRequest,
): Promise<AssistantServiceResult> {
  const trimmedMessage = request.message.trim();

  if (!trimmedMessage) {
    return {
      isSuccess: false,
      message: 'Escribe una pregunta antes de enviarla.',
    };
  }

  if (trimmedMessage.length > assistantMessageMaxLength) {
    return {
      isSuccess: false,
      message: `La pregunta no puede superar ${assistantMessageMaxLength} caracteres.`,
    };
  }

  const { data, error } = await supabase.functions.invoke<AssistantResponsePayload>(
    'store-assistant',
    {
      body: {
        ...request,
        message: trimmedMessage,
        history: request.history.slice(-8),
      },
    },
  );

  if (!error && data?.answer?.trim()) {
    return {
      isSuccess: true,
      answer: data.answer.trim(),
      isFallback: false,
    };
  }

  const fallbackAnswer = getLocalHelpAnswer(trimmedMessage);

  if (fallbackAnswer) {
    return {
      isSuccess: true,
      answer: fallbackAnswer,
      isFallback: true,
    };
  }

  return {
    isSuccess: false,
    message: 'No pude conectar con el asistente en este momento. Intenta nuevamente o visita el Centro de Ayuda.',
  };
}
