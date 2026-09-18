/**
 * Rutas de Autenticación
 * Este archivo define las rutas relacionadas con la autenticación de usuarios
 * en el sistema, incluyendo registro, inicio de sesión y renovación de tokens.
 * 
 * Rutas disponibles:
 * - POST /register: Registro de nuevos usuarios
 * - POST /login: Inicio de sesión de usuarios
 * - POST /renew-token: Renovación de token JWT
 */

import express from 'express';
import { login, register, verifyToken, renewToken } from '../controller/AuthController.js';

const router = express.Router();

/**
 * @route POST /register
 * @desc Registra un nuevo usuario en el sistema
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /login
 * @desc Inicia sesión de un usuario existente
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /renew-token
 * @desc Renueva el token JWT de un usuario autenticado
 * @access Private
 * @middleware verifyToken
 */
router.post('/renew-token', verifyToken, renewToken);

export default router;