/**
 * Controlador de Autenticación
 * Este archivo contiene todas las funciones necesarias para manejar la autenticación
 * de usuarios en el sistema, incluyendo registro, inicio de sesión, verificación
 * de tokens y renovación de tokens.
 * 
 * Funcionalidades:
 * - Registro de usuarios
 * - Inicio de sesión
 * - Verificación de tokens
 * - Renovación de tokens
 * - Verificación de roles (admin y médico)
 */

import { insertUsuario, getUsuarioByEmail, getUsuarioById } from "../model/UsuariosModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET;

if ( !JWT_SECRET) {
    throw new Error("No existe token");
}

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del usuario a registrar
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta con el ID del usuario creado
 */
const register = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;

        // Validar campos requeridos
        if (!nombre || nombre.trim() === '' || !email || email.trim() === '' || !contrasena || contrasena.trim() === '') {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar longitud mínima de contraseña
        if (contrasena.length < 8) {
            return res.status(400).json({ 
                message: 'La contraseña debe tener al menos 8 caracteres' 
            });
        }

        const nuevoUsuario = {
            nombre: nombre.trim(),
            email: email.trim(),
            contrasena: contrasena,
            rol : 'PACIENTE'
        };

        const resultado = await insertUsuario(nuevoUsuario);

        res.status(201).json({
            message: 'Usuario creado correctamente',
            id: resultado.id,
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);

        if (error.message.includes('email ya existe')) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

/**
 * Inicia sesión de un usuario en el sistema
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Credenciales del usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta con el token JWT y datos del usuario
 */
const login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        if (!email  || !contrasena) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const usuario = await getUsuarioByEmail(email);
        console.log('Usuario encontrado:', usuario ? { ...usuario, contrasena: '******' } : null);

        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        console.log('Comparando contraseña para usuario:', usuario.email, 'con rol:', usuario.rol);
        
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
        
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                rol: usuario.rol
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { contrasena: _, ...usuarioSinContrasena } = usuario;

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: usuarioSinContrasena
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

/**
 * Middleware para verificar la validez del token JWT
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log('verifyToken: No se encontró el header Authorization');
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
    }
    
    // Extraer el token del header 'Bearer TOKEN'
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('verifyToken: Formato de token inválido');
        return res.status(401).json({ message: 'Formato de token inválido' });
    }
    
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        console.log('verifyToken: Token verificado exitosamente para usuario:', verified.id, 'rol:', verified.rol);
        next();
    } catch (error) {
        console.log('verifyToken: Error al verificar token:', error.message);
        res.status(401).json({ message: 'Token no válido o expirado', error: error.message });
    }
}

/**
 * Middleware para verificar si el usuario tiene rol de administrador
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
const verificarAdmin = (req, res, next) => {
    console.log('verificarAdmin: Verificando permisos para usuario:', req.user?.id, 'rol:', req.user?.rol);
    if (!req.user || req.user.rol !== 'ADMINISTRADOR') {
        console.log('verificarAdmin: Acceso denegado - no es administrador');
        return res.status(403).json({ 
            message: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
    }
    console.log('verificarAdmin: Acceso permitido');
    next();
};

/**
 * Middleware para verificar si el usuario tiene rol de médico o administrador
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
const verificarMedico = (req, res, next) => {
    if (!req.user || (req.user.rol !== 'MEDICO' && req.user.rol !== 'ADMINISTRADOR')) {
        return res.status(403).json({ 
            message: 'Acceso denegado. Se requieren permisos de médico.' 
        });
    }
    next();
};

/**
 * Renueva el token JWT de un usuario
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta con el nuevo token JWT y datos del usuario
 */
const renewToken = async (req, res) => {
    try {
        // El middleware verifyToken ya validó el token y agregó la info del usuario a req.user
        const usuario = await getUsuarioById(req.user.id);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // Generar un nuevo token
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                rol: usuario.rol
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        const { contrasena: _, ...usuarioSinContrasena } = usuario;
        
        res.status(200).json({
            message: 'Token renovado correctamente',
            token,
            usuario: usuarioSinContrasena
        });
    } catch (error) {
        console.error('Error al renovar el token:', error);
        res.status(500).json({ message: 'Error al renovar el token', error: error.message });
    }
};

export { 
    register, 
    login, 
    verifyToken, 
    renewToken,
    verificarAdmin,
    verificarMedico
};






