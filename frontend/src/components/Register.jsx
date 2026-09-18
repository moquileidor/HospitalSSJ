import React from 'react';
import './Login/Login.css';

const Register = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Registro</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input type="text" className="form-control" id="name" placeholder="Ingresa tu nombre completo" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" className="form-control" id="password" placeholder="Contraseña" />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register; 