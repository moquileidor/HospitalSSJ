import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

/**
 * Componente Login
 * Este componente maneja el proceso de inicio de sesión de los usuarios.
 * 
 * Características principales:
 * - Formulario de inicio de sesión
 * - Validación de campos
 * - Manejo de errores
 * - Redirección según el rol del usuario
 * - Verificación de datos personales
 * 
 * Estados:
 * - success: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Campos requeridos
 * - Formato de email
 * - Credenciales válidas
 * 
 * Redirecciones:
 * - ADMINISTRADOR: Panel de administración
 * - MEDICO: Panel médico
 * - PACIENTE: Dashboard de paciente
 * 
 * @returns {React.ReactNode} - Formulario de inicio de sesión
 */
const Login = () => {
  // Hook para la navegación programática
  const navigate = useNavigate();
  // Obtener la función de login del contexto de autenticación
  const { login } = useAuth();
  
  // Estados para manejar mensajes y carga
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Maneja el envío del formulario de inicio de sesión
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Validación de campos requeridos
    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      setSuccess('');
      return;
    }
    
    try {
      setLoading(true);
      setSuccess('');
      setError('');
      
      // Realizar la petición al backend usando la configuración centralizada
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          contrasena: password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      // Usar el contexto de autenticación para hacer login
      login(data.usuario, data.token);

      // Verificar si el usuario tiene datos personales
      try {
        const datosPersonalesResponse = await fetch(
          `${API_ENDPOINTS.datosPersonales}/${data.usuario.id_usuario}`,
          {
            headers: {
              'Authorization': `Bearer ${data.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const datosPersonalesData = await datosPersonalesResponse.json();

        setSuccess('Inicio de sesión exitoso');
        setLoading(false);

        // Redirigir según el rol y si tiene datos personales
        if (data.usuario.rol === 'ADMINISTRADOR') {
          navigate('/admin');
        } else if (data.usuario.rol === 'MEDICO') {
          navigate('/dashboard');
        } else {
          // Si no tiene datos personales o hay error, redirigir a completar perfil
          if (!datosPersonalesResponse.ok || !datosPersonalesData.success) {
            navigate('/completar-perfil');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        // Si hay error al obtener datos personales, redirigir a completar perfil
        if (data.usuario.rol === 'ADMINISTRADOR') {
          navigate('/admin');
        } else if (data.usuario.rol === 'MEDICO') {
          navigate('/medico-dashboard');
        } else {
          navigate('/completar-perfil');
        }
      }
    } catch (error) {
      console.error('Error de login:', error);
      setError(error.message || 'Credenciales inválidas');
      setSuccess('');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        {/* Mostrar mensajes de éxito o error */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit}>
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
          </div>
          {/* Botón de envío con estado de carga */}
          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-3"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
        {/* Enlace para registro de nuevos usuarios */}
        <p className="mt-3">¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};

export default Login;
