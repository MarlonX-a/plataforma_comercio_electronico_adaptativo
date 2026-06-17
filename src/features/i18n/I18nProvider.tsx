import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

const i18nStorageKey = 'comercio-adaptativo-language';

export const supportedLanguages = ['es', 'en', 'pt', 'fr'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  fr: 'Français',
};

const translations = {
  es: {
    'app.name': 'Comercio Adaptativo',
    'layout.skipToMain': 'Saltar al contenido principal',
    'layout.page.home': 'Inicio',
    'layout.page.products': 'Productos',
    'layout.page.productDetail': 'Detalle del producto',
    'layout.page.compare': 'Comparar productos',
    'layout.page.cart': 'Carrito',
    'layout.page.checkout': 'Finalizar compra',
    'layout.page.orders': 'Mis pedidos',
    'layout.page.login': 'Iniciar sesión',
    'layout.page.register': 'Crear cuenta',
    'layout.page.completeProfile': 'Completar perfil',
    'layout.page.profile': 'Mi perfil',
    'layout.page.help': 'Centro de Ayuda',
    'layout.page.siteMap': 'Mapa del sitio',
    'layout.page.notFound': 'Página no encontrada',
    'navbar.mainNav': 'Navegación principal',
    'navbar.goHome': 'Ir al inicio',
    'navbar.brandSubtitle': 'Tienda accesible',
    'navbar.nav.home': 'Inicio',
    'navbar.nav.products': 'Productos',
    'navbar.nav.cart': 'Carrito',
    'navbar.nav.orders': 'Pedidos',
    'navbar.authActions': 'Acciones de autenticación',
    'navbar.login': 'Iniciar sesión',
    'navbar.register': 'Registrarse',
    'navbar.myAccount': 'Mi cuenta',
    'navbar.hello': 'Hola',
    'navbar.myProfile': 'Mi perfil',
    'navbar.myOrders': 'Mis pedidos',
    'navbar.preferences': 'Preferencias',
    'navbar.logout': 'Cerrar sesión',
    'navbar.cartCount.one': '{{count}} producto en el carrito',
    'navbar.cartCount.other': '{{count}} productos en el carrito',
    'navbar.language': 'Idioma',
    'footer.about':
      'Plataforma de comercio electrónico orientada a una experiencia clara, elegante y accesible.',
    'footer.developers': 'Desarrolladores',
    'footer.navigation': 'Navegación',
    'footer.social': 'Redes sociales',
    'footer.home': 'Inicio',
    'footer.products': 'Productos',
    'footer.cart': 'Carrito',
    'footer.orders': 'Pedidos',
    'footer.help': 'Ayuda y Soporte',
    'footer.siteMap': 'Mapa del sitio',
    'footer.login': 'Iniciar sesión',
    'footer.register': 'Registro',
    'footer.support': 'Soporte',
    'footer.legal': '© {{year}} Comercio Adaptativo. Todos los derechos reservados.',
    'home.heroKicker': 'Una tienda diseñada para todas las personas',
    'home.heroSummary':
      'Descubre productos con una experiencia clara, rápida y personalizable, pensada para que comprar sea sencillo desde el primer momento.',
    'home.heroProducts': 'Ver productos',
    'home.heroLogin': 'Iniciar sesión',
    'home.quickAccessLabel': 'Accesos directos',
    'home.quickAccessTitle': '¿Qué deseas hacer?',
    'home.quick.products.title': 'Explorar productos',
    'home.quick.products.description': 'Busca, compara y encuentra productos por categoría.',
    'home.quick.products.link': 'Ir al catálogo',
    'home.quick.cart.title': 'Revisar mi carrito',
    'home.quick.cart.description': 'Consulta tus productos y modifica las cantidades fácilmente.',
    'home.quick.cart.link': 'Abrir carrito',
    'home.quick.register.title': 'Crear una cuenta',
    'home.quick.register.description': 'Guarda tu perfil y prepara una experiencia más personal.',
    'home.quick.register.link': 'Registrarme',
    'home.experienceEyebrow': 'Una mejor experiencia',
    'home.experienceTitle': 'Todo lo importante, fácil de encontrar',
    'home.experienceDescription':
      'La interfaz reduce pasos innecesarios y mantiene las decisiones principales siempre a la vista.',
    'home.feature.search.title': 'Encuentra rápido',
    'home.feature.search.description':
      'Búsqueda visible, filtros sencillos y resultados fáciles de revisar.',
    'home.feature.clarity.title': 'Compra con claridad',
    'home.feature.clarity.description':
      'Precios, disponibilidad y cantidades presentados sin sorpresas.',
    'home.feature.accessibility.title': 'Navega a tu manera',
    'home.feature.accessibility.description':
      'Controles accesibles por teclado y preferencias que permanecen contigo.',
    'home.experienceAction': 'Ver catálogo completo',
    'home.closingLabel': 'Tu próxima compra comienza aquí',
    'home.closingTitle': 'Explora el catálogo a tu ritmo',
    'home.closingAction': 'Comenzar ahora',
    'a11y.openMenu': 'Abrir menú de accesibilidad',
    'a11y.closeMenu': 'Cerrar menú de accesibilidad',
    'a11y.menuLabel': 'Menú de accesibilidad',
    'a11y.title': 'Accesibilidad',
    'a11y.subtitle': 'Ajusta la interfaz sin salir de la página actual.',
    'a11y.fontSize.title': 'Tamaño del texto',
    'a11y.fontSize.description': 'Aumenta el texto sin perder contenido ni funcionalidad.',
    'a11y.fontSize.default': 'Normal',
    'a11y.fontSize.large': 'Grande',
    'a11y.fontSize.extraLarge': 'Muy grande',
    'a11y.contrast.title': 'Contraste',
    'a11y.contrast.description': 'Refuerza la diferencia entre texto, controles y fondo.',
    'a11y.contrast.default': 'Predeterminado',
    'a11y.contrast.highContrast': 'Alto contraste',
    'a11y.spacing.title': 'Espaciado',
    'a11y.spacing.description': 'Amplía el espacio entre letras, palabras y líneas.',
    'a11y.spacing.default': 'Normal',
    'a11y.spacing.increased': 'Ampliado',
    'a11y.motion.title': 'Movimiento',
    'a11y.motion.description': 'Reduce transiciones y animaciones no esenciales.',
    'a11y.motion.default': 'Normal',
    'a11y.motion.reduced': 'Reducido',
    'a11y.reset': 'Restablecer',
    'a11y.applied': 'Preferencias aplicadas.',
    'a11y.resetDone': 'Preferencias restablecidas.',
  },
  en: {
    'app.name': 'Adaptive Commerce',
    'layout.skipToMain': 'Skip to main content',
    'layout.page.home': 'Home',
    'layout.page.products': 'Products',
    'layout.page.productDetail': 'Product details',
    'layout.page.compare': 'Compare products',
    'layout.page.cart': 'Cart',
    'layout.page.checkout': 'Checkout',
    'layout.page.orders': 'My orders',
    'layout.page.login': 'Sign in',
    'layout.page.register': 'Create account',
    'layout.page.completeProfile': 'Complete profile',
    'layout.page.profile': 'My profile',
    'layout.page.help': 'Help center',
    'layout.page.siteMap': 'Site map',
    'layout.page.notFound': 'Page not found',
    'navbar.mainNav': 'Main navigation',
    'navbar.goHome': 'Go to home',
    'navbar.brandSubtitle': 'Accessible store',
    'navbar.nav.home': 'Home',
    'navbar.nav.products': 'Products',
    'navbar.nav.cart': 'Cart',
    'navbar.nav.orders': 'Orders',
    'navbar.authActions': 'Authentication actions',
    'navbar.login': 'Sign in',
    'navbar.register': 'Sign up',
    'navbar.myAccount': 'My account',
    'navbar.hello': 'Hello',
    'navbar.myProfile': 'My profile',
    'navbar.myOrders': 'My orders',
    'navbar.preferences': 'Preferences',
    'navbar.logout': 'Sign out',
    'navbar.cartCount.one': '{{count}} item in cart',
    'navbar.cartCount.other': '{{count}} items in cart',
    'navbar.language': 'Language',
    'footer.about':
      'E-commerce platform focused on a clear, elegant, and accessible experience.',
    'footer.developers': 'Developers',
    'footer.navigation': 'Navigation',
    'footer.social': 'Social media',
    'footer.home': 'Home',
    'footer.products': 'Products',
    'footer.cart': 'Cart',
    'footer.orders': 'Orders',
    'footer.help': 'Help and support',
    'footer.siteMap': 'Site map',
    'footer.login': 'Sign in',
    'footer.register': 'Register',
    'footer.support': 'Support',
    'footer.legal': '© {{year}} Adaptive Commerce. All rights reserved.',
    'home.heroKicker': 'A store designed for everyone',
    'home.heroSummary':
      'Discover products with a clear, fast, and personalized experience designed to make shopping simple from the start.',
    'home.heroProducts': 'View products',
    'home.heroLogin': 'Sign in',
    'home.quickAccessLabel': 'Quick actions',
    'home.quickAccessTitle': 'What would you like to do?',
    'home.quick.products.title': 'Browse products',
    'home.quick.products.description': 'Search, compare, and find products by category.',
    'home.quick.products.link': 'Go to catalog',
    'home.quick.cart.title': 'Review my cart',
    'home.quick.cart.description': 'Check your products and update quantities easily.',
    'home.quick.cart.link': 'Open cart',
    'home.quick.register.title': 'Create an account',
    'home.quick.register.description': 'Save your profile for a more personal experience.',
    'home.quick.register.link': 'Sign up',
    'home.experienceEyebrow': 'A better experience',
    'home.experienceTitle': 'Everything important, easy to find',
    'home.experienceDescription':
      'The interface reduces unnecessary steps and keeps key decisions always in view.',
    'home.feature.search.title': 'Find quickly',
    'home.feature.search.description':
      'Visible search, simple filters, and results that are easy to review.',
    'home.feature.clarity.title': 'Shop with clarity',
    'home.feature.clarity.description':
      'Prices, availability, and quantities presented without surprises.',
    'home.feature.accessibility.title': 'Navigate your way',
    'home.feature.accessibility.description':
      'Keyboard-accessible controls and preferences that stay with you.',
    'home.experienceAction': 'View full catalog',
    'home.closingLabel': 'Your next purchase starts here',
    'home.closingTitle': 'Explore the catalog at your own pace',
    'home.closingAction': 'Start now',
    'a11y.openMenu': 'Open accessibility menu',
    'a11y.closeMenu': 'Close accessibility menu',
    'a11y.menuLabel': 'Accessibility menu',
    'a11y.title': 'Accessibility',
    'a11y.subtitle': 'Adjust the interface without leaving the current page.',
    'a11y.fontSize.title': 'Text size',
    'a11y.fontSize.description': 'Increase text size without losing content or functionality.',
    'a11y.fontSize.default': 'Normal',
    'a11y.fontSize.large': 'Large',
    'a11y.fontSize.extraLarge': 'Extra large',
    'a11y.contrast.title': 'Contrast',
    'a11y.contrast.description': 'Strengthen the difference between text, controls, and background.',
    'a11y.contrast.default': 'Default',
    'a11y.contrast.highContrast': 'High contrast',
    'a11y.spacing.title': 'Text spacing',
    'a11y.spacing.description': 'Increase spacing between letters, words, and lines.',
    'a11y.spacing.default': 'Normal',
    'a11y.spacing.increased': 'Increased',
    'a11y.motion.title': 'Motion',
    'a11y.motion.description': 'Reduce non-essential transitions and animations.',
    'a11y.motion.default': 'Normal',
    'a11y.motion.reduced': 'Reduced',
    'a11y.reset': 'Reset',
    'a11y.applied': 'Preferences applied.',
    'a11y.resetDone': 'Preferences reset.',
  },
  pt: {
    'app.name': 'Comercio Adaptativo',
    'layout.skipToMain': 'Ir para o conteúdo principal',
    'layout.page.home': 'Início',
    'layout.page.products': 'Produtos',
    'layout.page.productDetail': 'Detalhe do produto',
    'layout.page.compare': 'Comparar produtos',
    'layout.page.cart': 'Carrinho',
    'layout.page.checkout': 'Finalizar compra',
    'layout.page.orders': 'Meus pedidos',
    'layout.page.login': 'Entrar',
    'layout.page.register': 'Criar conta',
    'layout.page.completeProfile': 'Completar perfil',
    'layout.page.profile': 'Meu perfil',
    'layout.page.help': 'Central de ajuda',
    'layout.page.siteMap': 'Mapa do site',
    'layout.page.notFound': 'Página não encontrada',
    'navbar.mainNav': 'Navegação principal',
    'navbar.goHome': 'Ir para o início',
    'navbar.brandSubtitle': 'Loja acessível',
    'navbar.nav.home': 'Início',
    'navbar.nav.products': 'Produtos',
    'navbar.nav.cart': 'Carrinho',
    'navbar.nav.orders': 'Pedidos',
    'navbar.authActions': 'Ações de autenticação',
    'navbar.login': 'Entrar',
    'navbar.register': 'Cadastrar',
    'navbar.myAccount': 'Minha conta',
    'navbar.hello': 'Olá',
    'navbar.myProfile': 'Meu perfil',
    'navbar.myOrders': 'Meus pedidos',
    'navbar.preferences': 'Preferências',
    'navbar.logout': 'Sair',
    'navbar.cartCount.one': '{{count}} produto no carrinho',
    'navbar.cartCount.other': '{{count}} produtos no carrinho',
    'navbar.language': 'Idioma',
    'footer.about':
      'Plataforma de comércio eletrônico focada em uma experiência clara, elegante e acessível.',
    'footer.developers': 'Desenvolvedores',
    'footer.navigation': 'Navegação',
    'footer.social': 'Redes sociais',
    'footer.home': 'Início',
    'footer.products': 'Produtos',
    'footer.cart': 'Carrinho',
    'footer.orders': 'Pedidos',
    'footer.help': 'Ajuda e suporte',
    'footer.siteMap': 'Mapa do site',
    'footer.login': 'Entrar',
    'footer.register': 'Cadastro',
    'footer.support': 'Suporte',
    'footer.legal': '© {{year}} Comercio Adaptativo. Todos os direitos reservados.',
    'home.heroKicker': 'Uma loja pensada para todas as pessoas',
    'home.heroSummary':
      'Descubra produtos com uma experiência clara, rápida e personalizável, pensada para tornar a compra simples desde o início.',
    'home.heroProducts': 'Ver produtos',
    'home.heroLogin': 'Entrar',
    'home.quickAccessLabel': 'Ações rápidas',
    'home.quickAccessTitle': 'O que você deseja fazer?',
    'home.quick.products.title': 'Explorar produtos',
    'home.quick.products.description': 'Busque, compare e encontre produtos por categoria.',
    'home.quick.products.link': 'Ir para o catálogo',
    'home.quick.cart.title': 'Revisar meu carrinho',
    'home.quick.cart.description': 'Confira seus produtos e ajuste as quantidades facilmente.',
    'home.quick.cart.link': 'Abrir carrinho',
    'home.quick.register.title': 'Criar uma conta',
    'home.quick.register.description': 'Salve seu perfil para uma experiência mais pessoal.',
    'home.quick.register.link': 'Cadastrar',
    'home.experienceEyebrow': 'Uma experiência melhor',
    'home.experienceTitle': 'Tudo o que importa, fácil de encontrar',
    'home.experienceDescription':
      'A interface reduz etapas desnecessárias e mantém as decisões principais sempre visíveis.',
    'home.feature.search.title': 'Encontre rápido',
    'home.feature.search.description':
      'Busca visível, filtros simples e resultados fáceis de revisar.',
    'home.feature.clarity.title': 'Compre com clareza',
    'home.feature.clarity.description':
      'Preços, disponibilidade e quantidades apresentados sem surpresas.',
    'home.feature.accessibility.title': 'Navegue do seu jeito',
    'home.feature.accessibility.description':
      'Controles acessíveis por teclado e preferências que permanecem com você.',
    'home.experienceAction': 'Ver catálogo completo',
    'home.closingLabel': 'Sua próxima compra começa aqui',
    'home.closingTitle': 'Explore o catálogo no seu ritmo',
    'home.closingAction': 'Começar agora',
    'a11y.openMenu': 'Abrir menu de acessibilidade',
    'a11y.closeMenu': 'Fechar menu de acessibilidade',
    'a11y.menuLabel': 'Menu de acessibilidade',
    'a11y.title': 'Acessibilidade',
    'a11y.subtitle': 'Ajuste a interface sem sair da página atual.',
    'a11y.fontSize.title': 'Tamanho do texto',
    'a11y.fontSize.description': 'Aumente o texto sem perder conteúdo ou funcionalidade.',
    'a11y.fontSize.default': 'Normal',
    'a11y.fontSize.large': 'Grande',
    'a11y.fontSize.extraLarge': 'Muito grande',
    'a11y.contrast.title': 'Contraste',
    'a11y.contrast.description': 'Reforce a diferença entre texto, controles e fundo.',
    'a11y.contrast.default': 'Padrão',
    'a11y.contrast.highContrast': 'Alto contraste',
    'a11y.spacing.title': 'Espaçamento',
    'a11y.spacing.description': 'Amplie o espaço entre letras, palavras e linhas.',
    'a11y.spacing.default': 'Normal',
    'a11y.spacing.increased': 'Ampliado',
    'a11y.motion.title': 'Movimento',
    'a11y.motion.description': 'Reduza transições e animações não essenciais.',
    'a11y.motion.default': 'Normal',
    'a11y.motion.reduced': 'Reduzido',
    'a11y.reset': 'Restabelecer',
    'a11y.applied': 'Preferências aplicadas.',
    'a11y.resetDone': 'Preferências restabelecidas.',
  },
  fr: {
    'app.name': 'Commerce Adaptatif',
    'layout.skipToMain': 'Aller au contenu principal',
    'layout.page.home': 'Accueil',
    'layout.page.products': 'Produits',
    'layout.page.productDetail': 'Détail du produit',
    'layout.page.compare': 'Comparer les produits',
    'layout.page.cart': 'Panier',
    'layout.page.checkout': 'Finaliser l’achat',
    'layout.page.orders': 'Mes commandes',
    'layout.page.login': 'Se connecter',
    'layout.page.register': 'Créer un compte',
    'layout.page.completeProfile': 'Compléter le profil',
    'layout.page.profile': 'Mon profil',
    'layout.page.help': 'Centre d’aide',
    'layout.page.siteMap': 'Plan du site',
    'layout.page.notFound': 'Page introuvable',
    'navbar.mainNav': 'Navigation principale',
    'navbar.goHome': 'Aller à l’accueil',
    'navbar.brandSubtitle': 'Boutique accessible',
    'navbar.nav.home': 'Accueil',
    'navbar.nav.products': 'Produits',
    'navbar.nav.cart': 'Panier',
    'navbar.nav.orders': 'Commandes',
    'navbar.authActions': 'Actions d’authentification',
    'navbar.login': 'Se connecter',
    'navbar.register': 'S’inscrire',
    'navbar.myAccount': 'Mon compte',
    'navbar.hello': 'Bonjour',
    'navbar.myProfile': 'Mon profil',
    'navbar.myOrders': 'Mes commandes',
    'navbar.preferences': 'Préférences',
    'navbar.logout': 'Se déconnecter',
    'navbar.cartCount.one': '{{count}} article dans le panier',
    'navbar.cartCount.other': '{{count}} articles dans le panier',
    'navbar.language': 'Langue',
    'footer.about':
      'Plateforme e-commerce orientée vers une expérience claire, élégante et accessible.',
    'footer.developers': 'Développeurs',
    'footer.navigation': 'Navigation',
    'footer.social': 'Réseaux sociaux',
    'footer.home': 'Accueil',
    'footer.products': 'Produits',
    'footer.cart': 'Panier',
    'footer.orders': 'Commandes',
    'footer.help': 'Aide et support',
    'footer.siteMap': 'Plan du site',
    'footer.login': 'Se connecter',
    'footer.register': 'Inscription',
    'footer.support': 'Support',
    'footer.legal': '© {{year}} Commerce Adaptatif. Tous droits réservés.',
    'home.heroKicker': 'Une boutique pensée pour toutes les personnes',
    'home.heroSummary':
      'Découvrez des produits avec une expérience claire, rapide et personnalisable, conçue pour simplifier l’achat dès le premier instant.',
    'home.heroProducts': 'Voir les produits',
    'home.heroLogin': 'Se connecter',
    'home.quickAccessLabel': 'Accès rapides',
    'home.quickAccessTitle': 'Que souhaitez-vous faire ?',
    'home.quick.products.title': 'Explorer les produits',
    'home.quick.products.description': 'Recherchez, comparez et trouvez des produits par catégorie.',
    'home.quick.products.link': 'Aller au catalogue',
    'home.quick.cart.title': 'Vérifier mon panier',
    'home.quick.cart.description': 'Consultez vos produits et modifiez les quantités facilement.',
    'home.quick.cart.link': 'Ouvrir le panier',
    'home.quick.register.title': 'Créer un compte',
    'home.quick.register.description': 'Enregistrez votre profil pour une expérience plus personnelle.',
    'home.quick.register.link': 'S’inscrire',
    'home.experienceEyebrow': 'Une meilleure expérience',
    'home.experienceTitle': 'Tout l’essentiel, facile à trouver',
    'home.experienceDescription':
      'L’interface réduit les étapes inutiles et garde les décisions clés toujours visibles.',
    'home.feature.search.title': 'Trouvez rapidement',
    'home.feature.search.description':
      'Recherche visible, filtres simples et résultats faciles à examiner.',
    'home.feature.clarity.title': 'Achetez en toute clarté',
    'home.feature.clarity.description':
      'Prix, disponibilité et quantités présentés sans surprise.',
    'home.feature.accessibility.title': 'Naviguez à votre façon',
    'home.feature.accessibility.description':
      'Contrôles accessibles au clavier et préférences conservées.',
    'home.experienceAction': 'Voir le catalogue complet',
    'home.closingLabel': 'Votre prochain achat commence ici',
    'home.closingTitle': 'Explorez le catalogue à votre rythme',
    'home.closingAction': 'Commencer maintenant',
    'a11y.openMenu': 'Ouvrir le menu d’accessibilité',
    'a11y.closeMenu': 'Fermer le menu d’accessibilité',
    'a11y.menuLabel': 'Menu d’accessibilité',
    'a11y.title': 'Accessibilité',
    'a11y.subtitle': 'Ajustez l’interface sans quitter la page actuelle.',
    'a11y.fontSize.title': 'Taille du texte',
    'a11y.fontSize.description':
      'Augmentez la taille du texte sans perdre de contenu ni de fonctionnalité.',
    'a11y.fontSize.default': 'Normal',
    'a11y.fontSize.large': 'Grand',
    'a11y.fontSize.extraLarge': 'Très grand',
    'a11y.contrast.title': 'Contraste',
    'a11y.contrast.description':
      'Renforcez la différence entre le texte, les contrôles et l’arrière-plan.',
    'a11y.contrast.default': 'Par défaut',
    'a11y.contrast.highContrast': 'Contraste élevé',
    'a11y.spacing.title': 'Espacement',
    'a11y.spacing.description': 'Augmentez l’espacement entre lettres, mots et lignes.',
    'a11y.spacing.default': 'Normal',
    'a11y.spacing.increased': 'Augmenté',
    'a11y.motion.title': 'Mouvement',
    'a11y.motion.description': 'Réduisez les transitions et animations non essentielles.',
    'a11y.motion.default': 'Normal',
    'a11y.motion.reduced': 'Réduit',
    'a11y.reset': 'Réinitialiser',
    'a11y.applied': 'Préférences appliquées.',
    'a11y.resetDone': 'Préférences réinitialisées.',
  },
} as const;

type TranslationDictionary = (typeof translations)['es'];
type TranslationKey = keyof TranslationDictionary;

type TranslateParams = Record<string, string | number>;

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const isSupportedLanguage = (value: string | null): value is SupportedLanguage =>
  value !== null && supportedLanguages.includes(value as SupportedLanguage);

const resolveInitialLanguage = (): SupportedLanguage => {
  const storedLanguage = window.localStorage.getItem(i18nStorageKey);

  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return 'es';
};

const interpolate = (template: string, params?: TranslateParams): string => {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => resolveInitialLanguage());

  useEffect(() => {
    window.localStorage.setItem(i18nStorageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams): string => {
      const languageDictionary = translations[language] as TranslationDictionary;
      const fallbackDictionary = translations.es as TranslationDictionary;
      const translatedText = languageDictionary[key] ?? fallbackDictionary[key] ?? key;
      return interpolate(translatedText, params);
    },
    [language],
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const contextValue = useContext(I18nContext);

  if (!contextValue) {
    throw new Error('useI18n debe utilizarse dentro de I18nProvider.');
  }

  return contextValue;
}
