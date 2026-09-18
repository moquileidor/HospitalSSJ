import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateMedic.css';

/**
 * Componente UpdateMedic
 * Este componente maneja la actualización de información de médicos registrados.
 * Permite a los administradores modificar datos de médicos y sus especialidades.
 * 
 * Características principales:
 * - Formulario de actualización de médico
 * - Selección de médico a actualizar
 * - Modificación de datos personales
 * - Cambio de especialidad
 * - Manejo de errores y éxito
 * 
 * Props:
 * @param {Array} medicos - Lista de médicos registrados
 * @param {Array} especialidades - Lista de especialidades disponibles
 * 
 * Estados:
 * - id_medico: ID del médico seleccionado
 * - nombre: Nombre del médico
 * - email: Correo electrónico
 * - id_especialidad: ID de la especialidad
 * - mensaje: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Campos requeridos
 * - Formato de email
 * - Especialidad válida
 * - Email único en el sistema
 * 
 * @returns {React.ReactNode} - Formulario de actualización de médico
 */
const UpdateMedic = ({ medicos, especialidades }) => {
    // Estados para manejar el formulario y mensajes
    const [selectedId, setSelectedId] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [especialidadId, setEspecialidadId] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');    

    /**
     * Efecto para depuración de datos recibidos
     * Muestra en consola la estructura de los datos de médicos y especialidades
     */
    useEffect(() => {
        console.log('Médicos recibidos (completos):', JSON.stringify(medicos, null, 2));
        console.log('Especialidades recibidas (completas):', JSON.stringify(especialidades, null, 2));
        
        // Verificar estructura de médicos
        if (medicos && medicos.length > 0) {
            console.log('Estructura completa del primer médico:', medicos[0]);
            console.log('Primer médico (claves):', Object.keys(medicos[0]));
            
            const primerMedico = medicos[0];
            console.log('Propiedades del primer médico:');
            console.log('- id:', primerMedico.id);
            console.log('- id_medico:', primerMedico.id_medico);
            console.log('- nombre:', primerMedico.nombre);
            console.log('- especialidad_id:', primerMedico.especialidad_id);
            console.log('- id_especialidad:', primerMedico.id_especialidad);
            console.log('- email:', primerMedico.email);
        }
        
        // Verificar estructura de especialidades
        if (especialidades && especialidades.length > 0) {
            console.log('Estructura completa de la primera especialidad:', especialidades[0]);
            console.log('Primera especialidad (claves):', Object.keys(especialidades[0]));
            
            const primeraEspecialidad = especialidades[0];
            console.log('Propiedades de la primera especialidad:');
            console.log('- id:', primeraEspecialidad.id);
            console.log('- id_especialidad:', primeraEspecialidad.id_especialidad);
            console.log('- nombre:', primeraEspecialidad.nombre);
        }
        
        // Verificar IDs duplicados
        if (medicos && medicos.length > 0) {
            const idCounts = {};
            medicos.forEach(m => {
                const id = m.id_medico || m.id;
                idCounts[id] = (idCounts[id] || 0) + 1;
            });
            
            const duplicados = Object.entries(idCounts).filter(([_, count]) => count > 1);
            if (duplicados.length > 0) {
                console.warn('IDs de médicos duplicados:', duplicados);
            } else {
                console.log('No hay IDs de médicos duplicados');
            }
        }
    }, [medicos, especialidades]);    

    /**
     * Efecto que se ejecuta cuando se selecciona un médico
     * Actualiza los campos del formulario con los datos del médico seleccionado
     */
    useEffect(() => {
        if (selectedId && medicos) {
            const medicoSeleccionado = medicos.find(m => 
                String(m.id) === String(selectedId) || 
                String(m.id_medico) === String(selectedId)
            );
            
            console.log('Médico seleccionado (completo):', medicoSeleccionado);
            
            if (medicoSeleccionado) {
                setNombre(medicoSeleccionado.nombre || '');
                setEmail(medicoSeleccionado.email || '');
                
                let espId = null;
                if (medicoSeleccionado.id_especialidad !== undefined) {
                    espId = medicoSeleccionado.id_especialidad;
                } else if (medicoSeleccionado.especialidad_id !== undefined) {
                    espId = medicoSeleccionado.especialidad_id;
                }
                
                setEspecialidadId(espId !== null ? String(espId) : '');
                console.log('Especialidad ID establecida:', espId !== null ? String(espId) : '');
            }
        } else {
            setNombre('');
            setEmail('');
            setEspecialidadId('');
        }
    }, [selectedId, medicos]);

    /**
     * Obtiene el nombre de una especialidad a partir de su ID
     * @param {string|number} id - ID de la especialidad
     * @returns {string} - Nombre de la especialidad
     */
    const getNombreEspecialidad = (id) => {
        if (!id || !especialidades || especialidades.length === 0) {
            return '';
        }
        
        const idStr = String(id);
        
        // Intentar encontrar la especialidad con cualquiera de las posibles propiedades ID
        let especialidad = especialidades.find(esp => String(esp.id_especialidad) === idStr);
        if (!especialidad) {
            especialidad = especialidades.find(esp => String(esp.id) === idStr);
        }
        
        console.log(`Buscando especialidad con ID ${idStr}:`, especialidad);
        return especialidad ? especialidad.nombre : '';
    };

    /**
     * Maneja el envío del formulario de actualización
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar que se haya seleccionado un médico
        if (!selectedId) {
            setError('Por favor selecciona un médico');
            return;
        }

        // Validar que se haya modificado al menos un campo
        if (!nombre.trim() && !email.trim() && !especialidadId) {
            setError('Debes modificar al menos un campo para actualizar');
            return;
        }

        // Validar formato del email si se proporciona
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setMensaje('');

            // Preparar datos para actualización
            const medicoActualizado = {
                nombre: nombre.trim(),
                email: email.trim(),
                id_especialidad: especialidadId ? parseInt(especialidadId, 10) : undefined
            };

            console.log(`Actualizando médico ID ${selectedId} con datos:`, medicoActualizado);

            // Enviar solicitud de actualización al backend
            const response = await axios.put(`http://localhost:3000/api/medicos/${selectedId}`, medicoActualizado);
            
            console.log('Respuesta del servidor:', response.data);
            setMensaje('Médico actualizado correctamente');
            
            // Limpiar formulario después de actualizar
            setTimeout(() => {
                setSelectedId('');
                setMensaje('');
            }, 3000);
            
        } catch (err) {
            console.error('Error al actualizar el médico:', err);
            
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
    const hayCargando = !medicos || medicos.length === 0 || !especialidades || especialidades.length === 0;

    return (
        <div className="update-medic-container">
            {/* Mostrar mensajes de éxito o error */}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {hayCargando ? (
                <p>Cargando datos...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Selector de médico */}
                    <div className="form-group">
                        <label htmlFor="medico">Seleccione un médico:</label>
                        <select
                            className="form-control"
                            id="medico"
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                        >
                            <option value="">-- Seleccionar médico --</option>
                            {medicos.map((medico) => {
                                const especialidadId = medico.id_especialidad !== undefined ? 
                                    medico.id_especialidad : medico.especialidad_id;
                                
                                const especialidadNombre = getNombreEspecialidad(especialidadId);
                                const medicoId = medico.id_medico || medico.id;
                                
                                return (
                                    <option key={medicoId} value={medicoId}>
                                        {`${medico.nombre || 'Sin nombre'} - ${especialidadNombre} (ID: ${medicoId})`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Campos de edición que aparecen al seleccionar un médico */}
                    {selectedId && (
                        <>
                            {/* Campo de nombre */}
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre completo:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Dejar vacío para no modificar"
                                />
                                <small className="form-text text-muted">
                                    Opcional: Modifica solo si deseas cambiar el nombre
                                </small>
                            </div>

                            {/* Campo de email */}
                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Dejar vacío para no modificar"
                                />
                            </div>

                            {/* Selector de especialidad */}
                            <div className="form-group">
                                <label htmlFor="especialidad">Especialidad médica</label>
                                <select
                                    className="form-control"
                                    id="especialidad"
                                    value={especialidadId}
                                    onChange={e => setEspecialidadId(e.target.value)}
                                    required
                                >
                                    <option value=''>Selecciona una especialidad</option>
                                    {especialidades && especialidades.map(esp => (
                                        <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                            {esp.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                className="btn btn-primary mt-3"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Médico'}
                            </button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
};

export default UpdateMedic;