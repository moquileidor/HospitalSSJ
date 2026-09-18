import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import './AdminPanel.css';
import RegisterSpecialty from './RegisterSpecialty';
import ListSpecialties from './ListSpecialties';
import UpdateSpecialty from './UpdateSpecialty';
import DeleteSpecialty from './DeleteSpecialty';
import axios from 'axios';

const AdminPanel = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/especialidades');
        setEspecialidades(response.data);
        setError('');
      } catch (err) {
        setError('Error al cargar las especialidades');
      } finally {
        setLoading(false);
      }
    };
    fetchEspecialidades();
  }, []);

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
                    <p>Funcionalidad en desarrollo</p>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="citas">
                  <div className="admin-section">
                    <h3>Gestión de Citas</h3>
                    <p>Funcionalidad en desarrollo</p>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="usuarios">
                  <div className="admin-section">
                    <h3>Gestión de Usuarios</h3>
                    <p>Funcionalidad en desarrollo</p>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminPanel; 