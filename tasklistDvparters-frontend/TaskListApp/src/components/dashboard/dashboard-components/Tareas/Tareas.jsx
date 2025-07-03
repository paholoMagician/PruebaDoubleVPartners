import { useState, useEffect } from 'react';
import './Tareas.css';

import {
    Box, Paper, Typography, Button, Grid, TextField, MenuItem,
    Table, TableBody, TableCell, TableFooter, TablePagination, TableContainer, TableHead,
    TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Alert, Snackbar,
    Chip // Añadido para mostrar el estado
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { getTasks, createTask, updateTask, softDeleteTask, getUsers } from './services/Tareas.services';
import moment from 'moment'; // Para formatear fechas

export const Tareas = ({ userData }) => {

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]); // Para almacenar usuarios para el desplegable de asignación
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterEstado, setFilterEstado] = useState(1); // Por defecto a tareas activas (Estado = 1)

    // Estado del formulario para TaskHeaderCreateUpdateDto
    const [formData, setFormData] = useState({
        Iduser: '', // Usuario asignado a la tarea
        EstadoTarea: 1, // Estado inicial de la tarea (1=Pendiente)
        Titutlo: '',
        Observacion: '',
        Estado: 1 // Estado del registro (1=Activo, 0=Eliminado Lógicamente)
    });

    const isUserSelected = !!formData.Iduser;

    useEffect(() => {
        fetchTasks();
        fetchUsersForDropdown(); // Obtener usuarios cuando el componente se monta
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterEstado]); // Vuelve a obtener tareas cuando filterEstado cambia

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await getTasks(filterEstado); // Usa filterEstado
            setTasks(response); // Asumiendo que el backend devuelve un array directamente
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersForDropdown = async () => {
        try {
            // Obtener solo usuarios activos (Estado = 1)
            const response = await getUsers(1);
            setUsers(response.data); // Asumiendo que getUsers devuelve { data: [...] }
        } catch (err) {
            console.error("Error al obtener usuarios para el desplegable:", err.message);
            setError("Error al cargar la lista de usuarios para asignar.");
        }
    };

    const handleOpenCreateDialog = () => {
        setFormData({
            Iduser: '',
            EstadoTarea: 1, // Por defecto a Pendiente
            Titutlo: '',
            Observacion: '',
            Estado: 1 // Por defecto a activo
        });
        setEditMode(false);
        setCurrentTask(null);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (task) => {
        setFormData({
            Iduser: task.iduser,
            EstadoTarea: task.estadoTarea,
            Titutlo: task.titutlo,
            Observacion: task.observacion,
            Estado: task.estado
        });
        setEditMode(true);
        setCurrentTask(task);
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
            if (editMode && currentTask) {
                // No es necesario eliminar 'Password' ya que no está en formData para tareas
                await updateTask(currentTask.id, formData);
                setSuccess('Tarea actualizada exitosamente');
            } else {
                // Para la creación, añade Usercrea del usuario logueado
                const dataToCreate = { ...formData };
                await createTask(dataToCreate);
                setSuccess('Tarea creada exitosamente');
            }
            fetchTasks();
            handleCloseDialog();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar lógicamente esta tarea?')) return;

        setLoading(true);
        try {
            await softDeleteTask(taskId);
            setSuccess('Tarea eliminada lógicamente exitosamente');
            fetchTasks(); // Actualiza la lista para mostrar la tarea como inactiva
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

    const filteredTasks = tasks.filter((task) =>
        task.titutlo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.observacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.iduser && users.find(u => u.id === task.iduser)?.nombres.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginatedTasks = filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Mapea EstadoTarea a una cadena legible y color para el Chip
    const getEstadoTareaDisplay = (estadoTarea) => {
        switch (estadoTarea) {
            case 1: return { text: 'Pendiente', color: 'warning' };
            case 2: return { text: 'En Progreso', color: 'info' };
            case 3: return { text: 'Completada', color: 'success' };
            default: return { text: 'Desconocido', color: 'default' };
        }
    };

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
                <Typography variant="h4">Gestión de Tareas</Typography>
                <TextField
                    label="Buscar Tarea"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 300 }}
                />
                <TextField
                    select
                    label="Filtrar por Estado"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(parseInt(e.target.value))}
                    sx={{ width: 200 }}
                >
                    <MenuItem value={1}>Activas</MenuItem>
                    <MenuItem value={0}>Inactivas</MenuItem>
                    {/* Añade otros estados si aplica, por ejemplo, para EstadoTarea */}
                </TextField>
                {userData?.role === 'ADM' || userData?.role === 'GER' ? ( // ADM y USR pueden crear tareas
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateDialog}
                    >
                        Nueva Tarea
                    </Button>
                ) : null}
            </Box>

            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Usuario Asignado</TableCell>
                                <TableCell>Estado Tarea</TableCell>
                                <TableCell>Observación</TableCell>
                                <TableCell>Fecha Creación</TableCell>
                                <TableCell>Creada Por</TableCell>
                                <TableCell>Estado Registro</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && !tasks.length ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedTasks.map((task) => {
                                    const assignedUser = users.find(u => u.id === task.iduser);
                                    const createdByUser = users.find(u => u.id === task.usercrea); // Asumiendo que usercrea es el ID
                                    const taskStatus = getEstadoTareaDisplay(task.estadoTarea);
                                    const recordStatus = task.estado === 1 ? { text: 'Activo', color: 'success' } : { text: 'Inactivo', color: 'error' };

                                    return (
                                        <TableRow key={task.id}>
                                            <TableCell>{task.titutlo}</TableCell>
                                            <TableCell>{assignedUser ? assignedUser.nombres : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip label={taskStatus.text} color={taskStatus.color} size="small" />
                                            </TableCell>
                                            <TableCell>{task.observacion}</TableCell>
                                            <TableCell>{moment(task.fecrea).format('DD/MM/YYYY HH:mm')}</TableCell>
                                            <TableCell>{createdByUser ? createdByUser.nombres : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip label={recordStatus.text} color={recordStatus.color} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                {(userData?.role === 'ADM' || userData?.role === 'USR') && task.estado === 1 && ( // Solo tareas activas pueden ser editadas/eliminadas por ADM/USR
                                                    <>
                                                        <IconButton onClick={() => handleOpenEditDialog(task)}>
                                                            <EditIcon color="primary" />
                                                        </IconButton>
                                                        {userData?.role === 'ADM' && ( // Solo ADM puede eliminar lógicamente
                                                            <IconButton onClick={() => handleDelete(task.id)}>
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={filteredTasks.length}
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

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        padding: 2,
                        width: '100%',
                        maxWidth: '600px'
                    }
                }}
            >
                <DialogTitle>
                    {editMode ? 'Editar Tarea' : 'Crear Nueva Tarea'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} className="dialog-form">
                        <ul className="form-list">
                            <li>
                                <TextField
                                    fullWidth
                                    select
                                    label="Asignar a Usuario"
                                    name="Iduser"
                                    value={formData.Iduser}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                >
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.nombres}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Cargando usuarios...</MenuItem>
                                    )}
                                </TextField>
                            </li>
                            <li>
                                <TextField
                                    fullWidth
                                    label="Título"
                                    name="Titutlo"
                                    value={formData.Titutlo}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!isUserSelected || loading}
                                />
                            </li>
                            <li>
                                <TextField
                                    fullWidth
                                    label="Observación"
                                    name="Observacion"
                                    value={formData.Observacion}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={3}
                                    disabled={!isUserSelected || loading}
                                />
                            </li>
                            <li>
                                <TextField
                                    fullWidth
                                    select
                                    label="Estado de la Tarea"
                                    name="EstadoTarea"
                                    value={formData.EstadoTarea}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!isUserSelected || loading}
                                >
                                    <MenuItem value={1}>Pendiente</MenuItem>
                                    <MenuItem value={2}>En Progreso</MenuItem>
                                    <MenuItem value={3}>Completada</MenuItem>
                                </TextField>
                            </li>
                            {editMode && (
                                <li>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Estado del Registro"
                                        name="Estado"
                                        value={formData.Estado}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!isUserSelected || loading}
                                    >
                                        <MenuItem value={1}>Activo</MenuItem>
                                        <MenuItem value={0}>Inactivo</MenuItem>
                                    </TextField>
                                </li>
                            )}
                        </ul>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>Cancelar</Button>
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