/**
 * ======== COMPONENTE DE PERFIL DE USUARIO ========
 * 
 * Este archivo crea la página de perfil de usuario donde los usuarios pueden:
 * - Ver su información personal
 * - Editar sus datos básicos (nombre, email)
 * - Cambiar su contraseña
 * - Actualizar sus datos personales (dirección, teléfono, etc.)
 */

// Importaciones necesarias
import React, { useState, useEffect } from 'react';  // React y sus funciones principales
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';  // Componentes visuales de Bootstrap
import { useAuth } from '../context/AuthContext';  // Información de autenticación del usuario
import { API_ENDPOINTS, fetchWithAuth } from '../config/api';  // Funciones para comunicarse con el servidor
import './UserProfile.css';  // Estilos específicos para esta página

// Definición del componente principal
const UserProfile = () => {
  // Obtener información del usuario actual y función para cerrar sesión
  const { currentUser, logout } = useAuth();
  
  // Estado para almacenar los datos básicos del perfil (nombre y email)
  const [profile, setProfile] = useState({
    nombre: '',
    email: '',
  });
  
  // Estado para almacenar datos personales adicionales del usuario
  const [datosPersonales, setDatosPersonales] = useState({
    fechaNacimiento: '',  // Fecha de nacimiento del usuario
    direccion: '',        // Dirección del usuario
    telefono: '',         // Número de teléfono
    genero: ''            // Género del usuario
  });
  
  // Indica si el usuario ya tiene datos personales guardados en la base de datos
  const [tieneDatosPersonales, setTieneDatosPersonales] = useState(false);
  
  // Estados para manejar el cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('');  // Estado para mostrar mensajes de éxito
  const [success, setSuccess] = useState('');
  
  // Estado para indicar si hay una operación en curso (guardando datos)
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar si el usuario está en modo de edición o visualización
  const [editing, setEditing] = useState(false);

  // Este bloque de código se ejecuta cuando el componente se carga o cuando cambia el usuario actual
  useEffect(() => {
    // Solo ejecutar si hay un usuario conectado
    if (currentUser) {
      // Cargar los datos básicos del usuario
      setProfile({
        nombre: currentUser.nombre || '',
        email: currentUser.email || '',
      });
        // Verificar que el ID del usuario sea válido
      if (typeof currentUser.id_usuario !== 'number' || isNaN(currentUser.id_usuario)) {
        setError('Error interno: ID de usuario inválido. Por favor, vuelve a iniciar sesión.');
        setTieneDatosPersonales(false);
        return;
      }
      
      // Función para obtener los datos personales del usuario desde el servidor
      const fetchDatosPersonales = async () => {
        try {
          // Realizar petición al servidor para obtener datos personales
          const response = await fetchWithAuth(`${API_ENDPOINTS.datosPersonales}/${currentUser.id_usuario}`);
          const data = await response.json(); // Convertir la respuesta a formato JSON
            // Si la petición fue exitosa y hay datos
          if (response.ok && data.success) {
            // Formateamos la fecha de nacimiento (quitando la parte de la hora)
            const fechaNacimiento = data.data?.fechaNacimiento ? 
              data.data.fechaNacimiento.split('T')[0] : '';
              
            // Guardar los datos personales en el estado
            setDatosPersonales({
              fechaNacimiento: fechaNacimiento,
              direccion: data.data?.direccion || '',
              telefono: data.data?.telefono || '',
              genero: data.data?.genero || ''
            });
            // Marcar que el usuario tiene datos personales
            setTieneDatosPersonales(true);
          } else {
            // Si no hay datos personales, mostrar un mensaje
            setTieneDatosPersonales(false);
            setError('No se encontraron datos personales');
          }        } catch (err) {
          // Si ocurre un error, mostrarlo en la consola y al usuario
          console.error('Error al cargar datos personales:', err);
          setError('Error al cargar los datos personales');
          setTieneDatosPersonales(false);
        }
      };
      
      // Ejecutar la función para cargar los datos personales
      fetchDatosPersonales();
    }
  }, [currentUser]); // Este efecto se ejecuta cuando cambia el usuario actual

  /**
   * Esta función se activa cuando el usuario cambia algún campo del formulario de datos básicos
   * @param {Event} e - El evento del formulario
   */
  const handleChange = (e) => {
    // Extraer el nombre del campo y su nuevo valor
    const { name, value } = e.target;
    // Actualizar el estado del perfil manteniendo los otros valores
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };
  /**
   * Función para controlar cambios en los campos de contraseña
   * @param {Event} e - El evento del formulario
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    // Actualizar el estado correspondiente según el campo modificado
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  /**
   * Función para controlar cambios en los campos de datos personales
   * @param {Event} e - El evento del formulario
   */
  const handleDatosPersonalesChange = (e) => {
    const { name, value } = e.target;
    // Actualizar el estado de datos personales manteniendo los otros valores
    setDatosPersonales(prev => ({
      ...prev,
      [name]: value
    }));
  };
  /**
   * Función que se ejecuta cuando el usuario envía el formulario
   * @param {Event} e - El evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar que la página se recargue
    // Limpiar mensajes anteriores
    setError('');
    setSuccess('');
    // Mostrar indicador de carga
    setLoading(true);

    try {
      // 1. PASO 1: Actualizar datos básicos del usuario (nombre, email, contraseña)
      const userResponse = await fetchWithAuth(
        `${API_ENDPOINTS.usuarios}/${currentUser.id_usuario}`,
        {
          method: 'PUT', // Método HTTP para actualizar
          body: JSON.stringify({
            nombre: profile.nombre,
            email: profile.email,
            // Solo incluir contraseña si se ha proporcionado una nueva
            ...(newPassword ? { contrasena: newPassword } : {}),
            rol: currentUser.rol // Mantener el rol actual del usuario
          })
        }
      );      // Verificar si la actualización fue exitosa
      if (!userResponse.ok) {
        const userData = await userResponse.json();
        throw new Error(userData.message || 'Error al actualizar el perfil');
      }

      // 2. PASO 2: Actualizar datos personales del usuario
      // Preparar los datos a enviar
      const datosPersonalesBody = {
        id_usuario: currentUser.id_usuario,  // ID del usuario
        fechaNacimiento: datosPersonales.fechaNacimiento || null,  // Fecha de nacimiento (puede ser null)
        direccion: datosPersonales.direccion || '',  // Dirección (cadena vacía si no existe)
        telefono: datosPersonales.telefono || '',  // Teléfono (cadena vacía si no existe)
        genero: datosPersonales.genero || ''  // Género (cadena vacía si no existe)
      };
      // Determinar la URL correcta según el método
      const urlDatosPersonales = tieneDatosPersonales
        ? `${API_ENDPOINTS.datosPersonales}/${currentUser.id_usuario}` // PUT con ID
        : `${API_ENDPOINTS.datosPersonales}/`; // POST sin ID
      // Enviar petición al servidor
      let datosPersonalesResponse = await fetchWithAuth(
        urlDatosPersonales,
        {
          method: tieneDatosPersonales ? 'PUT' : 'POST',
          body: JSON.stringify(datosPersonalesBody)
        }
      );
      let datosPersonalesData = await datosPersonalesResponse.json();
      // Si el POST falla por duplicado, intenta PUT automáticamente
      if (
        !tieneDatosPersonales &&
        !datosPersonalesResponse.ok &&
        datosPersonalesData.message &&
        datosPersonalesData.message.includes('Ya existen datos personales')
      ) {
        // Intenta actualizar en vez de crear
        datosPersonalesResponse = await fetchWithAuth(
          `${API_ENDPOINTS.datosPersonales}/${currentUser.id_usuario}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosPersonalesBody)
          }
        );
        datosPersonalesData = await datosPersonalesResponse.json();
      }
      // Verificar si la actualización fue exitosa
      if (!datosPersonalesResponse.ok || !datosPersonalesData.success) {
        throw new Error(datosPersonalesData.message || 'Error al actualizar datos personales');
      }

      // 3. PASO 3: Todo ha salido bien, actualizar la interfaz
      setSuccess('Perfil actualizado correctamente'); // Mostrar mensaje de éxito
      setNewPassword(''); // Limpiar campo de contraseña
      setConfirmPassword(''); // Limpiar campo de confirmación
      setEditing(false); // Desactivar modo de edición
    } catch (err) {
      // Si ocurre algún error, mostrarlo al usuario
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      // Quitar indicador de carga, independientemente del resultado
      setLoading(false);
    }
  };
  // Lo que se va a mostrar en la página
  return (
    // Contenedor principal con espacio arriba y abajo
    <Container className="py-5">
      {/* Fila centrada horizontalmente */}
      <Row className="justify-content-center">
        {/* Columna que ocupa 8/12 del ancho en pantallas medianas o más grandes */}
        <Col md={8}>
          {/* Tarjeta contenedora del formulario */}
          <Card>
            <Card.Body>
              {/* Título de la página */}
              <h2 className="text-center mb-4">Mi Perfil</h2>
              
              {/* Mensajes de error (solo se muestra si hay un error) */}
              {error && <Alert variant="danger">{error}</Alert>}
              
              {/* Mensajes de éxito (solo se muestra si hay un mensaje de éxito) */}
              {success && <Alert variant="success">{success}</Alert>}
                {/* Formulario con evento de envío */}
              <Form onSubmit={handleSubmit}>
                {/* ---------- SECCIÓN 1: DATOS BÁSICOS ---------- */}
                
                {/* Campo para el nombre */}
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={profile.nombre}
                    onChange={handleChange}  // Función que se activa al cambiar el valor
                    readOnly={!editing}      // Solo editable cuando el modo edición está activo
                  />
                </Form.Group>
                
                {/* Campo para el email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    readOnly={!editing}      // Solo editable cuando el modo edición está activo
                  />
                </Form.Group>                {/* Sección de contraseña - solo visible en modo edición */}
                {editing && (
                  <>
                    {/* Campo para la nueva contraseña */}
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Contraseña (dejar en blanco para mantener)</Form.Label>
                      <Form.Control
                        type="password" // Campo tipo contraseña (oculta los caracteres)
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Nueva contraseña"
                      />
                    </Form.Group>

                    {/* Campo para confirmar la nueva contraseña */}
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirmar contraseña"
                      />
                    </Form.Group>
                  </>
                )}                {/* ---------- SECCIÓN 2: DATOS PERSONALES ---------- */}
                <hr /> {/* Línea horizontal para separar secciones */}
                <h5 className="mb-3">Datos Personales</h5>
                
                {/* Campo para la fecha de nacimiento */}
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date" // Campo especial para fechas con calendario
                    name="fechaNacimiento"
                    value={datosPersonales.fechaNacimiento}
                    onChange={handleDatosPersonalesChange}
                    readOnly={!editing} // Solo editable en modo edición
                  />
                </Form.Group>                {/* Campo para la dirección */}
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={datosPersonales.direccion}
                    onChange={handleDatosPersonalesChange}
                    readOnly={!editing}
                  />
                </Form.Group>

                {/* Campo para el teléfono */}
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel" // Campo específico para números de teléfono
                    name="telefono"
                    value={datosPersonales.telefono}
                    onChange={handleDatosPersonalesChange}
                    readOnly={!editing}
                  />
                </Form.Group>

                {/* Campo para el género (desplegable) */}
                <Form.Group className="mb-3">
                  <Form.Label>Género</Form.Label>
                  <Form.Select
                    name="genero"
                    value={datosPersonales.genero}
                    onChange={handleDatosPersonalesChange}
                    disabled={!editing} // Deshabilitado cuando no está en modo edición
                  >
                    {/* Opciones del desplegable */}
                    <option value="">Seleccionar género</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </Form.Select>
                </Form.Group>                {/* ---------- SECCIÓN 3: BOTONES DE ACCIÓN ---------- */}
                {/* Contenedor para los botones con espacio entre ellos */}
                <div className="d-flex justify-content-between">
                  {/* Si NO está en modo edición, mostrar el botón de Editar */}
                  {!editing ? (
                    <Button 
                      variant="primary" // Estilo del botón: azul
                      onClick={() => setEditing(true)} // Al hacer clic, activa el modo edición
                    >
                      Editar Perfil
                    </Button>
                  ) : (
                    /* Si ESTÁ en modo edición, mostrar botones de Cancelar y Guardar */
                    <>
                      {/* Botón Cancelar */}
                      <Button 
                        variant="secondary" // Estilo del botón: gris
                        onClick={() => {
                          setEditing(false); // Desactiva el modo edición
                          setNewPassword(''); // Limpia el campo de contraseña
                          setConfirmPassword(''); // Limpia el campo de confirmar contraseña
                        }}
                      >
                        Cancelar
                      </Button>
                      {/* Botón Guardar Cambios */}
                      <Button 
                        variant="primary" // Estilo del botón: azul
                        type="submit" // Tipo submit: envía el formulario
                        disabled={loading} // Deshabilitado mientras se está guardando
                      >
                        {/* Cambiar texto según estado de carga */}
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </>
                  )}
                </div>              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

/**
 * Exportar el componente para poder usarlo en otras partes de la aplicación
 * Esto permite que este perfil de usuario pueda ser incluido en las rutas
 * o en otros componentes de la aplicación
 */
export default UserProfile;
