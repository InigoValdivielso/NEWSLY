import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoGoogle from "../assets/images/googleLogo.png";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar el inicio de sesión
    console.log("Iniciar sesión con:", { username, password });
  };
  const handleGoogleLogin = () => {
    console.log("Iniciar sesión con Google");
    // Aquí iría la lógica para manejar el inicio de sesión con Google
  };

  return (
    <div className="login-page">
      <div
        className="d-flex align-items-center justify-content-center bg-light"
        style={{ borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 5)" }}
      >
        <div
          className="card w-100"
          style={{ maxWidth: "400px", padding: "20px" }}
        >
          <div
            className="card-header text-center"
            style={{ backgroundColor: "transparent" }}
          >
            <h3>Iniciar Sesión en Newsly</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Iniciar Sesión
              </button>
            </form>
            <button
              onClick={handleGoogleLogin}
              className="btn btn-dark w-100 mb-3 mt-3 d-flex align-items-center justify-content-center"
            >
              <img
                src={logoGoogle}
                alt="Google"
                style={{ width: "20px", marginRight: "8px" }}
              />
              Iniciar sesión con Google
            </button>
          </div>
          <div
            className="card-footer text-center"
            style={{ backgroundColor: "transparent" }}
          >
            <p className="mb-0">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-primary text-decoration-underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
