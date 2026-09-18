/**
 * Controlador de Médicos
 * Este archivo contiene todas las funciones necesarias para manejar las operaciones
 * relacionadas con los médicos en el sistema, incluyendo la creación, lectura,
 * actualización y eliminación de médicos.
 * 
 * Funcionalidades:
 * - Obtener todos los médicos
 * - Obtener médico por ID
 * - Insertar nuevo médico
 * - Editar médico existente
 * - Eliminar médico
 * - Obtener ID de médico por ID de usuario
 */

import { getAllMedicos, insertMedico, getMedicoById, getMedicoByUsuarioId, editMedicoById, deleteMedico } from '../model/MedicosModel.js'
import { insertUsuario } from '../model/UsuariosModel.js'

/**
 * Obtiene todos los médicos registrados en el sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Lista de médicos con sus datos completos
 */
const getAllM = async (req, res) => {
    try {
        const medicos = await getAllMedicos()
        res.json(medicos)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

/**
 * Obtiene un médico específico por su ID
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del médico a buscar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos del médico encontrado
 */
const getMById = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)){
            return res.status(400).json({
                message: 'ID INVALIDO'
            })
        }

        const medico = await getMedicoById(id)

        if (!medico) {
            return res.status(404).json(
                {
                    message: 'No se encontró el médico con el ID proporcionado' + '(' + id + ')'
                }
            )
        }

        res.json(medico)    
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el médico', error: error.message })
    }
}
    
/**
 * Inserta un nuevo médico en el sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del médico a insertar
 * @param {string} req.body.nombre - Nombre del médico
 * @param {string} req.body.email - Email del médico
 * @param {string} req.body.contrasena - Contraseña del médico
 * @param {number} req.body.id_especialidad - ID de la especialidad del médico
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos del médico creado
 */
const insertM = async (req, res) => {
    try {
        const { nombre, email, contrasena, id_especialidad } = req.body;

        if (!nombre || !email || !contrasena || !id_especialidad) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear usuario con rol de médico
        const nuevoUsuario = {
            nombre: nombre.trim(),
            email: email.trim(),
            contrasena: contrasena,
            rol: 'MEDICO'
        };
        const usuarioResult = await insertUsuario(nuevoUsuario);
        const id_usuario = usuarioResult.id_usuario || usuarioResult.recordset?.[0]?.id_usuario;

        // Crear registro de médico
        const nuevoMedico = {
            id_especialidad: parseInt(id_especialidad),
            id_usuario
        };
        const resultado = await insertMedico(nuevoMedico);

        res.status(201).json({
            message: 'Médico creado correctamente',
            usuario: usuarioResult,
            medico: resultado
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Edita un médico existente
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del médico a editar
 * @param {Object} req.body - Nuevos datos del médico
 * @param {string} [req.body.nombre] - Nuevo nombre del médico
 * @param {string} [req.body.email] - Nuevo email del médico
 * @param {number} [req.body.id_especialidad] - Nueva especialidad del médico
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos del médico actualizado
 */
const editM = async (req, res) => {
    try {
        const id = req.params.id
        const { nombre, email, id_especialidad } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' })
        }

        // Validar que se proporcione al menos un campo para actualizar
        if (!nombre && !email && !id_especialidad) {
            return res.status(400).json({ message: 'Debes proporcionar al menos un campo para actualizar' })
        }

        const medicoExiste = await getMedicoById(id)
        if (!medicoExiste) {
            return res.status(404).json({ message: 'No se encontró el médico con el ID proporcionado' })
        }

        // Preparar objeto con los campos a actualizar
        const medicoActualizado = {}

        if (nombre) medicoActualizado.nombre = nombre.trim()
        if (email) medicoActualizado.email = email.trim()
        if (id_especialidad) medicoActualizado.id_especialidad = parseInt(id_especialidad)

        const resultado = await editMedicoById(id, medicoActualizado)

        res.json({
            message: 'Médico actualizado correctamente',
            id: resultado.id,
            medico: medicoActualizado
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el médico', error: error.message })
    }
}

/**
 * Elimina un médico del sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del médico a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Confirmación de eliminación
 */
const deleteM = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido',
                details: 'El ID del médico debe ser un número válido'
            })
        }

        const medicoExiste = await getMedicoById(id)
        if(!medicoExiste) {
            return res.status(404).json({
                message: 'No se encontró el médico con el ID proporcionado',
                details: `El médico con ID ${id} no existe en la base de datos`
            })
        }

        try {
            const resultado = await deleteMedico(id)
            if (resultado) {
                res.json({
                    message: 'Médico eliminado correctamente',
                    id: resultado.id,
                    details: `Se ha eliminado el médico ${medicoExiste.nombre || ''} con ID ${id} y su usuario asociado`
                })
            } else {
                res.status(404).json({
                    message: 'No se pudo eliminar el médico',
                    details: 'El médico existe pero no pudo ser eliminado'
                })
            }
        } catch (deleteError) {
            // Manejar errores específicos de eliminación
            let errorMessage = 'Error al eliminar el médico';
            let statusCode = 500;
            
            if (deleteError.message && deleteError.message.includes('REFERENCE constraint')) {
                errorMessage = 'No se puede eliminar el médico porque tiene registros asociados';
                statusCode = 409; 
            }
            
            res.status(statusCode).json({
                message: errorMessage,
                details: deleteError.message
            });
        }
    } catch (error) {
        console.error('Error en deleteM:', error);
        res.status(500).json({
            message: 'Error al procesar la solicitud de eliminación del médico',
            error: error.message
        })
    }
}

/**
 * Obtiene el ID de un médico a partir del ID de su usuario asociado
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id_usuario - ID del usuario asociado al médico
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} ID del médico encontrado
 */
const getMedicoIdByUsuarioId = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        
        if (!id_usuario) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }
        
        const medico = await getMedicoByUsuarioId(id_usuario);
        
        if (!medico) {
            return res.status(404).json({ message: 'No se encontró un médico asociado a este usuario' });
        }
        
        res.json(medico);
    } catch (error) {
        console.error('Error al obtener ID del médico:', error);
        res.status(500).json({ message: 'Error al obtener ID del médico', error: error.message });
    }
};

export {getAllM, getMById, insertM, editM, deleteM, getMedicoIdByUsuarioId}