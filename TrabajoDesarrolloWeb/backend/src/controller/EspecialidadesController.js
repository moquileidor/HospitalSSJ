/**
 * Controlador de Especialidades Médicas
 * Este archivo contiene todas las funciones necesarias para manejar las operaciones
 * relacionadas con las especialidades médicas en el sistema, incluyendo la creación,
 * lectura, actualización y eliminación de especialidades.
 * 
 * Funcionalidades:
 * - Obtener todas las especialidades
 * - Obtener especialidad por ID
 * - Insertar nueva especialidad
 * - Editar especialidad existente
 * - Eliminar especialidad
 */

import {getAllEspecialidades, getEspecialidadById, insertEspecialidad, editEspecialidadById, deleteEspecialidadById } from '../model/EspecialidadesModel.js'

/**
 * Obtiene todas las especialidades médicas registradas en el sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Lista de especialidades médicas
 */
const getAllE = async (req, res) => {
    try {
        const especialidades = await getAllEspecialidades()
        res.json(especialidades)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

/**
 * Inserta una nueva especialidad médica en el sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la especialidad a insertar
 * @param {string} req.body.nombre - Nombre de la especialidad médica
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos de la especialidad creada
 */
const insertE = async (req, res) => {
    try {
        const { nombre } = req.body

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la especialidad es obligatorio' })
        }

        const nuevaEspecialidad = { nombre }
        const resultado = await insertEspecialidad(nuevaEspecialidad)

        res.status(201).json({
            message_: 'Especialidad creada correctamente',
            id: resultado.id,
            especialidad: nuevaEspecialidad
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/**
 * Obtiene una especialidad médica específica por su ID
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la especialidad a buscar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos de la especialidad encontrada
 */
const getEById = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)){
            return res.status(400).json({
                message: 'ID INVALIDO'
            })
        }

        const especialidad = await getEspecialidadById(id)

        if (!especialidad) {
            return res.status(404).json(
                {
                    message: 'No se encontró la especialidad con el ID proporcionado' + '(' + id + ')'
                }
            )
        }

        res.json(especialidad)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la especialidad', error: error.message })
    }
}

/**
 * Actualiza una especialidad médica existente
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la especialidad a actualizar
 * @param {Object} req.body - Nuevos datos de la especialidad
 * @param {string} req.body.nombre - Nuevo nombre de la especialidad
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos de la especialidad actualizada
 */
const updateE = async (req, res) => {
    try {
        const id = req.params.id
        const { nombre } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({message: 'Id inválido'})
        }

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la especialidad es obligatorio' })
        }
        
        const especialidadExistente = await getEspecialidadById(id)
        if (!especialidadExistente) {
            return res.status(400).json({ message: 'No se encontró la especialidad con el ID proporcionado' + '(' + id + ')' })
        }

        const especialidadActualizada = { nombre }
        const resultado = await editEspecialidadById(id, especialidadActualizada)

        res.json({
            message: 'Especialidad actualizada correctamente',
            especialidad: resultado
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la especialidad', error: error.message })
    }
}

/**
 * Elimina una especialidad médica del sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la especialidad a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Confirmación de eliminación
 */
const deleteE = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const especialidadExistente = await getEspecialidadById(id)
        if (!especialidadExistente) {
            return res.status(404).json({
                message: 'No se encontró la especialidad con el ID proporcionado' + '(' + id + ')'
            })
        }

        const resultado = await deleteEspecialidadById(id)
        if (resultado) {
            return res.json({ message: `Especialidad con ID: ${id} eliminada correctamente` })
        } else {
            return res.status(500).json({ message: 'No se pudo eliminar la especialidad' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la especialidad', error: error.message })
    }
}

export {getAllE, insertE, getEById, updateE, deleteE}
