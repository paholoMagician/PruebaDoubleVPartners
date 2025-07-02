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

export const MyTeam = ({ userData }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

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
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers(1, userData.nameid); // Estado 1 (activos)
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
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
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (user) => {
        setFormData({
            Nombres: user.nombres,
            Email: user.email,
            Password: '', // ¡IMPORTANTE: SIEMPRE VACÍA PARA EDICIÓN!
            Rol: user.rol,
            Estado: user.estado // Asegúrate de cargar el estado del usuario existente
        });
        setEditMode(true);
        setCurrentUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editMode && currentUser) {
                const dataToSend = { ...formData };
                // ESTO ES CLAVE: Si la contraseña está vacía, no la enviamos.
                if (dataToSend.Password === '') {
                    delete dataToSend.Password;
                }

                await updateUser(currentUser.id, dataToSend); // Envía los datos ajustados
                setSuccess('Usuario actualizado exitosamente');
            } else {
                // ... lógica para crear usuario
                await createUser(formData);
                setSuccess('Usuario creado exitosamente');
            }
            fetchUsers();
            handleCloseDialog();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (userId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

        setLoading(true);
        try {
            await deleteUser(userId);
            setSuccess('Usuario eliminado exitosamente');
            fetchUsers();
        } catch (err) {
            setError(err.message);
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
            {/* Alertas */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert severity="error" onClose={handleCloseAlert}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert severity="success" onClose={handleCloseAlert}>
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
                {userData?.role === 'ADM' && (
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
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && !users.length ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress />
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
                        <ul className="form-list">
                            <li>
                                <TextField
                                    fullWidth
                                    label="Nombre Completo"
                                    name="Nombres"
                                    value={formData.Nombres}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </li>
                            <li>
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
                            </li>
                            <li>
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
                                    <MenuItem key="ADM" value="ADM">Administrador</MenuItem>
                                    <MenuItem key="GER" value="GER">Supervisor</MenuItem>
                                    <MenuItem key="NOR" value="NOR">Empleado</MenuItem>
                                </TextField>
                            </li>
                        </ul>
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