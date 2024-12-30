import { Link } from "react-router-dom";
import { Button } from "../components/button"
import '../styles/HomePage.css';

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="bg-primary text-light py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="fs-1 font-weight-bold">Newsly</h1>
          <nav>
            <Link to="/login">
              <Button variant="light" className="me-2">Iniciar sesión</Button>
            </Link>
            <Link to="/register">
              <Button variant="light">Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow-1 container py-8">
        <section className="text-center mb-5">
          <h2 className="h1 font-weight-bold mb-4 mt-4">Bienvenido a Newsly</h2>
          <p className="lead text-muted mb-4">
            Tu buscador de noticias personalizadas
          </p>
          <Link to="/login">
            <Button size="lg" variant="primary">Comienza ahora</Button>
          </Link>
        </section>

        <section className="row row-cols-1 row-cols-md-3 g-4 mb-5">
          <div className="col">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="h5 font-weight-semibold mb-2">Personalización</h3>
                <p>Recibe noticias adaptadas a tus intereses y preferencias.</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="h5 font-weight-semibold mb-2">Diversidad</h3>
                <p>Accede a una amplia variedad de fuentes de noticias confiables.</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="h5 font-weight-semibold mb-2">Actualización</h3>
                <p>Mantente informado con las últimas noticias en tiempo real.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="h3 font-weight-bold mb-4">¿Listo para estar mejor informado?</h2>
          <Link to="/register">
            <Button size="lg" variant="primary">Únete a Newsly</Button>
          </Link>
        </section>
      </main>

      <footer className="bg-muted py-4">
        <div className="container text-center">
          <p>&copy; 2023 Newsly. Todos los derechos reservados.</p>
          <nav className="mt-3">
            <Link href="/about" className="text-primary mx-2">Acerca de</Link>
            <Link href="/privacy" className="text-primary mx-2">Privacidad</Link>
            <Link href="/terms" className="text-primary mx-2">Términos</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
