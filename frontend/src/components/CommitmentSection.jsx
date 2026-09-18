import React from 'react';
import './CommitmentSection.css';
import { Link } from 'react-router-dom';

const CommitmentSection = () => {
  return (
    <section className="commitment-section">
      <div className="heart-icon">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3004/3004458.png" 
          alt="Heart Icon" 
        />
      </div>
      <h1>Comprometidos contigo</h1>
      <p>
        Somos el centro de atención médica más confiable de la región. Contamos con un equipo de
        expertos médicos altamente capacitados, instalaciones modernas y un compromiso
        inquebrantable con el bienestar de nuestros pacientes.
      </p>
      <Link to="/more-info" className="info-button">Más información</Link>
    </section>
  );
};

export default CommitmentSection; 