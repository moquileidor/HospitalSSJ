import React, { useState } from 'react';
import axios from 'axios';
import './DeleteSpecialty.css';

const DeleteSpecialty = ({ especialidades, setEspecialidades }) => {
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!selectedId) {
      setError('Por favor selecciona una especialidad');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMensaje('');

      await axios.delete(`http://localhost:3000/api/especialidades/${selectedId}`);

      setMensaje('Especialidad eliminada correctamente');
      setSelectedId('');
      setConfirmDelete(false);
      // Actualizar el estado local de especialidades
      setEspecialidades(prev =>
        prev.filter(esp => esp.id_especialidad !== parseInt(selectedId))
      );
    } catch (err) {
      console.error('Error al eliminar la especialidad:', err);
      setError(err.response?.data?.message || 'Error al eliminar la especialidad');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedId) {
      setError('Por favor selecciona una especialidad');
      return;
    }
    setConfirmDelete(true);
  };

  const handleCancel = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="delete-specialty-container">
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
          <p>¿Estás seguro de que deseas eliminar esta especialidad?</p>
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