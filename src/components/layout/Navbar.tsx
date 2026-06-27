import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaBoxOpen,
  FaChevronDown,
  FaPlusCircle,
  FaSignOutAlt,
  FaSlidersH,
  FaStore,
  FaUserCircle,
} from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/LogoPro.png';
import {
  languageLabels,
  supportedLanguages,
  useI18n,
} from '../../features/i18n/I18nProvider';
import {
  getCurrentAuthSession,
  getUserProfile,
  listenToAuthSession,
  logout,
} from '../../features/auth/services/authService';
import type { AuthSession, UserProfile } from '../../features/auth/types/auth.types';
import { canManageProducts } from '../../features/products/services/productManagementService';
import {
  cartUpdatedEventName,
  getCartItemCount,
} from '../../features/cart/services/cartService';
import styles from './Navbar.module.css';

const navigationItems = [
  { labelKey: 'navbar.nav.home', path: '/' },
  { labelKey: 'navbar.nav.products', path: '/products' },
  { labelKey: 'navbar.nav.cart', path: '/cart' },
  { labelKey: 'navbar.nav.orders', path: '/orders' },
] as const;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(() => getCartItemCount());
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const userLabel = useMemo(() => {
    if (userProfile?.fullName?.trim()) {
      return userProfile.fullName.trim();
    }

    if (authSession?.email) {
      return authSession.email.split('@')[0];
    }

    return t('navbar.myAccount');
  }, [authSession, userProfile, t]);

  const canAccessSellerTools = canManageProducts(userProfile?.role);

  useEffect(() => {
    let isMounted = true;

    getCurrentAuthSession().then((session) => {
      if (isMounted) {
        setAuthSession(session);
      }
    });

    const unsubscribe = listenToAuthSession((session) => {
      setAuthSession(session);
      setUserProfile(null);
      setIsProfileMenuOpen(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authSession) {
      return;
    }

    let isMounted = true;

    getUserProfile(authSession.userId).then((profile) => {
      if (isMounted) {
        setUserProfile(profile);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [authSession, location.pathname]);

  useEffect(() => {
    const refreshProfile = () => {
      if (!authSession) {
        return;
      }

      getUserProfile(authSession.userId).then((profile) => {
        setUserProfile(profile);
      });
    };

    window.addEventListener('auth-profile-updated', refreshProfile);

    return () => {
      window.removeEventListener('auth-profile-updated', refreshProfile);
    };
  }, [authSession]);

  useEffect(() => {
    const refreshCartCount = () => {
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener(cartUpdatedEventName, refreshCartCount);

    return () => {
      window.removeEventListener(cartUpdatedEventName, refreshCartCount);
    };
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsProfileMenuOpen(false);
      profileButtonRef.current?.focus();
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    const result = await logout();

    if (result.isSuccess) {
      setIsProfileMenuOpen(false);
      setUserProfile(null);
      navigate('/');
    }
  };

  const openAccessibilityMenu = () => {
    window.dispatchEvent(new CustomEvent('open-accessibility-menu'));
    setIsProfileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={t('navbar.mainNav')}>
        <NavLink
          to="/"
          className={styles.brand}
          aria-label={t('navbar.goHome')}
          onClick={() => setIsProfileMenuOpen(false)}
        >
          <img src={logoImage} alt="" className={styles.brandLogo} aria-hidden="true" />
          <span className={styles.brandContent}>
            <span className={styles.brandName}>{t('app.name')}</span>
            <span className={styles.brandSubtitle}>{t('navbar.brandSubtitle')}</span>
          </span>
        </NavLink>

        <div className={styles.navContent}>
          <label className={styles.languageControl}>
            <span>{t('navbar.language')}</span>
            <select
              className={styles.languageSelector}
              value={language}
              onChange={(event) => setLanguage(event.target.value as (typeof supportedLanguages)[number])}
              aria-label={t('navbar.language')}
            >
              {supportedLanguages.map((supportedLanguage) => (
                <option key={supportedLanguage} value={supportedLanguage}>
                  {languageLabels[supportedLanguage]}
                </option>
              ))}
            </select>
          </label>

          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsProfileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  {t(item.labelKey)}
                  {item.path === '/cart' && cartItemCount > 0 ? (
                    <span
                      className={styles.cartCount}
                      aria-label={
                        cartItemCount === 1
                          ? t('navbar.cartCount.one', { count: cartItemCount })
                          : t('navbar.cartCount.other', { count: cartItemCount })
                      }
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
            {canAccessSellerTools ? (
              <li>
                <NavLink
                  to="/seller/products/new"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  {t('navbar.nav.addProduct')}
                </NavLink>
              </li>
            ) : null}
          </ul>

          {authSession ? (
            <div ref={profileMenuRef} className={styles.profileMenu}>
              <button
                ref={profileButtonRef}
                className={styles.profileButton}
                type="button"
                aria-expanded={isProfileMenuOpen}
                aria-controls="profile-menu"
                onClick={() => setIsProfileMenuOpen((currentValue) => !currentValue)}
              >
                <span className={styles.profileAvatar} aria-hidden="true">
                  {userLabel.charAt(0).toUpperCase()}
                </span>
                <span className={styles.profileText}>
                  <span className={styles.profileGreeting}>{t('navbar.hello')}</span>
                  <span className={styles.profileName}>{userLabel}</span>
                </span>
                <FaChevronDown aria-hidden="true" />
              </button>

              {isProfileMenuOpen ? (
                <div id="profile-menu" className={styles.profileDropdown}>
                  <div className={styles.profileHeader}>
                    <strong>{userLabel}</strong>
                    <span>{authSession.email}</span>
                  </div>

                  <NavLink to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                    <FaUserCircle aria-hidden="true" />
                    {t('navbar.myProfile')}
                  </NavLink>
                  <NavLink to="/orders" onClick={() => setIsProfileMenuOpen(false)}>
                    <FaBoxOpen aria-hidden="true" />
                    {t('navbar.myOrders')}
                  </NavLink>
                  {canAccessSellerTools ? (
                    <>
                      <NavLink to="/seller/products/new" onClick={() => setIsProfileMenuOpen(false)}>
                        <FaPlusCircle aria-hidden="true" />
                        {t('navbar.addProduct')}
                      </NavLink>
                      <NavLink to="/seller/products" onClick={() => setIsProfileMenuOpen(false)}>
                        <FaStore aria-hidden="true" />
                        {t('navbar.workerPanel')}
                      </NavLink>
                    </>
                  ) : null}
                  <button type="button" onClick={openAccessibilityMenu}>
                    <FaSlidersH aria-hidden="true" />
                    {t('navbar.preferences')}
                  </button>
                  <button type="button" onClick={handleLogout}>
                    <FaSignOutAlt aria-hidden="true" />
                    {t('navbar.logout')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className={styles.authActions} aria-label={t('navbar.authActions')}>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? `${styles.authLink} ${styles.authLinkActive}` : styles.authLink
                }
              >
                {t('navbar.login')}
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.authLink} ${styles.authLinkPrimary} ${styles.authLinkActive}`
                    : `${styles.authLink} ${styles.authLinkPrimary}`
                }
              >
                {t('navbar.register')}
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
