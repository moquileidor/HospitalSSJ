
/**
 * ======== CONFIGURACIÓN DE LA API ========
 * 
 * Este archivo contiene la configuración para conectar con el servidor backend.
 * Define las URLs de la API y proporciona funciones para hacer peticiones.
 */

// URL base de la API, cambia dependiendo de si estamos en producción o desarrollo
// - En producción: usa la URL definida en las variables de entorno de producción
// - En desarrollo: usa la URL local (http://localhost:3000)
const API_URL = import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL_PROD  // URL para el entorno de producción
    : import.meta.env.VITE_API_URL || 'http://localhost:3000';  // URL para desarrollo

/**
 * Objeto que contiene todas las rutas de la API
 * 
 * Este objeto permite acceder fácilmente a todas las URL de la API desde cualquier
 * parte de la aplicación. Así no hay que escribir las URLs completas cada vez.
 */
export const API_ENDPOINTS = {
    // URL para gestionar las especialidades médicas (crear, listar, etc.)
    especialidades: `${API_URL}/api/especialidades`,
    
    // URL para gestionar usuarios (registro, actualización, etc.)
    usuarios: `${API_URL}/api/usuarios`,
    
    // URL para gestionar médicos (crear, listar, etc.)
    medicos: `${API_URL}/api/medicos`,
    
    // URL para gestionar citas médicas
    citas: `${API_URL}/api/citas`,
    
    // URL para gestionar datos personales de los usuarios
    datosPersonales: `${API_URL}/api/datos-personales`,    // URLs relacionadas con la autenticación de usuarios
    auth: {
        login: `${API_URL}/api/auth/login`,           // Para iniciar sesión
        register: `${API_URL}/api/auth/register`,     // Para registrar nuevos usuarios
        renewToken: `${API_URL}/api/auth/renew-token` // Para renovar el token de autenticación
    }
};

/**
 * Función para hacer peticiones HTTP al servidor incluyendo automáticamente el token de autenticación
 * 
 * Esta función es muy importante porque:
 * 1. Facilita hacer peticiones a la API desde cualquier parte de la aplicación
 * 2. Incluye automáticamente el token de autenticación en las peticiones
 * 3. Configura el formato de datos como JSON
 * 
 * @param {string} url - La dirección URL a la que hacer la petición
 * @param {object} options - Opciones adicionales para la petición (método, cuerpo, etc.)
 * @returns {Promise} - Devuelve la respuesta de la petición
 */
export const fetchWithAuth = async (url, options = {}) => {
    // Obtener el token de autenticación guardado en el navegador
    const token = localStorage.getItem('token');
    
    // Configurar las cabeceras por defecto (tipo de contenido)
    const defaultHeaders = {
        'Content-Type': 'application/json'  // Indicar que enviamos y recibimos datos en formato JSON
    };
      // Si existe un token, añadirlo a las cabeceras como autorización
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;  // Formato estándar para enviar tokens
    }
    
    // Crear la configuración final combinando las opciones recibidas con las cabeceras
    const config = {
        ...options,                    // Mantener todas las opciones recibidas (método, cuerpo, etc.)
        headers: {                     // Configurar las cabeceras
            ...defaultHeaders,         // Incluir las cabeceras por defecto
            ...options.headers         // Incluir cabeceras adicionales si se proporcionaron
        }
    };
    
    // Realizar la petición y devolver el resultado
    return fetch(url, config);  // La función fetch es nativa de JavaScript y se usa para hacer peticiones HTTP
};
