// import { API_BASE_URL } from '../config'; // Asegúrate de que esta ruta sea correcta

const API_BASE_URL = 'https://localhost:7275';
const API_URL = `${API_BASE_URL}/api/TaskHeader`;

// Helper para obtener el token JWT de localStorage
// Helper para obtener el token JWT del sessionStorage
const getToken = () => {
    const token = sessionStorage.getItem('jwt_token');
    return token;
};

// Helper para solicitudes fetch autorizadas
const authorizedFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log("Header de Autorización enviado:", headers['Authorization']);
    } else {
        console.warn("Advertencia: No se encontró token, la solicitud se enviará sin autorización.");
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        if (response.status === 401) {
            console.error("Error 401: Token inválido o no proporcionado. Redirigiendo a login.");
            sessionStorage.removeItem('jwt_token'); // <--- CAMBIO AQUÍ: Limpiar token de sessionStorage
            sessionStorage.removeItem('userData'); // Si también guardas userData en sessionStorage, límpialo aquí
            window.location.href = '/login'; // Redirigir a la página de login
            throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
        }
        const errorData = await response.json();
        const action = options.method === 'POST' ? 'crear' : options.method === 'PUT' ? 'actualizar' : 'obtener';
        throw new Error(errorData.message || `Error al ${action} la tarea: ${response.statusText}`);
    }
    return response.json();
};

export const getTasks = async (estado) => {
    return authorizedFetch(`${API_URL}/GetAll/${estado}`, { method: 'GET' });
};

export const getTaskById = async (id) => {
    return authorizedFetch(`${API_URL}/${id}`, { method: 'GET' });
};

export const createTask = async (taskData) => {
    return authorizedFetch(`${API_URL}/Create`, {
        method: 'POST',
        body: JSON.stringify(taskData),
    });
};

export const updateTask = async (id, taskData) => {
    return authorizedFetch(`${API_URL}/Update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
    });
};

export const softDeleteTask = async (id) => {
    return authorizedFetch(`${API_URL}/Delete/${id}`, {
        method: 'DELETE',
    });
};

import { getUsers } from '../../MyTeam/services/MyTeamServices';
export { getUsers };