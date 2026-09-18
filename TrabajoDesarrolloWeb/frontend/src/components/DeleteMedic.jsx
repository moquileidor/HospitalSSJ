/**
 * Componente DeleteMedic
 * Este componente maneja la eliminación de médicos del sistema.
 * Permite a los administradores eliminar médicos que no tengan citas activas.
 * 
 * Características principales:
 * - Formulario de eliminación de médico
 * - Selección de médico a eliminar
 * - Validación de citas activas
 * - Manejo de errores y éxito
 * 
 * Props:
 * @param {Array} medicos - Lista de médicos registrados
 * @param {Array} especialidades - Lista de especialidades disponibles
 * @param {Function} onMedicoDeleted - Callback al eliminar un médico
 * 
 * Estados:
 * - id_medico: ID del médico seleccionado
 * - mensaje: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Médico seleccionado
 * - Sin citas pendientes
 * - Sin citas confirmadas
 * 
 * @returns {React.ReactNode} - Formulario de eliminación de médico
 */
import React, { useState } from 'react';
import axios from 'axios';
import './DeleteMedic.css';

const DeleteMedic = ({ medicos, especialidades, onMedicoDeleted }) => {
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Obtener el nombre de la especialidad según su ID
    const getNombreEspecialidad = (id) => {
        // Si no hay ID o no hay especialidades, devolver "No asignada"
        if (!id || !especialidades || especialidades.length === 0) {
            return '';
        }
        
        // Convertir id a string para comparación segura
        const idStr = String(id);
        
        // Intentar encontrar la especialidad con cualquiera de las posibles propiedades ID
        let especialidad = especialidades.find(esp => String(esp.id_especialidad) === idStr);
        if (!especialidad) {
            especialidad = especialidades.find(esp => String(esp.id) === idStr);
        }
        
        return especialidad ? especialidad.nombre : 'No asignada';
    };

    // Obtener los datos del médico seleccionado
    const getMedicoSeleccionado = () => {
        if (!selectedId || !medicos) return null;
        
        return medicos.find(m => 
            String(m.id) === String(selectedId) || 
            String(m.id_medico) === String(selectedId)
        );
    };

    // Manejar eliminación del médico
    const handleDelete = async () => {
        if (!selectedId) {
            setError('Por favor selecciona un médico');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setMensaje('');

            // Realizar la petición para eliminar el médico
            await axios.delete(`http://localhost:3000/api/medicos/${selectedId}`);
            
            setMensaje('Médico eliminado correctamente');
            
            // Limpiar selección después de eliminar
            setSelectedId('');
            setConfirmDelete(false);
            
            // Notificar al componente padre para actualizar la lista
            if (onMedicoDeleted) {
                onMedicoDeleted();
            }
            
        } catch (err) {
            console.error('Error al eliminar el médico:', err);
            
            // Mostrar detalles del error si están disponibles
            if (err.response) {
                console.error('Respuesta de error del servidor:', err.response.data);
                setError(err.response.data.message || `Error ${err.response.status}: ${err.response.statusText}`);
            } else {
                setError('Error al conectar con el servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    // Verificar si hay datos cargados
    const hayCargando = !medicos || medicos.length === 0;
    const medicoSeleccionado = getMedicoSeleccionado();

    return (
        <div className="delete-medic-container">
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {hayCargando ? (
                <p>Cargando datos...</p>
            ) : (
                <>
                    <div className="form-group">
                        <label htmlFor="medico">Seleccione un médico para eliminar:</label>
                        <select
                            className="form-control"
                            id="medico"
                            value={selectedId}
                            onChange={(e) => {
                                setSelectedId(e.target.value);
                                setConfirmDelete(false); // Resetear confirmación cuando se cambia la selección
                            }}
                        >
                            <option value="">-- Seleccionar médico --</option>
                            {medicos.map((medico) => {
                                // Determinar qué propiedad de especialidad usar
                                const especialidadId = medico.id_especialidad !== undefined ? 
                                    medico.id_especialidad : medico.especialidad_id;
                                
                                // Obtener nombre de especialidad
                                const especialidadNombre = getNombreEspecialidad(especialidadId);
                                
                                // Determinar qué ID usar para el médico
                                const medicoId = medico.id_medico || medico.id;
                                
                                return (
                                    <option key={medicoId} value={medicoId}>
                                        {`${medico.nombre || 'Sin nombre'} - ${especialidadNombre} (ID: ${medicoId})`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {selectedId && medicoSeleccionado && !confirmDelete && (
                        <div className="medic-info">
                            <h4>Información del médico</h4>
                            <p><strong>Nombre:</strong> {medicoSeleccionado.nombre}</p>
                            <p><strong>Email:</strong> {medicoSeleccionado.email}</p>
                            <p><strong>Especialidad:</strong> {
                                getNombreEspecialidad(
                                    medicoSeleccionado.id_especialidad !== undefined ? 
                                    medicoSeleccionado.id_especialidad : medicoSeleccionado.especialidad_id
                                )
                            }</p>
                            
                            <button 
                                className="btn btn-danger"
                                onClick={() => setConfirmDelete(true)}
                                disabled={loading}
                            >
                                Eliminar este médico
                            </button>
                        </div>
                    )}

                    {selectedId && confirmDelete && (
                        <div className="confirm-delete">
                            <div className="alert alert-warning">
                                <p><strong>¿Estás seguro de que deseas eliminar este médico?</strong></p>
                                <p>Esta acción no se puede deshacer.</p>
                            </div>
                            
                            <div className="btn-group">
                                <button 
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? 'Eliminando...' : 'Sí, eliminar'}
                                </button>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmDelete(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DeleteMedic;
