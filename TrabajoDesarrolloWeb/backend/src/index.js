/**
 * Archivo principal del servidor backend
 * Este archivo configura y ejecuta el servidor Express que maneja todas las peticiones
 * de la aplicación de gestión médica.
 * 
 * Funcionalidades principales:
 * - Configuración del servidor Express
 * - Configuración de middleware (CORS, JSON parsing)
 * - Definición de rutas principales
 * - Conexión a la base de datos
 * - Inicio del servidor
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {getConnection} from './config/Connection.js'
import router from './routes/EspecialidadesRoute.js';
import routerM from './routes/MedicosRoute.js';
import routerU from './routes/UsuariosRoute.js'
import routerA from './routes/authRoutes.js';
import routerCitas from './routes/CitasRoute.js';
import routerDatosPersonales from './routes/datosPersonales.routes.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config()

// Crear la aplicación Express
const app = express()

// Configurar middleware
app.use(cors()) // Habilitar CORS para todas las rutas
app.use(express.json()) // Habilitar parsing de JSON en las peticiones

// Definir rutas principales
// Ruta raíz
app.use('/', router)

// Rutas para especialidades médicas
app.use('/api/especialidades', router)
app.use('/api/especialidades/:id', router)

// Rutas para médicos
app.use('/api/medicos',routerM)
app.use('/api/medicos/:id', routerM)

// Rutas para usuarios
app.use('/api/usuarios', routerU)
app.use('/api/usuarios/:id', routerU)

// Rutas de autenticación
app.use('/api/auth', routerA)

// Rutas para citas médicas
app.use('/api/citas', routerCitas);

// Rutas para datos personales de usuarios
app.use('/api/datos-personales', routerDatosPersonales);

// Middleware para rutas no encontradas (404) que devuelva JSON
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores para devolver siempre JSON
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// Iniciar el servidor
app.listen(process.env.PORT, () => {
    console.log(`Conectados al puerto: ${process.env.PORT}`)
    getConnection() // ✅ CORREGIDO: Ahora se ejecuta la función correctamente
})
