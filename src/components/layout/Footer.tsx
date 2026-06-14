import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import uiStyles from '../ui/UiPrimitives.module.css';
import logoImage from '../../assets/images/LogoPro.png';
import styles from './Footer.module.css';

const developers = ['Marlon Alvia', 'Tyrone Mora', 'Rolando Delgado'] as const;

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com', icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: FaInstagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: FaLinkedinIn },
  { label: 'GitHub', href: 'https://github.com', icon: FaGithub },
] as const;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <section className={styles.projectInfo} aria-labelledby="footer-project-title">
          <img src={logoImage} alt="" className={styles.footerLogo} aria-hidden="true" />
          <div>
            <h2 id="footer-project-title" className={styles.footerTitle}>
              Comercio Adaptativo
            </h2>
            <p className={styles.description}>
              Plataforma de comercio electrónico orientada a una experiencia clara, elegante y
              accesible.
            </p>
          </div>
        </section>

        <section className={styles.footerSection} aria-labelledby="footer-developers-title">
          <h2 id="footer-developers-title" className={styles.sectionTitle}>
            Desarrolladores
          </h2>
          <ul className={styles.developerList}>
            {developers.map((developer) => (
              <li key={developer}>{developer}</li>
            ))}
          </ul>
        </section>

        <nav className={styles.footerSection} aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" className={styles.sectionTitle}>
            Navegación
          </h2>
          <ul className={styles.linkList}>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/products">Productos</Link>
            </li>
            <li>
              <Link to="/cart">Carrito</Link>
            </li>
            <li>
              <Link to="/orders">Pedidos</Link>
            </li>
            <li>
              <Link to="/accessibility">Accesibilidad</Link>
            </li>
            <li>
              <Link to="/help">Ayuda y Soporte</Link>
            </li>
            <li>
              <Link to="/site-map">Mapa del sitio</Link>
            </li>
            <li>
              <Link to="/login">Iniciar sesión</Link>
            </li>
            <li>
              <Link to="/register">Registro</Link>
            </li>
            <li>
              <a href="mailto:soporte@comercioadaptativo.local">Soporte</a>
            </li>
          </ul>
        </nav>

        <section className={styles.footerSection} aria-labelledby="footer-social-title">
          <h2 id="footer-social-title" className={styles.sectionTitle}>
            Redes sociales
          </h2>
          <div className={styles.socialList}>
            {socialLinks.map(({ label, href, icon: SocialIcon }) => (
              <a
                key={label}
                className={uiStyles.socialButton}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <SocialIcon aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.legalBar}>
        <p>© 2026 Comercio Adaptativo. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
