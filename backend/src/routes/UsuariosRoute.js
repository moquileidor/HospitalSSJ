/**
 * Rutas de Usuarios
 * Este archivo define las rutas relacionadas con la gestión de usuarios
 * en el sistema, incluyendo listado, creación, edición y eliminación.
 * 
 * Rutas disponibles:
 * - GET /listarU: Obtiene todos los usuarios
 * - POST /: Crea un nuevo usuario
 * - PUT /:id: Actualiza un usuario existente
 * - DELETE /:id: Elimina un usuario
 */

import {getAllU, getUById, insertU, editeU, deleteU, getPassword} from '../controller/UsuarioController.js'
import { verifyToken, verificarAdmin } from '../controller/AuthController.js'
import express from 'express'
const router = express.Router()

/**
 * @route GET /listarU
 * @desc Obtiene la lista de todos los usuarios registrados
 * @access Private
 */
router.get('/listarU', getAllU)

/**
 * @route POST /
 * @desc Crea un nuevo usuario en el sistema
 * @access Public
 */
router.post('/', insertU)

/**
 * @route GET /:id/password
 * @desc Obtiene la contraseña de un usuario (solo para administradores)
 * @access Private (requiere token y rol administrador)
 * @param {string} id - ID del usuario cuya contraseña se quiere obtener
 */
router.get('/:id/password', verifyToken, verificarAdmin, getPassword)

/**
 * @route PUT /:id
 * @desc Actualiza los datos de un usuario existente
 * @access Private (requiere token)
 * @param {string} id - ID del usuario a actualizar
 */
router.put('/:id', verifyToken, editeU)

/**
 * @route DELETE /:id
 * @desc Elimina un usuario del sistema
 * @access Private (requiere token)
 * @param {string} id - ID del usuario a eliminar
 */
router.delete('/:id', verifyToken, deleteU)

export default router