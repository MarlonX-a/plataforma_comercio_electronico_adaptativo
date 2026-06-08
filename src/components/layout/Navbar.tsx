import { useEffect, useMemo, useState } from 'react';
import { FaBoxOpen, FaChevronDown, FaSignOutAlt, FaSlidersH, FaUserCircle } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/LogoPro.png';
import {
  getCurrentAuthSession,
  getUserProfile,
  listenToAuthSession,
  logout,
} from '../../features/auth/services/authService';
import type { AuthSession, UserProfile } from '../../features/auth/types/auth.types';
import {
  cartUpdatedEventName,
  getCartItemCount,
} from '../../features/cart/services/cartService';
import styles from './Navbar.module.css';

const navigationItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Productos', path: '/products' },
  { label: 'Carrito', path: '/cart' },
  { label: 'Pedidos', path: '/orders' },
  { label: 'Accesibilidad', path: '/accessibility' },
] as const;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(() => getCartItemCount());

  const userLabel = useMemo(() => {
    if (userProfile?.fullName?.trim()) {
      return userProfile.fullName.trim();
    }

    if (authSession?.email) {
      return authSession.email.split('@')[0];
    }

    return 'Mi cuenta';
  }, [authSession, userProfile]);

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

  const handleLogout = async () => {
    const result = await logout();

    if (result.isSuccess) {
      setIsProfileMenuOpen(false);
      setUserProfile(null);
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <NavLink to="/" className={styles.brand} aria-label="Ir al inicio">
          <img src={logoImage} alt="" className={styles.brandLogo} aria-hidden="true" />
          <span className={styles.brandContent}>
            <span className={styles.brandName}>Comercio Adaptativo</span>
            <span className={styles.brandSubtitle}>Tienda accesible</span>
          </span>
        </NavLink>

        <div className={styles.navContent}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  {item.label}
                  {item.path === '/cart' && cartItemCount > 0 ? (
                    <span
                      className={styles.cartCount}
                      aria-label={`${cartItemCount} ${
                        cartItemCount === 1 ? 'producto' : 'productos'
                      } en el carrito`}
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>

          {authSession ? (
            <div className={styles.profileMenu}>
              <button
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
                  <span className={styles.profileGreeting}>Hola</span>
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
                    Mi perfil
                  </NavLink>
                  <NavLink to="/orders" onClick={() => setIsProfileMenuOpen(false)}>
                    <FaBoxOpen aria-hidden="true" />
                    Mis pedidos
                  </NavLink>
                  <NavLink to="/accessibility" onClick={() => setIsProfileMenuOpen(false)}>
                    <FaSlidersH aria-hidden="true" />
                    Preferencias
                  </NavLink>
                  <button type="button" onClick={handleLogout}>
                    <FaSignOutAlt aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className={styles.authActions} aria-label="Acciones de autenticación">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? `${styles.authLink} ${styles.authLinkActive}` : styles.authLink
                }
              >
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.authLink} ${styles.authLinkPrimary} ${styles.authLinkActive}`
                    : `${styles.authLink} ${styles.authLinkPrimary}`
                }
              >
                Registrarse
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
