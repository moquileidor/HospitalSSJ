/**
 * Componente RegisterSpecialty
 * Este componente permite registrar nuevas especialidades médicas en el sistema.
 * Solo los administradores pueden acceder a este formulario.
 * 
 * Características principales:
 * - Formulario de registro de especialidad
 * - Validación de campos
 * - Manejo de errores y éxito
 * 
 * Props:
 * @param {Array} especialidades - Lista de especialidades actuales
 * @param {Function} setEspecialidades - Función para actualizar la lista de especialidades
 * 
 * Estados:
 * - nombre: Nombre de la especialidad
 * - mensaje: Mensaje de éxito
 * - error: Mensaje de error
 * - loading: Estado de carga
 * 
 * Validaciones:
 * - Campo de nombre requerido
 * - Nombre único en el sistema
 * 
 * @returns {React.ReactNode} - Formulario de registro de especialidad
 */
import React, {useState} from 'react';
import axios from 'axios';
import './RegisterSpecialty.css';

/**
 * Componente RegisterSpecialty
 * Este componente maneja el registro de nuevas especialidades médicas.
 * Permite a los administradores agregar nuevas especialidades al sistema.
 * 
 * @param {Array} especialidades - Lista actual de especialidades
 * @param {Function} setEspecialidades - Función para actualizar la lista de especialidades
 * @returns {React.ReactNode} - Formulario de registro de especialidad
 */
const RegisterSpecialty = ({ especialidades, setEspecialidades }) => {
  // Estados para manejar el formulario y mensajes
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Maneja el envío del formulario de registro de especialidad
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que el nombre no esté vacío
    if (!nombre.trim()) {
      setError(
        'El nombre de la especialidad es obligatorio'
      )
      return
    }

    try {
      setLoading(true)
      setError('')
      setMensaje('')

      // Enviar la solicitud al backend
      const response = await axios.post('http://localhost:3000/api/especialidades', {
        nombre
      })

      // Actualizar el estado con el mensaje de éxito
      setMensaje('Especialidad registrada correctamente')
      setNombre('')
      
      // Actualizar la lista de especialidades si se proporcionó la función
      if (setEspecialidades) {
        setEspecialidades([...especialidades, { id_especialidad: response.data.id, nombre }]);
      }
      console.log('Especialidad creada:', response.data)
    } catch (err) {
      console.error('Error al registrar la especialidad: ', err)
      setError(err.response?.data?.message || 'Error al registrar la especialidad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-specialty-container">
      <h2>Registrar Especialidad</h2>

      {/* Mostrar mensajes de éxito o error */}
      {mensaje && <div className='alert alert-success'>{mensaje}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      {/* Formulario de registro */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="specialty">Especialidad</label>
          <input 
            type="text" 
            className="form-control" 
            id="specialty" 
            placeholder="Ingresa la especialidad"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        {/* Botón de envío con estado de carga */}
        <button 
          type="submit" 
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {
            loading ? 'Registrando...' : 'Registrar'
          }
        </button>
      </form>
    </div>    
  )
}

export default RegisterSpecialty;
