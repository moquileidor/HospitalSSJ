import React from 'react';
import './DoctorsSection.css';

const DoctorsSection = () => {
  const doctors = [
    {
      name: 'Dr. Santiago Galeano',
      specialty: 'URÓLOGO',
      description: 'Con más de una década de experiencia, El Dr. Galeano es el residente experto en urología general y salud del hombre.',
      image: 'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg'
    },
    {
      name: 'Dr. Jeremy Agudelo',
      specialty: 'GINECÓLOGO Y OBSTETRA',
      description: 'Como médico en jefe de Hospital SSJ, el Dr. Agudelo se especializa en cirugía ginecológica y atención obstétrica.',
      image: 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg'
    },
    {
      name: 'Dr. Jorge Alvarado',
      specialty: 'NEUROCIRUJANO',
      description: 'El Dr. Alvarado cuenta con más de 15 años de experiencia en el área de neuroregeneración.',
      image: 'https://img.freepik.com/free-photo/doctor-smiling-with-stethoscope_1154-36.jpg'
    }
  ];

  return (
    <section className="doctors-section">
      <h2>Conoce a nuestros médicos</h2>
      <div className="doctors-grid">
        {doctors.map((doctor, index) => (
          <div key={index} className="doctor-card">
            <div className="doctor-avatar">
              <img src={doctor.image} alt={doctor.name} />
            </div>
            <h3>{doctor.name}</h3>
            <p className="specialty">{doctor.specialty}</p>
            <p className="description">{doctor.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoctorsSection; 