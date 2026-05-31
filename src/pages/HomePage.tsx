import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <h1>Bienvenido a la tienda adaptativa</h1>
      <p>
        Plataforma de comercio electrónico enfocada en usabilidad y accesibilidad.
      </p>

      <Link to="/products">
        Ver productos
      </Link>
    </>
  )
}
