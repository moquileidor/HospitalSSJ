/**
 * Controlador de Citas Médicas
 * Este archivo contiene todas las funciones necesarias para manejar las operaciones
 * relacionadas con las citas médicas en el sistema, incluyendo la creación, consulta,
 * confirmación y actualización de citas.
 * 
 * Funcionalidades:
 * - Agendar nueva cita (pacientes)
 * - Listar citas pendientes (médicos)
 * - Confirmar cita (médicos)
 * - Obtener citas por usuario (pacientes)
 * - Obtener citas por médico
 * - Actualizar estado de citas
 * - Listar todas las citas (administradores)
 */

import { crearCita, listarCitasPendientes, confirmarCita, getCitasByUsuarioId, getCitasByMedicoId, actualizarEstadoCita, listarTodasLasCitas } from '../model/CitasModel.js';

/**
 * Permite a un paciente agendar una nueva cita médica
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos de la cita a agendar
 * @param {number} req.body.id_usuario - ID del usuario que agenda la cita
 * @param {string} req.body.fecha_cita - Fecha y hora de la cita
 * @param {string} [req.body.notas] - Notas adicionales sobre la cita
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos de la cita agendada
 */
const agendarCita = async (req, res) => {
    try {
        const { id_usuario, fecha_cita, notas } = req.body;
        if (!id_usuario || !fecha_cita) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        const fechaNormalizada = new Date(fecha_cita);
        if (Number.isNaN(fechaNormalizada.getTime())) {
            return res.status(400).json({ message: 'Fecha de cita invalida' });
        }

        const cita = await crearCita({ id_usuario, fecha_cita: fechaNormalizada, notas });
        res.status(201).json({ message: 'Cita agendada', cita });
    } catch (error) {
        res.status(500).json({ message: 'Error al agendar cita', error: error.message });
    }
};

/**
 * Obtiene todas las citas pendientes para que los médicos las confirmen
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Lista de citas pendientes
 */
const obtenerCitasPendientes = async (req, res) => {
    try {
        const citas = await listarCitasPendientes();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas', error: error.message });
    }
};

/**
 * Permite a un médico confirmar una cita pendiente
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos para confirmar la cita
 * @param {number} req.body.id_cita - ID de la cita a confirmar
 * @param {number} req.body.id_medico - ID del médico que confirma la cita
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Confirmación de la cita
 */
const confirmarCitaMedico = async (req, res) => {
    try {
        const { id_cita, id_medico } = req.body;
        if (!id_cita || !id_medico) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        try {
            await confirmarCita({ id_cita, id_medico });
            res.json({ message: 'Cita confirmada' });
        } catch (error) {
            if (error.message === 'Ya tienes una cita programada en este horario') {
                return res.status(409).json({ 
                    message: 'No puedes confirmar esta cita porque ya tienes otra cita programada en este horario',
                    error: 'HORARIO_OCUPADO'
                });
            }
            throw error; // Re-lanzar otros errores
        }
    } catch (error) {
        console.error('Error al confirmar cita:', error);
        res.status(500).json({ message: 'Error al confirmar cita', error: error.message });
    }
};

/**
 * Obtiene todas las citas de un usuario específico
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id_usuario - ID del usuario cuyas citas se quieren obtener
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Lista de citas del usuario
 */
const obtenerCitasUsuario = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        
        if (!id_usuario) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }
        
        const citas = await getCitasByUsuarioId(id_usuario);
        res.json(citas);
    } catch (error) {
        console.error('Error al obtener citas del usuario:', error);
        res.status(500).json({ message: 'Error al obtener citas', error: error.message });
    }
};

/**
 * Obtiene todas las citas de un médico específico
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id_medico - ID del médico cuyas citas se quieren obtener
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Lista de citas del médico
 */
const obtenerCitasMedico = async (req, res) => {
    try {
        const id_medico = req.params.id_medico;
        
        if (!id_medico) {
            return res.status(400).json({ message: 'ID de médico no proporcionado' });
        }
        
        const citas = await getCitasByMedicoId(id_medico);
        res.json(citas);
    } catch (error) {
        console.error('Error al obtener citas del médico:', error);
        res.status(500).json({ message: 'Error al obtener citas', error: error.message });
    }
};

/**
 * Actualiza el estado de una cita existente
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos para actualizar la cita
 * @param {number} req.body.id_cita - ID de la cita a actualizar
 * @param {string} req.body.estado - Nuevo estado de la cita (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA)
 * @param {string} [req.body.nuevaFecha] - Nueva fecha para la cita (opcional)
 * @param {number} req.body.id_usuario - ID del usuario que realiza el cambio
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Datos de la cita actualizada
 */
const actualizarEstado = async (req, res) => {
    try {
        const { id_cita, estado, nuevaFecha, id_usuario } = req.body;
        
        console.log('Datos recibidos en el controlador:', req.body);
        
        if (!id_cita || !estado) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        if (!id_usuario) {
            return res.status(400).json({ message: 'Se requiere el ID del usuario para registrar el cambio' });
        }
        
        // Validar que el estado sea válido
        const estadosValidos = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 
                message: 'Estado no válido', 
                estadosValidos 
            });
        }
        
        let fechaNormalizada = null;
        if (nuevaFecha) {
            const parsedDate = new Date(nuevaFecha);
            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: 'Nueva fecha invalida' });
            }
            fechaNormalizada = parsedDate;
        }

        const citaActualizada = await actualizarEstadoCita({ id_cita, estado, nuevaFecha: fechaNormalizada, id_usuario });
        console.log('Cita actualizada:', citaActualizada);
        
        res.json({ 
            message: 'Estado de cita actualizado correctamente', 
            cita: citaActualizada 
        });
    } catch (error) {
        console.error('Error al actualizar estado de la cita:', error);
        res.status(500).json({ message: 'Error al actualizar estado de la cita', error: error.message });
    }
};

/**
 * Obtiene todas las citas del sistema (solo para administradores)
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Lista completa de citas
 */
const obtenerTodasLasCitas = async (req, res) => {
    try {
        const citas = await listarTodasLasCitas();
        res.json(citas);
    } catch (error) {
        console.error('Error al obtener todas las citas:', error);
        res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
    }
};

export { 
    agendarCita, 
    obtenerCitasPendientes, 
    confirmarCitaMedico, 
    obtenerCitasUsuario, 
    obtenerCitasMedico, 
    actualizarEstado,
    obtenerTodasLasCitas 
};
