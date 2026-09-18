/**
 * Componente Footer
 * Este componente representa el pie de página de la aplicación.
 * Muestra información de contacto y enlaces importantes del hospital.
 * 
 * Características:
 * - Logo del hospital
 * - Botón de llamada a la acción para agendar citas
 * - Información de contacto (dirección, email, teléfono)
 * - Enlaces a secciones importantes
 * 
 * @returns {React.ReactNode} - Pie de página de la aplicación
 */
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <img 
              src="/LogoSSJ.jpg" 
              alt="Hospital SSJ Logo" 
              className="footer-icon" 
            />
          </div>
          <h2>Hospital SSJ</h2>
          <Link to="/schedule-appointment" className="appointment-button">Agenda una consulta</Link>
        </div>
        
        <div className="footer-contact">
          <h3>COMUNÍCATE CON NOSOTROS</h3>
          
          <div className="contact-info">
            <div className="contact-item">
              <h4>Dirección</h4>
              <p>Calle 45, Poblado, Medellín Antioquia</p>
            </div>
            
            <div className="contact-item">
              <h4>Correo electrónico</h4>
              <p>contacto@hospitalssj.com</p>
            </div>
            
            <div className="contact-item">
              <h4>Teléfono</h4>
              <p>(+57) 123 456 78</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
