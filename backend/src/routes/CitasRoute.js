/**
 * Rutas de Citas Médicas
 * Este archivo define las rutas relacionadas con la gestión de citas médicas
 * en el sistema, incluyendo agendamiento, confirmación y consulta de citas.
 * Todas las rutas requieren autenticación mediante token JWT.
 * 
 * Rutas disponibles:
 * - POST /: Agendar una nueva cita (requiere token)
 * - GET /usuario/:id_usuario: Ver citas propias (requiere token)
 * - GET /pendientes: Ver citas pendientes (requiere rol médico)
 * - POST /confirmar: Confirmar una cita (requiere rol médico)
 * - GET /medico/:id_medico: Ver citas de un médico (requiere rol médico)
 * - PUT /estado: Actualizar estado de una cita (requiere rol médico)
 * - GET /todas: Ver todas las citas (requiere rol administrador)
 */

import { Router } from 'express';
import { agendarCita, obtenerCitasPendientes, confirmarCitaMedico, obtenerCitasUsuario, obtenerCitasMedico, actualizarEstado, obtenerTodasLasCitas } from '../controller/CitasController.js';
import { verifyToken, verificarAdmin, verificarMedico } from '../controller/AuthController.js';
import { getCitasByUsuarioId } from '../model/CitasModel.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(verifyToken);

// Middleware personalizado para permitir cambio de fecha por el paciente dueño de la cita o médicos/administradores
const verificarCambioEstadoCita = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'No autenticado' });
    if (user.rol === 'MEDICO' || user.rol === 'ADMINISTRADOR') return next();
    // Si es paciente, solo puede cambiar citas propias
    const { id_cita } = req.body;
    if (!id_cita) return res.status(400).json({ message: 'Falta el id_cita' });
    // Buscar la cita y verificar que le pertenece
    const citas = await getCitasByUsuarioId(user.id);
    if (citas.some(c => c.id_cita == id_cita)) return next();
    return res.status(403).json({ message: 'Acceso denegado. Solo puedes modificar tus propias citas.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error de autorización', error: err.message });
  }
};

/**
 * @route POST /
 * @desc Agendar una nueva cita médica
 * @access Private (requiere token)
 */
router.post('/', agendarCita);

/**
 * @route GET /usuario/:id_usuario
 * @desc Obtener las citas de un usuario específico
 * @access Private (requiere token)
 * @param {string} id_usuario - ID del usuario cuyas citas se quieren consultar
 */
router.get('/usuario/:id_usuario', obtenerCitasUsuario);

/**
 * @route GET /pendientes
 * @desc Obtener todas las citas pendientes de confirmación
 * @access Private (requiere rol médico)
 * @middleware verificarMedico
 */
router.get('/pendientes', verificarMedico, obtenerCitasPendientes);

/**
 * @route POST /confirmar
 * @desc Confirmar una cita médica pendiente
 * @access Private (requiere rol médico)
 * @middleware verificarMedico
 */
router.post('/confirmar', verificarMedico, confirmarCitaMedico);

/**
 * @route GET /medico/:id_medico
 * @desc Obtener todas las citas de un médico específico
 * @access Private (requiere rol médico)
 * @middleware verificarMedico
 * @param {string} id_medico - ID del médico cuyas citas se quieren consultar
 */
router.get('/medico/:id_medico', verificarMedico, obtenerCitasMedico);

/**
 * @route PUT /estado
 * @desc Actualizar el estado de una cita médica
 * @access Private (requiere rol médico)
 * @middleware verificarCambioEstadoCita
 */
router.put('/estado', verificarCambioEstadoCita, actualizarEstado);

/**
 * @route GET /todas
 * @desc Obtener todas las citas del sistema
 * @access Private (requiere rol administrador)
 * @middleware verificarAdmin
 */
router.get('/todas', verificarAdmin, obtenerTodasLasCitas);

export default router;
