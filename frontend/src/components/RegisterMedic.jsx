import React, {useState} from 'react';
import axios from 'axios';
import './RegisterMedic.css';

/**
 * Componente RegisterMedic
 * Este componente maneja el registro de nuevos médicos en el sistema.
 * Permite a los administradores agregar médicos con sus datos básicos y especialidad.
 * 
 * Características principales:
 * - Formulario de registro de médico
 * - Selección de especialidad
 * - Validación de campos
 * - Manejo de errores y éxito
 * 
 * Props:
 * @param {Array} especialidades - Lista de especialidades disponibles
 * @param {Array} medicos - Lista actual de médicos
 * @param {Function} setMedicos - Función para actualizar la lista de médicos
 * 
 * Estados:
 * - nombre: Nombre del médico
 * - email: Correo electrónico
 * - contrasena: Contraseña
 * - id_especialidad: ID de la especialidad seleccionada
 * - mensaje: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Campos requeridos
 * - Formato de email
 * - Contraseña segura
 * - Especialidad válida
 * 
 * @returns {React.ReactNode} - Formulario de registro de médico
 */
const RegisterMedic = ({ especialidades, medicos, setMedicos }) => {
    // Estados para manejar el formulario y mensajes
    const [nombre, setNombre] = useState(''); // Nombre completo del médico
    const [email, setEmail] = useState(''); // Correo electrónico del médico
    const [contrasena, setContrasena] = useState(''); // Contraseña para el acceso al sistema
    const [id_especialidad, setIdEspecialidad] = useState(''); // ID de la especialidad seleccionada
    const [mensaje, setMensaje] = useState(''); // Mensaje de éxito
    const [error, setError] = useState(''); // Mensaje de error
    const [loading, setLoading] = useState(false); // Estado de carga durante el registro

    /**
     * Maneja el envío del formulario de registro de médico
     * Realiza validaciones y envía los datos al backend
     * 
     * @param {Event} e - Evento del formulario
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que todos los campos estén completos
        if (!nombre.trim() || !email.trim() || !contrasena.trim() || id_especialidad === '') {
            setError('Todos los campos son obligatorios');
            setMensaje('');
            return;
        }

        // Validar formato del email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Por favor ingrese un correo electrónico válido');
            return;
        }

        // Validar longitud mínima de la contraseña
        if (contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setMensaje('');

            // Enviar la solicitud de registro al backend
            const response = await axios.post('http://localhost:3000/api/medicos', {
                nombre: nombre.trim(),
                email: email.trim(),
                contrasena,
                id_especialidad: parseInt(id_especialidad, 10)
            });

            setMensaje('Médico registrado correctamente');
            
            // Limpiar el formulario después del registro exitoso
            setNombre('');
            setEmail('');
            setContrasena('');
            setIdEspecialidad('');

            // Actualizar la lista de médicos si se proporcionó la función
            if (setMedicos) {
                setMedicos([
                    ...(medicos || []),
                    { 
                        id_medico: response.data.id, 
                        nombre: nombre.trim(), 
                        email: email.trim(), 
                        id_especialidad: parseInt(id_especialidad, 10) 
                    }
                ]);
            }
            console.log('Médico creado exitosamente:', response.data);
        } catch (err) {
            console.error('Error al registrar al médico:', err);
            setError(err.response?.data?.message || 'Error al registrar al médico. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='admin-action-section'>
            <h2>Registrar Médico</h2>

            {/* Mostrar mensajes de éxito o error */}
            {mensaje && <div className='alert alert-success'>{mensaje}</div>}
            {error && <div className='alert alert-danger'>{error}</div>}

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit}>
                {/* Campo de nombre */}
                <div className='form-group'>
                    <label htmlFor="medic-nombre">Nombre completo</label>
                    <input
                        type='text'
                        className='form-control'
                        id="medic-nombre"
                        placeholder='Ingrese el nombre completo del médico'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de email */}
                <div className='form-group'>
                    <label htmlFor="medic-email">Correo electrónico</label>
                    <input
                        type='email'
                        className='form-control'
                        id="medic-email"
                        placeholder='ejemplo@correo.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de contraseña */}
                <div className='form-group'>
                    <label htmlFor="medic-contrasena">Contraseña</label>
                    <input
                        type='password'
                        className='form-control'
                        id="medic-contrasena"
                        placeholder='Mínimo 6 caracteres'
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {/* Selector de especialidad */}
                <div className='form-group'>
                    <label htmlFor="medic-especialidad">Especialidad médica</label>
                    <select
                        className='form-control'
                        id="medic-especialidad"
                        value={id_especialidad}
                        onChange={e => setIdEspecialidad(e.target.value)}
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

                {/* Botón de envío con estado de carga */}
                <button
                    type='submit'
                    className='btn btn-primary mt-3'
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrar médico'}
                </button>
            </form>
        </div>
    );
};

export default RegisterMedic;