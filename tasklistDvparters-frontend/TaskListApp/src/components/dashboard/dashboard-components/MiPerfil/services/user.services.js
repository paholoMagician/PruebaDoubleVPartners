// src/services/user.services.js

const API_BASE_URL = 'https://localhost:7275';

// Función para obtener un token JWT del sessionStorage
const getAuthToken = () => {
    return sessionStorage.getItem('jwt_token');
};

/**
 * Actualiza la información de un usuario.
 * Requiere autenticación y rol ADM.
 * @param {number} userId - El ID del usuario a actualizar.
 * @param {Object} userData - Los datos del usuario a actualizar (Nombres, Email, Password, Estado, Rol).
 * @returns {Promise<Object>} Los datos del usuario actualizados.
 * @throws {Error} Si la respuesta de la API no es exitosa o hay un error de red.
 */
export const updateUserService = async (userId, userData) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("No hay token de autenticación disponible.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Users/UpdateUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || `Error al actualizar usuario: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en updateUserService:', error);
        throw error;
    }
};