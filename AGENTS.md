# Plataforma de Comercio Electrónico Adaptativo

## Project Context

This is a university project for the subject "Usabilidad y Accesibilidad".

Project name:
"Plataforma de Comercio Electrónico Adaptativo"

Brand identity:
- Store style inspired by gaming/e-commerce.
- Logo reference: GG Store.
- Main colors must be based on the logo:
  - Black / dark background
  - Cyan / electric blue
  - Purple
  - White
- The UI should feel modern, clean, accessible and slightly futuristic.

Visual inspiration:
- Use https://www.constructoraglpro.com/ only as visual inspiration for:
  - Modern landing structure
  - Smooth section transitions
  - Big hero section
  - Clear navigation
  - Cards with hover effects
  - Strong call-to-action buttons
  - Clean spacing
- Do not copy text, images, layout exactly, assets or brand identity.
- Adapt the style to an accessible e-commerce platform.

## Stack

- React
- TypeScript
- Vite
- React Router DOM
- Supabase
- CSS Modules
- React Icons

## Architecture

Follow feature-based architecture:

src/
├── app/
│   └── router/
├── assets/
│   └── branding/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── accessibility/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   └── checkout/
├── lib/
├── pages/
├── styles/
├── types/
└── utils/

## Development Rules

- Use strict TypeScript.
- Never use `any`.
- Use `unknown` only when truly necessary and narrow it before using.
- Use functional components.
- Prefer composition over inheritance.
- Keep components small, readable and reusable.
- Avoid unnecessary dependencies.
- Avoid overengineering.
- Do not create code that is not required for the current step.
- Never place Supabase queries directly inside UI components.
- Keep Supabase logic inside services or feature service files.
- Use CSS Modules for component styles.
- Use global CSS only for resets, CSS variables and accessibility utilities.

## Professional TypeScript Rules

Do not create vague or generic types such as:

- Data
- Item
- Props
- Response
- UserData
- FormData
- ApiResponse

Use domain-specific names.

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
- ProductSearchParams
- CheckoutStep

Prefer `type` for simple object shapes and unions.
Use `interface` only when extension is needed.

Shared types must live in:

src/types/

Feature-specific types must live inside each feature:

src/features/products/types/product.types.ts
src/features/cart/types/cart.types.ts
src/features/checkout/types/checkout.types.ts

## Supabase Rules

- Supabase client must live in:

src/lib/supabaseClient.ts

- Generated database types must live in:

src/types/database.types.ts

- Use generated Supabase types as the source of truth.
- Do not manually duplicate database row types.
- Create frontend domain models when needed.
- Map database snake_case fields to frontend camelCase fields using mapper functions.

Example:

Database:
image_url

Frontend:
imageUrl

Use mappers:

src/features/products/mappers/product.mapper.ts

## Accessibility Goals

The application must comply with WCAG 2.2 Level A + AA.

Always prioritize:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Accessible forms
- Accessible color contrast
- Clear error messages
- Consistent navigation
- Responsive design
- Low cognitive load
- Screen reader compatibility

Use ARIA only when native HTML is not enough.

## Mandatory Accessibility Criteria

The following WCAG criteria are transversal and must be respected across the whole project:

- 1.3.1 Information and relationships
- 1.4.3 Minimum contrast
- 2.1.1 Keyboard
- 2.4.7 Focus visible
- 2.5.8 Target size minimum
- 3.3.1 Error identification
- 3.3.2 Labels or instructions
- 4.1.2 Name, role and value
- 4.1.3 Status messages

## Accessibility Menu

The app must include an accessibility menu with options that users can enable, disable or reset.

Required options:

- Increase text size
- Decrease text size
- High contrast mode
- Dark mode
- Text spacing
- Large buttons
- Highlight links
- Highlight focus
- Reduce animations
- Dyslexia-friendly font
- Large cursor
- Reading guide
- Hide decorative images
- Reset accessibility settings

Accessibility settings must be stored locally using localStorage.

Use CSS variables and data attributes for accessibility states.

Example:

html[data-theme="dark"]
html[data-contrast="high"]
html[data-motion="reduced"]
html[data-text-size="large"]

## Forms Accessibility

All forms must include:

- Associated labels
- Clear instructions
- autocomplete where appropriate
- Visible error messages
- Error messages connected with aria-describedby
- Keyboard navigation
- Visible focus
- Submit confirmation
- Status messages using role="status" or aria-live
- No automatic unexpected navigation when typing

Forms in this project:

- Login form
- Register form
- Profile form
- Search form
- Product filters form
- Checkout form
- Contact/support form

## User Profiles

Design decisions must consider these users:

### University student

Needs:
- Fast search
- Filters
- Product comparison
- Quick checkout
- Recommendations

### Adult worker

Needs:
- Clear product information
- Trust
- Secure checkout
- Order tracking
- Reduced visual fatigue

### Older adult

Needs:
- Simple interface
- Large icons and buttons
- Step-by-step guidance
- Help access
- Better text readability

## UX Principles

The application must prioritize:

- Simplicity
- Readability
- Accessibility
- Fast navigation
- Low cognitive load
- Clear visual hierarchy
- Predictable interaction
- Minimal number of clicks

Avoid:

- Cluttered screens
- Hidden actions
- Small buttons
- Low contrast text
- Complex forms
- Excessive animations

## Visual Design System

Use CSS variables:

:root {
  --color-bg: #050505;
  --color-surface: #111827;
  --color-surface-soft: #1f2937;
  --color-primary: #00d9ff;
  --color-secondary: #8b5cf6;
  --color-accent: #a855f7;
  --color-text: #ffffff;
  --color-text-muted: #d1d5db;
  --color-border: rgba(255, 255, 255, 0.14);
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --shadow-card: 0 20px 40px rgba(0, 0, 0, 0.35);
}

Design style:

- Dark modern base
- Cyan and purple gradients
- Rounded cards
- Soft shadows
- Clear buttons
- Accessible hover states
- Smooth but optional animations
- Product cards with clear price, image and CTA
- Hero section with strong message and visible actions

## Animation Rules

Animations are allowed only if:

- They are subtle
- They do not block interaction
- They respect prefers-reduced-motion
- They can be disabled from the accessibility menu

Use transitions for:

- Cards hover
- Buttons hover
- Section reveal
- Menu open/close

Do not use aggressive parallax, flashing effects or excessive motion.

Never create elements that flash more than 3 times per second.

## Pages

The project should include:

- Home
- Products catalog
- Product detail
- Cart
- Checkout
- Login
- Register
- Profile
- Order tracking
- Help / Support

## Core Features

### Home

Should include:

- Hero section
- Main CTA to products
- Accessibility message
- Featured products
- Categories
- Benefits
- Simple shopping process
- Footer

### Products

Should include:

- Search
- Filters
- Product cards
- Categories
- Accessible empty state
- Loading state
- Error state

### Cart

Should include:

- Product summary
- Quantity controls
- Remove item
- Total price
- Checkout button
- Status messages

### Checkout

Should include:

- Step-by-step flow
- Accessible form fields
- Order summary
- Confirmation before final submit
- Error prevention

## Workflow

Work in small incremental steps.

Before generating code:

1. Explain what files will be created or modified.
2. Explain why.
3. Generate the code.
4. Explain how to test it.
5. Stop and wait for approval before moving to the next major feature.

Never generate unnecessary code.

## Code Quality

Before finishing a task, check:

- TypeScript has no errors.
- Components have meaningful names.
- CSS Modules are scoped.
- HTML is semantic.
- Buttons are real `<button>`.
- Links are real `<a>` or React Router `<Link>`.
- Inputs have labels.
- Images have alt text.
- Focus states are visible.
- Layout is responsive.
- No Supabase query is inside UI components.
- No `any` is used.

## Important Instruction

This project is mainly evaluated for usability and accessibility, not only visual design.

Every feature must be easy to use for:
- A fast university student
- An occasional adult worker
- An older adult with low technological experience