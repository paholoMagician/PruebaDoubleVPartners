USE [master]
GO
/****** Object:  Database [taskslistDvpartners]    Script Date: 7/3/2025 7:21:00 PM ******/
CREATE DATABASE [taskslistDvpartners]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'taskslistDvpartners', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\taskslistDvpartners.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'taskslistDvpartners_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\taskslistDvpartners_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [taskslistDvpartners] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [taskslistDvpartners].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [taskslistDvpartners] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET ARITHABORT OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [taskslistDvpartners] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [taskslistDvpartners] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET  DISABLE_BROKER 
GO
ALTER DATABASE [taskslistDvpartners] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [taskslistDvpartners] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [taskslistDvpartners] SET  MULTI_USER 
GO
ALTER DATABASE [taskslistDvpartners] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [taskslistDvpartners] SET DB_CHAINING OFF 
GO
ALTER DATABASE [taskslistDvpartners] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [taskslistDvpartners] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [taskslistDvpartners] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [taskslistDvpartners] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [taskslistDvpartners] SET QUERY_STORE = ON
GO
ALTER DATABASE [taskslistDvpartners] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [taskslistDvpartners]
GO
/****** Object:  Table [dbo].[tasksBody]    Script Date: 7/3/2025 7:21:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tasksBody](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](350) NULL,
	[urlimagen] [varchar](500) NULL,
	[idTasksHeader] [int] NULL,
	[color] [varchar](15) NULL,
	[estado] [int] NULL,
	[eliminado] [int] NULL,
	[fechaInicioTarea] [datetime] NOT NULL,
	[fechaFinTarea] [datetime] NULL,
	[observacion] [varchar](200) NULL,
 CONSTRAINT [PK_tasksBody] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tasksHeader]    Script Date: 7/3/2025 7:21:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tasksHeader](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[usercrea] [int] NULL,
	[fecrea] [datetime] NULL,
	[iduser] [int] NULL,
	[estado] [int] NULL,
	[estadoTarea] [int] NULL,
	[titutlo] [varchar](150) NULL,
	[observacion] [varchar](250) NULL,
	[fechaFinal] [datetime] NULL,
 CONSTRAINT [PK_tasksHeader2] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 7/3/2025 7:21:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombres] [varchar](75) NULL,
	[email] [varchar](120) NULL,
	[password] [varchar](100) NULL,
	[estado] [int] NULL,
	[rol] [char](3) NULL,
	[fecrea] [datetime] NOT NULL,
	[usercrea] [int] NULL,
 CONSTRAINT [PK_users2] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[tasksBody] ON 

INSERT [dbo].[tasksBody] ([id], [descripcion], [urlimagen], [idTasksHeader], [color], [estado], [eliminado], [fechaInicioTarea], [fechaFinTarea], [observacion]) VALUES (1, N'prueba', N'', 2, N'#444', 1, 0, CAST(N'2025-07-01T04:11:53.197' AS DateTime), CAST(N'2025-07-01T04:11:53.197' AS DateTime), N'xxx')
SET IDENTITY_INSERT [dbo].[tasksBody] OFF
GO
SET IDENTITY_INSERT [dbo].[tasksHeader] ON 

INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (13, 17, CAST(N'2025-07-03T17:21:19.953' AS DateTime), 18, 0, 1, N'Bugg #4450', N'BUG EN LA API DE CREACION DE USUARIO', CAST(N'2025-07-03T17:21:19.953' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (14, 17, CAST(N'2025-07-03T17:26:07.797' AS DateTime), 28, 0, 2, N'cocinar', N'arroz con pollo', CAST(N'2025-07-03T17:26:07.797' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (15, 17, CAST(N'2025-07-03T17:44:59.827' AS DateTime), 30, 1, 2, N'Realizar el deploy', N'DEPLOY EN NODE JS', CAST(N'2025-07-03T19:01:57.460' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (16, 17, CAST(N'2025-07-03T17:48:51.163' AS DateTime), 32, 1, 1, N'BUG #4552 ', N'En la api de creacion de tickets', CAST(N'2025-07-03T19:08:46.980' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (17, 17, CAST(N'2025-07-03T17:56:47.863' AS DateTime), 33, 1, 2, N'Cambio en el estilo del botn', N'Cambiar a color verde y borde redondeado: "border-radius: 10px;"', CAST(N'2025-07-03T19:01:27.853' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (18, 31, CAST(N'2025-07-03T17:58:34.783' AS DateTime), 30, 1, 3, N'Actualizar dependendias npm.', N'A la version mas actual', CAST(N'2025-07-03T17:58:59.717' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (19, 31, CAST(N'2025-07-03T18:56:09.947' AS DateTime), 33, 1, 2, N'Bugg #44', N'API Consulta de saldos', CAST(N'2025-07-03T19:09:31.687' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (20, 17, CAST(N'2025-07-03T19:00:11.113' AS DateTime), 30, 1, 1, N'Repaldar informacion', N'Respaldo de codigo de la app front', CAST(N'2025-07-03T19:00:11.113' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (21, 17, CAST(N'2025-07-03T19:08:24.497' AS DateTime), 35, 1, 2, N'Bug #25', N'Correcion de tabla responsive', CAST(N'2025-07-03T19:10:39.447' AS DateTime))
INSERT [dbo].[tasksHeader] ([id], [usercrea], [fecrea], [iduser], [estado], [estadoTarea], [titutlo], [observacion], [fechaFinal]) VALUES (22, 30, CAST(N'2025-07-03T19:09:58.200' AS DateTime), 32, 1, 1, N'Realizar el deploy', N'Deploy con dockerdel backend .NET8', CAST(N'2025-07-03T19:09:58.200' AS DateTime))
SET IDENTITY_INSERT [dbo].[tasksHeader] OFF
GO
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (17, N'Camila Velastegui Norma', N'cvelastegui@mail.com', N'$2a$12$3IDgE4/OMXYgp11wsirbEejkK2k7maBh8aiXysgk77l.N.7PnaGkO', 1, N'ADM', CAST(N'2025-07-02T04:08:43.000' AS DateTime), 15)
INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (30, N'Eugenia Beltran', N'ebeltran@mail.com', N'$2a$12$E/wlpwlGA19IRYwCdPw5C.kNA4.j.X0PozPC.4HWMT2N6hjXhX2nS', 1, N'GER', CAST(N'2025-07-03T22:44:23.780' AS DateTime), 17)
INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (31, N'Mauricio Rodas', N'mrodas@mail.com', N'$2a$12$vHWM0I2oGz3ZoxmMIuXH4utwWcIT3MikZfICE6m/7YhUp6GGJDAeK', 1, N'NOR', CAST(N'2025-07-03T22:44:38.357' AS DateTime), 17)
INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (32, N'Mauricio Pome', N'mpome@mail.com', N'$2a$12$ZZRwVxi5.17JBbOBvMV.6O0oOl4judryOsxtBugTYtWItKK77.Iu2', 1, N'NOR', CAST(N'2025-07-03T22:48:09.840' AS DateTime), 17)
INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (33, N'Antonio Macias', N'amcias@mail.com', N'$2a$12$4b/J3lsKq0KlYiVAK2uVmOAfRRpewmRCFs7K7kjyiEelIDo8zqwtS', 1, N'NOR', CAST(N'2025-07-03T22:56:19.370' AS DateTime), 17)
INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (34, N'Yolanda Bastidas', N'ybastidas', N'$2a$12$6wfpU8XTuG0YMVJW7hGHCulAAxxd758jpLPMwCmyZqS/Wv4M0Wd7a', 1, N'NOR', CAST(N'2025-07-04T00:00:43.480' AS DateTime), 17)
INSERT [dbo].[users] ([id], [nombres], [email], [password], [estado], [rol], [fecrea], [usercrea]) VALUES (35, N'Eduardo Macias Yepez', N'eyepez@mail.com', N'$2a$12$fSEX5fKWo1n07J5vQv5aD.7MYBJMmQqyIO894q5cJE68ueleq/28m', 1, N'NOR', CAST(N'2025-07-04T00:06:45.940' AS DateTime), 17)
SET IDENTITY_INSERT [dbo].[users] OFF
GO
ALTER TABLE [dbo].[tasksBody] ADD  CONSTRAINT [DF_Table_1_fecrea]  DEFAULT (getdate()) FOR [fechaInicioTarea]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF_users2_fecrea]  DEFAULT (getdate()) FOR [fecrea]
GO
USE [master]
GO
ALTER DATABASE [taskslistDvpartners] SET  READ_WRITE 
GO
