import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Grid, TextField, MenuItem,
    Table, TableBody, TableCell, TableFooter, TablePagination, TableContainer, TableHead,
    TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Alert, Snackbar,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { getUsers, createUser, updateUser, deleteUser } from './services/MyTeamServices';
import Swal from 'sweetalert2'; // Import SweetAlert2

export const MyTeam = ({ userData }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Form state
    const [formData, setFormData] = useState({
        Nombres: '',
        Email: '',
        Password: '', // La contraseña siempre se inicializa vacía
        Rol: 'NOR',
        Estado: 1
    });

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers(1, userData.nameid); // Estado 1 (activos)
            setUsers(response.data);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Carga',
                text: err.message || "Error desconocido al cargar los usuarios."
            });
            setError(err.message); // Mantener para el Snackbar si es deseado
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateDialog = () => {
        setFormData({
            Nombres: '',
            Email: '',
            Password: '', // Siempre vacía para creación
            Rol: 'NOR',
            Estado: 1
        });
        setEditMode(false);
        setCurrentUser(null);
        setShowPassword(false); // Reset password visibility for new user
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (user) => {
        setFormData({
            Nombres: user.nombres,
            Email: user.email,
            Password: '', // ¡IMPORTANTE: SIEMPRE VACÍA PARA EDICIÓN!
            Rol: user.rol.trim(), // Asegúrate de quitar espacios si el backend los envía
            Estado: user.estado // Asegúrate de cargar el estado del usuario existente
        });
        setEditMode(true);
        setCurrentUser(user);
        setShowPassword(false); // Reset password visibility for edit mode
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError(null); // Clear errors on dialog close
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            if (editMode && currentUser) {
                const dataToSend = { ...formData };
                // ESTO ES CLAVE: Si la contraseña está vacía, no la enviamos.
                // Esto permite que el backend no modifique la contraseña si no se proporciona una nueva.
                if (dataToSend.Password === '') {
                    delete dataToSend.Password;
                }
                // Si la contraseña no está vacía, pero tiene menos de 6 caracteres (ejemplo de validación)
                if (dataToSend.Password && dataToSend.Password.length < 6) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Contraseña Corta',
                        text: 'La contraseña debe tener al menos 6 caracteres si se va a cambiar.'
                    });
                    setLoading(false);
                    return;
                }

                await updateUser(currentUser.id, dataToSend); // Envía los datos ajustados
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Usuario actualizado exitosamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
                setSuccess('Usuario actualizado exitosamente'); // Para el Snackbar
            } else {
                // Validación de contraseña para creación
                if (!formData.Password || formData.Password.length < 6) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Contraseña Requerida',
                        text: 'Para crear un usuario, la contraseña es obligatoria y debe tener al menos 6 caracteres.'
                    });
                    setLoading(false);
                    return;
                }
                await createUser(formData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: 'Usuario creado exitosamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
                setSuccess('Usuario creado exitosamente'); // Para el Snackbar
            }
            fetchUsers();
            handleCloseDialog();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: `Error al ${editMode ? 'actualizar' : 'crear'}`,
                text: err.message || "Ocurrió un error inesperado."
            });
            setError(err.message); // Para el Snackbar
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Realmente deseas eliminar este usuario? ¡Esta acción es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        setLoading(true);
        try {
            await deleteUser(userId);
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'Usuario eliminado exitosamente.',
                showConfirmButton: false,
                timer: 1500
            });
            setSuccess('Usuario eliminado exitosamente'); // Para el Snackbar
            fetchUsers();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: err.message || "No se pudo eliminar el usuario."
            });
            setError(err.message); // Para el Snackbar
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setError(null);
        setSuccess(null);
    };

    const filteredUsers = users.filter((user) =>
        user.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 3 }}>
            {/* Alertas con Snackbar (complemento a SweetAlert2) */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error" onClose={handleCloseAlert} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="success" onClose={handleCloseAlert} sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>


            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Mi Equipo</Typography>
                <TextField
                    label="Buscar Usuario"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 300 }}
                />
                {(userData?.role === 'ADM' || userData?.role === 'GER') && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateDialog}
                    >
                        Nuevo Usuario
                    </Button>
                )}
            </Box>


            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Estado</TableCell> {/* Add Estado column header */}
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && !users.length ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center"> {/* Update colspan */}
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hay usuarios disponibles.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.nombres}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {{
                                                ADM: 'Administrador',
                                                GER: 'Supervisor',
                                                NOR: 'Empleado'
                                            }[user.rol?.trim()] || 'Desconocido'}
                                        </TableCell>
                                        <TableCell>
                                            {user.estado === 1 ? 'Activo' : 'Inactivo'}
                                        </TableCell>
                                        <TableCell>
                                            {userData?.role === 'ADM' && (
                                                <>
                                                    <IconButton onClick={() => handleOpenEditDialog(user)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(user.id)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={filteredUsers.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(event, newPage) => setPage(newPage)}
                                    onRowsPerPageChange={(event) => {
                                        setRowsPerPage(parseInt(event.target.value, 10));
                                        setPage(0);
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>


            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </DialogTitle>

                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} className="dialog-form">
                        <Grid container spacing={2}> {/* Use Grid for better layout */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre Completo"
                                    name="Nombres"
                                    value={formData.Nombres}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="Email"
                                    type="email"
                                    value={formData.Email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </Grid>
                            {/* CONDITIONAL RENDERING OF PASSWORD FIELD */}
                            {!editMode && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contraseña"
                                        name="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.Password}
                                        onChange={handleInputChange}
                                        required={!editMode} // Password is only required for creation
                                        disabled={loading}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Rol"
                                    name="Rol"
                                    value={formData.Rol}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                >
                                    <MenuItem value="ADM">Administrador</MenuItem>
                                    <MenuItem value="GER">Supervisor</MenuItem>
                                    <MenuItem value="NOR">Empleado</MenuItem>
                                </TextField>
                            </Grid>
                            {editMode && ( // Only show status dropdown in edit mode
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Estado"
                                        name="Estado"
                                        value={formData.Estado}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    >
                                        <MenuItem value={1}>Activo</MenuItem>
                                        <MenuItem value={0}>Inactivo</MenuItem>
                                    </TextField>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {editMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};