import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <p className="home-kicker">Compra inclusiva y simple</p>
      <h1 id="home-title">Bienvenido a la tienda adaptativa</h1>
      <p className="home-summary">
        Plataforma de comercio electrónico enfocada en usabilidad, accesibilidad y navegación rápida.
      </p>

      <Link className="home-action" to="/products">
        Ver productos
      </Link>
    </section>
  );
}
