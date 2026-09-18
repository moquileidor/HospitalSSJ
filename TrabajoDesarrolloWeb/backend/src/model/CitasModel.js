/**
 * Modelo de Citas
 * Este archivo contiene todas las funciones necesarias para interactuar con la tabla de citas
 * en la base de datos. Incluye operaciones para la gestión de citas médicas, incluyendo
 * creación, confirmación, actualización y consulta de citas.
 * 
 * Funcionalidades:
 * - Crear nueva cita
 * - Listar citas pendientes
 * - Verificar disponibilidad de médico
 * - Confirmar cita
 * - Obtener citas por ID de usuario
 * - Obtener citas por ID de médico
 * - Actualizar estado de cita
 * - Listar todas las citas
 */

import { getConnection } from "../config/Connection.js";

const normalizarFechaCita = (valor) => {
    if (!valor) {
        throw new Error('Fecha de cita no proporcionada');
    }
    const fecha = valor instanceof Date ? valor : new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
        throw new Error('Fecha de cita invalida');
    }
    return fecha;
};

/**
 * Crea una nueva cita en la base de datos
 * @param {Object} cita - Objeto con los datos de la cita
 * @param {number} cita.id_usuario - ID del usuario que solicita la cita
 * @param {string} cita.fecha_cita - Fecha y hora de la cita
 * @param {string} [cita.notas] - Notas adicionales sobre la cita
 * @returns {Promise<Object>} Cita creada con su ID
 */
const crearCita = async ({id_usuario, fecha_cita, notas}) => {
    console.log("dsd")
    const con = await getConnection();
    const fechaNormalizada = normalizarFechaCita(fecha_cita);
    const result = await con.request()
        .input('id_usuario', id_usuario)
        .input('fecha_cita', fechaNormalizada)
        .input('estado', 'PENDIENTE')
        .input('notas', notas || null)
        .query('INSERT INTO citas (id_usuario, id_medico, fecha_cita, estado, notas) OUTPUT INSERTED.id_cita VALUES (@id_usuario, NULL, @fecha_cita, @estado, @notas)');

        console.log("fsdfsdfs")
    return result.recordset[0];
};

/**
 * Obtiene todas las citas pendientes que no tienen médico asignado
 * @returns {Promise<Array>} Lista de citas pendientes con información del paciente
 */
const listarCitasPendientes = async () => {
    const con = await getConnection();
    const result = await con.request()
        .query(`
            SELECT c.id_cita, c.id_usuario, c.fecha_cita, c.estado, c.notas, u.nombre as nombre_paciente
            FROM citas c
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.estado = 'PENDIENTE' AND c.id_medico IS NULL
        `);
    return result.recordset;
};

/**
 * Verifica si un médico está disponible en una fecha y hora específica
 * @param {number} id_medico - ID del médico a verificar
 * @param {string|Date} fecha_cita - Fecha y hora de la cita a verificar
 * @returns {Promise<boolean>} true si el médico está disponible, false si no
 */
const verificarDisponibilidadMedico = async (id_medico, fecha_cita) => {
    const con = await getConnection();

    const fechaObjetivo = normalizarFechaCita(fecha_cita);

    const inicioDia = new Date(fechaObjetivo);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fechaObjetivo);
    finDia.setHours(23, 59, 59, 999);

    const result = await con.request()
        .input('id_medico', id_medico)
        .input('fechaInicio', inicioDia)
        .input('fechaFin', finDia)
        .query(`
            SELECT fecha_cita
            FROM citas
            WHERE id_medico = @id_medico
            AND estado IN ('PENDIENTE', 'CONFIRMADA')
            AND fecha_cita BETWEEN @fechaInicio AND @fechaFin
        `);

    const dosHorasEnMs = 2 * 60 * 60 * 1000;
    return result.recordset.every((cita) => {
        const fechaExistente = normalizarFechaCita(cita.fecha_cita);
        const diferencia = Math.abs(fechaExistente.getTime() - fechaObjetivo.getTime());
        return diferencia >= dosHorasEnMs;
    });
};

/**
 * Confirma una cita asignándole un médico
 * @param {Object} params - Parámetros para confirmar la cita
 * @param {number} params.id_cita - ID de la cita a confirmar
 * @param {number} params.id_medico - ID del médico a asignar
 * @throws {Error} Si la cita no existe o el médico no está disponible
 */
const confirmarCita = async ({ id_cita, id_medico }) => {
    const con = await getConnection();

    // Primero obtener la fecha de la cita
    const citaResult = await con.request()
        .input('id_cita', id_cita)
        .query('SELECT fecha_cita FROM citas WHERE id_cita = @id_cita');

    if (citaResult.recordset.length === 0) {
        throw new Error('Cita no encontrada');
    }

    const fecha_cita = citaResult.recordset[0].fecha_cita;

    // Verificar disponibilidad
    const disponible = await verificarDisponibilidadMedico(id_medico, fecha_cita);
    if (!disponible) {
        throw new Error('Ya tienes una cita programada en este horario');
    }

    // Si está disponible, proceder con la confirmación
    await con.request()
        .input('id_cita', id_cita)
        .input('id_medico', id_medico)
        .input('estado', 'CONFIRMADA')
        .query('UPDATE citas SET id_medico = @id_medico, estado = @estado WHERE id_cita = @id_cita');
};

/**
 * Obtiene todas las citas de un usuario específico
 * @param {number} id_usuario - ID del usuario
 * @returns {Promise<Array>} Lista de citas del usuario con información del médico y especialidad
 */
const getCitasByUsuarioId = async (id_usuario) => {
    const con = await getConnection();
    const result = await con.request()
        .input('id_usuario', id_usuario)
        .query(`
            SELECT c.id_cita, c.fecha_cita, c.estado, c.notas,
                   m.id_medico,
                   u.nombre as nombre_medico,
                   e.nombre as especialidad
            FROM citas c
            LEFT JOIN medicos m ON c.id_medico = m.id_medico
            LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario
            LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE c.id_usuario = @id_usuario
            ORDER BY c.fecha_cita DESC
        `);
    return result.recordset;
};

/**
 * Obtiene todas las citas de un médico específico
 * @param {number} id_medico - ID del médico
 * @returns {Promise<Array>} Lista de citas del médico con información de los pacientes
 */
const getCitasByMedicoId = async (id_medico) => {
    const con = await getConnection();
    const result = await con.request()
        .input('id_medico', id_medico)
        .query(`
            SELECT c.id_cita, c.fecha_cita, c.estado, c.notas,
                   u.id_usuario, u.nombre as nombre_paciente,
                   e.nombre as especialidad
            FROM citas c
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            LEFT JOIN medicos m ON c.id_medico = m.id_medico
            LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE c.id_medico = @id_medico
            ORDER BY c.fecha_cita DESC
        `);
    return result.recordset;
};

/**
 * Actualiza el estado y/o fecha de una cita
 * @param {Object} params - Parámetros para actualizar la cita
 * @param {number} params.id_cita - ID de la cita a actualizar
 * @param {string} params.estado - Nuevo estado de la cita
 * @param {string} [params.nuevaFecha] - Nueva fecha para la cita
 * @param {number} [params.id_usuario] - ID del usuario que realiza el cambio
 * @returns {Promise<Object>} Cita actualizada con información completa
 * @throws {Error} Si hay un error al actualizar la cita o registrar el cambio
 */
const actualizarEstadoCita = async ({ id_cita, estado, nuevaFecha, id_usuario }) => {
    const con = await getConnection();
    
    console.log('Datos recibidos:', { id_cita, estado, nuevaFecha, id_usuario });
    
    // Si hay una nueva fecha, ajustarla para manejar la zona horaria
    if (nuevaFecha) {
        const fecha = normalizarFechaCita(nuevaFecha);
        nuevaFecha = fecha;
        console.log('Fecha normalizada:', fecha.toISOString());
    }

    // Actualizar estado y fecha si se proporciona
    let updateQuery = 'UPDATE citas SET estado = @estado';
    const request = con.request()
        .input('id_cita', id_cita)
        .input('estado', estado);
    
    if (nuevaFecha) {
        updateQuery += ', fecha_cita = @nuevaFecha';
        request.input('nuevaFecha', nuevaFecha);
    }
    updateQuery += ' WHERE id_cita = @id_cita';
    
    console.log('Query de actualización:', updateQuery);
    await request.query(updateQuery);

    // Registrar en historial_cambios
    if (id_usuario) {
        const tipo_cambio = nuevaFecha ? 'CAMBIO_FECHA' : 'CAMBIO_ESTADO';
        console.log('Insertando en historial_cambios:', { id_cita, id_usuario, tipo_cambio });
        try {
            await con.request()
                .input('id_cita', id_cita)
                .input('id_admin', id_usuario)
                .input('tipo_cambio', tipo_cambio)
                .query('INSERT INTO historial_cambios (id_cita, id_admin, tipo_cambio, fecha_cambio) VALUES (@id_cita, @id_admin, @tipo_cambio, GETDATE())');
            console.log('Inserción en historial_cambios exitosa');
        } catch (error) {
            console.error('Error al insertar en historial_cambios:', error);
            throw error;
        }
    } else {
        console.log('No se registró en historial_cambios porque no hay id_usuario');
    }

    // Devolver la cita actualizada
    const result = await con.request()
        .input('id_cita', id_cita)
        .query(`
            SELECT c.id_cita, c.fecha_cita, c.estado, c.notas,
                   u.nombre as nombre_paciente,
                   m.id_medico,
                   (SELECT nombre FROM usuarios WHERE id_usuario = m.id_usuario) as nombre_medico,
                   e.nombre as especialidad
            FROM citas c
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            LEFT JOIN medicos m ON c.id_medico = m.id_medico
            LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE c.id_cita = @id_cita
        `);
    return result.recordset[0];
};

/**
 * Obtiene todas las citas del sistema con información detallada
 * @returns {Promise<Array>} Lista completa de citas con información de pacientes, médicos y cambios
 */
const listarTodasLasCitas = async () => {
    const con = await getConnection();
    const result = await con.request()
        .query(`
            SELECT 
                c.id_cita,
                c.fecha_cita,
                c.estado,
                c.notas,
                p.nombre as nombre_paciente,
                p.email as email_paciente,
                m.id_medico,
                med.nombre as nombre_medico,
                e.nombre as especialidad,
                hc.fecha_cambio as ultimo_cambio,
                hc.tipo_cambio as tipo_ultimo_cambio,
                admin.nombre as nombre_admin_cambio
            FROM citas c
            INNER JOIN usuarios p ON c.id_usuario = p.id_usuario
            LEFT JOIN medicos m ON c.id_medico = m.id_medico
            LEFT JOIN usuarios med ON m.id_usuario = med.id_usuario
            LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            LEFT JOIN (
                SELECT id_cita, MAX(fecha_cambio) as ultima_fecha
                FROM historial_cambios
                GROUP BY id_cita
            ) ult ON c.id_cita = ult.id_cita
            LEFT JOIN historial_cambios hc ON ult.id_cita = hc.id_cita 
                AND ult.ultima_fecha = hc.fecha_cambio
            LEFT JOIN usuarios admin ON hc.id_admin = admin.id_usuario
            ORDER BY c.fecha_cita DESC
        `);
    return result.recordset;
};

export {
    crearCita,
    listarCitasPendientes,
    confirmarCita,
    getCitasByUsuarioId,
    getCitasByMedicoId,
    actualizarEstadoCita,
    verificarDisponibilidadMedico,
    listarTodasLasCitas
};