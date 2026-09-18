import React, {useState, useEffect} from "react";
import axios  from "axios";
import './ListMedic.css'

/**
 * Componente ListMedic
 * Este componente muestra una lista de todos los médicos registrados en el sistema.
 * Presenta la información en una tabla con los detalles de cada médico.
 * 
 * Características principales:
 * - Tabla responsive con lista de médicos
 * - Información detallada de cada médico
 * - Estados de carga y error
 * - Mensaje cuando no hay médicos
 * 
 * Props:
 * @param {Array} medicos - Lista de médicos a mostrar
 * 
 * Estructura de datos:
 * Cada médico contiene:
 * - id_medico: Identificador único
 * - nombre: Nombre del médico
 * - email: Correo electrónico
 * - id_especialidad: ID de la especialidad
 * 
 * @returns {React.ReactNode} - Tabla de médicos o mensajes de estado
 */
const ListMedic = ({medicos, usuarios, loading, error}) => {
    // Mostrar indicador de carga mientras se obtienen los datos
    if(loading) return <div className="loading">Cargando médicos...</div>;
    // Mostrar mensaje de error si existe
    if(error) return <div className="error-message">{error}</div>;

    return(
        <div className="list-medics-container">
            {/* Mostrar mensaje si no hay médicos */}
            {medicos.length === 0 ? (
                <p>No hay medicos registradas</p>
            ) : (
                // Tabla responsive con la lista de médicos
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Correo electronico</th>
                                <th>Especialidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapear cada médico a una fila de la tabla */}
                            {medicos.map((medico) => (
                                <tr key={medico.id_medico}>
                                    <td>{medico.id_medico}</td>
                                    <td>{medico.nombre}</td>
                                    <td>{medico.email}</td>
                                    <td>{medico.especialidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListMedic;