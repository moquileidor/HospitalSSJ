import React, {useState} from 'react';
import axios from 'axios';
import './RegisterSpecialty.css';

const RegisterSpecialty = ({ especialidades, setEspecialidades }) => {
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()

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


      const response = await axios.post('http://localhost:3000/api/especialidades', {
        nombre
      })

      setMensaje('Especialidad registrada correctamente')
      setNombre('')
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

      {mensaje && <div className='alert alert-success'>{mensaje}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}


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
