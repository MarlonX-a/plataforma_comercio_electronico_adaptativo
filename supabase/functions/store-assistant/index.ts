type AssistantRole = 'user' | 'assistant';

type AssistantHistoryMessage = {
  role: AssistantRole;
  content: string;
};

type AssistantRequestBody = {
  message: string;
  currentPath: string;
  history: AssistantHistoryMessage[];
};

type OpenAIContentPart = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  content?: OpenAIContentPart[];
};

type OpenAIResponseBody = {
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAssistantRole = (value: unknown): value is AssistantRole =>
  value === 'user' || value === 'assistant';

const parseRequestBody = (value: unknown): AssistantRequestBody | null => {
  if (!isRecord(value) || typeof value.message !== 'string') {
    return null;
  }

  const rawHistory = Array.isArray(value.history) ? value.history : [];
  const history = rawHistory.flatMap((historyItem): AssistantHistoryMessage[] => {
    if (
      !isRecord(historyItem) ||
      !isAssistantRole(historyItem.role) ||
      typeof historyItem.content !== 'string'
    ) {
      return [];
    }

    const content = historyItem.content.trim().slice(0, 500);
    return content ? [{ role: historyItem.role, content }] : [];
  });

  return {
    message: value.message.trim(),
    currentPath:
      typeof value.currentPath === 'string' ? value.currentPath.slice(0, 120) : '/',
    history: history.slice(-8),
  };
};

const getResponseText = (responseBody: OpenAIResponseBody): string | null => {
  for (const outputItem of responseBody.output ?? []) {
    for (const contentPart of outputItem.content ?? []) {
      if (contentPart.type === 'output_text' && contentPart.text?.trim()) {
        return contentPart.text.trim();
      }
    }
  }

  return null;
};

const assistantInstructions = `
Eres el asistente de soporte de Comercio Adaptativo, una tienda web accesible.

Solo respondes preguntas relacionadas con el uso de esta plataforma. Puedes orientar sobre:
- Inicio y navegación principal.
- Catálogo, búsqueda, categorías, comparación y detalle de productos.
- Carrito, cantidades, checkout y revisión antes de confirmar.
- Registro, inicio de sesión, verificación de correo y perfil.
- Historial de pedidos.
- Menú de accesibilidad: tamaño de texto, alto contraste, espaciado y reducción de movimiento.
- Centro de Ayuda.
- Panel de productos, únicamente para perfiles worker o admin.

Reglas:
- Responde siempre en español claro, con un máximo aproximado de 120 palabras.
- Si la pregunta no trata sobre Comercio Adaptativo, explica brevemente que solo puedes ayudar con la tienda.
- No inventes precios, stock, estados de pedidos, políticas, promociones ni datos del usuario.
- Indica que el catálogo y la cuenta muestran la información actual cuando sea necesario.
- Nunca solicites contraseñas, números completos de tarjeta, códigos de verificación ni otros secretos.
- No afirmes que ejecutaste acciones. Solo orientas al usuario.
- Cuando ayude, menciona la ruta o nombre visible de la pantalla.
`;

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido.' }, 405);
  }

  const openAIKey = Deno.env.get('OPENAI_API_KEY');

  if (!openAIKey) {
    return jsonResponse({ error: 'El asistente no está configurado.' }, 503);
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: 'La solicitud no contiene JSON válido.' }, 400);
  }

  const body = parseRequestBody(rawBody);

  if (!body || !body.message || body.message.length > 500) {
    return jsonResponse({ error: 'La pregunta debe contener entre 1 y 500 caracteres.' }, 400);
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4.1-mini',
      instructions: assistantInstructions,
      input: [
        ...body.history,
        {
          role: 'user',
          content: `Página actual: ${body.currentPath}\nPregunta: ${body.message}`,
        },
      ],
      max_output_tokens: 300,
    }),
  });

  const responseBody = (await response.json()) as OpenAIResponseBody;

  if (!response.ok) {
    console.error('OpenAI request failed.', response.status, responseBody.error?.message);
    return jsonResponse({ error: 'No se pudo generar una respuesta.' }, 502);
  }

  const answer = getResponseText(responseBody);

  if (!answer) {
    return jsonResponse({ error: 'La IA no devolvió una respuesta válida.' }, 502);
  }

  return jsonResponse({ answer });
});
