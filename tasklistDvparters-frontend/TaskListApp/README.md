# 📋 Task Assignment App (React + .NET + SQL Server)

## 🛠️ Stack Tecnológico Completo

### Frontend (React)
![React 19](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

**Librerías principales:**
- ⚛️ React 19 + React DOM
- 🚀 Vite (build tool)
- 🎨 Material-UI v7 (Core + Icons)
- 🛣️ React Router DOM v7
- 🕒 Moment.js (manejo de fechas)
- 🧩 DnD Kit (drag and drop)
- ✨ SweetAlert2 (notificaciones)

**Dependencias de desarrollo:**
- 🔍 ESLint (con plugins para React)
- 💡 TypeScript definitions
- 🔄 React Refresh (HMR)

### Backend (.NET)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![EF Core](https://img.shields.io/badge/EF_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![BCrypt](https://img.shields.io/badge/BCrypt-02569B?style=for-the-badge&logo=keycdn&logoColor=white)

**Tecnologías clave:**
- 🖥️ ASP.NET Core 6/7
- 🗄️ Entity Framework Core (ORM)
- 🔒 BCrypt.Net.Next (encriptación)
- 📄 Swagger/OpenAPI
- 🛡️ JWT Authentication

### Base de Datos
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

## 🌟 Features Técnicas Destacadas

### Frontend Avanzado
- **Drag & Drop** con @dnd-kit para gestión visual de tareas
- **UI profesional** con Material-UI v7
- **Formularios optimizados** usando MUI + React Hook Form
- **Routing avanzado** con React Router DOM v7
- **Notificaciones elegantes** con SweetAlert2

### Seguridad Backend
- **Encriptación robusta** con BCrypt.Net.Next
- **Autenticación JWT** segura
- **Validación de datos** en capa API
- **Patrón Repository** con EF Core

```markdown
## 📦 Dependencias Clave (package.json)

```json
"dependencies": {
  "@dnd-kit/core": "^6.3.1",          // Drag & Drop
  "@dnd-kit/sortable": "^10.0.0",     // Ordenamiento
  "@emotion/react": "^11.14.0",        // Estilos MUI
  "@emotion/styled": "^11.14.1",       // Componentes estilizados
  "@mui/icons-material": "^7.2.0",     // Íconos
  "@mui/material": "^7.2.0",           // Componentes UI
  "moment": "^2.30.1",                 // Manejo de fechas
  "react": "^19.1.0",                  // React 19
  "react-dom": "^19.1.0",              // React DOM
  "react-router-dom": "^7.6.3",        // Routing
  "sweetalert2": "^11.22.2"            // Alertas
}

## 🚀 Cómo iniciar el frontend

1. Abre una terminal en la carpeta del frontend.
2. Ejecuta los siguientes comandos:

```bash
npm install
npm run dev

## 🚀 Cómo iniciar el Backend
1. Ctrl + f5 dentro de la solucion
2. El backend iniciará el servidor en http://localhost:5173 (por defecto).