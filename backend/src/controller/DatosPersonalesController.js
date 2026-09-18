/**
 * Controlador de Datos Personales
 * Este archivo contiene todas las funciones necesarias para manejar las operaciones
 * relacionadas con los datos personales de los usuarios en el sistema, incluyendo
 * la creación, consulta y actualización de información personal.
 * 
 * Funcionalidades:
 * - Crear datos personales de usuario
 * - Obtener datos personales por ID de usuario
 * - Actualizar datos personales existentes
 */

import { insertDatosPersonales, getDatosPersonalesByUsuarioId, updateDatosPersonales } from '../model/DatosPersonalesModel.js';

/**
 * Crea un nuevo registro de datos personales para un usuario
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos personales a crear
 * @param {number} req.body.id_usuario - ID del usuario al que pertenecen los datos
 * @param {string} [req.body.fechaNacimiento] - Fecha de nacimiento del usuario
 * @param {string} [req.body.direccion] - Dirección del usuario
 * @param {string} [req.body.telefono] - Número de teléfono del usuario
 * @param {string} [req.body.genero] - Género del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos personales creados
 */
export const createDatosPersonales = async (req, res) => {
    try {
        const datosPersonales = req.body;
        
        // Validar campos requeridos
        if (!datosPersonales.id_usuario) {
            return res.status(400).json({ 
                success: false,
                message: 'El ID de usuario es requerido' 
            });
        }

        const result = await insertDatosPersonales(datosPersonales);
        res.status(201).json({
            success: true,
            data: result,
            message: 'Datos personales creados correctamente'
        });
    } catch (error) {
        console.error('Error al crear datos personales:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear los datos personales',
            error: error.message 
        });
    }
};

/**
 * Obtiene los datos personales de un usuario específico
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id_usuario - ID del usuario cuyos datos se quieren obtener
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos personales del usuario
 */
export const getDatosPersonales = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        if (!id_usuario) {
            return res.status(400).json({ 
                success: false,
                message: 'El ID de usuario es requerido' 
            });
        }

        const datosPersonales = await getDatosPersonalesByUsuarioId(id_usuario);
        if (!datosPersonales) {
            return res.status(404).json({ 
                success: false,
                message: 'No se encontraron datos personales para este usuario',
                error: 'NOT_FOUND'
            });
        }
        res.json({
            success: true,
            data: datosPersonales
        });
    } catch (error) {
        console.error('Error al obtener datos personales:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener los datos personales',
            error: error.message 
        });
    }
};

/**
 * Actualiza los datos personales de un usuario existente o crea uno nuevo si no existe
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id_usuario - ID del usuario cuyos datos se quieren actualizar
 * @param {Object} req.body - Nuevos datos personales
 * @param {string} [req.body.fechaNacimiento] - Nueva fecha de nacimiento
 * @param {string} [req.body.direccion] - Nueva dirección
 * @param {string} [req.body.telefono] - Nuevo número de teléfono
 * @param {string} [req.body.genero] - Nuevo género
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Confirmación de la actualización o creación
 */
export const updateDatosPersonalesController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const datosPersonales = req.body;
        
        if (!id_usuario) {
            return res.status(400).json({ 
                success: false,
                message: 'El ID de usuario es requerido' 
            });
        }

        // Validar que al menos un campo esté presente
        if (!datosPersonales.fechaNacimiento && !datosPersonales.direccion && 
            !datosPersonales.telefono && !datosPersonales.genero) {
            return res.status(400).json({ 
                success: false,
                message: 'Debe proporcionar al menos un campo para actualizar',
                error: 'MISSING_FIELDS'
            });
        }

        // Primero intentar actualizar
        const success = await updateDatosPersonales(id_usuario, {
            fechaNacimiento: datosPersonales.fechaNacimiento || null,
            direccion: datosPersonales.direccion || '',
            telefono: datosPersonales.telefono || '',
            genero: datosPersonales.genero || ''
        });
        
        if (!success) {
            // Si no existe, intentar crear nuevos datos personales
            const newDatos = await insertDatosPersonales({
                ...datosPersonales,
                id_usuario,
                fechaNacimiento: datosPersonales.fechaNacimiento || null,
                direccion: datosPersonales.direccion || '',
                telefono: datosPersonales.telefono || '',
                genero: datosPersonales.genero || ''
            });
            return res.status(201).json({
                success: true,
                message: 'Datos personales creados correctamente',
                data: newDatos
            });
        }
        
        res.json({ 
            success: true,
            message: 'Datos personales actualizados correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar datos personales:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar los datos personales',
            error: error.message 
        });
    }
}; 