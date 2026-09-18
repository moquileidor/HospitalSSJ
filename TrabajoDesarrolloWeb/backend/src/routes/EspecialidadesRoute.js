/**
 * Rutas de Especialidades Médicas
 * Este archivo define las rutas relacionadas con la gestión de especialidades
 * médicas en el sistema, incluyendo listado, creación, edición y eliminación.
 * 
 * Rutas disponibles:
 * - GET /: Obtiene todas las especialidades
 * - POST /: Crea una nueva especialidad
 * - GET /:id: Obtiene una especialidad específica
 * - PUT /:id: Actualiza una especialidad existente
 * - DELETE /:id: Elimina una especialidad
 */

import { getAllE, insertE, getEById, updateE, deleteE} from "../controller/EspecialidadesController.js";
import express from 'express'

const router = express.Router()

/**
 * @route GET /
 * @desc Obtiene la lista de todas las especialidades médicas registradas
 * @access Private
 */
router.get('/', getAllE)

/**
 * @route POST /
 * @desc Crea una nueva especialidad médica en el sistema
 * @access Private
 */
router.post('/', insertE)

/**
 * @route GET /:id
 * @desc Obtiene los datos de una especialidad médica específica
 * @access Private
 * @param {string} id - ID de la especialidad a consultar
 */
router.get('/:id', getEById)

/**
 * @route PUT /:id
 * @desc Actualiza los datos de una especialidad médica existente
 * @access Private
 * @param {string} id - ID de la especialidad a actualizar
 */
router.put('/:id', updateE)

/**
 * @route DELETE /:id
 * @desc Elimina una especialidad médica del sistema
 * @access Private
 * @param {string} id - ID de la especialidad a eliminar
 */
router.delete('/:id', deleteE)

export default router