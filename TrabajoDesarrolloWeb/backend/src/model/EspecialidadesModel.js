/**
 * Modelo de Especialidades
 * Este archivo contiene todas las funciones necesarias para interactuar con la tabla de especialidades
 * en la base de datos. Incluye operaciones CRUD para la gestión de especialidades médicas.
 * 
 * Funcionalidades:
 * - Obtener todas las especialidades
 * - Insertar nueva especialidad
 * - Obtener especialidad por ID
 * - Editar especialidad existente
 * - Eliminar especialidad
 */

import {getConnection} from '../config/Connection.js'

/**
 * Obtiene todas las especialidades registradas en la base de datos
 * @returns {Promise<Array>} Lista de especialidades
 */
const getAllEspecialidades = async () => {
    try {
        const con = await getConnection();
        const result = await con.request().query('SELECT * FROM especialidades')
        return result.recordset
    } catch (error) {
        console.log('Error al obtener las especialidades', error)
    }
}

/**
 * Inserta una nueva especialidad en la base de datos
 * @param {Object} especialidad - Objeto con los datos de la especialidad
 * @param {string} especialidad.nombre - Nombre de la especialidad
 * @returns {Promise<Object>} Especialidad creada con su ID
 */
const insertEspecialidad = async (especialidad) => {
    const con = await getConnection();
    const result = await con.request()
        .input('nombre', especialidad.nombre)
        .query('INSERT INTO Especialidades (nombre) VALUES (@nombre) SELECT SCOPE_IDENTITY() AS id')
    return result.recordset[0]
}

/**
 * Obtiene una especialidad específica por su ID
 * @param {number} id - ID de la especialidad a buscar
 * @returns {Promise<Object|null>} Especialidad encontrada o null si no existe
 */
const getEspecialidadById = async (id) => {
    try {
        const con = await getConnection();
        const result = await con.request()
        .input('id', id)
        .query('SELECT * FROM especialidades WHERE id_especialidad = @id')

        if (result.recordset.length === 0) {
            return null
        }
        return result.recordset[0]
    } catch (error) {
        console.log('Error al obtener la especialidad por ID', error)
    }
}

/**
 * Edita una especialidad existente
 * @param {number} id - ID de la especialidad a editar
 * @param {Object} especialidad - Nuevos datos de la especialidad
 * @param {string} especialidad.nombre - Nuevo nombre de la especialidad
 * @returns {Promise<Object|null>} Especialidad actualizada o null si no existe
 * @throws {Error} Si hay un error en la actualización
 */
const editEspecialidadById = async  (id, especialidad) => {
    try {
        const con  = await getConnection();
        const result = await con.request()
            .input('id', id)
            .input('nombre', especialidad.nombre)
            .query('UPDATE especialidades SET nombre = @nombre WHERE id_especialidad = @id')

        if (result.rowsAffected.length === 0) {
            return null
        }
        return { id, ...especialidad}
    } catch (error) {
        console.log('Error al editar la especialidad por ID', error)
        throw error
    }
}

/**
 * Elimina una especialidad de la base de datos
 * @param {number} id - ID de la especialidad a eliminar
 * @returns {Promise<Object|null>} ID de la especialidad eliminada o null si no existe
 * @throws {Error} Si hay un error en la eliminación
 */
const deleteEspecialidadById = async (id) => {
    try {
        const con = await getConnection();
        const result = await con.request()
            .input('id', id)
            .query('DELETE FROM especialidades WHERE id_especialidad = @id')

        if (result.rowsAffected.length === 0) {
            return null
        }
        return { id }
    } catch (error) {
        console.log('Error al eliminar la especialidad por ID', error)
        throw error
    }
}

export {getAllEspecialidades, insertEspecialidad, getEspecialidadById, editEspecialidadById, deleteEspecialidadById}
