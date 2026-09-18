/**
 * Modelo de Médicos
 * Este archivo contiene todas las funciones necesarias para interactuar con la tabla de médicos
 * en la base de datos. Incluye operaciones CRUD y funciones específicas para la gestión de médicos.
 * 
 * Funcionalidades:
 * - Obtener todos los médicos
 * - Insertar nuevo médico
 * - Obtener médico por ID
 * - Obtener médico por ID de usuario
 * - Editar médico existente
 * - Eliminar médico
 */

import { getConnection} from "../config/Connection.js";

/**
 * Obtiene todos los médicos registrados con sus datos completos
 * Utiliza un procedimiento almacenado para obtener la información detallada
 * @returns {Promise<Array>} Lista de médicos con sus datos completos
 */
const getAllMedicos = async () => {
    try {
        const con  = await getConnection();
        const result = await con.request().execute('sp_listar_medicos')
        return result.recordset
    } catch (error) {
        console.log('Error al obetner las especialidades', error)
    }
}

/**
 * Inserta un nuevo médico en la base de datos
 * @param {Object} medico - Objeto con los datos del médico
 * @param {number} medico.id_especialidad - ID de la especialidad del médico
 * @param {number} medico.id_usuario - ID del usuario asociado al médico
 * @returns {Promise<Object>} Médico creado con su ID
 * @throws {Error} Si hay un error en la inserción
 */
const insertMedico = async (medico) => {
    try {
        const con = await getConnection();
        const result = await con.request()
            .input('id_especialidad', medico.id_especialidad)
            .input('id_usuario', medico.id_usuario)
            .query('INSERT INTO medicos (id_especialidad, id_usuario) VALUES (@id_especialidad, @id_usuario); SELECT SCOPE_IDENTITY() AS id');
        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

/**
 * Obtiene un médico específico por su ID
 * @param {number} id - ID del médico a buscar
 * @returns {Promise<Object|null>} Médico encontrado o null si no existe
 */
const getMedicoById = async (id) => {
    try {
        const con = await getConnection();
        const result = await con.request() 
            .input('id', id)
            .query('SELECT * FROM medicos WHERE id_medico = @id')
        
        if (result.recordset.length === 0) {
            return null
        }
        return result.recordset[0]
    } catch (error) {
        console.log('Error al obtener al medico por su ID', error)
    }
}

/**
 * Obtiene un médico por el ID de su usuario asociado
 * @param {number} id_usuario - ID del usuario asociado al médico
 * @returns {Promise<Object|null>} Médico encontrado o null si no existe
 * @throws {Error} Si hay un error en la consulta
 */
const getMedicoByUsuarioId = async (id_usuario) => {
    try {
        const con = await getConnection();
        const result = await con.request() 
            .input('id_usuario', id_usuario)
            .query('SELECT id_medico FROM medicos WHERE id_usuario = @id_usuario')
        
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0];
    } catch (error) {
        console.log('Error al obtener al médico por ID de usuario:', error);
        throw error;
    }
};

/**
 * Edita un médico existente
 * @param {number} id - ID del médico a editar
 * @param {Object} medico - Nuevos datos del médico
 * @param {number} [medico.id_especialidad] - Nueva especialidad
 * @param {string} [medico.nombre] - Nuevo nombre
 * @param {string} [medico.email] - Nuevo email
 * @returns {Promise<Object>} Mensaje de éxito
 * @throws {Error} Si el médico no existe o el email ya está en uso
 */
const editMedicoById = async (id, medico) => {
    try {
        const con = await getConnection();

        // 1. Verificar si el médico existe y obtener su id_usuario
        const medicoExiste = await con.request()
            .input('id', id)
            .query('SELECT id_medico, id_usuario FROM medicos WHERE id_medico = @id');
        
        if (medicoExiste.recordset.length === 0) {
            throw new Error(`No se encontró el médico con ID ${id}`);
        }
        
        // Obtener el id_usuario asociado al médico
        const id_usuario = medicoExiste.recordset[0].id_usuario;
        
        if (!id_usuario) {
            throw new Error(`El médico con ID ${id} no tiene un usuario asociado`);
        }

        // 2. Actualizar la especialidad en la tabla médicos (solo si se proporciona)
        if (medico.id_especialidad) {
            await con.request()
                .input('id', id)
                .input('id_especialidad', medico.id_especialidad)
                .query('UPDATE medicos SET id_especialidad = @id_especialidad WHERE id_medico = @id');
            
            console.log(`Especialidad actualizada para médico ID ${id}`);
        }

        // 3. Actualizar los datos del usuario (nombre y email, solo los proporcionados)
        const updateFields = [];
        const request = con.request().input('id_usuario', id_usuario);
        
        // Preparar actualización del nombre si se proporciona
        if (medico.nombre && medico.nombre.trim() !== '') {
            updateFields.push('nombre = @nombre');
            request.input('nombre', medico.nombre.trim());
        }
        
        // Preparar actualización del email si se proporciona
        if (medico.email && medico.email.trim() !== '') {
            // Verificar si el email ya existe (excepto para este usuario)
            const emailExiste = await con.request()
                .input('email', medico.email.trim())
                .input('id_usuario', id_usuario)
                .query('SELECT id_usuario FROM usuarios WHERE email = @email AND id_usuario != @id_usuario');
            
            if (emailExiste.recordset.length > 0) {
                throw new Error(`El email ${medico.email} ya está en uso por otro usuario`);
            }
            
            updateFields.push('email = @email');
            request.input('email', medico.email.trim());
        }
        
        // Si hay campos para actualizar, ejecutar la consulta
        if (updateFields.length > 0) {
            const updateQuery = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = @id_usuario`;
            await request.query(updateQuery);
            console.log(`Datos de usuario actualizados para médico ID ${id}`);
        }

        return { message: "Médico actualizado correctamente" };
    } catch (error) {
        console.error('Error en editMedicoById:', error);
        throw error;
    }
}

/**
 * Elimina un médico y su usuario asociado
 * @param {number} id - ID del médico a eliminar
 * @returns {Promise<Object>} ID del médico eliminado
 * @throws {Error} Si el médico tiene citas asociadas o no se puede eliminar
 */
const deleteMedico = async (id) => { 
    try {
        const con = await getConnection();
        
        // Obtener el usuario asociado al médico (si existe)
        const medicoQuery = await con.request()
            .input('id', id)
            .query('SELECT id_usuario FROM medicos WHERE id_medico = @id');
        
        if (medicoQuery.recordset.length === 0) {
            return null; // No existe el médico
        }
        
        const id_usuario = medicoQuery.recordset[0].id_usuario;
        
        // Asegurar que las columnas permitan valores NULL para conservar historial
        await con.request().query(
            "IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('citas') AND name = 'id_medico' AND is_nullable = 0) " +
            "ALTER TABLE citas ALTER COLUMN id_medico INT NULL"
        );
        await con.request().query(
            "IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('citas') AND name = 'id_usuario' AND is_nullable = 0) " +
            "ALTER TABLE citas ALTER COLUMN id_usuario INT NULL"
        );
        await con.request().query(
            "IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('historial_cambios') AND name = 'id_admin' AND is_nullable = 0) " +
            "ALTER TABLE historial_cambios ALTER COLUMN id_admin INT NULL"
        );
        
        // Marcar las citas del médico como canceladas y desvincular el id del médico
        await con.request()
            .input('id_medico', id)
            .query(`
                UPDATE citas
                SET id_medico = NULL,
                    estado = CASE WHEN estado IN ('PENDIENTE','CONFIRMADA') THEN 'CANCELADA' ELSE estado END,
                    notas = CONVERT(VARCHAR(MAX), ISNULL(notas, '')) + ' [MÉDICO ELIMINADO]'
                WHERE id_medico = @id_medico
            `);
        
        if (id_usuario) {
            // Desvincular historial administrativo y citas donde haya actuado como paciente
            await con.request()
                .input('id_usuario', id_usuario)
                .query('UPDATE historial_cambios SET id_admin = NULL WHERE id_admin = @id_usuario');
            
            await con.request()
                .input('id_usuario', id_usuario)
                .query(`
                    UPDATE citas
                    SET id_usuario = NULL,
                        estado = CASE WHEN estado IN ('PENDIENTE','CONFIRMADA') THEN 'CANCELADA' ELSE estado END,
                        notas = CONVERT(VARCHAR(MAX), ISNULL(notas, '')) + ' [USUARIO ELIMINADO]'
                    WHERE id_usuario = @id_usuario
                `);
        }
        
        // Eliminar el registro del médico
        const medicoDelete = await con.request()
            .input('id', id)
            .query('DELETE FROM medicos WHERE id_medico = @id');
        
        if (medicoDelete.rowsAffected[0] === 0) {
            throw new Error('No se pudo eliminar el médico');
        }
        
        console.log(`Médico ID ${id} eliminado correctamente`);
        
        // Eliminar al usuario asociado y sus datos dependientes
        if (id_usuario) {
            try {
                await con.request()
                    .input('id_usuario', id_usuario)
                    .query('DELETE FROM datosPersonales WHERE id_usuario = @id_usuario');
                
                const usuarioDelete = await con.request()
                    .input('id_usuario', id_usuario)
                    .query('DELETE FROM usuarios WHERE id_usuario = @id_usuario');
                
                if (usuarioDelete.rowsAffected[0] === 0) {
                    console.warn(`No se pudo eliminar el usuario asociado ID ${id_usuario}`);
                } else {
                    console.log(`Usuario ID ${id_usuario} eliminado`);
                }
            } catch (userError) {
                console.error(`Error al eliminar el usuario asociado: ${userError.message}`);
            }
        }
        
        return { id };
    } catch (error) {
        console.error('Error al eliminar al médico por ID:', error);
        throw error;
    }
}
export {getAllMedicos, insertMedico, getMedicoById, getMedicoByUsuarioId, editMedicoById, deleteMedico}
