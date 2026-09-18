/**
 * Componente MoreInfo
 * Este componente muestra una página de información adicional sobre el hospital.
 * Presenta contenido informativo sobre recursos y artículos de salud disponibles
 * para los pacientes.
 * 
 * Características:
 * - Título de la sección
 * - Descripción de los recursos disponibles
 * - Información sobre el blog del hospital
 * 
 * @returns {React.ReactNode} - Página de información adicional
 */
import React from 'react';
import './MoreInfo.css';

const MoreInfo = () => {
  return (
    <div className="more-info-container">
      <h2>Más Información</h2>
      <p>
        En Hospital SSJ, nos esforzamos por mantener a nuestros pacientes informados sobre las
        últimas noticias y avances en el campo de la medicina. Aquí encontrarás recursos y artículos
        que te ayudarán a entender mejor tu salud y bienestar.
      </p>
      <p>
        Visita nuestro blog para obtener más información sobre temas de salud, consejos de expertos y
        mucho más.
      </p>
    </div>
  );
};

export default MoreInfo; 