import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (!acceptTerms) {
      alert('Debes aceptar los términos y condiciones')
      return
    }
    console.log('Registrar usuario:', { username, email, password, acceptTerms })
  }

  return (
    <div className="register-page">
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ width:'400px', borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", marginBottom: '20px', height: '570px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', height: '600px', padding: '20px' }}>
                <h1 className="text-center mb-4">Registro</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Usuario</label>
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
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
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
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-control"
                            placeholder="Repite tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input
                            id="terms"
                            type="checkbox"
                            className="form-check-input"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <label htmlFor="terms" className="form-check-label">Acepto los términos y condiciones</label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                </form>
                <p className="text-center mt-3">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-primary">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}
