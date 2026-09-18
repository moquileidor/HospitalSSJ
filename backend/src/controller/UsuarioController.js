import { getAllUsuarios, insertUsuario, getUsuarioById, editUsuarioById, deleteUsuario} from '../model/UsuariosModel.js'

const getAllU = async (req, res)  => {
    try {
        const usuarios = await getAllUsuarios()
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getUById = async (req, res) => {
    try {
        const id = req.params.id

        if(!id || isNaN(id)){
            return res.status(400).json({
                message: 'ID INVALIDO'
            })
        }

        const usuario = await getUsuarioById(id)

        if (!usuario) {
            return res.status(400).json(
                {
                    message: 'No se encontró el usuario con el ID proporcionado' + '(' + id  + ')'
                }
            )
        }

        res.json(usuario)
    } catch (error){
        res.status(500).json({message: 'Error al obtener el usuario', error: error.message})
    }
}



const insertU = async (req, res) => {
    try {
        const {nombre, email, contrasena, rol} = req.body

        if (!nombre || nombre.trim() === '' || !email || email.trim() === '' || !contrasena || contrasena.trim() === ''  ) {
            return res.status(400).json({message: 'Todos los campos son obligatorios'})
        }

        // Validar que la contraseña tenga al menos 8 caracteres
        if (contrasena.length < 8) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        const nuevoUsuario = {
            nombre: nombre.trim(),
            email: email.trim(),
            contrasena: contrasena,
        }

        const resultado = await insertUsuario(nuevoUsuario)

        res.status(201).json({
            message: 'Usuario creado correctamente',
            id: resultado.id,
            usuario: nuevoUsuario
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


const editeU = async (req, res) => {
    try {
        const id = req.params.id;
        const {nombre, email, contrasena, rol} = req.body
        
        console.log('Editando usuario:', id, 'con datos:', { nombre, email, rol, contrasena: contrasena ? '****' : undefined });

        if (!nombre || nombre.trim() === '' || !email || email.trim() === '' || !rol || rol.trim() === '' ) {
            return res.status(400).json({message: 'Nombre, email y rol son obligatorios'})
        }

        const usuarioExiste = await getUsuarioById(id)
        if (!usuarioExiste) {
            return res.status(404).json({message: 'No se encontró al usuario con el id proporcionado'})
        }
        
        // Validar que un admin no edite a otro admin (solo puede editar su propio perfil)
        if (req.user && req.user.rol === 'ADMINISTRADOR') {
            if (usuarioExiste.rol === 'ADMINISTRADOR' && req.user.id !== parseInt(id)) {
                return res.status(403).json({
                    message: 'No puedes editar la información de otro administrador. Solo puedes editar tu propio perfil, pacientes o médicos.'
                });
            }
        }
        
        console.log('Usuario existente:', { ...usuarioExiste, contrasena: '****' });

        const usuarioActualizado = {
            nombre: nombre.trim(),
            email: email.trim(),
            rol: rol.trim()
        }
        
        // Solo incluir la contraseña si se proporciona
        if (contrasena && contrasena.trim() !== '') {
            usuarioActualizado.contrasena = contrasena.trim();
            console.log('Se actualizará la contraseña');
        } else {
            console.log('No se actualizará la contraseña');
        }

        const resultado = await editUsuarioById(id, usuarioActualizado)
        console.log('Usuario actualizado correctamente:', { id, ...usuarioActualizado, contrasena: usuarioActualizado.contrasena ? '****' : undefined });

        res.status(201).json({
            message: 'Usuario actualizado correctamente',
            id: resultado.id,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({message: 'Error al actualizar el usuario ',error:error.message})
    }
}


const deleteU = async (req, res) => {
    try {
        const id = req.params.id

        if (!id || isNaN(id)){
            return res.status(400).json({
                message: 'ID invalido'
            })
        }

        const usuarioExiste = await getUsuarioById(id)
        if (!usuarioExiste) {
            return res.status(400).json({
                message: 'No se encontró el usuario con el id proporcionado'
            })
        }

        // Validar que un admin no elimine a otro admin
        if (req.user && req.user.rol === 'ADMINISTRADOR') {
            if (usuarioExiste.rol === 'ADMINISTRADOR') {
                return res.status(403).json({
                    message: 'No puedes eliminar a otro administrador. Solo puedes eliminar pacientes o médicos.'
                });
            }
        }

        try {
            const resultado = await deleteUsuario(id)
            if (resultado) {
                res.json ({
                    message: 'Usuario eliminado correctamente. Se cancelaron automáticamente todas las citas activas asociadas y se limpiaron los registros relacionados.',
                    id: resultado.id
                })
            } else {
                res.status(404).json({
                    message: 'No se pudo eliminar al usuario'
                })
            }
        } catch (error) {
            // Si hay algún error durante la eliminación, devolver mensaje detallado
            console.error('Error al eliminar usuario:', error);
            res.status(400).json({
                message: error.message || 'Error al eliminar el usuario',
                error: error
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar al usuario', error: error.message
        })
    }
}

/**
 * Obtiene la contraseña de un usuario (solo para administradores)
 * Solo permite ver contraseñas de pacientes y médicos, NO de otros administradores
 */
const getPassword = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const usuario = await getUsuarioById(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar que un admin no vea la contraseña de otro admin
        if (req.user && req.user.rol === 'ADMINISTRADOR') {
            if (usuario.rol === 'ADMINISTRADOR' && req.user.id !== parseInt(id)) {
                return res.status(403).json({
                    message: 'No puedes ver la contraseña de otro administrador.'
                });
            }
        }

        // Devolver la contraseña
        res.status(200).json({ 
            message: 'Contraseña obtenida exitosamente',
            password: usuario.contrasena,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error al obtener contraseña:', error);
        res.status(500).json({ message: 'Error al obtener contraseña', error: error.message });
    }
};

export {getAllU, getUById, insertU, editeU, deleteU, getPassword}