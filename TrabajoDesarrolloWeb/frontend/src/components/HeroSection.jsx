import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./HeroSection.css"; // Importa el CSS

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center position-relative">
          {/* Texto */}
          <Col md={6} className="text-center text-md-start text-white">
            <h1 className="fw-bold text-primary">SOMOS TU <span className="text-info">MEJOR OPCIÓN</span></h1>
            <p className="mt-3 fs-5">
              Nuestros clientes merecen <span className="fw-bold">LA MEJOR</span> atención médica posible.
            </p>
            <Button variant="primary" className="px-4 py-2"><strong>Agendar Cita</strong></Button>
          </Col>

          {}
          <Col md={6} className="text-center">
            <div className="doctor-container">
              <img src="/doctor.png" alt="Doctora" className="doctor-img img-fluid" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
