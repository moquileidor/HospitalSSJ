/**
 * Rutas de Datos Personales
 * Este archivo define las rutas relacionadas con la gestión de datos personales
 * de los usuarios en el sistema, incluyendo creación, consulta y actualización.
 * 
 * Rutas disponibles:
 * - POST /: Crear datos personales de un usuario
 * - GET /:id_usuario: Obtener datos personales de un usuario
 * - PUT /:id_usuario: Actualizar datos personales de un usuario
 */

import { Router } from 'express';
import { createDatosPersonales, getDatosPersonales, updateDatosPersonalesController } from '../controller/DatosPersonalesController.js';

const router = Router();

/**
 * @route POST /
 * @desc Crear un nuevo registro de datos personales para un usuario
 * @access Private
 */
router.post('/', createDatosPersonales);

/**
 * @route GET /:id_usuario
 * @desc Obtener los datos personales de un usuario específico
 * @access Private
 * @param {string} id_usuario - ID del usuario cuyos datos se quieren consultar
 */
router.get('/:id_usuario', getDatosPersonales);

/**
 * @route PUT /:id_usuario
 * @desc Actualizar los datos personales de un usuario existente
 * @access Private
 * @param {string} id_usuario - ID del usuario cuyos datos se quieren actualizar
 */
router.put('/:id_usuario', updateDatosPersonalesController);

export default router; 