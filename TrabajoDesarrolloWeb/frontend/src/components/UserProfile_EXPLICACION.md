# Explicación del Componente Perfil de Usuario

## ¿Qué es este archivo?

Este archivo (`UserProfile.jsx`) es una parte de la aplicación web que muestra y permite editar el perfil del usuario que ha iniciado sesión. Es como tu "página personal" dentro de la aplicación, donde puedes ver y actualizar tu información.

## Principales funciones que realiza

1. **Mostrar información actual del usuario**:
   - Muestra datos básicos como nombre y correo electrónico
   - Muestra datos personales como fecha de nacimiento, dirección, teléfono y género

2. **Permitir editar la información**:
   - El usuario puede hacer clic en "Editar Perfil" para modificar sus datos
   - Puede cambiar su contraseña si lo desea
   - Puede actualizar o añadir sus datos personales

3. **Guardar cambios en la base de datos**:
   - Cuando el usuario hace clic en "Guardar Cambios", la información se envía al servidor para actualizarla

## ¿Cómo funciona?

### 1. Secciones del Formulario
El formulario está dividido en tres secciones principales:
- **Datos Básicos**: Nombre y correo electrónico
- **Contraseña**: Solo visible en modo edición, permite cambiar la contraseña
- **Datos Personales**: Información adicional como dirección, teléfono, etc.

### 2. Estados del Formulario
El componente puede estar en dos estados:
- **Modo Visualización**: Los campos no se pueden editar (están como "solo lectura")
- **Modo Edición**: Los campos se pueden modificar y aparecen los botones para guardar o cancelar

### 3. Proceso de Actualización
Cuando se pulsa "Guardar Cambios":
1. Se validan los datos
2. Se envían al servidor en dos peticiones separadas (datos básicos y datos personales)
3. Si todo va bien, se muestra un mensaje de éxito
4. Si hay algún error, se muestra un mensaje de error

## Vocabulario técnico simplificado

- **Estado**: Son variables especiales que almacenan información que puede cambiar y afectar lo que se muestra en pantalla
- **Efecto**: Es una función que se ejecuta cuando algo específico cambia (como cuando se carga la página)
- **Evento**: Una acción del usuario como hacer clic en un botón o escribir en un campo
- **Props**: Información que recibe el componente desde fuera (como los datos del usuario)
- **API**: Forma de comunicarse con el servidor para obtener o enviar información
