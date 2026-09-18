SE [master]
GO
/****** Object:  Database [proyectodesarrolloweb]    Script Date: 12/05/2025 21:36:17 ******/
CREATE DATABASE [proyectodesarrolloweb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'proyectodesarrolloweb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\proyectodesarrolloweb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'proyectodesarrolloweb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\proyectodesarrolloweb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [proyectodesarrolloweb] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [proyectodesarrolloweb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [proyectodesarrolloweb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET ARITHABORT OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [proyectodesarrolloweb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [proyectodesarrolloweb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET  ENABLE_BROKER 
GO
ALTER DATABASE [proyectodesarrolloweb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [proyectodesarrolloweb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET RECOVERY FULL 
GO
ALTER DATABASE [proyectodesarrolloweb] SET  MULTI_USER 
GO
ALTER DATABASE [proyectodesarrolloweb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [proyectodesarrolloweb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [proyectodesarrolloweb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [proyectodesarrolloweb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [proyectodesarrolloweb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [proyectodesarrolloweb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'proyectodesarrolloweb', N'ON'
GO
ALTER DATABASE [proyectodesarrolloweb] SET QUERY_STORE = ON
GO
ALTER DATABASE [proyectodesarrolloweb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [proyectodesarrolloweb]
GO
/****** Object:  User [UserJorge]    Script Date: 12/05/2025 21:36:17 ******/
CREATE USER [UserJorge] FOR LOGIN [UserJorge] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [UserJorge]
GO
/****** Object:  Table [dbo].[citas]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[citas](
	[id_cita] [int] IDENTITY(1,1) NOT NULL,
	[id_usuario] [int] NOT NULL,
	[id_medico] [int] NOT NULL,
	[fecha_cita] [datetime] NOT NULL,
	[estado] [varchar](20) NOT NULL,
	[notas] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_cita] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[datosPersonales]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[datosPersonales](
	[id_datosPersonales] [int] IDENTITY(1,1) NOT NULL,
	[id_usuario] [int] NOT NULL,
	[fechaNacimiento] [date] NULL,
	[direccion] [varchar](255) NULL,
	[telefono] [varchar](20) NULL,
	[genero] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_datosPersonales] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[especialidades]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[especialidades](
	[id_especialidad] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_especialidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historial_cambios]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historial_cambios](
	[id_historial] [int] IDENTITY(1,1) NOT NULL,
	[id_cita] [int] NOT NULL,
	[id_admin] [int] NOT NULL,
	[tipo_cambio] [varchar](50) NOT NULL,
	[fecha_cambio] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_historial] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[medicos]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[medicos](
	[id_medico] [int] IDENTITY(1,1) NOT NULL,
	[id_especialidad] [int] NOT NULL,
	[id_usuario] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_medico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[id_usuario] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[contrasena] [varchar](255) NOT NULL,
	[rol] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[historial_cambios] ADD  DEFAULT (getdate()) FOR [fecha_cambio]
GO
ALTER TABLE [dbo].[citas]  WITH CHECK ADD FOREIGN KEY([id_medico])
REFERENCES [dbo].[medicos] ([id_medico])
GO
ALTER TABLE [dbo].[citas]  WITH CHECK ADD FOREIGN KEY([id_usuario])
REFERENCES [dbo].[usuarios] ([id_usuario])
GO
ALTER TABLE [dbo].[datosPersonales]  WITH CHECK ADD FOREIGN KEY([id_usuario])
REFERENCES [dbo].[usuarios] ([id_usuario])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[historial_cambios]  WITH CHECK ADD FOREIGN KEY([id_admin])
REFERENCES [dbo].[usuarios] ([id_usuario])
GO
ALTER TABLE [dbo].[historial_cambios]  WITH CHECK ADD FOREIGN KEY([id_cita])
REFERENCES [dbo].[citas] ([id_cita])
GO
ALTER TABLE [dbo].[medicos]  WITH CHECK ADD FOREIGN KEY([id_especialidad])
REFERENCES [dbo].[especialidades] ([id_especialidad])
GO
ALTER TABLE [dbo].[medicos]  WITH CHECK ADD  CONSTRAINT [fk_medico_usuario] FOREIGN KEY([id_usuario])
REFERENCES [dbo].[usuarios] ([id_usuario])
GO
ALTER TABLE [dbo].[medicos] CHECK CONSTRAINT [fk_medico_usuario]
GO
ALTER TABLE [dbo].[citas]  WITH CHECK ADD CHECK  (([estado]='COMPLETADA' OR [estado]='CANCELADA' OR [estado]='CONFIRMADA' OR [estado]='PENDIENTE'))
GO
ALTER TABLE [dbo].[usuarios]  WITH CHECK ADD  CONSTRAINT [chk_rol] CHECK  (([rol]='MEDICO' OR [rol]='PACIENTE' OR [rol]='ADMINISTRADOR'))
GO
ALTER TABLE [dbo].[usuarios] CHECK CONSTRAINT [chk_rol]
GO
/****** Object:  StoredProcedure [dbo].[sp_insertar_medico]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[sp_insertar_medico]
@id_especialidad int,
@id_usuario int
as
Begin
	insert into medicos ( id_especialidad, id_usuario) values ( @id_especialidad, @id_usuario)
End
GO
/****** Object:  StoredProcedure [dbo].[sp_listar_medicos]    Script Date: 12/05/2025 21:36:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


create procedure [dbo].[sp_listar_medicos]
as 
select 
	m.id_medico,
	u.nombre,
	u.email,
	e.nombre as especialidad
from medicos m
join usuarios u on m.id_usuario = u.id_usuario
join especialidades e on m.id_especialidad = e.id_especialidad
GO
USE [master]
GO
ALTER DATABASE [proyectodesarrolloweb] SET  READ_WRITE 
GO
