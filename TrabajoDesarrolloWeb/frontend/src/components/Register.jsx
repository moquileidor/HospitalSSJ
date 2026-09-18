/**
 * Componente Register
 * Este componente maneja el proceso de registro de nuevos usuarios.
 * 
 * Características principales:
 * - Formulario de registro
 * - Validación de campos
 * - Validación de formato de email
 * - Validación de contraseña
 * - Manejo de errores
 * - Redirección al login después del registro exitoso
 * 
 * Estados:
 * - success: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Campos requeridos
 * - Formato de email válido
 * - Contraseña de al menos 8 caracteres
 * - Email único en el sistema
 * 
 * Campos del formulario:
 * - nombre: Nombre completo del usuario
 * - email: Correo electrónico
 * - password: Contraseña
 * 
 * @returns {React.ReactNode} - Formulario de registro
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login/Login.css';
import { API_ENDPOINTS } from '../config/api';

const Register = () => {
  // Estados para manejar mensajes y carga
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Hook para la navegación programática
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de registro
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombre = e.target.name.value;
    const email = e.target.email.value;
    const contrasena = e.target.password.value;
    
    // Validación de campos requeridos
    if (!nombre || !email || !contrasena) {
      setError('Todos los campos son obligatorios');
      setSuccess('');
      return;
    }

    // Validación de longitud mínima de contraseña
    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setSuccess('');
      return;
    }
    
    // Validación de formato de email usando expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un correo electrónico válido');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Realizar la petición al backend usando la configuración centralizada
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, contrasena })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error de registro:', error);
      setError(error.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Registro</h2>
        {/* Mostrar mensajes de éxito o error */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {/* Formulario de registro */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              className="form-control" 
              id="name" 
              name="name" 
              placeholder="Ingresa tu nombre completo" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              placeholder="Ingresa tu correo" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              placeholder="Contraseña" 
            />
            <small className="form-text text-muted">La contraseña debe tener al menos 8 caracteres.</small>
          </div>
          {/* Botón de envío con estado de carga */}
          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-3"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 