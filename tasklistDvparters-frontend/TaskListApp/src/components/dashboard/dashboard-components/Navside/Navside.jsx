import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    HomeOutlined as HomeIcon,
    PersonOutlined as PersonIcon,
    GroupOutlined as GroupIcon,
    AssignmentOutlined as AssignmentIcon,
    LogoutOutlined as LogoutIcon,
    Checklist as ChecklistIcon
} from '@mui/icons-material';

import './Navside.css';
import TaskListLogo from '../../../../assets/task_list_logo.png';
import { logoutUser } from '../../../login/services/login.services';

export const Navside = ({ onSeleccionarVista, vistaActiva, userData }) => {

    // console.log('DESDE EL DASHBOARD VISTO EL USERDATA', userData); // Log para depuración

    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem('navsideOpen');
        return savedState === null ? true : JSON.parse(savedState);
    });

    const navigate = useNavigate();

    // Definición de módulos con los roles permitidos para cada uno
    const allModulosNav = [
        // {
        //     id: 'home',
        //     icon: <HomeIcon />,
        //     label: 'Home',
        //     title: 'Regreso al dashboard principal',
        //     roles: ['ADM', 'GER'] // ADM y GER pueden ver Home
        // },
        {
            id: 'profile',
            icon: <PersonIcon />,
            label: 'Mi Perfil',
            title: 'Mi perfil de usuario, gestiona el manejo de mis datos en la app',
            roles: ['ADM', 'GER', 'NOR'] // Todos pueden ver Mi Perfil
        },
        {
            id: 'team',
            icon: <GroupIcon />,
            label: 'Mi Equipo',
            title: 'Crea a tu equipo de trabajo, y gestionas sus principales datos',
            roles: ['ADM'] // Solo ADM puede ver Mi Equipo
        },
        {
            id: 'tasks',
            icon: <AssignmentIcon />,
            label: 'Tareas',
            title: 'Asigna tareas a tu equipo',
            roles: ['ADM', 'GER'] // ADM y GER pueden ver Tareas
        },
        {
            id: 'mytasks',
            icon: <ChecklistIcon />,
            label: 'Mis Tareas Asignadas',
            title: 'Revisa las tareas asignadas, y crea una trazabilidad de inicio a fin',
            multiline: true,
            roles: ['ADM', 'GER', 'NOR'] // Todos pueden ver Mis Tareas Asignadas
        }
    ];

    // Filtra los módulos basándose en el rol del usuario
    const modulosNav = allModulosNav.filter(modulo => {
        // Asegúrate de que userData y userData.role existan
        if (!userData || !userData.role) {
            return false; // Si no hay datos de usuario o rol, no mostrar ningún módulo
        }
        // Verifica si el rol del usuario está incluido en la lista de roles permitidos para el módulo
        return modulo.roles.includes(userData.role);
    });

    const handleLogout = () => {
        logoutUser();
        navigate('/login', { replace: true });
    };

    const toggleNavside = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem('navsideOpen', JSON.stringify(newState));
    };

    return (
        <div className={`navside-container ${isOpen ? 'open' : 'closed'}`}>
            <div>
                {isOpen && (
                    <img src={TaskListLogo} alt="Logo" style={{ width: '170px', height: 'auto', marginBottom: '20px' }} />
                )}

                <ul className="navside-menu">
                    {modulosNav.map((modulo) => (
                        <li key={modulo.id}>
                            <button
                                title={modulo.title}
                                onClick={() => onSeleccionarVista(modulo.id)}
                                className={`nav-button ${vistaActiva === modulo.id ? 'active' : ''}`}
                            >
                                {modulo.icon}
                                {isOpen && (
                                    <span className="nav-label">
                                        {modulo.multiline ? (
                                            <>
                                                Mis Tareas<br />Asignadas
                                            </>
                                        ) : (
                                            modulo.label
                                        )}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                <hr />

                <Button
                    variant="text"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ mt: 2, mb: 2, color: 'red' }}
                    className="logout-button"
                >
                    {isOpen && 'Cerrar Sesión'}
                </Button>
            </div>

            <button
                className="toggle-button"
                onClick={toggleNavside}
            >
                {isOpen ? <ArrowBackIosNewIcon fontSize="small" /> : <ArrowForwardIosIcon fontSize="small" />}
            </button>
        </div>
    );
};