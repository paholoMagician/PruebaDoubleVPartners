const API_BASE_URL = 'https://localhost:7275';

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Login/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    email,
                    password
                }
            ),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || errorData.error || "Credenciales incorrectas o error desconocido.";
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('ESTE ES EL TOKEN: ');
        console.table(data.token);
        return data.token;
    } catch (error) {
        console.error('Error en el servicio de login:', error);
        throw error;
    }
};

export const decodeJwtToken = () => {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
        return null;
    }
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decodificando el token JWT:", error);
        return null;
    }
};

export const hasValidToken = () => {
    const token = sessionStorage.getItem('jwt_token');
    return !!token;
};

export const logoutUser = () => {
    sessionStorage.removeItem('jwt_token');
};
