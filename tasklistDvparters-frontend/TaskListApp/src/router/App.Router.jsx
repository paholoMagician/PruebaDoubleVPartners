import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Login } from '../components/login/Login';
import { PrivateRoute } from '../router/PrivateRoute ';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta para el login, accesible por cualquiera */}
                <Route path="/login" element={<Login />} />

                {/* Ruta protegida para el Dashboard */}
                {/* Ahora, el Dashboard solo se renderizará si PrivateRoute permite el acceso */}
                <Route
                    path="/dashboard" // La ruta específica para tu Dashboard
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                {/* Redirige la ruta raíz a /dashboard si está autenticado, o a /login si no */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute> {/* PrivateRoute verificará si hay token */}
                            {/* Si hay token, redirige a /dashboard, si no, PrivateRoute te enviará a /login */}
                            <Navigate to="/dashboard" replace />
                        </PrivateRoute>
                    }
                />

                {/* Ruta por defecto o redirección si la URL no coincide con ninguna ruta */}
                {/* Si un usuario intenta acceder a una ruta que no existe, lo redirigimos al login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
