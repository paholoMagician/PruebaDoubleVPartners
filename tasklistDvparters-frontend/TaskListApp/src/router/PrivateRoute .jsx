// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Asegúrate de que esta ruta a hasValidToken sea correcta
// Si login.services.js está en src/componentlogin/services/
import { hasValidToken } from '../components/login/services/login.services';

/**
 * Componente que protege rutas. Si el usuario no está autenticado,
 * lo redirige a la página de login.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes que se renderizarán si el usuario está autenticado.
 * @returns {React.ReactNode} - Los componentes protegidos o un componente de redirección.
 */

export const PrivateRoute = ({ children }) => {
    // Llama a la función que verifica el token
    const isAuthenticated = hasValidToken();

    if (!isAuthenticated) {
        // Si no hay un token válido, redirige al usuario a la página de login
        return <Navigate to="/login" replace />;
    }

    // Si hay un token válido, renderiza los componentes hijos
    // Outlet es útil si PrivateRoute se usa como un layout para rutas anidadas
    // Si solo envuelve un componente directamente, 'children' es lo que necesitas.
    return children ? children : <Outlet />;
};