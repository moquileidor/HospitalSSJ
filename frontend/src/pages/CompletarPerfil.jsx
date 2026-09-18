import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import './CompletarPerfil.css';

/**
 * Componente CompletarPerfil
 * Este componente maneja el proceso de completar el perfil de usuario.
 * Se muestra cuando un usuario se registra por primera vez y necesita
 * proporcionar información personal adicional.
 * 
 * Incluye:
 * - Formulario para datos personales
 * - Validación de autenticación
 * - Verificación de datos existentes
 * - Manejo de errores
 * - Redirección automática
 * 
 * @returns {React.ReactNode} - Formulario de completar perfil
 */
const CompletarPerfil = () => {
    // Hook para la navegación programática
    const navigate = useNavigate();
    // Obtener el usuario actual y el token del contexto de autenticación
    const { currentUser, token } = useAuth();
    
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        genero: ''
    });
    // Estados para manejar errores y carga
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Efecto que se ejecuta al cargar el componente
     * Verifica la autenticación y si el usuario ya tiene datos personales
     */
    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!currentUser || !token) {
            navigate('/login');
            return;
        }
        // Verificar si ya tiene datos personales
        const checkDatosPersonales = async () => {
            try {
                const response = await axios.get(
                    `${API_ENDPOINTS.datosPersonales}/${currentUser.id_usuario}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.data) {
                    // Si ya tiene datos personales, redirigir al dashboard
                    navigate('/dashboard');
                }
            } catch (error) {
                // Si no tiene datos personales, no hacer nada
            }
        };
        checkDatosPersonales();
    }, [currentUser, token, navigate]);

    /**
     * Maneja los cambios en los campos del formulario
     * @param {Event} e - Evento del cambio en el input
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Maneja el envío del formulario
     * Envía los datos personales al backend
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!currentUser?.id_usuario) {
                throw new Error('No se pudo obtener el ID del usuario');
            }

            const response = await axios.post(
                API_ENDPOINTS.datosPersonales,
                {
                    ...formData,
                    id_usuario: currentUser.id_usuario
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                // Redirigir al dashboard después de completar el perfil
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error al guardar datos personales:', error);
            setError(error.response?.data?.message || 'Error al guardar los datos personales');
        } finally {
            setLoading(false);
        }
    };    return (
        <div className="completar-perfil-container">
            {/* Encabezado del formulario */}
        <div className="completar-perfil-header">
                <div className="completar-perfil-logo">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h2 className="completar-perfil-title">
                    Completa tu perfil
                </h2>
                <p className="completar-perfil-subtitle">
                    Por favor, proporciona tus datos personales para continuar
                </p>
            </div>

            {/* Contenedor del formulario */}            <div className="completar-perfil-form-container">
                <div className="form-progress">
                    <div className="progress-indicator">
                        <div className="progress-bar"></div>
                    </div>
                </div>
                <form className="completar-perfil-form" onSubmit={handleSubmit}>
                    {/* Mostrar mensaje de error si existe */}
                    {error && (
                        <div className="error-alert">
                            {error}
                        </div>
                    )}                    {/* Campo de fecha de nacimiento */}
                    <div className="form-group">
                        <label htmlFor="fechaNacimiento" className="form-label">
                            Fecha de Nacimiento
                            <span className="tooltip-icon" title="Ingresa tu fecha de nacimiento en formato DD/MM/AAAA">ℹ️</span>
                        </label>
                        <input
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            type="date"
                            required
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            className="form-control"
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Campo de dirección */}
                    <div className="form-group">
                        <label htmlFor="direccion" className="form-label">
                            Dirección
                        </label>
                        <input
                            id="direccion"
                            name="direccion"
                            type="text"
                            required
                            placeholder="Ingresa tu dirección completa"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Campo de teléfono */}
                    <div className="form-group">
                        <label htmlFor="telefono" className="form-label">
                            Teléfono
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            required
                            placeholder="Ingresa tu número telefónico"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Campo de género */}
                    <div className="form-group">
                        <label htmlFor="genero" className="form-label">
                            Género
                        </label>
                        <select
                            id="genero"
                            name="genero"
                            required
                            value={formData.genero}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Selecciona un género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    {/* Botón de envío */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Guardando...' : 'Guardar Datos'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompletarPerfil; 