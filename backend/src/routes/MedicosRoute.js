/**
 * Rutas de Médicos
 * Este archivo define las rutas relacionadas con la gestión de médicos
 * en el sistema, incluyendo listado, creación, edición y eliminación.
 * 
 * Rutas disponibles:
 * - GET /: Obtiene todos los médicos
 * - POST /: Crea un nuevo médico
 * - GET /usuario/:id_usuario: Obtiene el ID de un médico por su ID de usuario
 * - GET /:id: Obtiene un médico específico
 * - PUT /:id: Actualiza un médico existente
 * - DELETE /:id: Elimina un médico
 */

import { getAllM , insertM, getMById, editM, deleteM, getMedicoIdByUsuarioId} from "../controller/MedicosController.js";
import express from 'express'

const router = express.Router()

/**
 * @route GET /
 * @desc Obtiene la lista de todos los médicos registrados
 * @access Private
 */
router.get('/', getAllM)

/**
 * @route POST /
 * @desc Crea un nuevo médico en el sistema
 * @access Private
 */
router.post('/', insertM)

/**
 * @route GET /usuario/:id_usuario
 * @desc Obtiene el ID de un médico a partir del ID de su usuario asociado
 * @access Private
 * @param {string} id_usuario - ID del usuario asociado al médico
 */
router.get('/usuario/:id_usuario', getMedicoIdByUsuarioId)

/**
 * @route GET /:id
 * @desc Obtiene los datos de un médico específico
 * @access Private
 * @param {string} id - ID del médico a consultar
 */
router.get('/:id', getMById)

/**
 * @route PUT /:id
 * @desc Actualiza los datos de un médico existente
 * @access Private
 * @param {string} id - ID del médico a actualizar
 */
router.put('/:id', editM)

/**
 * @route DELETE /:id
 * @desc Elimina un médico del sistema
 * @access Private
 * @param {string} id - ID del médico a eliminar
 */
router.delete('/:id', deleteM)

export default router