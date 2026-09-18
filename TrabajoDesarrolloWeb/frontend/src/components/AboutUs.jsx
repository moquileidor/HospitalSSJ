// Componente AboutUs
// Este componente muestra información sobre el hospital y su misión.
// Es una sección estática que aparece en la página principal o en la sección 'Sobre Nosotros'.
// No requiere props ni lógica avanzada, solo muestra texto informativo.
import React from 'react';
import './AboutUs.css';

// Definición del componente funcional AboutUs
const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Título de la sección */}
      <h2>Sobre Nosotros</h2>
      {/* Primer párrafo: misión y enfoque */}
      <p>
        En Hospital SSJ, nos dedicamos a proporcionar atención médica de calidad con un enfoque en la
        innovación y el cuidado del paciente. Nuestra misión es mejorar la salud y el bienestar de
        nuestra comunidad a través de servicios médicos excepcionales.
      </p>
      {/* Segundo párrafo: historia y equipo */}
      <p>
        Fundado en 1990, nuestro hospital ha crecido para convertirse en un líder en atención médica
        en la región, con un equipo de profesionales altamente capacitados y tecnología de vanguardia.
      </p>
    </div>
  );
};

// Exporta el componente para que pueda ser usado en otras partes de la app
export default AboutUs; 