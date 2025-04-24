import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavigationBar = () => {
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
          </Nav>
          <Link to="/login" className="login-button">Ingresar</Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
