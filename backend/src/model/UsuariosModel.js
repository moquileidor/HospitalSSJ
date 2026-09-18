import {getConnection} from '../config/Connection.js'
import bcrypt from 'bcrypt'

const getAllUsuarios = async () => {
    try {
        const con = await getConnection
        const result = await con.request().query('SELECT * FROM usuarios')
        return result.recordset
    } catch (error) {
        console.log('Error al obtener los usuarios', error)
    }
}

const insertUsuario = async (usuario) => {
    try {
        const con = await getConnection;
        // Encriptar la contraseña antes de guardar
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuario.contraseña, saltRounds);
        const rol = 'PACIENTE'
        const result = await con.request()
            .input('nombre', usuario.nombre)
            .input('email', usuario.email)
            .input('contrasena', hashedPassword)
            .input('rol', rol)
            .query('INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (@nombre, @email, @contraseña, @rol)');
        return result;
    } catch (error) {
        console.log('Error al insertar el usuario', error);
        throw error;
    }
}

export { getAllUsuarios, insertUsuario };


