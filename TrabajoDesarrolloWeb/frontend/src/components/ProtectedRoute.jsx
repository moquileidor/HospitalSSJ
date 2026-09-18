import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente ProtectedRoute
 * Este componente protege las rutas que requieren que el usuario esté autenticado.
 * Si el usuario no está autenticado, será redirigido a la página de login.
 * 
 * @param {React.ReactNode} children - Componentes hijos que se renderizarán si el usuario está autenticado
 * @returns {React.ReactNode} - Componente de carga, redirección o contenido protegido
 */
export const ProtectedRoute = ({ children }) => {
  // Obtener el estado de autenticación y carga del contexto
  const { isAuthenticated, loading } = useAuth();

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return <div className="text-center p-5">Cargando...</div>;
  }

  // Si el usuario no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, mostrar el contenido protegido
  return children ? children : <Outlet />;
};

/**
 * Componente RoleRoute
 * Este componente protege las rutas que requieren que el usuario tenga un rol específico.
 * Si el usuario no tiene el rol requerido, será redirigido a la página principal.
 * 
 * @param {string[]} roles - Array de roles permitidos para acceder a la ruta
 * @param {React.ReactNode} children - Componentes hijos que se renderizarán si el usuario tiene el rol correcto
 * @returns {React.ReactNode} - Componente de carga, redirección o contenido protegido
 */
export const RoleRoute = ({ roles, children }) => {
  // Obtener el usuario actual y el estado de carga del contexto
  const { currentUser, loading } = useAuth();

  // Mostrar un indicador de carga mientras se verifica el rol
  if (loading) {
    return <div className="text-center p-5">Cargando...</div>;
  }

  // Si no hay usuario o no tiene un rol permitido, redirigir a la página principal
  if (!currentUser || !roles.includes(currentUser.rol)) {
    return <Navigate to="/" />;
  }

  // Si el usuario tiene el rol correcto, mostrar el contenido protegido
  return children ? children : <Outlet />;
};
