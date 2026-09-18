import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateSpecialty.css';

const UpdateSpecialty = ({ especialidades, setEspecialidades }) => {
  const [selectedId, setSelectedId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedId) {
      setError('Por favor selecciona una especialidad');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre de la especialidad es obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMensaje('');

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
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
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