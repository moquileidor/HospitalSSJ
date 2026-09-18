/**
 * Componente Dashboard
 * Este componente representa el panel principal de usuario del sistema.
 * Muestra información personalizada según el rol del usuario (paciente, médico, administrador).
 * 
 * Características principales:
 * - Perfil de usuario con información básica
 * - Gestión de citas médicas
 * - Estadísticas y resumen de actividades
 * - Acciones específicas según el rol
 * 
 * Estados:
 * - citasPendientes: Lista de citas pendientes
 * - citasPaciente: Citas del paciente
 * - citasMedico: Citas del médico
 * - loading: Estado de carga
 * - error: Mensajes de error
 * 
 * @returns {React.ReactNode} - Panel principal de usuario
 */
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, fetchWithAuth } from '../config/api';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [citasLoading, setCitasLoading] = useState(false);
  const [citasError, setCitasError] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [medicoId, setMedicoId] = useState(null);
  
  // Para pacientes: sus citas
  const [citasPaciente, setCitasPaciente] = useState([]);
  const [citasPacienteLoading, setCitasPacienteLoading] = useState(false);
  const [citasPacienteError, setCitasPacienteError] = useState('');
  
  // Para médicos: todas sus citas
  const [citasMedico, setCitasMedico] = useState([]);
  const [citasMedicoLoading, setCitasMedicoLoading] = useState(false);
  const [citasMedicoError, setCitasMedicoError] = useState('');
  const [estadoMsg, setEstadoMsg] = useState('');

  // Estado para cambio de fecha de cita
  const [citaCambio, setCitaCambio] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [cambioMsg, setCambioMsg] = useState('');
  const [cambioError, setCambioError] = useState('');
  const [cancelMsg, setCancelMsg] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Obtener ID del médico si el usuario es médico
  useEffect(() => {
    if (currentUser?.rol === 'MEDICO') {
      const fetchMedicoId = async () => {
        try {
          const response = await fetchWithAuth(`${API_ENDPOINTS.medicos}/usuario/${currentUser.id_usuario}`);
          if (!response.ok) throw new Error('Error al obtener ID del médico');
          const data = await response.json();
          setMedicoId(data.id_medico);
          console.log('ID del médico obtenido:', data.id_medico);
        } catch (err) {
          console.error('Error al obtener ID del médico:', err);
        }
      };
      fetchMedicoId();
    }
  }, [currentUser]);

  // Solo para médicos: cargar citas pendientes
  useEffect(() => {
    if (currentUser?.rol === 'MEDICO') {
      const fetchCitas = async () => {
        setCitasLoading(true);
        setCitasError('');
        try {
          const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/pendientes`);
          if (!response.ok) throw new Error('Error al cargar citas pendientes');
          const data = await response.json();
          setCitasPendientes(data);
        } catch (err) {
          setCitasError(err.message);
        } finally {
          setCitasLoading(false);
        }
      };
      fetchCitas();
    }
  }, [currentUser]);
  
  // Para médicos: cargar todas sus citas
  useEffect(() => {
    if (currentUser?.rol === 'MEDICO' && medicoId) {
      const fetchCitasMedico = async () => {
        setCitasMedicoLoading(true);
        setCitasMedicoError('');
        try {
          const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/medico/${medicoId}`);
          if (!response.ok) throw new Error('Error al cargar citas del médico');
          const data = await response.json();
          setCitasMedico(data);
        } catch (err) {
          setCitasMedicoError(err.message);
        } finally {
          setCitasMedicoLoading(false);
        }
      };
      fetchCitasMedico();
    }
  }, [currentUser, medicoId, confirmMsg, estadoMsg]); // Recargar cuando cambie el mensaje de confirmación o estado
  
  // Para pacientes: cargar sus citas
  useEffect(() => {
    if (currentUser?.rol === 'PACIENTE' && currentUser?.id_usuario) {
      const fetchCitasPaciente = async () => {
        setCitasPacienteLoading(true);
        setCitasPacienteError('');
        try {
          const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/usuario/${currentUser.id_usuario}`);
          if (!response.ok) throw new Error('Error al cargar tus citas');
          const data = await response.json();
          setCitasPaciente(data);
        } catch (err) {
          setCitasPacienteError(err.message);
        } finally {
          setCitasPacienteLoading(false);
        }
      };
      fetchCitasPaciente();
    }
  }, [currentUser]);

  // Confirmar cita
  const handleConfirmCita = async (id_cita) => {
    setConfirmMsg('');
    setCitasError('');
    
    if (!medicoId) {
      setCitasError('No se pudo obtener el ID del médico');
      return;
    }
    
    try {
      console.log('Confirmando cita:', { id_cita, id_medico: medicoId });
      const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/confirmar`, {
        method: 'POST',
        body: JSON.stringify({
          id_cita,
          id_medico: medicoId
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'HORARIO_OCUPADO') {
          setCitasError('No puedes confirmar esta cita porque ya tienes otra cita programada en este horario');
        } else {
          throw new Error(data.message || 'Error al confirmar cita');
        }
        return;
      }
      
      setConfirmMsg('Cita confirmada correctamente');
      // Recargar citas
      const res = await fetchWithAuth(`${API_ENDPOINTS.citas}/pendientes`);
      setCitasPendientes(await res.json());
    } catch (err) {
      setCitasError(err.message);
    }
  };
  
  // Actualizar estado de cita
  const handleCambiarEstado = async (id_cita, estado) => {
    setEstadoMsg('');
    setCitasMedicoError('');
    
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/estado`, {
        method: 'PUT',
        body: JSON.stringify({
          id_cita,
          estado,
          id_usuario: currentUser.id_usuario // Agregamos el id_usuario del médico
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar estado de la cita');
      }
      
      const data = await response.json();
      setEstadoMsg(`Estado de cita actualizado a: ${estado}`);
      
      // Actualizar la cita en la lista local
      setCitasMedico(prevCitas => 
        prevCitas.map(cita => 
          cita.id_cita === id_cita ? { ...cita, estado } : cita
        )
      );
    } catch (err) {
      setCitasMedicoError(err.message);
    }
  };

  // Solicitar cambio de fecha
  const handleSolicitarCambio = (id_cita) => {
    setCitaCambio(id_cita);
    setNuevaFecha('');
    setCambioMsg('');
    setCambioError('');
  };

  const handleEnviarCambio = async (id_cita) => {
    setCambioMsg('');
    setCambioError('');
    if (!nuevaFecha) {
      setCambioError('Selecciona una nueva fecha');
      return;
    }

    const fechaNormalizada = new Date(nuevaFecha);
    if (Number.isNaN(fechaNormalizada.getTime())) {
      setCambioError('Selecciona una fecha y hora validas');
      return;
    }

    try {
      // Incluir el id_usuario en la petición
      const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/estado`, {
        method: 'PUT',
        body: JSON.stringify({
          id_cita,
          estado: 'PENDIENTE',
          nuevaFecha: fechaNormalizada.toISOString(),
          id_usuario: currentUser.id_usuario // Agregamos el id_usuario del usuario actual
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al solicitar cambio de fecha');
      }

      const data = await response.json();
      setCambioMsg('Solicitud de cambio de fecha enviada correctamente');
      setCitaCambio(null);
      setNuevaFecha('');

      // Actualizar la lista de citas
      if (currentUser.rol === 'PACIENTE') {
        const citasResponse = await fetchWithAuth(`${API_ENDPOINTS.citas}/usuario/${currentUser.id_usuario}`);
        const citasData = await citasResponse.json();
        setCitasPaciente(citasData);
      }
    } catch (err) {
      setCambioError(err.message);
    }
  };
  const handleCancelarCita = async (id_cita) => {
    if (!window.confirm('Estas seguro de cancelar esta cita?')) {
      return;
    }
    setCancelMsg('');
    setCancelError('');
    setCambioMsg('');
    setCambioError('');
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.citas}/estado`, {
        method: 'PUT',
        body: JSON.stringify({
          id_cita,
          estado: 'CANCELADA',
          id_usuario: currentUser.id_usuario
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'No se pudo cancelar la cita');
      }

      await response.json();
      setCancelMsg('Cita cancelada correctamente');
      setCitaCambio(null);
      setNuevaFecha('');

      const citasResponse = await fetchWithAuth(`${API_ENDPOINTS.citas}/usuario/${currentUser.id_usuario}`);
      const citasData = await citasResponse.json();
      setCitasPaciente(citasData);
    } catch (err) {
      setCancelError(err.message);
    }
  };


  // Formatear la fecha de registro si está disponible
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Obtener el color del badge según el estado de la cita
  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'warning';
      case 'CONFIRMADA':
        return 'primary';
      case 'COMPLETADA':
        return 'success';
      case 'CANCELADA':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="py-5 dashboard-container">
      <h1 className="text-center mb-5">Mi Cuenta</h1>
      
      <Row>
        <Col lg={4} md={5} className="mb-4">
          <Card className="profile-card">
            <Card.Header as="h5" className="text-center">Perfil de Usuario</Card.Header>
            <Card.Body className="text-center">
              <div className="avatar-container mb-3">
                {currentUser?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <Card.Title>{currentUser?.nombre || 'Usuario'}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{currentUser?.email}</Card.Subtitle>
              <Card.Text>
                <span className="badge bg-info">{currentUser?.rol || 'USUARIO'}</span>
              </Card.Text>
              <Link to="/profile" className="btn btn-primary">Editar Perfil</Link>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header as="h5">Información de Cuenta</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Estado:</strong> <span className="text-success">Activo</span>
              </ListGroup.Item>
              {currentUser?.fecha_registro && (
                <ListGroup.Item>
                  <strong>Fecha de Registro:</strong> {formatDate(currentUser?.fecha_registro)}
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <strong>Tipo de Usuario:</strong> {currentUser?.rol || 'Usuario Estándar'}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          {/* Si es médico, mostrar citas pendientes */}
          {currentUser?.rol === 'MEDICO' && (
            <>
              <Card className="mb-4">
                <Card.Header as="h5">Citas Pendientes por Confirmar</Card.Header>
                <Card.Body>
                  {citasLoading && <div>Cargando citas...</div>}
                  {citasError && <div className="alert alert-danger">{citasError}</div>}
                  {confirmMsg && <div className="alert alert-success">{confirmMsg}</div>}
                  {citasPendientes.length === 0 ? (
                    <div>No hay citas pendientes por confirmar.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Paciente</th>
                            <th>Fecha</th>
                            <th>Notas</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {citasPendientes.map(cita => (
                            <tr key={cita.id_cita}>
                              <td>{cita.id_cita}</td>
                              <td>{cita.nombre_paciente || cita.id_usuario}</td>
                              <td>{formatDate(cita.fecha_cita)}</td>
                              <td>{cita.notas}</td>
                              <td>
                                <button className="btn btn-success btn-sm" onClick={() => handleConfirmCita(cita.id_cita)}>
                                  Confirmar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              {/* Todas las citas del médico */}
              <Card className="mb-4">
                <Card.Header as="h5">Todas Mis Citas</Card.Header>
                <Card.Body>
                  {citasMedicoLoading && <div>Cargando citas...</div>}
                  {citasMedicoError && <div className="alert alert-danger">{citasMedicoError}</div>}
                  {estadoMsg && <div className="alert alert-success">{estadoMsg}</div>}
                  {citasMedico.length === 0 ? (
                    <div>No tienes citas asignadas.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Paciente</th>
                            <th>Estado</th>
                            <th>Notas</th>
                            <th>Cambiar Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {citasMedico.map(cita => (
                            <tr key={cita.id_cita}>
                              <td>{formatDate(cita.fecha_cita)}</td>
                              <td>{cita.nombre_paciente}</td>
                              <td>
                                <Badge bg={getEstadoBadgeColor(cita.estado)}>
                                  {cita.estado}
                                </Badge>
                              </td>
                              <td>{cita.notas || 'Sin notas'}</td>
                              <td>
                                <Form.Select 
                                  size="sm" 
                                  value={cita.estado}
                                  onChange={(e) => handleCambiarEstado(cita.id_cita, e.target.value)}
                                >
                                  <option value="PENDIENTE">PENDIENTE</option>
                                  <option value="CONFIRMADA">CONFIRMADA</option>
                                  <option value="COMPLETADA">COMPLETADA</option>
                                  <option value="CANCELADA">CANCELADA</option>
                                </Form.Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
          
          {/* Si es paciente, mostrar sus citas */}
          {currentUser?.rol === 'PACIENTE' && (
            <Card className="mb-4">
              <Card.Header as="h5">Mis Citas</Card.Header>
              <Card.Body>
                {cambioMsg && <div className="alert alert-success">{cambioMsg}</div>}
                {cambioError && <div className="alert alert-danger">{cambioError}</div>}
                {cancelMsg && <div className="alert alert-success">{cancelMsg}</div>}
                {cancelError && <div className="alert alert-danger">{cancelError}</div>}
                {citasPacienteLoading && <div>Cargando tus citas...</div>}
                {citasPacienteError && <div className="alert alert-danger">{citasPacienteError}</div>}
                {citasPaciente.length === 0 ? (
                  <div>No tienes citas programadas. <Link to="/schedule-appointment">¡Agenda una ahora!</Link></div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Médico</th>
                          <th>Especialidad</th>
                          <th>Estado</th>
                          <th>Notas</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {citasPaciente.map(cita => (
                          <tr key={cita.id_cita}>
                            <td>{formatDate(cita.fecha_cita)}</td>
                            <td>{cita.nombre_medico || 'Sin asignar'}</td>
                            <td>{cita.especialidad || 'N/A'}</td>
                            <td>
                              <Badge bg={getEstadoBadgeColor(cita.estado)}>
                                {cita.estado}
                              </Badge>
                            </td>
                            <td>{cita.notas || 'Sin notas'}</td>
                            <td>
                              {['PENDIENTE', 'CONFIRMADA'].includes(cita.estado) && (
                                citaCambio === cita.id_cita ? (
                                  <div style={{minWidth: 200}}>
                                    <input
                                      type="datetime-local"
                                      value={nuevaFecha}
                                      onChange={e => setNuevaFecha(e.target.value)}
                                      className="form-control mb-2"
                                    />
                                    <div className="d-flex flex-wrap gap-2">
                                      <button className="btn btn-success btn-sm" onClick={() => handleEnviarCambio(cita.id_cita)}>
                                        Enviar
                                      </button>
                                      <button className="btn btn-secondary btn-sm" onClick={() => setCitaCambio(null)}>
                                        Cancelar solicitud
                                      </button>
                                      <button className="btn btn-danger btn-sm" onClick={() => handleCancelarCita(cita.id_cita)}>
                                        Cancelar cita
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex flex-column gap-2">
                                    <button className="btn btn-warning btn-sm" onClick={() => handleSolicitarCambio(cita.id_cita)}>
                                      Solicitar cambio de fecha
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleCancelarCita(cita.id_cita)}>
                                      Cancelar cita
                                    </button>
                                  </div>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
          
          <Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;





