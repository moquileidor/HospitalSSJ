import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contacto</h2>
      <p>Estamos aquí para ayudarte. Puedes contactarnos a través de los siguientes medios:</p>
      <ul>
        <li>Teléfono: (57) 1234 5678</li>
        <li>Email: contacto@hospitalssj.com</li>
        <li>Dirección: Calle 123, Poblado, Medellín Antioquia, CP 12345</li>
      </ul>
      <p>
        Nuestro equipo de atención al cliente está disponible de lunes a viernes, de 8:00 a.m. a 5:00
        p.m., para responder a tus preguntas y programar tus citas.
      </p>
    </div>
  );
};

export default Contact; 