import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" className="form-control" id="password" placeholder="Contraseña" />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">Entrar</button>
        </form>
        <p className="mt-3">¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};

export default Login;
