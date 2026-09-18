
/**
 * ======== CLIENTE HTTP ========
 * 
 * Este archivo crea un sistema avanzado de comunicación con el servidor que:
 * - Maneja automáticamente la autenticación
 * - Renueva tokens expirados automáticamente
 * - Proporciona métodos fáciles para hacer peticiones (GET, POST, PUT, DELETE)
 * - Gestiona errores de forma centralizada
 */

// Importar las URLs del API definidas en api.jsx
import { API_ENDPOINTS } from "./api";

/**
 * Clase que maneja las peticiones HTTP al servidor con gestión de tokens
 * Esta clase es más avanzada que la función fetchWithAuth porque puede
 * renovar tokens automáticamente cuando expiran
 */
class HttpClient {
  /**
   * Constructor: se ejecuta al crear una instancia del cliente HTTP
   * Inicializa el cliente con el token almacenado en el navegador (si existe)
   */
  constructor() {
    // Intentar obtener el token guardado en el navegador
    this.token = localStorage.getItem('token');
  }
  /**
   * Guarda o elimina el token de autenticación
   * 
   * @param {string|null} token - El nuevo token a guardar, o null para eliminar el token actual
   * 
   * Esta función:
   * 1. Actualiza el token en la memoria del cliente
   * 2. Guarda el token en el almacenamiento local del navegador
   * 3. Si se pasa null, elimina el token (cierra la sesión)
   */
  setToken(token) {
    this.token = token; // Guarda el token en la instancia

    if (token) {
      // Si hay token, guardarlo en el navegador
      localStorage.setItem('token', token);
    } else {
      // Si no hay token, eliminar el que pudiera haber (cerrar sesión)
      localStorage.removeItem('token');
    }
  }
  /**
   * Prepara las cabeceras HTTP para las peticiones
   * 
   * @returns {Object} - Un objeto con las cabeceras configuradas
   * 
   * Esta función:
   * 1. Crea cabeceras para enviar y recibir datos en formato JSON
   * 2. Si hay un token disponible, lo incluye como cabecera de autorización
   */
  getHeaders() {
    // Crear cabeceras básicas (indicando que trabajamos con JSON)
    const headers = {
      'Content-Type': 'application/json'
    };

    // Si hay un token de autenticación disponible, añadirlo
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;  // Formato estándar Bearer
    }

    return headers;  // Devolver las cabeceras completas
  }
  /**
   * Realiza una petición GET (obtener datos) al servidor
   * 
   * @param {string} url - La URL a la que hacer la petición
   * @returns {Promise} - La respuesta del servidor
   * 
   * El método GET se usa para solicitar datos, como una lista de médicos, 
   * detalles de usuario, etc.
   */
  async get(url) {
    return this.request(url, {
      method: 'GET'  // Método HTTP para obtener datos
    });
  }

  /**
   * Realiza una petición POST (enviar datos nuevos) al servidor
   * 
   * @param {string} url - La URL a la que hacer la petición
   * @param {Object} data - Los datos a enviar al servidor
   * @returns {Promise} - La respuesta del servidor
   * 
   * El método POST se usa para crear nuevos recursos, como registrar un usuario,
   * crear una cita, etc.
   */
  async post(url, data) {
    return this.request(url, {
      method: 'POST',  // Método HTTP para crear
      body: JSON.stringify(data)  // Convertir datos a formato JSON
    });
  }
  /**
   * Realiza una petición PUT (actualizar datos) al servidor
   * 
   * @param {string} url - La URL a la que hacer la petición
   * @param {Object} data - Los datos actualizados a enviar
   * @returns {Promise} - La respuesta del servidor
   * 
   * El método PUT se usa para actualizar recursos existentes, como
   * actualizar el perfil de usuario, modificar una cita, etc.
   */
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',  // Método HTTP para actualizar
      body: JSON.stringify(data)  // Convertir datos a formato JSON
    });
  }

  /**
   * Realiza una petición DELETE (eliminar datos) al servidor
   * 
   * @param {string} url - La URL a la que hacer la petición
   * @returns {Promise} - La respuesta del servidor
   * 
   * El método DELETE se usa para eliminar recursos, como
   * cancelar una cita, eliminar un médico, etc.
   */
  async delete(url) {
    return this.request(url, {
      method: 'DELETE'  // Método HTTP para eliminar
    });
  }
  /**
   * Método central que procesa todas las peticiones HTTP
   * 
   * @param {string} url - La URL a la que hacer la petición
   * @param {Object} options - Opciones adicionales para la petición
   * @returns {Promise} - La respuesta del servidor
   * 
   * Esta función avanzada:
   * 1. Realiza la petición al servidor con las cabeceras de autenticación
   * 2. Detecta si el token ha expirado (error 401)
   * 3. Intenta renovar el token automáticamente si ha expirado
   * 4. Reintenta la petición original con el nuevo token
   */
  async request(url, options = {}) {
    try {
      // Realizar la petición con las cabeceras de autenticación
      const response = await fetch(url, {
        ...options,  // Incluir todas las opciones (método, cuerpo, etc.)
        headers: this.getHeaders(),  // Añadir las cabeceras con el token
      });      // Detectar si el token ha expirado (código 401 = No autorizado)
      if (response.status === 401) {
        // Intentar renovar el token automáticamente
        const renewedToken = await this.renewToken();
        
        if (renewedToken) {
          // Si se renovó con éxito, reintentar la petición original
          // pero ahora con el nuevo token válido
          return fetch(url, {
            ...options,
            headers: this.getHeaders()  // Obtener cabeceras con el nuevo token
          });
        } else {
          // Si no se pudo renovar el token, probablemente la sesión
          // realmente expiró y es necesario volver a iniciar sesión
          throw new Error('No se pudo renovar la sesión');
        }
      }      // Devolver la respuesta para que el código que llamó a esta función
      // pueda procesarla (obtener datos, verificar éxito, etc.)
      return response;
    } catch (error) {
      // Si ocurre cualquier error (red, servidor caído, etc.)
      console.error('Error en la petición HTTP:', error);
      // Relanzar el error para que el código que llamó a esta función
      // pueda manejarlo adecuadamente
      throw error;
    }
  }
  /**
   * Intenta renovar automáticamente un token de acceso expirado
   * 
   * @returns {string|null} - El nuevo token si se renovó con éxito, o null si falló
   * 
   * Cuando un token expira, esta función:
   * 1. Pide un nuevo token al servidor usando el token actual
   * 2. Si tiene éxito, guarda el nuevo token
   * 3. Si falla, elimina el token actual (cierra la sesión)
   */
  async renewToken() {
    try {
      // Realizar petición al endpoint de renovación de tokens
      const response = await fetch(API_ENDPOINTS.auth.renewToken, {
        method: 'POST',  // Método HTTP para crear un nuevo recurso (token)
        headers: this.getHeaders()  // Incluir el token actual (aunque expirado)
      });      // Verificar si la renovación fue exitosa
      if (!response.ok) {
        // Si el servidor rechazó la renovación
        // (token muy antiguo o inválido)
        this.setToken(null);  // Eliminar el token (cerrar sesión)
        return null;  // Indicar que falló la renovación
      }

      // Procesar la respuesta para obtener el nuevo token
      const data = await response.json();
      
      // Guardar el nuevo token renovado
      this.setToken(data.token);
      
      // Devolver el nuevo token para que se pueda usar
      return data.token;
    } catch (error) {
      // Si hay cualquier error durante la renovación
      console.error('Error al renovar el token:', error);
      this.setToken(null);  // Por seguridad, cerrar sesión
      return null;  // Indicar que falló la renovación
    }  }
}

/**
 * Creamos una única instancia del cliente HTTP que se usará en toda la aplicación
 * 
 * Al usar un patrón "Singleton" (instancia única):
 * - Ahorramos memoria porque no se crean múltiples instancias
 * - Compartimos el mismo token en todas las partes de la app
 * - Centralizamos la lógica de autenticación
 */
const httpClient = new HttpClient();

// Exportar la instancia para usarla en otros archivos
export default httpClient;
