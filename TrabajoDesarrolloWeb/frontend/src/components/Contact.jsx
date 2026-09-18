// Componente Contact
// Este componente muestra la información de contacto del hospital.
// Es una sección estática que aparece en la página de contacto.
// No requiere props ni lógica avanzada, solo muestra datos de contacto y horarios.
import React from 'react';
import './Contact.css';

// Definición del componente funcional Contact
const Contact = () => {
  return (
    <div className="contact-container">
      {/* Título de la sección */}
      <h2>Contacto</h2>
      {/* Descripción breve */}
      <p>Estamos aquí para ayudarte. Puedes contactarnos a través de los siguientes medios:</p>
      {/* Lista de medios de contacto */}
      <ul>
        <li>Teléfono: (57) 1234 5678</li>
        <li>Email: contacto@hospitalssj.com</li>
        <li>Dirección: Calle 123, Poblado, Medellín Antioquia, CP 12345</li>
      </ul>
      {/* Horario de atención */}
      <p>
        Nuestro equipo de atención al cliente está disponible de lunes a viernes, de 8:00 a.m. a 5:00
        p.m., para responder a tus preguntas y programar tus citas.
      </p>
    </div>
  );
};

// Exporta el componente para que pueda ser usado en otras partes de la app
export default Contact; 