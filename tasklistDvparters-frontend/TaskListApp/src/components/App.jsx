
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './login/Login';
import { Dashboard } from './dashboard/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta para el login */}
                <Route path="/login" element={<Login />} />

                {/* Ruta para la aplicación principal (Dashboard) */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Redirige a /login si la URL no coincide con ninguna ruta */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;