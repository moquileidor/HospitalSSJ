# Explicación del archivo API.jsx

## ¿Qué es este archivo?

Este archivo (`api.jsx`) es una parte importante de la aplicación que se encarga de establecer la comunicación entre el frontend (lo que ves en el navegador) y el backend (el servidor donde se almacenan los datos).

## ¿Qué hace este archivo?

### 1. Definir la URL base de la API

Este archivo configura la dirección principal del servidor:
- En producción (cuando la aplicación está publicada): usa una dirección especial configurada para el sitio web real.
- En desarrollo (cuando los programadores están trabajando): usa `http://localhost:3000`, que es el servidor local.

### 2. Organizar todas las rutas de la API

Define un objeto llamado `API_ENDPOINTS` que contiene todas las direcciones URL para acceder a diferentes partes del backend:
- Para usuarios (crear cuentas, actualizar perfiles)
- Para médicos (listar médicos, crear nuevos)
- Para citas (programar citas, ver citas pendientes)
- Para datos personales (dirección, teléfono, etc.)
- Para autenticación (iniciar sesión, registrarse, renovar acceso)

### 3. Proporcionar una función para hacer peticiones seguras

La función `fetchWithAuth` es muy importante porque:
- Añade automáticamente el "token" (una especie de llave digital) a cada petición
- Configura el formato correcto para enviar y recibir datos (JSON)
- Simplifica hacer peticiones desde cualquier parte de la aplicación

## ¿Por qué es importante este archivo?

1. **Centralización**: Mantiene todas las URLs en un solo lugar. Si cambia la dirección del servidor, solo hay que cambiarla aquí.

2. **Seguridad**: Garantiza que las peticiones incluyan correctamente el token de autenticación.

3. **Consistencia**: Asegura que todas las comunicaciones con el servidor sigan el mismo formato.

## Conceptos clave para entender

- **API**: Application Programming Interface - Es la "puerta" que permite que la aplicación web se comunique con el servidor.
- **Token**: Un código de acceso temporal que identifica al usuario y permite acceder a recursos protegidos.
- **Fetch**: Es una función de JavaScript para realizar peticiones HTTP (enviar/recibir datos de un servidor).
- **Headers**: Metadatos que se envían junto con una petición HTTP para proporcionar información adicional como el formato o la autenticación.
