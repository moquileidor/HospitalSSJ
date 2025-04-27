import {getAllEspecialidades, getEspecialidadById, insertEspecialidad, editEspecialidadById, deleteEspecialidadById } from '../model/EspecialidadesModel.js'

const getAllE = async (req, res) => {

    try {
        const especialidades = await getAllEspecialidades()
        res.json(especialidades)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const insertE = async (req, res) => {
    try {
        const { nombre } = req.body

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la especialidad es obligatorio' })
        }

        const nuevaEspecialidad = { nombre }
        const resultado = await insertEspecialidad(nuevaEspecialidad)

        res.status(201).json({
            message_: 'Especialidad creada correctamente',
            id: resultado.id,
            especialidad: nuevaEspecialidad
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getEById = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)){
            return res.status(400).json({
                message: 'ID INVALIDO'
            })
        }

        const especialidad = await getEspecialidadById(id)

        if (!especialidad) {
            return res.status(404).json(
                {
                    message: 'No se encontró la especialidad con el ID proporcionado' + '(' + id + ')'
                }
            )
        }

        res.json(especialidad)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la especialidad', error: error.message })
    }
}


const updateE = async (req, res) => {
    try {
        const id = req.params.id
        const { nombre } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({message: 'Id inválido'})
        }

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la especialidad es obligatorio' })
        }
        
        const especialidadExistente = await getEspecialidadById(id)
        if (!especialidadExistente) {
            return res.status(400).json({ message: 'No se encontró la especialidad con el ID proporcionado' + '(' + id + ')' })
        }

        const especialidadActualizada = { nombre }
        const resultado = await editEspecialidadById(id, especialidadActualizada)

        res.json({
            message: 'Especialidad actualizada correctamente',
            especialidad: resultado
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la especialidad', error: error.message })
    }
}


const deleteE = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'ID inválido'
            })
        }

        const especialidadExistente = await getEspecialidadById(id)
        if (!especialidadExistente) {
            return res.status(404).json({
                message: 'No se encontró la especialidad con el ID proporcionado' + '(' + id + ')'
            })
        }

        const resultado = await deleteEspecialidadById(id)
        if (resultado) {
            return res.json({ message: `Especialidad con ID: ${id} eliminada correctamente` })
        } else {
            return res.status(500).json({ message: 'No se pudo eliminar la especialidad' })
        }

            
    }  catch (error) {
        res.status(500).json({ message: 'Error al eliminar la especialidad', error: error.message })
    } 

}


export {getAllE, insertE, getEById, updateE, deleteE}
