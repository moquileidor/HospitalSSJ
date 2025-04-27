# Sistema de Gestión Médica

Este proyecto es un sistema de gestión médica que incluye:

- Frontend en React
- Backend en Node.js
- Base de datos SQL Server

## Estructura del Proyecto

```
TrabajoDesarrolloWeb/
├── frontend/         # Aplicación React
├── backend/          # Servidor Node.js
└── basededatos/     # Scripts de base de datos
```

## Configuración para Vercel

Para desplegar solo el frontend en Vercel:

1. El frontend debe estar en la raíz del repositorio o en una carpeta específica
2. Configurar el archivo `vercel.json` para ignorar el backend
3. Asegurarse de que las variables de entorno estén configuradas correctamente 