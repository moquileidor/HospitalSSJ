/**
 * Componente AdminPanel
 * Este componente maneja el panel de administración del sistema.
 * Permite gestionar usuarios, especialidades, médicos y citas.
 * 
 * Características principales:
 * - Gestión de usuarios (listar, editar, eliminar)
 * - Gestión de especialidades médicas
 * - Gestión de médicos
 * - Gestión de citas médicas
 * - Cambio de roles de usuarios
 * - Visualización de estadísticas
 * 
 * Estados:
 * - especialidades: Lista de especialidades médicas
 * - medicos: Lista de médicos registrados
 * - usuarios: Lista de usuarios del sistema
 * - citas: Lista de citas médicas
 * - loading: Estado de carga general
 * - error: Mensajes de error
 * 
 * Funcionalidades:
 * - Filtrado de citas por estado y fecha
 * - Edición de datos de usuarios
 * - Eliminación de usuarios
 * - Visualización de citas por usuario
 * - Cambio de roles de usuarios
 * 
 * @returns {React.ReactNode} - Panel de administración completo
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Table, Badge, Form, Button, Modal, Alert } from 'react-bootstrap';
import './AdminPanel.css';
import RegisterSpecialty from './RegisterSpecialty';
import ListSpecialties from './ListSpecialties';
import UpdateSpecialty from './UpdateSpecialty';
import DeleteSpecialty from './DeleteSpecialty';
import RegisterMedic from './RegisterMedic';
import axios from 'axios';
import ListMedic from './listMedic';
import UpdateMedic from './UpdateMedic';
import DeleteMedic from './DeleteMedic';
import { API_ENDPOINTS, fetchWithAuth } from '../config/api';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState('');
  const [rolMensaje, setRolMensaje] = useState('');
  const [rolError, setRolError] = useState('');
  const [citas, setCitas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    fechaNacimiento: '',
    direccion: '',
    telefono: '',
    genero: ''
  });
  const [datosPersonales, setDatosPersonales] = useState({});
  const [citasUsuario, setCitasUsuario] = useState([]);
  const [loadingCitasUsuario, setLoadingCitasUsuario] = useState(false);
  const [showCitasModal, setShowCitasModal] = useState(false);
  // Estados para visualización de contraseña
  const [tempPassword, setTempPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordUser, setPasswordUser] = useState(null);

  /**
   * Efecto para cargar especialidades y médicos al montar el componente
   */
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        setLoading(true);
        const especialidadesResponse = await axios.get(API_ENDPOINTS.especialidades);
        setEspecialidades(especialidadesResponse.data);

        const medicosResponse = await axios.get(API_ENDPOINTS.medicos);
        setMedicos(medicosResponse.data)

        setError('');
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchEspecialidades();
  }, []);

  /**
   * Efecto para cargar usuarios al montar el componente
   */
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setUsuariosLoading(true);
        setUsuariosError('');
        const response = await fetchWithAuth(`${API_ENDPOINTS.usuarios}/listarU`);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setUsuariosError('Error al cargar los usuarios');
      } finally {
        setUsuariosLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  /**
   * Maneja el cambio de rol de un usuario en el estado local
   * @param {number} id_usuario - ID del usuario a cambiar
   * @param {string} newRole - Nuevo rol del usuario
   */
  const handleRoleChange = (id_usuario, newRole) => {
    setUsuarios(prev =>
      prev.map(usuario => {
        if (usuario.id_usuario !== id_usuario) return usuario;
        if (usuario.rol === 'ADMINISTRADOR') return usuario;
        return { ...usuario, rol: newRole };
      })
    );
  };

  /**
   * Guarda el cambio de rol de un usuario en el backend
   * @param {Object} usuario - Usuario con el rol actualizado
   */
  const handleSaveRole = async (usuario) => {
  setRolMensaje('');
  setRolError('');

  if (usuario.rol === 'ADMINISTRADOR') {
    setRolError('No se puede modificar el rol de otro administrador');
    return;
  }

  try {
    console.log('Enviando solicitud para cambiar rol:', {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });

    const response = await fetchWithAuth(`${API_ENDPOINTS.usuarios}/${usuario.id_usuario}`, {
      method: 'PUT',
      body: JSON.stringify({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      }),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el rol');
    }

    setRolMensaje('Rol actualizado correctamente');

    try {
      const medicosResponse = await axios.get(API_ENDPOINTS.medicos);
      setMedicos(medicosResponse.data);
    } catch (err) {
      console.error('Error al recargar la lista de médicos:', err);
    }
  } catch (err) {
    console.error('Error completo:', err);
    setRolError('Error al actualizar el rol: ' + err.message);
  }
};

  /**
   * Efecto para cargar citas cuando el usuario es administrador
   */
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/todas`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error al cargar citas:', response.status, errorData);
          
          // Si el token expiró o es inválido, mostrar mensaje específico
          if (response.status === 401) {
            throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
          }
          
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Citas cargadas exitosamente:', data.length, 'citas');
        setCitas(data);
        setError(''); // Limpiar error si todo va bien
      } catch (err) {
        console.error('Error completo al cargar citas:', err);
        setError(err.message);
      }
    };

    if (currentUser?.rol === 'ADMINISTRADOR') {
      console.log('Usuario es administrador, cargando citas...');
      cargarCitas();
    } else {
      console.log('Usuario no es administrador, rol:', currentUser?.rol);
    }
  }, [currentUser]);

  /**
   * Formatea una fecha a formato local
   * @param {string} fecha - Fecha a formatear
   * @returns {string} - Fecha formateada
   */
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Obtiene la contraseña de un usuario (solo para pacientes y médicos)
   */
  const handleViewPassword = async (usuario) => {
    setPasswordError('');
    setTempPassword('');
    setPasswordUser(null);
    setPasswordLoading(true);
    
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.usuarios}/${usuario.id_usuario}/password`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener contraseña');
      }

      const data = await response.json();
      setTempPassword(data.password);
      setPasswordUser(usuario);
      setShowPasswordModal(true);
    } catch (err) {
      console.error('Error al obtener contraseña:', err);
      setPasswordError(err.message || 'Error desconocido');
      alert(`Error: ${err.message}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  /**
   * Obtiene el color del badge según el estado de la cita
   * @param {string} estado - Estado de la cita
   * @returns {string} - Color del badge
   */
  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'CONFIRMADA': return 'primary';
      case 'COMPLETADA': return 'success';
      case 'CANCELADA': return 'danger';
      default: return 'secondary';
    }
  };

  // Filtrar citas según estado y fecha
  const citasFiltradas = citas.filter(cita => {
    const cumpleFiltroEstado = filtroEstado === 'TODOS' || cita.estado === filtroEstado;
    
    // Corregir el desfase de zona horaria al comparar fechas
    let cumpleFiltroFecha = true;
    if (filtroFecha) {
      const fechaCita = new Date(cita.fecha_cita);
      // Obtener la fecha en formato YYYY-MM-DD sin conversión de zona horaria
      const year = fechaCita.getFullYear();
      const month = String(fechaCita.getMonth() + 1).padStart(2, '0');
      const day = String(fechaCita.getDate()).padStart(2, '0');
      const fechaCitaLocal = `${year}-${month}-${day}`;
      cumpleFiltroFecha = fechaCitaLocal === filtroFecha;
    }
    
    return cumpleFiltroEstado && cumpleFiltroFecha;
  });

  /**
   * Maneja el clic en el botón de editar usuario
   * @param {Object} usuario - Usuario a editar
   */
  const handleEditClick = async (usuario) => {
    setEditandoUsuario(usuario);
    try {
      // Cargar datos personales del usuario
      const response = await fetchWithAuth(`${API_ENDPOINTS.datosPersonales}/${usuario.id_usuario}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Formatear la fecha para el input type="date"
        const fechaNacimiento = data.data?.fechaNacimiento ? data.data.fechaNacimiento.split('T')[0] : '';
        
        setEditForm({
          nombre: usuario.nombre,
          email: usuario.email,
          contrasena: '',
          fechaNacimiento: fechaNacimiento,
          direccion: data.data?.direccion || '',
          telefono: data.data?.telefono || '',
          genero: data.data?.genero || ''
        });
        setDatosPersonales(data.data || {});
      } else if (response.status === 404) {
        // Si no hay datos personales, inicializar con valores vacíos
        setEditForm({
          nombre: usuario.nombre,
          email: usuario.email,
          contrasena: '',
          fechaNacimiento: '',
          direccion: '',
          telefono: '',
          genero: ''
        });
        setDatosPersonales({});
      } else {
        throw new Error(data.message || 'Error al cargar datos personales');
      }
    } catch (err) {
      console.error('Error al cargar datos personales:', err);
      setRolError('Error al cargar datos personales: ' + err.message);
      // Mantener los datos básicos del usuario
      setEditForm({
        nombre: usuario.nombre,
        email: usuario.email,
        contrasena: '',
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        genero: ''
      });
      setDatosPersonales({});
    }
  };

  /**
   * Cancela la edición de un usuario
   */
  const handleCancelEdit = () => {
    setEditandoUsuario(null);
    setEditForm({
      nombre: '',
      email: '',
      contrasena: '',
      fechaNacimiento: '',
      direccion: '',
      telefono: '',
      genero: ''
    });
  };

  /**
   * Guarda los cambios en un usuario
   * @param {Object} usuario - Usuario con los datos actualizados
   */
  const handleSaveEdit = async (usuario) => {
    try {
      // Validar campos requeridos
      if (!editForm.nombre || !editForm.email) {
        throw new Error('El nombre y email son obligatorios');
      }

      // Actualizar usuario
      const response = await fetchWithAuth(`${API_ENDPOINTS.usuarios}/${usuario.id_usuario}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: editForm.nombre,
          email: editForm.email,
          contrasena: editForm.contrasena || undefined,
          rol: usuario.rol
        })
      });

      const userData = await response.json();
      if (!response.ok) {
        throw new Error(userData.message || 'Error al actualizar usuario');
      }

      // Preparar datos personales
      const datosPersonalesBody = {
        id_usuario: usuario.id_usuario,
        fechaNacimiento: editForm.fechaNacimiento || null,
        direccion: editForm.direccion || '',
        telefono: editForm.telefono || '',
        genero: editForm.genero || ''
      };

      // Intentar actualizar datos personales
      let datosPersonalesResponse;
      try {
        datosPersonalesResponse = await fetchWithAuth(
          `${API_ENDPOINTS.datosPersonales}/${usuario.id_usuario}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosPersonalesBody)
          }
        );
      } catch (error) {
        // Si falla la actualización, intentar crear nuevos datos personales
        datosPersonalesResponse = await fetchWithAuth(
          API_ENDPOINTS.datosPersonales,
          {
            method: 'POST',
            body: JSON.stringify(datosPersonalesBody)
          }
        );
      }

      const datosPersonalesData = await datosPersonalesResponse.json();
      
      if (!datosPersonalesResponse.ok || !datosPersonalesData.success) {
        throw new Error(datosPersonalesData.message || 'Error al actualizar datos personales');
      }

      // Actualizar la lista de usuarios
      setUsuarios(prev => prev.map(u => 
        u.id_usuario === usuario.id_usuario 
          ? { ...u, nombre: editForm.nombre, email: editForm.email }
          : u
      ));

      setEditandoUsuario(null);
      setRolMensaje('Usuario actualizado correctamente');
      setRolError('');
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      setRolError(err.message);
    }
  };

  const handleDeleteClick = async (usuario) => {
    setUsuarioAEliminar(usuario);
    setLoadingCitasUsuario(true);
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/usuario/${usuario.id_usuario}`);
      if (!response.ok) throw new Error('Error al cargar las citas del usuario');
      const data = await response.json();
      setCitasUsuario(data);
      
      // Simplificamos: siempre mostrar modal de confirmación
      // El backend se encarga de cancelar automáticamente las citas activas
      setShowModal(true);
      
    } catch (err) {
      setRolError('Error al verificar las citas del usuario: ' + err.message);
      // Si hay error al cargar citas, aún permitir eliminación
      setShowModal(true);
    } finally {
      setLoadingCitasUsuario(false);
    }
  };

  // Ya no necesitamos esta función porque el backend cancela automáticamente
  // const handleCancelarTodasLasCitas = async () => {
  //   // Funcionalidad movida al backend
  // };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.usuarios}/${usuarioAEliminar.id_usuario}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar usuario');
      }

      const data = await response.json();
      setUsuarios(prev => prev.filter(u => u.id_usuario !== usuarioAEliminar.id_usuario));
      setShowModal(false);
      setShowCitasModal(false); // También cerrar modal de citas si está abierto
      setRolMensaje(data.message || 'Usuario eliminado correctamente');
    } catch (err) {
      setRolError(err.message);
      setShowModal(false);
      setShowCitasModal(false); // También cerrar modal de citas si está abierto
    }
  };

  return (
    <div className="admin-panel-container">
      <Container>
        <h2 className="admin-title">Panel de Administración</h2>
        
        <Tab.Container defaultActiveKey="especialidades">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="especialidades">Especialidades</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="medicos">Médicos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="citas">Citas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="usuarios">Usuarios</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="especialidades">
                  <div className="admin-section">
                    
                    <h3>Gestión de Especialidades</h3>
                    <div className="admin-actions">
                      <a href="#registrar" className="admin-action-btn">Registrar</a>
                      <a href="#listar" className="admin-action-btn">Listar</a>
                      <a href="#actualizar" className="admin-action-btn">Actualizar</a>
                      <a href="#eliminar" className="admin-action-btn">Eliminar</a>
                    </div>
                    
                    <div id="registrar" className="admin-action-section">
                      <h4>Registrar Especialidad</h4>
                      <RegisterSpecialty especialidades={especialidades} setEspecialidades={setEspecialidades} />
                    </div>
                    
                    <div id="listar" className="admin-action-section">
                      <h4>Listar Especialidades</h4>
                      <ListSpecialties especialidades={especialidades} loading={loading} error={error} />
                    </div>
                    
                    <div id="actualizar" className="admin-action-section">
                      <h4>Actualizar Especialidad</h4>
                      <UpdateSpecialty especialidades={especialidades} setEspecialidades={setEspecialidades} />
                    </div>
                    
                    <div id="eliminar" className="admin-action-section">
                      <h4>Eliminar Especialidad</h4>
                      <DeleteSpecialty especialidades={especialidades} setEspecialidades={setEspecialidades} />
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="medicos">
                  <div className="admin-section">
                    <h3>Gestión de Médicos</h3>
                    <div className='admin-actions'>
                      <a href="#register-medic" className='admin-action-btn'>Registrar</a>
                      <a href="#listar-medic" className='admin-action-btn'>Listar</a>
                      <a href="#actualizar-medic" className='admin-action-btn'>Actualizar</a>
                      <a href="#eliminar-medic" className='admin-action-btn'>Eliminar</a>
                    </div>
                    <div id="register-medic" className="admin-action-section">
                      <h4>Registrar Médico</h4>
                      <RegisterMedic especialidades={especialidades} />
                    </div>
                    <div id="listar-medic" className="admin-action-section">
                      <h4>Listar Medicos</h4>
                      <ListMedic medicos={medicos} />
                    </div>                    <div id="actualizar-medic" className="admin-action-section">
                      <h4>Actualizar Médico</h4>
                      <UpdateMedic medicos={medicos} especialidades={especialidades} />
                    </div>
                    
                    <div id="eliminar-medic" className="admin-action-section">
                      <h4>Eliminar Médico</h4>
                      <DeleteMedic 
                        medicos={medicos} 
                        especialidades={especialidades} 
                        onMedicoDeleted={() => {
                          // Recargar la lista de médicos después de eliminar
                          axios.get(API_ENDPOINTS.medicos)
                            .then(response => setMedicos(response.data))
                            .catch(err => console.error('Error al recargar médicos:', err));
                        }} 
                      />
                    </div>

                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="citas">
                  <div className="admin-section">
                    <h3>Gestión de Citas</h3>
                    
                    {/* Filtros */}
                    <Card className="mb-4">
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Filtrar por Estado:</Form.Label>
                              <Form.Select 
                                value={filtroEstado} 
                                onChange={(e) => setFiltroEstado(e.target.value)}
                              >
                                <option value="TODOS">Todos los estados</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="CONFIRMADA">Confirmada</option>
                                <option value="COMPLETADA">Completada</option>
                                <option value="CANCELADA">Cancelada</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Filtrar por Fecha:</Form.Label>
                              <Form.Control
                                type="date"
                                value={filtroFecha}
                                onChange={(e) => setFiltroFecha(e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    {/* Tabla de Citas */}
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Fecha y Hora</th>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Especialidad</th>
                            <th>Estado</th>
                            <th>Último Cambio</th>
                            <th>Notas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {citasFiltradas.map(cita => (
                            <tr key={cita.id_cita}>
                              <td>{cita.id_cita}</td>
                              <td>{formatearFecha(cita.fecha_cita)}</td>
                              <td>
                                {cita.nombre_paciente}
                                <br />
                                <small className="text-muted">{cita.email_paciente}</small>
                              </td>
                              <td>{cita.nombre_medico || 'Sin asignar'}</td>
                              <td>{cita.especialidad || 'N/A'}</td>
                              <td>
                                <Badge bg={getEstadoBadgeColor(cita.estado)}>
                                  {cita.estado}
                                </Badge>
                              </td>
                              <td>
                                {cita.ultimo_cambio ? (
                                  <>
                                    {formatearFecha(cita.ultimo_cambio)}
                                    <br />
                                    <small>
                                      {cita.tipo_ultimo_cambio} por {cita.nombre_admin_cambio}
                                    </small>
                                  </>
                                ) : 'Sin cambios'}
                              </td>
                              <td>{cita.notas || 'Sin notas'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="usuarios">
                  <div className="admin-section">
                    <h3>Gestión de Usuarios</h3>
                    {usuariosLoading && <p>Cargando usuarios...</p>}
                    {usuariosError && <p className="text-danger">{usuariosError}</p>}
                    {rolMensaje && <div className="alert alert-success">{rolMensaje}</div>}
                    {rolError && <div className="alert alert-danger">{rolError}</div>}
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.map(usuario => (
                            <tr key={usuario.id_usuario}>
                              <td>{usuario.id_usuario}</td>
                              <td>{usuario.nombre}</td>
                              <td>{usuario.email}</td>
                              <td>
                                {/* Los admins no pueden cambiar el rol de otros admins ni el suyo propio */}
                                {usuario.rol === 'ADMINISTRADOR' ? (
                                  usuario.rol
                                ) : (
                                  <Form.Select
                                    value={usuario.rol}
                                    onChange={e => handleRoleChange(usuario.id_usuario, e.target.value)}
                                  >
                                    <option value="PACIENTE">Paciente</option>
                                    <option value="MEDICO">Médico</option>
                                    <option value="ADMINISTRADOR">Administrador</option>
                                  </Form.Select>
                                )}
                              </td>
                              <td>
                                {/* Mostrar acciones solo si NO es otro administrador */}
                                {usuario.id_usuario === currentUser.id_usuario ? (
                                  <div className="action-buttons">
                                    <button className="dropdown-toggle">
                                      <i className="fas fa-ellipsis-v"></i>
                                      Acciones
                                    </button>
                                    <div className="dropdown-menu">
                                      <button
                                        className="dropdown-item editar"
                                        onClick={() => handleEditClick(usuario)}
                                      >
                                        <i className="fas fa-edit"></i>
                                        Editar mi perfil
                                      </button>
                                    </div>
                                  </div>
                                ) : usuario.rol !== 'ADMINISTRADOR' ? (
                                  <div className="action-buttons">
                                    <button className="dropdown-toggle">
                                      <i className="fas fa-ellipsis-v"></i>
                                      Acciones
                                    </button>
                                    <div className="dropdown-menu">
                                      <button
                                        className="dropdown-item editar"
                                        onClick={() => handleEditClick(usuario)}
                                      >
                                        <i className="fas fa-edit"></i>
                                        Editar
                                      </button>
                                      <button
                                        className="dropdown-item guardar-rol"
                                        onClick={() => handleSaveRole(usuario)}
                                      >
                                        <i className="fas fa-user-tag"></i>
                                        Guardar Rol
                                      </button>
                                      <button
                                        className="dropdown-item eliminar"
                                        onClick={() => handleDeleteClick(usuario)}
                                      >
                                        <i className="fas fa-trash-alt"></i>
                                        Eliminar
                                      </button>
                                      <button
                                        className="dropdown-item ver-pass"
                                        onClick={() => handleViewPassword(usuario)}
                                      >
                                        <i className="fas fa-key"></i>
                                        Ver Contraseña
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted">Sin acciones</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      {/* Modal de citas del usuario */}
      <Modal show={showCitasModal} onHide={() => setShowCitasModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Citas Asociadas al Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citasUsuario.some(cita => ['PENDIENTE', 'CONFIRMADA'].includes(cita.estado)) ? (
            <Alert variant="warning">
              <Alert.Heading>No se puede eliminar el usuario</Alert.Heading>
              <p>
                El usuario {usuarioAEliminar?.nombre} tiene citas activas (pendientes o confirmadas).
                Debe cancelar o completar todas las citas activas antes de poder eliminar el usuario.
              </p>
            </Alert>
          ) : (
            <Alert variant="info">
              <Alert.Heading>El usuario solo tiene citas completadas o canceladas</Alert.Heading>
              <p>
                Puede eliminar el usuario sin problemas. Las citas históricas no bloquean la eliminación.
              </p>
            </Alert>
          )}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Médico</th>
                <th>Especialidad</th>
              </tr>
            </thead>
            <tbody>
              {citasUsuario.map(cita => (
                <tr key={cita.id_cita}>
                  <td>{formatearFecha(cita.fecha_cita)}</td>
                  <td>
                    <Badge bg={getEstadoBadgeColor(cita.estado)}>
                      {cita.estado}
                    </Badge>
                  </td>
                  <td>{cita.nombre_medico || 'Sin asignar'}</td>
                  <td>{cita.especialidad || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Ya no necesitamos estos botones porque la eliminación es automática */}
          <Alert variant="info" className="mt-3">
            <Alert.Heading>ℹ️ Información</Alert.Heading>
            Al eliminar este usuario, todas las citas activas serán canceladas automáticamente.
          </Alert>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-3">
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            className="modal-btn"
          >
            Eliminar Usuario
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowCitasModal(false)}
            className="modal-btn"
          >
            Cancelar
          </Button>
        </Modal.Footer>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCitasModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mostrar contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contraseña del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordLoading ? (
            <div>Cargando...</div>
          ) : passwordError ? (
            <Alert variant="danger">{passwordError}</Alert>
          ) : (
            <div>
              <p>
                Contraseña de <strong>{passwordUser?.nombre}</strong> (ID {passwordUser?.id_usuario}):
              </p>
              <Card className="p-3 mb-2">
                <code style={{ fontSize: '1.1rem' }}>{tempPassword}</code>
              </Card>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(tempPassword);
                  alert('Contraseña copiada al portapapeles');
                }}
              >
                Copiar
              </Button>
              <small className="d-block mt-2 text-muted">
                Esta contraseña está almacenada en texto plano en la base de datos.
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar al usuario {usuarioAEliminar?.nombre}?</p>
          {citasUsuario.some(cita => ['PENDIENTE', 'CONFIRMADA'].includes(cita.estado)) ? (
            <Alert variant="warning">
              <Alert.Heading>⚠️ Atención</Alert.Heading>
              Este usuario tiene citas activas (pendientes o confirmadas). 
              <strong> Al eliminar el usuario, estas citas serán canceladas automáticamente.</strong>
            </Alert>
          ) : (
            <Alert variant="info">Este usuario no tiene citas activas. Puede eliminarlo sin problemas.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-3">
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            className="modal-btn"
          >
            Eliminar Usuario
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            className="modal-btn"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición de usuario */}
      <Modal show={editandoUsuario !== null} onHide={handleCancelEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                    placeholder="Nombre completo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña (dejar en blanco para mantener):</Form.Label>
                  <Form.Control
                    type="password"
                    value={editForm.contrasena}
                    onChange={(e) => setEditForm({...editForm, contrasena: e.target.value})}
                    placeholder="Nueva contraseña"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento:</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.fechaNacimiento}
                    onChange={(e) => setEditForm({...editForm, fechaNacimiento: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección:</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.direccion}
                    onChange={(e) => setEditForm({...editForm, direccion: e.target.value})}
                    placeholder="Dirección completa"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono:</Form.Label>
                  <Form.Control
                    type="tel"
                    value={editForm.telefono}
                    onChange={(e) => setEditForm({...editForm, telefono: e.target.value})}
                    placeholder="Número de teléfono"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Género:</Form.Label>
                  <Form.Select
                    value={editForm.genero}
                    onChange={(e) => setEditForm({...editForm, genero: e.target.value})}
                  >
                    <option value="">Seleccionar género</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCancelEdit}
          >
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleSaveEdit(editandoUsuario)}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel; 



