import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListSpecialties.css';

const ListSpecialties = ({ especialidades, loading, error }) => {
  if (loading) return <div className="loading">Cargando especialidades...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="list-specialties-container">
      {especialidades.length === 0 ? (
        <p>No hay especialidades registradas</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha de Creación</th>
              </tr>
            </thead>
            <tbody>
              {especialidades.map((especialidad) => (
                <tr key={especialidad.id_especialidad}>
                  <td>{especialidad.id_especialidad}</td>
                  <td>{especialidad.nombre}</td>
                  <td>{new Date().toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListSpecialties; 