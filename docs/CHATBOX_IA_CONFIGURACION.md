# Configuración del chatbox con IA

El frontend llama a la función segura `store-assistant` mediante Supabase. La clave de OpenAI nunca debe guardarse en `.env` con prefijo `VITE_` ni utilizarse directamente desde React.

## 1. Iniciar sesión y vincular Supabase

Desde la raíz del proyecto:

```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
```

## 2. Guardar secretos

```bash
npx supabase secrets set OPENAI_API_KEY=TU_CLAVE_OPENAI
npx supabase secrets set OPENAI_MODEL=gpt-4.1-mini
```

Opcionalmente, limita CORS al dominio desplegado:

```bash
npx supabase secrets set ALLOWED_ORIGIN=https://tu-dominio.com
```

## 3. Desplegar la función

```bash
npx supabase functions deploy store-assistant
```

La aplicación ya utiliza `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Después del despliegue, el chat podrá llamar la función con `supabase.functions.invoke()`.

## 4. Probar

```bash
npm run dev
```

1. Abre la URL de Vite.
2. Pulsa el botón de chat situado sobre el botón de accesibilidad.
3. Pregunta: `¿Cómo agrego un producto al carrito?`
4. Comprueba una pregunta fuera del alcance, por ejemplo sobre noticias, y verifica que el asistente se limite a la tienda.
5. Desactiva temporalmente la función y comprueba que las consultas frecuentes reciben ayuda local.

## Seguridad

- No publiques `OPENAI_API_KEY` en Git.
- Configura límites de gasto en la cuenta de OpenAI.
- Antes de producción, añade rate limiting por usuario o dirección IP en la Edge Function.
- El chat no debe recibir contraseñas, datos completos de tarjetas ni códigos de verificación.
