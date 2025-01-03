import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importar useNavigate
import "../styles/LoginPage.css";
import { login } from "../services/api.jsx"; // Importar la función login desde api.jsx

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Para mostrar mensajes al usuario
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password); // Llamada a la función login
      setMessage("Inicio de sesión exitoso.");

      // Verificar si la respuesta es exitosa y redirigir al usuario
      if (data.status === "success") {
        // Redirigir a la página principal (home)
        sessionStorage.setItem('token', data.token) // Guardar el token 
        navigate("/home");
      } else {
        setMessage("Credenciales incorrectas.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error al iniciar sesión. Intenta nuevamente."
      );
      console.error("Error en el inicio de sesión:", error);
    }
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
            {message && (
              <div className="alert alert-info text-center" role="alert">
                {message}
              </div>
            )}
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
