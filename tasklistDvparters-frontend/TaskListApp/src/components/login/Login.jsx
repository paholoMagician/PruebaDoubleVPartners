// src/componentlogin/Login.jsx
import { useState } from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import TaskListLogo from '../../assets/task_list_logo.png';
// Importa la función de login del servicio
import { loginUser } from './services/login.services';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Limpiamos cualquier error previo
        setLoading(true); // Iniciamos el estado de carga

        if (!email || !password) {
            setError("Por favor, ingrese su correo electrónico y contraseña.");
            setLoading(false); // Detenemos la carga si hay un error de validación local
            return;
        }

        try {
            // Llama a la función del servicio para realizar el login
            const token = await loginUser(email, password);

            if (token) {
                sessionStorage.setItem('jwt_token', token);
                console.log('Token JWT almacenado:', token);
                navigate('/'); // Redirige al dashboard
            } else {
                setError("No se recibió un token de autenticación.");
            }

        } catch (err) {
            // El servicio ya loguea el error en consola, aquí solo lo mostramos al usuario
            setError(err.message || "Error al intentar iniciar sesión. Intente de nuevo.");
        } finally {
            setLoading(false); // Siempre detenemos la carga al finalizar, exitosa o con error
        }
    };

    return (
        <>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* <Typography component="h1" variant="h5">
                        Iniciar Sesión
                    </Typography> */}
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* CAMBIO AQUÍ: Usa la variable importada en el src */}
                        <img src={TaskListLogo} alt='Logo de TaskList' style={{ width: '450px', height: 'auto', marginBottom: '20px' }} />
                        {/* O con Avatar si lo prefieres: */}
                        {/* <Avatar sx={{ m: 1, width: 100, height: 100 }}>
                        <img src={TaskListLogo} alt='Logo de TaskList' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Avatar> */}
                        <Typography component="h1" variant="h5">
                            Iniciar Sesión
                        </Typography>
                        {/* ... el resto de tu formulario ... */}
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading} // Deshabilita los campos durante la carga
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading} // Deshabilita los campos durante la carga
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading} // Deshabilita el botón durante la carga
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'} {/* Cambia texto del botón */}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"¿No tienes una cuenta? Regístrate"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
                    {'Copyright © '}
                    <Link color="inherit" href="https://mui.com/">
                        Tu Empresa
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </>
    );
};