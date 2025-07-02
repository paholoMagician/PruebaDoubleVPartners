const API_BASE_URL = 'https://localhost:7275';

const getAuthToken = () => {
    return sessionStorage.getItem('jwt_token');
};

export const getUsers = async (estado = 1, usercrea) => {
    const token = getAuthToken();
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        // Construye los parámetros de consulta
        const queryParams = new URLSearchParams();
        if (estado !== undefined && estado !== null) {
            queryParams.append('estado', estado);
        }
        if (usercrea !== undefined && usercrea !== null) {
            queryParams.append('userCrea', usercrea); // Asegúrate que el nombre 'userCrea' coincida con tu backend
        }

        // Construye la URL final con los parámetros de consulta
        // Si hay parámetros, añade '?' y luego los parámetros, de lo contrario, solo la URL base
        const url = `${API_BASE_URL}/api/Users/GetUsers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Mejora el mensaje de error para incluir el mensaje del backend si existe
            throw new Error(errorData.message || `Error al obtener usuarios: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getUsers:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
        throw new Error("No hay token de autenticación disponible.");
    }

    // Asegúrate de que el estado se envíe (por defecto 1)
    const completeUserData = {
        ...userData,
        estado: userData.estado ?? 1
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/Users/CreateUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(completeUserData)
        });

        if (!response.ok) {
            // Intentar leer como texto para manejar errores tipo .NET
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };

    } catch (error) {
        console.error('Error en createUser:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    const token = getAuthToken();
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/api/Users/UpdateUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al actualizar usuario: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updateUser:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    const token = getAuthToken();
    if (!token) throw new Error("No hay token de autenticación disponible.");

    try {
        const response = await fetch(`${API_BASE_URL}/api/Users/DeleteUser/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al eliminar usuario: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en deleteUser:', error);
        throw error;
    }
};