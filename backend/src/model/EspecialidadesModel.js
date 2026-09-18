import {getConnection} from '../config/Connection.js'

const getAllEspecialidades = async () => {

    try {
        const con = await getConnection
        const result = await con.request().query('SELECT * FROM especialidades')
        return result.recordset
    } catch (error) {
        console.log('Error al obtener las especialidades', error)
    }
}

const insertEspecialidad = async (especialidad) => {

    {
        const con = await getConnection
        const result = await con.request()
            .input('nombre', especialidad.nombre)
            .query('INSERT INTO Especialidades (nombre) VALUES (@nombre) SELECT SCOPE_IDENTITY() AS id')
        return result.recordset[0]
    }

}

const getEspecialidadById = async (id) => {
    try {
        const con = await getConnection
        const result = await con.request()
        .input('id', id)
        .query('SELECT * FROM especialidades WHERE id_especialidad = @id')


        if (result.recordset.length === 0) {
            return null
        }
        return result.recordset[0]
    } catch (error) {
        console.log('Error al obtener la especialidad por ID', error)
    }
}

const editEspecialidadById = async  (id, especialidad) => {
    try {
        const con  = await getConnection
        const result = await con.request()
            .input('id', id)
            .input('nombre', especialidad.nombre)
            .query('UPDATE especialidades SET nombre = @nombre WHERE id_especialidad = @id')

        if (result.rowsAffected.length === 0) {
            return null
        }
        return { id, ...especialidad}
    } catch (error) {
        console.log('Error al editar la especialidad por ID', error)
        throw error
    }
}

const deleteEspecialidadById = async (id) => {
    try {
        const con = await getConnection
        const result = await con.request()
            .input('id', id)
            .query('DELETE FROM especialidades WHERE id_especialidad = @id')

        if (result.rowsAffected.length === 0) {
            return null
        }
        return { id }
    } catch (error) {
        console.log('Error al eliminar la especialidad por ID', error)
        throw error
    }
}



export {getAllEspecialidades, insertEspecialidad, getEspecialidadById, editEspecialidadById, deleteEspecialidadById}
