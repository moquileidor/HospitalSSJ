-- Crear base de datos
CREATE DATABASE proyectodesarrolloweb;
GO

-- Usar la base de datos
USE proyectodesarrolloweb;
GO

-- Crear tablas

CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMINISTRADOR', 'PACIENTE'))
);

CREATE TABLE especialidades (
    id_especialidad INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE medicos (
    id_medico INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    id_especialidad INT NOT NULL,
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
);

CREATE TABLE citas (
    id_cita INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_medico INT NOT NULL,
    fecha_cita DATETIME NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('COMPLETADA', 'CANCELADA', 'CONFIRMADA', 'PENDIENTE')),
    notas TEXT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
);

CREATE TABLE historial_cambios (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_cita INT NOT NULL,
    id_admin INT NOT NULL,
    tipo_cambio VARCHAR(50) NOT NULL,
    fecha_cambio DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita),
    FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario)
);
