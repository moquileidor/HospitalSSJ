/**
 * Modelo de Datos Personales
 * Este archivo contiene todas las funciones necesarias para interactuar con la tabla de datos personales
 * en la base de datos. Incluye operaciones para la gestión de información personal de los usuarios.
 * 
 * Funcionalidades:
 * - Insertar datos personales
 * - Obtener datos personales por ID de usuario
 * - Actualizar datos personales
 */

import { getConnection } from "../config/Connection.js";

/**
 * Inserta los datos personales de un usuario en la base de datos
 * @param {Object} datosPersonales - Objeto con los datos personales del usuario
 * @param {number} datosPersonales.id_usuario - ID del usuario
 * @param {string} datosPersonales.fechaNacimiento - Fecha de nacimiento
 * @param {string} datosPersonales.direccion - Dirección del usuario
 * @param {string} datosPersonales.telefono - Número de teléfono
 * @param {string} datosPersonales.genero - Género del usuario
 * @returns {Promise<Object>} Datos personales insertados
 * @throws {Error} Si ya existen datos personales para el usuario
 */
const insertDatosPersonales = async (datosPersonales) => {
    let con;
    try {
        con = await getConnection();
        
        // Verificar si ya existen datos personales para este usuario
        const checkResult = await con.request()
            .input('id_usuario', datosPersonales.id_usuario)
            .query('SELECT id_datosPersonales FROM datosPersonales WHERE id_usuario = @id_usuario');
            
        if (checkResult.recordset.length > 0) {
            throw new Error('Ya existen datos personales para este usuario');
        }

        const result = await con.request()
            .input('id_usuario', datosPersonales.id_usuario)
            .input('fechaNacimiento', datosPersonales.fechaNacimiento)
            .input('direccion', datosPersonales.direccion)
            .input('telefono', datosPersonales.telefono)
            .input('genero', datosPersonales.genero)
            .query(`
                INSERT INTO datosPersonales (
                    id_usuario, 
                    fechaNacimiento, 
                    direccion, 
                    telefono, 
                    genero
                ) 
                OUTPUT INSERTED.* 
                VALUES (
                    @id_usuario, 
                    @fechaNacimiento, 
                    @direccion, 
                    @telefono, 
                    @genero
                )
            `);
        
        return result.recordset[0];
    } catch (error) {
        console.error('Error al insertar datos personales:', error);
        throw error;
    }
};

/**
 * Obtiene los datos personales de un usuario específico
 * @param {number} id_usuario - ID del usuario
 * @returns {Promise<Object|null>} Datos personales del usuario o null si no existen
 * @throws {Error} Si hay un error al obtener los datos
 */
const getDatosPersonalesByUsuarioId = async (id_usuario) => {
    let con;
    try {
        con = await getConnection();
        const result = await con.request()
            .input('id_usuario', id_usuario)
            .query(`
                SELECT 
                    dp.*,
                    u.nombre,
                    u.email
                FROM datosPersonales dp
                INNER JOIN usuarios u ON dp.id_usuario = u.id_usuario
                WHERE dp.id_usuario = @id_usuario
            `);
        
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Error al obtener datos personales:', error);
        throw error;
    }
};

/**
 * Actualiza los datos personales de un usuario
 * @param {number} id_usuario - ID del usuario
 * @param {Object} datosPersonales - Nuevos datos personales
 * @param {string} datosPersonales.fechaNacimiento - Nueva fecha de nacimiento
 * @param {string} datosPersonales.direccion - Nueva dirección
 * @param {string} datosPersonales.telefono - Nuevo número de teléfono
 * @param {string} datosPersonales.genero - Nuevo género
 * @returns {Promise<boolean>} true si se actualizaron los datos, false si no
 * @throws {Error} Si hay un error al actualizar los datos
 */
const updateDatosPersonales = async (id_usuario, datosPersonales) => {
    let con;
    try {
        con = await getConnection();
        const result = await con.request()
            .input('id_usuario', id_usuario)
            .input('fechaNacimiento', datosPersonales.fechaNacimiento)
            .input('direccion', datosPersonales.direccion)
            .input('telefono', datosPersonales.telefono)
            .input('genero', datosPersonales.genero)
            .query(`
                UPDATE datosPersonales 
                SET 
                    fechaNacimiento = @fechaNacimiento,
                    direccion = @direccion,
                    telefono = @telefono,
                    genero = @genero
                OUTPUT INSERTED.*
                WHERE id_usuario = @id_usuario
            `);
        
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error al actualizar datos personales:', error);
        throw error;
    }
};

export { insertDatosPersonales, getDatosPersonalesByUsuarioId, updateDatosPersonales }; 