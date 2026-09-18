import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

/**
 * Componente NavigationBar
 * Este componente renderiza la barra de navegación principal de la aplicación.
 * Muestra diferentes opciones de navegación según el estado de autenticación
 * y el rol del usuario.
 * 
 * Características principales:
 * - Logo y nombre del hospital
 * - Enlaces a secciones principales
 * - Enlaces específicos según el rol del usuario
 * - Opciones de autenticación (login/registro o menú de usuario)
 * 
 * Estados:
 * - currentUser: Usuario actual autenticado
 * - isAuthenticated: Estado de autenticación
 * 
 * Enlaces por rol:
 * - ADMINISTRADOR: Panel de administración
 * - MEDICO: Panel médico
 * - PACIENTE: Agendar citas
 * 
 * @returns {React.ReactNode} - Barra de navegación completa
 */
const NavigationBar = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Link to="/" className="navbar-brand">Hospital SSJ</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/about-us" className="nav-link">Sobre Nosotros</Link>
            <Link to="/services" className="nav-link">Servicios</Link>
            <Link to="/contact" className="nav-link">Contacto</Link>
            
            {/* Links específicos según el rol */}
            {isAuthenticated() && currentUser?.rol === 'ADMINISTRADOR' && (
              <Link className="nav-link" to="/admin">Panel Admin</Link>
            )}
            
            {isAuthenticated() && currentUser?.rol === 'MEDICO' && (
              <Link to="/medico-dashboard" className="nav-link">Panel Médico</Link>
            )}
            
            {isAuthenticated() && (
              <Link to="/schedule-appointment" className="nav-link">Agendar Cita</Link>
            )}
          </Nav>
          
          {/* Botones de autenticación */}
          <div className="d-flex">
            {isAuthenticated() ? (
              <>
                <span className="navbar-text me-3">
                  Hola, {currentUser?.nombre?.split(' ')[0] || 'Usuario'}
                </span>
                <NavDropdown title="Mi Cuenta" id="user-dropdown">
                  <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <LogoutButton />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button">Ingresar</Link>
                <Link to="/register" className="nav-link ms-2">Registrarse</Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
