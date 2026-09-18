import React, { createContext, useContext, useState, useEffect } from 'react';
import httpClient from '../config/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Contexto de autenticación
 * Este contexto maneja todo lo relacionado con la autenticación de usuarios:
 * - Estado del usuario actual
 * - Token de autenticación
 * - Funciones de login/logout
 * - Verificación de roles
 * - Renovación de token
 */
const AuthContext = createContext();

/**
 * Hook personalizado para usar el contexto de autenticación
 * Permite acceder a todas las funciones y estados de autenticación desde cualquier componente
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Proveedor del contexto de autenticación
 * Este componente envuelve toda la aplicación y proporciona las funcionalidades
 * de autenticación a todos los componentes hijos
 */
export const AuthProvider = ({ children }) => {
  // Estados para manejar el usuario actual, token y estado de carga
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta al cargar la aplicación
  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage al cargar la app
    const storedUser = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setToken(storedToken);
      httpClient.setToken(storedToken);  // Sincronizar el token con el httpClient
    }
    
    setLoading(false);
  }, []);

  /**
   * Función para iniciar sesión
   * Guarda los datos del usuario y el token en localStorage y actualiza el estado
   * @param {Object} userData - Datos del usuario que inicia sesión
   * @param {string} authToken - Token de autenticación
   */
  const login = (userData, authToken) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    localStorage.setItem('userId', userData.id_usuario); // Guardar el ID del usuario
    setCurrentUser(userData);
    setToken(authToken);
    httpClient.setToken(authToken);  // Sincronizar el token con el httpClient
  };

  /**
   * Función para cerrar sesión
   * Elimina los datos del usuario y el token de localStorage y actualiza el estado
   */
  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Eliminar el ID del usuario
    setCurrentUser(null);
    setToken(null);
    httpClient.setToken(null);  // Limpiar el token en el httpClient
  };

  /**
   * Función para verificar si hay una sesión activa
   * @returns {boolean} - true si hay un usuario y token válidos
   */
  const isAuthenticated = () => {
    return !!currentUser && !!token;
  };

  /**
   * Función para verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} - true si el usuario tiene el rol especificado
   */
  const hasRole = (role) => {
    return currentUser?.rol === role;
  };
  
  /**
   * Función para renovar el token de autenticación
   * Se usa cuando el token está por expirar
   * @returns {Promise<string>} - Nueva token de autenticación
   */
  const renewToken = async () => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.auth.renewToken);
      
      if (!response.ok) {
        throw new Error('Error al renovar el token');
      }
      
      const data = await response.json();
      
      // Actualizar el token y el usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('userId', data.usuario.id_usuario); // Actualizar el ID del usuario
      
      setToken(data.token);
      setCurrentUser(data.usuario);
      httpClient.setToken(data.token);
      
      return data.token;
    } catch (error) {
      console.error('Error al renovar el token:', error);
      // Si hay un error, cerrar la sesión
      logout();
      throw error;
    }
  };

  // Valores y funciones que se proporcionan a través del contexto
  const value = {
    currentUser,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    renewToken
  };

  // Renderizar el proveedor del contexto solo cuando no está cargando
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
