// Services/MyWorks.services.js

const API_BASE_URL = 'https://localhost:7275/api/TasksBody'; // Ajusta esto a la URL base de tu API

/**
 * Obtiene el token JWT del sessionStorage.
 * @returns {string|null} El token JWT si existe, de lo contrario null.
 */
const getToken = () => {
    const token = sessionStorage.getItem('jwt_token');
    console.warn('TOKEN DESDE MYWORKS')
    console.warn(token)
    return token;
};

/**
 * Función genérica para manejar respuestas de la API.
 * @param {Response} response - La respuesta HTTP de la API.
 * @returns {Promise<any>} Los datos JSON de la respuesta o un error.
 */
async function handleApiResponse(response) {
    if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (e) {
            console.error(e);
            // Si la respuesta no es JSON, simplemente usamos el estado HTTP
            errorMessage = `Error HTTP: ${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

/**
 * Obtiene todos los cuerpos de tarea para un encabezado y estado específicos.
 * @param {number} tasksHeaderId - El ID del encabezado de la tarea.
 * @param {number} estado - El estado de las tareas (e.g., 0 para pendiente, 1 para completado, etc.).
 * @returns {Promise<Array>} Un array de objetos TasksBody.
 */
export async function getAllTasksBodyByHeaderId(tasksHeaderId, estado) {
    const token = getToken(); // Obtener el token
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/GetAllByHeader/${tasksHeaderId}/${estado}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return await handleApiResponse(response);
    } catch (error) {
        console.error('Error al obtener todos los cuerpos de tarea por encabezado:', error);
        throw error;
    }
}

/**
 * Obtiene un cuerpo de tarea específico por su ID.
 * @param {number} id - El ID del cuerpo de la tarea.
 * @returns {Promise<Object>} El objeto TasksBody.
 */
export async function getTasksBodyById(id) {
    const token = getToken(); // Obtener el token
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return await handleApiResponse(response);
    } catch (error) {
        console.error(`Error al obtener el cuerpo de tarea con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Crea un nuevo cuerpo de tarea.
 * @param {Object} tasksBodyDto - Los datos del cuerpo de la tarea a crear (TasksBodyCreateUpdateDto).
 * @returns {Promise<Object>} El objeto TasksBody creado.
 */
export async function createTasksBody(tasksBodyDto) {
    const token = getToken(); // Obtener el token
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/Create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tasksBodyDto),
        });
        return await handleApiResponse(response);
    } catch (error) {
        console.error('Error al crear el cuerpo de tarea:', error);
        throw error;
    }
}

/**
 * Actualiza un cuerpo de tarea existente.
 * @param {number} id - El ID del cuerpo de la tarea a actualizar.
 * @param {Object} tasksBodyDto - Los datos actualizados del cuerpo de la tarea (TasksBodyCreateUpdateDto).
 * @returns {Promise<Object>} El objeto TasksBody actualizado.
 */
export async function updateTasksBody(id, tasksBodyDto) {
    const token = getToken(); // Obtener el token
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/Update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tasksBodyDto),
        });
        return await handleApiResponse(response);
    } catch (error) {
        console.error(`Error al actualizar el cuerpo de tarea con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Realiza una eliminación lógica de un cuerpo de tarea.
 * @param {number} id - El ID del cuerpo de la tarea a eliminar lógicamente.
 * @returns {Promise<Object>} Un objeto con un mensaje de éxito y los datos del cuerpo de tarea eliminado.
 */
export async function softDeleteTasksBody(id) {
    const token = getToken(); // Obtener el token
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/Delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return await handleApiResponse(response);
    } catch (error) {
        console.error(`Error al eliminar lógicamente el cuerpo de tarea con ID ${id}:`, error);
        throw error;
    }
}