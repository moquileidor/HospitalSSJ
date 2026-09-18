import React, { useMemo, useState } from 'react';
import './ScheduleAppointment.css';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, fetchWithAuth } from '../config/api';

/**
 * Componente ScheduleAppointment
 * Este componente maneja el proceso de agendamiento de citas médicas.
 * Permite a los usuarios autenticados solicitar una cita con un especialista.
 * 
 * Características principales:
 * - Formulario de solicitud de cita
 * - Validación de autenticación
 * - Selección de fecha y hora
 * - Notas adicionales para la cita
 * - Confirmación de solicitud
 * 
 * Estados:
 * - success: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Usuario autenticado
 * - Fecha válida
 * - Campos requeridos
 * 
 * @returns {React.ReactNode} - Formulario de agendamiento de citas
 */
const ScheduleAppointment = () => {
  // Obtener el usuario actual y el estado de autenticación del contexto
  const { currentUser, isAuthenticated } = useAuth();
  // Estados para manejar mensajes y carga
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fechaHora, setFechaHora] = useState('');

  const minFechaHora = useMemo(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }, []);

  /**
   * Maneja el envío del formulario de solicitud de cita
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    
    // Obtener los valores del formulario
    let notas = e.target.notes ? e.target.notes.value : '';
    let id_usuario = currentUser?.id_usuario;
    let email = currentUser?.email;
    let nombre = currentUser?.nombre;

    // Validar que el usuario esté autenticado
    if (!isAuthenticated() || !id_usuario) {
      setError('Debes iniciar sesión para agendar una cita');
      setLoading(false);
      return;
    }
    
    // Validar que se haya seleccionado una fecha
    if (!fechaHora) {
      setError('La fecha y la hora son obligatorias');
      setLoading(false);
      return;
    }

    const fechaSeleccionada = new Date(fechaHora);
    if (Number.isNaN(fechaSeleccionada.getTime())) {
      setError('Selecciona una fecha y hora validas');
      setLoading(false);
      return;
    }

    // Validar que el id_usuario sea un número
    if (typeof id_usuario !== 'number' || isNaN(id_usuario)) {
      setError('Error interno: ID de usuario inválido. Por favor, vuelve a iniciar sesión.');
      setLoading(false);
      return;
    }

    try {
      // Enviar la solicitud de cita al backend
      const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/`, {
        method: 'POST',
        body: JSON.stringify({
          id_usuario,
          fecha_cita: fechaSeleccionada.toISOString(),
          notas
        })
      });

      // Depuración: mostrar status y tipo de respuesta
      console.log('Status de la respuesta:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Respuesta inesperada del servidor: ' + text);
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al agendar la cita');
      }

      setSuccess('Cita agendada exitosamente');
      setError('');
      setFechaHora('');
      if (e.target.notes) {
        e.target.notes.value = '';
      }
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-appointment-container">
      <h2>Agenda una Consulta</h2>
      <p>
        Completa el formulario a continuación para agendar una consulta con uno de nuestros
        especialistas. Nos pondremos en contacto contigo para confirmar la fecha y hora de tu cita.
      </p>
      {/* Mostrar mensajes de éxito o error */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Formulario de solicitud de cita */}
      <form onSubmit={handleSubmit}>
        {/* Mostrar información del usuario si está autenticado */}
        {isAuthenticated() && (
          <>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" className="form-control" value={currentUser?.nombre} readOnly />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" className="form-control" value={currentUser?.email} readOnly />
            </div>
          </>
        )}
        
        {/* Campo de fecha de la cita */}
        <div className="form-group">
          <label htmlFor="date">Fecha y hora preferidas</label>
          <input
            type="datetime-local"
            className="form-control"
            id="date"
            name="date"
            value={fechaHora}
            min={minFechaHora}
            onChange={(event) => setFechaHora(event.target.value)}
            required
          />
          <small className="text-muted">Selecciona la fecha y hora exactas para tu cita.</small>
        </div>
        
        {/* Campo para notas adicionales */}
        <div className="form-group">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea 
            className="form-control" 
            id="notes" 
            name="notes" 
            placeholder="¿Algo que debamos saber?" 
          />
        </div>
        
        {/* Botón de envío con estado de carga */}
        <button 
          type="submit" 
          className="btn btn-primary mt-3" 
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleAppointment; 
