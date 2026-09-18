/**
 * Componente ListSpecialties
 * Este componente muestra una lista de todas las especialidades médicas registradas.
 * Presenta la información en una tabla con los detalles de cada especialidad.
 * 
 * Características principales:
 * - Tabla responsive con lista de especialidades
 * - Información detallada de cada especialidad
 * - Estados de carga y error
 * - Mensaje cuando no hay especialidades
 * 
 * Props:
 * @param {Array} especialidades - Lista de especialidades a mostrar
 * @param {boolean} loading - Estado de carga de los datos
 * @param {string} error - Mensaje de error si existe
 * 
 * Estados:
 * - loading: Indica si los datos están cargando
 * - error: Mensaje de error si la carga falla
 * 
 * Estructura de datos:
 * Cada especialidad contiene:
 * - id_especialidad: Identificador único
 * - nombre: Nombre de la especialidad
 * - fecha_creacion: Fecha de registro
 * 
 * @returns {React.ReactNode} - Tabla de especialidades o mensajes de estado
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListSpecialties.css';

/**
 * Componente ListSpecialties
 * Este componente muestra una lista de todas las especialidades médicas registradas.
 * Presenta la información en una tabla con los detalles de cada especialidad.
 * 
 * @param {Array} especialidades - Lista de especialidades a mostrar
 * @param {boolean} loading - Estado de carga de los datos
 * @param {string} error - Mensaje de error si existe
 * @returns {React.ReactNode} - Tabla de especialidades o mensajes de estado
 */
const ListSpecialties = ({ especialidades, loading, error }) => {
  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) return <div className="loading">Cargando especialidades...</div>;
  // Mostrar mensaje de error si existe
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="list-specialties-container">
      {/* Mostrar mensaje si no hay especialidades */}
      {especialidades.length === 0 ? (
        <p>No hay especialidades registrados</p>
      ) : (
        // Tabla responsive con la lista de especialidades
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
              {/* Mapear cada especialidad a una fila de la tabla */}
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