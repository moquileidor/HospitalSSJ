# Sistema de Gestión Médica - Hospital SSJ

## 📋 Descripción del Proyecto

Este proyecto es una aplicación web completa para la gestión de un hospital o centro médico. Permite a los usuarios agendar citas médicas, gestionar especialidades médicas y administrar la información de pacientes y doctores.

### 🚀 Características Principales

- **Gestión de Especialidades Médicas**
  - Registro de nuevas especialidades
  - Actualización de especialidades existentes
  - Eliminación de especialidades
  - Listado completo de especialidades disponibles

- **Panel de Administración**
  - Interfaz intuitiva para gestionar el sistema
  - Control de acceso basado en roles (PACIENTE, ADMIN)
  - Gestión de usuarios y permisos

- **Interfaz de Usuario**
  - Diseño moderno y responsivo
  - Secciones informativas sobre servicios médicos
  - Información sobre doctores y especialidades
  - Formularios de contacto y registro

### 🛠️ Tecnologías Utilizadas

#### Frontend
- React.js
- Vite como bundler
- CSS modular para estilos
- Axios para peticiones HTTP

#### Backend
- Node.js
- Express.js
- SQL Server como base de datos
- bcrypt para encriptación de contraseñas

## ⚠️ Estado Actual del Proyecto

**Nota Importante:** Actualmente, solo el frontend está desplegado en Vercel. El backend no está publicado, lo que significa que las siguientes funcionalidades no están operativas en la versión en línea:

- Registro de usuarios
- Inicio de sesión
- Gestión de especialidades
- Agendamiento de citas
- Cualquier operación que requiera comunicación con el servidor

Para probar la funcionalidad completa del proyecto, es necesario clonar el repositorio y ejecutar tanto el frontend como el backend localmente.

## 🚀 Instrucciones de Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/moquileidor/HospitalSSJ.git
```

2. Instalar dependencias del frontend:
```bash
cd TrabajoDesarrolloWeb/frontend
npm install
```

3. Instalar dependencias del backend:
```bash
cd ../backend
npm install
```

4. Configurar la base de datos:
   - Crear una base de datos SQL Server
   - Ejecutar los scripts ubicados en la carpeta `basededatos`
   - Configurar las variables de entorno en el archivo `.env`

5. Iniciar el servidor backend:
```bash
npm run dev
```

6. Iniciar el frontend:
```bash
cd ../frontend
npm run dev
```

## 🔗 Enlaces

- [Versión en vivo (solo frontend)](https://hospital-ssj.vercel.app)
- [Repositorio en GitHub](https://github.com/moquileidor/HospitalSSJ)

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar. 