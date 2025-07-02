// src/componentlogin/Login.jsx
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
import { loginUser, hasValidToken } from './services/login.services';
import './Login.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Validar al inicio del ciclo de vida del componente Login
    useEffect(() => {
        // Redirige al dashboard si ya hay token
        if (hasValidToken()) navigate('/dashboard', { replace: true });
    }, [navigate]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (!email || !password) {
            setError("Por favor, ingrese su correo electrónico y contraseña.");
            setLoading(false);
            return;
        }
        try {
            const token = await loginUser(email, password);
            if (token) {
                sessionStorage.setItem('jwt_token', token);
                console.log('Token JWT almacenado:', token);
                navigate('/dashboard');
            } else {
                setError("No se recibió un token de autenticación.");
            }
        } catch (err) {
            setError(err.message || "Error al intentar iniciar sesión. Intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <Box
                    // APLICAMOS LA CLASE CSS AQUÍ
                    className="login-container-box"
                    sx={{
                        // Mantenemos estas propiedades sx aquí porque son de layout y dependen del componente MUI
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={TaskListLogo} alt='Logo de TaskList' style={{ width: '350px', height: 'auto', marginBottom: '20px' }} />
                    <Typography component="h1" variant="h5">
                        Iniciar Sesión
                    </Typography>

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
                            disabled={loading}
                        />
                        <TextField
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            disabled={loading}
                            margin="normal"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                aria-label="toggle password visibility"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
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
                            disabled={loading}
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
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
                        TaskList Manager
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </>
    );
};
