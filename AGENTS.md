# Plataforma de Comercio Electrónico Adaptativo

## Stack

- React
- TypeScript
- Vite
- React Router DOM
- Supabase
- CSS Modules

## Development Rules

- Use strict TypeScript.
- Avoid using any.
- Create interfaces and types in /types.
- Prefer composition over inheritance.
- Use functional components.
- Keep components small and reusable.
- Follow feature-based architecture.

## Accessibility

All code must comply with WCAG 2.2:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- ARIA only when necessary
- Accessible forms
- Accessible color contrast

## Architecture

src/
├── app/
├── components/
├── features/
├── lib/
├── pages/
├── styles/
├── types/
└── utils/

## Supabase

- Keep database logic in services.
- Never query Supabase directly inside UI components.
- Use typed responses.

## UX Goals

The application must prioritize:

- Simplicity
- Readability
- Accessibility
- Fast navigation
- Low cognitive load

## Workflow

Work in small incremental steps.

Before generating code:

1. Explain what files will be created.
2. Explain why.
3. Generate code.
4. Explain how to test it.

Never generate unnecessary code.

## TypeScript Professional Typing Rules

- Do not create generic or vague interfaces like:
  - Data
  - Item
  - Props
  - Response
  - UserData
  - FormData
  - ApiResponse

- Use domain-specific names based on the business context.

Good examples:
- Product
- ProductCardProps
- ProductFiltersState
- CartItem
- CartSummary
- CheckoutFormValues
- AccessibilitySettings
- UserProfile
- Order
- OrderItem
- AuthSession

- Prefer `type` for simple object shapes and unions.
- Use `interface` only when extension is needed.
- Never use `any`.
- Use `unknown` when the type is truly unknown and narrow it before using.
- Keep shared types in `src/types`.
- Keep feature-specific types inside each feature folder.

Examples:

src/features/products/types/product.types.ts

```ts
export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  stock: number;
  isActive: boolean;
};

export type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: number) => void;
};