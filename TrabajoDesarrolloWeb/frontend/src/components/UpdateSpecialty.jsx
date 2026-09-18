import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateSpecialty.css';

/**
 * Componente UpdateSpecialty
 * Este componente maneja la actualización de especialidades médicas existentes.
 * Permite a los administradores modificar el nombre de una especialidad.
 * 
 * Características principales:
 * - Formulario de actualización de especialidad
 * - Selección de especialidad a actualizar
 * - Validación de campos
 * - Manejo de errores y éxito
 * 
 * Props:
 * @param {Array} especialidades - Lista de especialidades disponibles
 * @param {Function} setEspecialidades - Función para actualizar la lista de especialidades
 * 
 * Estados:
 * - id_especialidad: ID de la especialidad seleccionada
 * - nombre: Nuevo nombre de la especialidad
 * - mensaje: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Campos requeridos
 * - Nombre único en el sistema
 * 
 * @returns {React.ReactNode} - Formulario de actualización de especialidad
 */
const UpdateSpecialty = ({ especialidades, setEspecialidades }) => {
  // Estados para manejar el formulario y mensajes
  const [selectedId, setSelectedId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  /**
   * Efecto que se ejecuta cuando se selecciona una especialidad
   * Actualiza los campos del formulario con los datos de la especialidad seleccionada
   */
  useEffect(() => {
    if (selectedId) {
      const especialidad = especialidades.find(esp => esp.id_especialidad === parseInt(selectedId));
      if (especialidad) {
        setNombre(especialidad.nombre);
        setDescripcion(especialidad.descripcion || '');
      }
    } else {
      setNombre('');
      setDescripcion('');
    }
  }, [selectedId, especialidades]);

  /**
   * Maneja el envío del formulario de actualización
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado una especialidad
    if (!selectedId) {
      setError('Por favor selecciona una especialidad');
      return;
    }

    // Validar que el nombre no esté vacío
    if (!nombre.trim()) {
      setError('El nombre de la especialidad es obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMensaje('');

      // Enviar la solicitud de actualización al backend
      await axios.put(`http://localhost:3000/api/especialidades/${selectedId}`, {
        nombre
      });

      setMensaje('Especialidad actualizada correctamente');
      // Actualizar el estado local de especialidades
      setEspecialidades(prev =>
        prev.map(esp =>
          esp.id_especialidad === parseInt(selectedId)
            ? { ...esp, nombre }
            : esp
        )
      );
    } catch (err) {
      console.error('Error al actualizar la especialidad:', err);
      setError(err.response?.data?.message || 'Error al actualizar la especialidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-specialty-container">
      {/* Mostrar mensajes de éxito o error */}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulario de actualización */}
      <form onSubmit={handleSubmit}>
        {/* Selector de especialidad */}
        <div className="form-group">
          <label htmlFor="especialidad">Seleccionar Especialidad</label>
          <select
            className="form-control"
            id="especialidad"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Selecciona una especialidad</option>
            {especialidades.map((especialidad) => (
              <option key={especialidad.id_especialidad} value={especialidad.id_especialidad}>
                {especialidad.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de nombre de la especialidad */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Especialidad</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la especialidad"
            required
          />
        </div>

        {/* Botón de envío con estado de carga */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !selectedId}
        >
          {loading ? 'Actualizando...' : 'Actualizar Especialidad'}
        </button>
      </form>
    </div>
  );
};

export default UpdateSpecialty; 