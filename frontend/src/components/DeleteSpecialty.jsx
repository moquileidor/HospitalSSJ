import React, { useState } from 'react';
import axios from 'axios';
import './DeleteSpecialty.css';

/**
 * Componente DeleteSpecialty
 * Este componente maneja la eliminación de especialidades médicas.
 * Permite a los administradores eliminar especialidades que no estén en uso.
 * 
 * Características principales:
 * - Formulario de eliminación de especialidad
 * - Selección de especialidad a eliminar
 * - Validación de dependencias
 * - Manejo de errores y éxito
 * 
 * Props:
 * @param {Array} especialidades - Lista de especialidades disponibles
 * @param {Function} setEspecialidades - Función para actualizar la lista de especialidades
 * 
 * Estados:
 * - id_especialidad: ID de la especialidad seleccionada
 * - mensaje: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Especialidad seleccionada
 * - Sin médicos asociados
 * - Sin citas pendientes
 * 
 * @returns {React.ReactNode} - Formulario de eliminación de especialidad
 */
const DeleteSpecialty = ({ especialidades, setEspecialidades }) => {
  // Estados para manejar el formulario y mensajes
  const [selectedId, setSelectedId] = useState(''); // ID de la especialidad seleccionada
  const [loading, setLoading] = useState(false); // Estado de carga durante la eliminación
  const [mensaje, setMensaje] = useState(''); // Mensaje de éxito
  const [error, setError] = useState(''); // Mensaje de error
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado del diálogo de confirmación

  /**
   * Maneja el proceso de eliminación de una especialidad
   * Realiza la petición al backend y actualiza el estado local
   * 
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    if (!selectedId) {
      setError('Por favor selecciona una especialidad');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMensaje('');

      // Enviar la solicitud de eliminación al backend
      await axios.delete(`http://localhost:3000/api/especialidades/${selectedId}`);

      setMensaje('Especialidad eliminada correctamente');
      setSelectedId('');
      setConfirmDelete(false);

      // Actualizar el estado local de especialidades
      setEspecialidades(prev =>
        prev.filter(esp => esp.id_especialidad !== parseInt(selectedId, 10))
      );
    } catch (err) {
      console.error('Error al eliminar la especialidad:', err);
      setError(
        err.response?.data?.message || 
        'Error al eliminar la especialidad. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la confirmación de eliminación
   * Muestra el diálogo de confirmación después de validar la selección
   */
  const handleConfirm = () => {
    if (!selectedId) {
      setError('Por favor selecciona una especialidad');
      return;
    }
    setConfirmDelete(true);
    setError(''); // Limpiar mensajes de error anteriores
  };

  /**
   * Maneja la cancelación de la eliminación
   * Oculta el diálogo de confirmación y limpia los mensajes
   */
  const handleCancel = () => {
    setConfirmDelete(false);
    setError('');
  };

  return (
    <div className="delete-specialty-container">
      <h2>Eliminar Especialidad</h2>

      {/* Mostrar mensajes de éxito o error */}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Selector de especialidad */}
      <div className="form-group">
        <label htmlFor="especialidad">Seleccionar Especialidad a Eliminar</label>
        <select
          className="form-control"
          id="especialidad"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={loading}
        >
          <option value="">Selecciona una especialidad</option>
          {especialidades.map((especialidad) => (
            <option key={especialidad.id_especialidad} value={especialidad.id_especialidad}>
              {especialidad.nombre}
            </option>
          ))}
        </select>
        <small className="form-text text-muted">
          Esta acción no se puede deshacer. Por favor, asegúrese de seleccionar la especialidad correcta.
        </small>
      </div>

      {/* Mostrar botón de eliminación o diálogo de confirmación */}
      {!confirmDelete ? (
        <button
          className="btn btn-danger"
          onClick={handleConfirm}
          disabled={loading || !selectedId}
        >
          Eliminar Especialidad
        </button>
      ) : (
        <div className="confirm-delete">
          <p className="warning-text">
            ¿Estás seguro de que deseas eliminar esta especialidad?
            Esta acción no se puede deshacer.
          </p>
          <div className="confirm-buttons">
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Sí, Eliminar'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteSpecialty; 