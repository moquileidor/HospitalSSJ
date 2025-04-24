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
              src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png" 
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
              <p>Calle 123, Poblado, Medellín Antioquia, CP 12345</p>
            </div>
            
            <div className="contact-item">
              <h4>Correo electrónico</h4>
              <p>hola@sitioincreible.com</p>
            </div>
            
            <div className="contact-item">
              <h4>Teléfono</h4>
              <p>(57) 1234 5678</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
