# Documentación Técnica - Sistema de Gestión Médica Hospital SSJ

## 1. Arquitectura del Sistema

### 1.1 Estructura del Proyecto
```
TrabajoDesarrolloWeb/
├── frontend/           # Aplicación React
├── backend/           # Servidor Node.js/Express
├── basededatos/      # Scripts y esquemas de la base de datos
└── cypress/          # Pruebas end-to-end
```

### 1.2 Componentes Principales

#### Frontend (React + Vite)
- **Tecnologías Principales:**
  - React.js para la interfaz de usuario
  - Vite como bundler y servidor de desarrollo
  - CSS modular para estilos encapsulados
  - Axios para comunicación con el backend
  - React Router para navegación
  - Context API para manejo de estado global

#### Backend (Node.js + Express)
- **Tecnologías Principales:**
  - Node.js como runtime
  - Express.js como framework web
  - SQL Server como base de datos
  - JWT para autenticación
  - bcrypt para encriptación
  - CORS para manejo de peticiones cross-origin

#### Base de Datos (SQL Server)
- **Esquema Principal:**
  - Tabla de Usuarios
  - Tabla de Especialidades
  - Tabla de Doctores
  - Tabla de Citas
  - Tabla de Pacientes

#### Pruebas (Cypress)
- Pruebas end-to-end para flujos críticos
- Pruebas de integración para componentes principales
- Pruebas de UI/UX

## 2. Funcionalidades del Sistema

### 2.1 Gestión de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión
- Recuperación de contraseña
- Perfiles de usuario (Paciente, Admin)
- Gestión de permisos

### 2.2 Gestión de Especialidades
- CRUD completo de especialidades médicas
- Asignación de doctores a especialidades
- Visualización de especialidades disponibles
- Filtrado y búsqueda de especialidades

### 2.3 Sistema de Citas
- Agendamiento de citas médicas
- Cancelación y reprogramación
- Historial de citas
- Notificaciones de citas
- Calendario de disponibilidad

### 2.4 Panel de Administración
- Dashboard con métricas clave
- Gestión de usuarios
- Gestión de especialidades
- Reportes y estadísticas
- Configuración del sistema

## 3. Flujos de Trabajo Principales

### 3.1 Registro e Inicio de Sesión
1. Usuario accede a la página de registro
2. Completa formulario con datos personales
3. Sistema valida información
4. Se crea cuenta y se envía confirmación
5. Usuario puede iniciar sesión

### 3.2 Agendamiento de Cita
1. Usuario inicia sesión
2. Selecciona especialidad
3. Elige doctor disponible
4. Selecciona fecha y hora
5. Confirma cita
6. Recibe confirmación por correo

### 3.3 Gestión de Especialidades (Admin)
1. Admin accede al panel
2. Puede crear/editar/eliminar especialidades
3. Asigna doctores a especialidades
4. Gestiona horarios y disponibilidad

## 4. Consideraciones de Seguridad

### 4.1 Autenticación y Autorización
- Implementación de JWT para sesiones
- Encriptación de contraseñas con bcrypt
- Roles y permisos basados en usuario
- Protección de rutas sensibles

### 4.2 Protección de Datos
- Validación de datos en frontend y backend
- Sanitización de inputs
- Protección contra ataques comunes (XSS, CSRF)
- Encriptación de datos sensibles

## 5. Despliegue y Mantenimiento

### 5.1 Requisitos del Sistema
- Node.js >= 14.x
- SQL Server >= 2019
- NPM >= 6.x
- Navegadores modernos (Chrome, Firefox, Safari, Edge)

### 5.2 Variables de Entorno
```
# Backend
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=hospital_ssj
JWT_SECRET=clave_secreta
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
```

### 5.3 Proceso de Despliegue
1. Preparación del entorno
2. Configuración de la base de datos
3. Despliegue del backend
4. Despliegue del frontend
5. Configuración de dominios y SSL
6. Monitoreo y mantenimiento

## 6. Mantenimiento y Soporte

### 6.1 Monitoreo
- Logs de aplicación
- Métricas de rendimiento
- Alertas de error
- Monitoreo de base de datos

### 6.2 Actualizaciones
- Proceso de actualización de dependencias
- Control de versiones
- Pruebas de regresión
- Plan de rollback

## 7. Limitaciones y Mejoras Futuras

### 7.1 Limitaciones Actuales
- Solo frontend desplegado en producción
- Limitaciones de recursos en entorno de desarrollo
- Restricciones de base de datos

### 7.2 Mejoras Planificadas
- Implementación de chat en vivo
- Sistema de recordatorios por SMS
- Integración con sistemas de pago
- Aplicación móvil
- Sistema de historiales médicos electrónicos

## 8. Contacto y Soporte

Para soporte técnico o consultas sobre el proyecto:
- Email: [correo de soporte]
- Repositorio: https://github.com/moquileidor/HospitalSSJ
- Documentación en línea: [URL de documentación] 