/**
 * Configuración de la conexión a la base de datos
 * Este archivo maneja la configuración y conexión a la base de datos SQL Server.
 * Utiliza variables de entorno para mantener seguras las credenciales.
 * 
 * Funcionalidades:
 * - Configuración de la cadena de conexión
 * - Manejo del pool de conexiones
 * - Exportación de la conexión y el objeto sql
 */

import sql from 'mssql'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Configuración de la cadena de conexión a la base de datos
 * Utiliza variables de entorno para los datos sensibles
 */
const stringConnection = {
    user: process.env.USER,         // Usuario de la base de datos
    password: process.env.PASSWORD, // Contraseña del usuario
    server: process.env.SERVER,     // Servidor de la base de datos
    database: process.env.DATABASE, // Nombre de la base de datos
    options: {
        trustServerCertificate: true // Opción para confiar en el certificado del servidor
    }
}

// Variable para almacenar el pool de conexiones
let pool;

/**
 * Función para obtener una conexión a la base de datos
 * Implementa el patrón Singleton para reutilizar la conexión
 * 
 * @returns {Promise<sql.ConnectionPool>} Pool de conexiones a la base de datos
 * @throws {Error} Si hay un error al conectar con la base de datos
 */
const getConnection = async () => {
    if (!pool) {
        pool = await new sql.ConnectionPool(stringConnection)
            .connect()
            .then(pool => {
                console.log('Conectados a la base de datos')
                return pool
            })
            .catch(err => {
                console.log('Error ', err)
                throw err;
            });
    }
    return pool;
}

// Exportar el objeto sql y la función getConnection
export {sql, getConnection}





