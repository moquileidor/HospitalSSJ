/**
 * Modelo de Usuarios
 * Este archivo contiene todas las funciones necesarias para interactuar con la tabla de usuarios
 * en la base de datos. Incluye operaciones CRUD y funciones específicas para la gestión de usuarios.
 * 
 * Funcionalidades:
 * - Obtener todos los usuarios
 * - Insertar nuevo usuario
 * - Obtener usuario por ID
 * - Editar usuario existente
 * - Eliminar usuario
 * - Obtener usuario por email
 */

import {getConnection} from '../config/Connection.js'
import bcrypt from 'bcrypt'

const VALID_ROLES = ['PACIENTE', 'MEDICO', 'ADMINISTRADOR', 'SUPERADMIN'];

/**
 * Obtiene todos los usuarios registrados en la base de datos
 * @returns {Promise<Array>} Lista de usuarios
 */
const getAllUsuarios = async () => {
    try {
        const con = await getConnection();
        const result = await con.request().query('SELECT * FROM usuarios')
        return result.recordset
    } catch (error) {
        console.log('Error al obtener los usuarios', error)
    }
}

/**
 * Inserta un nuevo usuario en la base de datos
 * @param {Object} usuario - Objeto con los datos del usuario
 * @param {string} usuario.nombre - Nombre completo del usuario
 * @param {string} usuario.email - Email del usuario
 * @param {string} usuario.contrasena - Contraseña del usuario
 * @param {string} [usuario.rol='PACIENTE'] - Rol del usuario (PACIENTE por defecto)
 * @returns {Promise<Object>} Usuario creado con su ID
 * @throws {Error} Si el email ya existe
 */
const insertUsuario = async (usuario) => {
    try {
        // Primero obtenemos la conexión
        const con = await getConnection();

        // Verificamos si el email ya existe
        if (usuario.email) {
            const emailExiste = await con.request()
                .input('email', usuario.email)
                .query('SELECT id_usuario FROM usuarios WHERE email = @email')
            
            if (emailExiste.recordset.length > 0) {
                throw new Error ('El email ya existe');
            }
        }

        const saltRounds = 10;
        const passwordToStore = await bcrypt.hash(usuario.contrasena, saltRounds);
        
        const rol = (usuario.rol || 'PACIENTE').toUpperCase();
        if (!VALID_ROLES.includes(rol)) {
            throw new Error('Rol no valido');
        }
        const result = await con.request()
            .input('nombre', usuario.nombre)
            .input('email', usuario.email)
            .input('contrasena', passwordToStore)
            .input('rol', rol)
            .query('INSERT INTO usuarios (nombre, email, contrasena, rol) OUTPUT INSERTED.id_usuario VALUES (@nombre, @email, @contrasena, @rol)');
        return result.recordset[0];
    } catch (error) {
        console.log('Error al insertar el usuario', error);
        throw error;
    }
}

/**
 * Obtiene un usuario específico por su ID
 * @param {number} id - ID del usuario a buscar
 * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
 */
const getUsuarioById = async (id) => {
    try {
        const con = await getConnection();
        const result = await con.request()
            .input('id', id)
            .query('SELECT * FROM usuarios WHERE id_usuario = @id')

        if (result.recordset.length === 0){
            return null
        }

        return result.recordset[0]
    } catch (error) {
        console.log('Error al obtener al usuario por su ID', error)
    }
}

/**
 * Edita un usuario existente
 * @param {number} id - ID del usuario a editar
 * @param {Object} usuario - Nuevos datos del usuario
 * @param {string} [usuario.nombre] - Nuevo nombre
 * @param {string} [usuario.email] - Nuevo email
 * @param {string} [usuario.contrasena] - Nueva contraseña
 * @param {string} [usuario.rol] - Nuevo rol
 * @returns {Promise<Object>} Usuario actualizado
 * @throws {Error} Si el usuario no existe o el email ya está en uso
 */
const editUsuarioById = async (id, usuario) => {
    try {
        console.log('Modelo: Editando usuario con ID:', id, 'Datos recibidos:', { ...usuario, contrasena: usuario.contrasena ? '****' : undefined });
        const con = await getConnection();

        // Verificar si el usuario existe
        const usuarioExiste = await con.request()
            .input('id', id )
            .query('SELECT id_usuario, rol, contrasena FROM usuarios WHERE id_usuario = @id')
        
        if(usuarioExiste.recordset.length === 0){
            throw new Error ('El usuario no existe');
        }

        const usuarioActual = usuarioExiste.recordset[0];
        console.log('Modelo: Usuario actual encontrado:', { ...usuarioActual, contrasena: '****' });

        if (usuarioActual.rol === 'ADMINISTRADOR' && usuario.rol && usuario.rol.toUpperCase() !== 'ADMINISTRADOR') {
            throw new Error('No se puede cambiar el rol de un administrador');
        }

        // Verificar si el nuevo email ya está en uso
        if (usuario.email){
            const emailExiste = await con.request()
                .input('email', usuario.email)
                .input('id', id)
                .query('SELECT id_usuario FROM usuarios WHERE email = @email AND id_usuario != @id')

            if (emailExiste.recordset.length > 0 ) {
                throw new Error ('No se puede actualizar el email, ya que ya existe un usuario en ese email')
            }
        }

        // Construir la consulta de actualización
        let updateQuery = 'UPDATE usuarios SET nombre = @nombre, email = @email';
        const request = con.request()
            .input('id', id)
            .input('nombre', usuario.nombre)
            .input('email', usuario.email);

        // Actualizar el rol si se proporciona
        if (usuario.rol) {
            // Si el usuario era médico y el nuevo rol NO es médico, eliminar de la tabla medicos antes de actualizar el usuario
            if (usuarioActual.rol === 'MEDICO' && usuario.rol !== 'MEDICO') {
                // Verificar si tiene citas asociadas
                const citasResult = await con.request()
                    .input('id_usuario', id)
                    .query(`
                        SELECT COUNT(*) as citasCount 
                        FROM medicos m 
                        JOIN citas c ON m.id_medico = c.id_medico 
                        WHERE m.id_usuario = @id_usuario
                        AND c.estado IN ('PENDIENTE', 'CONFIRMADA')
                    `);
                const tieneCitas = citasResult.recordset[0].citasCount > 0;
                if (tieneCitas) {
                    throw new Error('No se puede cambiar el rol del médico porque tiene citas asociadas. Debe reasignar o cancelar las citas primero.');
                }
                // Eliminar de la tabla medicos
                await con.request()
                    .input('id_usuario', id)
                    .query('DELETE FROM medicos WHERE id_usuario = @id_usuario');
            }
            updateQuery += ', rol = @rol';
            request.input('rol', usuario.rol);
            console.log(`Modelo: Actualizando rol de '${usuarioActual.rol}' a '${usuario.rol}'`);
        } else {
            usuario.rol = usuarioActual.rol;
            console.log('Modelo: Manteniendo rol actual:', usuarioActual.rol);
        }

        // Actualizar la contraseña si se proporciona una nueva
        if (usuario.contrasena && usuario.contrasena.trim() !== '') {
            console.log('Modelo: Actualizando contraseña');
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(usuario.contrasena, saltRounds);
            updateQuery += ', contrasena = @contrasena';
            request.input('contrasena', hashedPassword);
        } else {
            console.log('Modelo: Manteniendo contraseña actual');
        }

        updateQuery += ' WHERE id_usuario = @id';
        console.log('Modelo: Query de actualización:', updateQuery);

        const result = await request.query(updateQuery);
        console.log('Modelo: Filas afectadas:', result.rowsAffected[0]);
        
        if (result.rowsAffected[0] === 0){
            return null;
        }

        // Manejar cambios de rol a médico
        if (usuario.rol === 'MEDICO') {
            console.log('Modelo: El usuario es médico, verificando si ya existe en la tabla médicos');
            const medicoExiste = await con.request()
                .input('id_usuario', id)
                .query('SELECT id_medico FROM medicos WHERE id_usuario = @id_usuario');
            
            if (medicoExiste.recordset.length === 0) {
                console.log('Modelo: El médico no existe, creándolo con especialidad por defecto');
                
                // Obtener la primera especialidad disponible
                const especialidades = await con.request()
                    .query('SELECT TOP 1 id_especialidad FROM especialidades ORDER BY id_especialidad');
                
                if (especialidades.recordset.length > 0) {
                    const id_especialidad = especialidades.recordset[0].id_especialidad;
                    console.log(`Modelo: Usando especialidad ID ${id_especialidad} por defecto`);
                    
                    // Crear el médico con la especialidad por defecto
                    await con.request()
                        .input('id_usuario', id)
                        .input('id_especialidad', id_especialidad)
                        .query('INSERT INTO medicos (id_usuario, id_especialidad) VALUES (@id_usuario, @id_especialidad)');
                    
                    console.log('Modelo: Médico creado correctamente');
                } else {
                    console.log('Modelo: No hay especialidades disponibles para asignar al médico');
                }
            } else {
                console.log('Modelo: El médico ya existe en la tabla médicos');
            }
        }

        return {id, ...usuario};

    } catch (error) {
        console.log('Error al actualizar el usuario', error)
        throw error;
    }
}

/**
 * Elimina un usuario de la base de datos
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise<Object|null>} ID del usuario eliminado o null si no existe
 */
const deleteUsuario = async (id) => {
    try {
        const con = await getConnection();

        // Verificar si el usuario es médico
        const medicoResult = await con.request()
            .input('id_usuario', id)
            .query('SELECT id_medico FROM medicos WHERE id_usuario = @id_usuario');
        const esMedico = medicoResult.recordset.length > 0;
        const idMedico = esMedico ? medicoResult.recordset[0].id_medico : null;

        // Verificar si el usuario tiene citas activas como PACIENTE (PENDIENTE o CONFIRMADA)
        console.log('Verificando citas activas como paciente, id_usuario:', id);
        const citasResult = await con.request()
            .input('id_usuario', id)
            .query(`
                SELECT COUNT(*) as citasCount 
                FROM citas 
                WHERE id_usuario = @id_usuario 
                AND estado IN ('PENDIENTE', 'CONFIRMADA')
            `);
        console.log('Citas activas encontradas para el usuario (como paciente):', citasResult.recordset[0].citasCount);
        const tieneCitasActivas = citasResult.recordset[0].citasCount > 0;
        
        if (tieneCitasActivas) {
            console.log('Usuario tiene citas activas como paciente, cancelándolas automáticamente...');
            // Cancelar automáticamente todas las citas activas del usuario como paciente
            await con.request()
                .input('id_usuario', id)
                .query(`
                    UPDATE citas 
                    SET estado = 'CANCELADA', 
                        notas = CONVERT(VARCHAR(MAX), ISNULL(notas, '')) + ' [CANCELADA AUTOMÁTICAMENTE - Paciente eliminado por administrador]'
                    WHERE id_usuario = @id_usuario 
                    AND estado IN ('PENDIENTE', 'CONFIRMADA')
                `);
            console.log('Citas activas como paciente canceladas automáticamente');
        }

        // Si es médico, verificar y cancelar citas activas como MÉDICO
        if (esMedico && idMedico) {
            console.log('Verificando citas activas como médico, id_medico:', idMedico);
            const citasMedicoResult = await con.request()
                .input('id_medico', idMedico)
                .query(`
                    SELECT COUNT(*) as citasCount 
                    FROM citas 
                    WHERE id_medico = @id_medico 
                    AND estado IN ('PENDIENTE', 'CONFIRMADA')
                `);
            console.log('Citas activas encontradas para el médico:', citasMedicoResult.recordset[0].citasCount);
            const tieneCitasActivasComoMedico = citasMedicoResult.recordset[0].citasCount > 0;
            
            if (tieneCitasActivasComoMedico) {
                console.log('Médico tiene citas activas, cancelándolas automáticamente...');
                // Cancelar automáticamente todas las citas activas del médico
                await con.request()
                    .input('id_medico', idMedico)
                    .query(`
                        UPDATE citas 
                        SET estado = 'CANCELADA', 
                            notas = CONVERT(VARCHAR(MAX), ISNULL(notas, '')) + ' [CANCELADA AUTOMÁTICAMENTE - Médico eliminado por administrador]'
                        WHERE id_medico = @id_medico 
                        AND estado IN ('PENDIENTE', 'CONFIRMADA')
                    `);
                console.log('Citas activas como médico canceladas automáticamente');
            }
        }

        // Desvincular todas las citas del usuario antes de eliminarlo (como paciente)
        await con.request()
            .input('id_usuario', id)
            .query('UPDATE citas SET id_usuario = NULL WHERE id_usuario = @id_usuario');

        // Si es médico, desvincular también las citas como médico y eliminarlo de la tabla medicos
        if (esMedico) {
            await con.request()
                .input('id_medico', idMedico)
                .query('UPDATE citas SET id_medico = NULL WHERE id_medico = @id_medico');
            
            await con.request()
                .input('id_usuario', id)
                .query('DELETE FROM medicos WHERE id_usuario = @id_usuario');
        }

        // Eliminar registros del historial de cambios donde el usuario era administrador
        console.log('Eliminando registros del historial de cambios del administrador...');
        await con.request()
            .input('id_admin', id)
            .query('DELETE FROM historial_cambios WHERE id_admin = @id_admin');

        // Eliminar registros de datos personales (si existen)
        await con.request()
            .input('id_usuario', id)
            .query('DELETE FROM datosPersonales WHERE id_usuario = @id_usuario');

        // Eliminar el usuario
        const result = await con.request()
            .input('id', id)
            .query('DELETE FROM usuarios WHERE id_usuario = @id');

        if (result.rowsAffected[0] === 0){
            return null;
        }
        return {id}
    } catch (error) {
        console.log('Error al eliminar al usuario por ID',error)
        throw error;
    }
}

/**
 * Obtiene un usuario por su email
 * @param {string} email - Email del usuario a buscar
 * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
 * @throws {Error} Si hay un error en la consulta
 */
const getUsuarioByEmail = async (email) => {
    try {
        const con = await getConnection();
        const result = await con.request()
            .input('email', email)
            .query('SELECT * FROM usuarios WHERE email = @email')
        
        if (result.recordset.length === 0){
            return null
        }
        return result.recordset[0]

    } catch (error) {
        console.log('Error al obtener al usuario por su email', error)
        throw error;
    }
}

const countSuperAdmins = async () => {
    const con = await getConnection();
    const result = await con.request()
        .query("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'SUPERADMIN'");
    return result.recordset[0].total || 0;
};

const existsSuperAdmin = async () => {
    return (await countSuperAdmins()) > 0;
};

export { getAllUsuarios, insertUsuario, getUsuarioById, editUsuarioById, deleteUsuario, getUsuarioByEmail };







