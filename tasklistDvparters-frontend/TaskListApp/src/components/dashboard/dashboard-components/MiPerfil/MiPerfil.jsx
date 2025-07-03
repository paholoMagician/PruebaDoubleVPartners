import { useState, useEffect } from 'react';

import {
    PersonOutlined as PersonIcon
} from '@mui/icons-material';

import {
    Typography, Box, Paper, TextField, Button, Grid, MenuItem, Alert, CircularProgress,
    InputAdornment, IconButton, List, ListItem
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import UpdateIcon from '@mui/icons-material/Update';

import { updateUserService } from './services/user.services';
import './MiPerfil.css';

export const MiPerfil = ({ userData }) => {
    const [formData, setFormData] = useState({
        Nombres: userData?.unique_name || '',
        Email: userData?.email || '',
        Password: '',
        Rol: userData?.role || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (successMessage || error) {
                setSuccessMessage(null);
                setError(null);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const currentUserId = userData?.nameid;

        if (!currentUserId) {
            setError("No se pudo obtener el ID del usuario para actualizar.");
            setLoading(false);
            return;
        }

        try {
            const dataToUpdate = {
                Nombres: formData.Nombres,
                Email: formData.Email,
                Password: formData.Password === '' ? null : formData.Password,
                Estado: 1, // Siempre enviamos 1 (Activo)
                Rol: formData.Rol
            };

            await updateUserService(currentUserId, dataToUpdate);
            setSuccessMessage("Perfil actualizado exitosamente!");
        } catch (err) {
            setError(err.message || "Error al actualizar el perfil.");
            console.error("Error al actualizar perfil:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Cargando información del usuario...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }} className="mi-perfil-container">
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="large" sx={{ fontSize: '2.5rem' }} />
                Mi Perfil
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mt: 2 }} className="mi-perfil-paper">
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <List sx={{ width: '100%' }}>
                        {/* Grupo 1: Nombre completo y Correo electrónico */}
                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 0 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nombre Completo"
                                        name="Nombres"
                                        value={formData.Nombres}
                                        onChange={handleChange}
                                        margin="normal"
                                        required
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Correo Electrónico"
                                        name="Email"
                                        type="email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        margin="normal"
                                        required
                                        disabled={loading}
                                    />
                                </Grid>
                            </Grid>
                        </ListItem>

                        {/* Grupo 2: Contraseña y Rol */}
                        <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 0, mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Nueva Contraseña"
                                        name="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.Password}
                                        onChange={handleChange}
                                        margin="normal"
                                        disabled={loading}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        helperText="Dejar en blanco para no cambiar la contraseña."
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Rol"
                                        name="Rol"
                                        value={formData.Rol}
                                        onChange={handleChange}
                                        margin="normal"
                                        required
                                        disabled={loading}
                                    >
                                        <MenuItem value="ADM">Administrador</MenuItem>
                                        <MenuItem value="GER">Supervisor</MenuItem>
                                        <MenuItem value="NOR">Empleado</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                        startIcon={!loading && <UpdateIcon />}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Perfil'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};