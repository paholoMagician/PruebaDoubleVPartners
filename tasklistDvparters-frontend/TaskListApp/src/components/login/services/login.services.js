
const API_BASE_URL = 'https://localhost:7275';

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Login/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || errorData.error || "Credenciales incorrectas o error desconocido.";
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('ESTE ES EL TOKEN: ');
        console.table(data.token);
        return data.token; // Devuelve solo el token
    } catch (error) {
        console.error('Error en el servicio de login:', error);
        throw error; // Relanza el error para que el componente que llama lo pueda manejar
    }
};

export const hasValidToken = () => {
    const token = sessionStorage.getItem('jwt_token');
    return !!token;
};
// Puedes añadir más funciones relacionadas con la autenticación aquí, por ejemplo:
export const logoutUser = () => {
    sessionStorage.removeItem('jwt_token');
};

// export const registerUser = async (userData) => { ... };