import React from 'react';
import './ScheduleAppointment.css';

const ScheduleAppointment = () => {
  return (
    <div className="schedule-appointment-container">
      <h2>Agenda una Consulta</h2>
      <p>
        Completa el formulario a continuación para agendar una consulta con uno de nuestros
        especialistas. Nos pondremos en contacto contigo para confirmar la fecha y hora de tu cita.
      </p>
      <form>
        <div className="form-group">
          <label htmlFor="name">Nombre Completo</label>
          <input type="text" className="form-control" id="name" placeholder="Ingresa tu nombre completo" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo" />
        </div>
        <div className="form-group">
          <label htmlFor="date">Fecha Preferida</label>
          <input type="date" className="form-control" id="date" />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Enviar</button>
      </form>
    </div>
  );
};

export default ScheduleAppointment; 