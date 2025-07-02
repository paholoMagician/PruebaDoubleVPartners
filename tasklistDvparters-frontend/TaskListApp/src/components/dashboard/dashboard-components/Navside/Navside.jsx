import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';

import './Navside.css';
import TaskListLogo from '../../../../assets/task_list_logo.png';
import { logoutUser } from '../../../login/services/login.services';

export const Navside = ({ onSeleccionarVista, vistaActiva }) => {
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem('navsideOpen');
        return savedState === null ? true : JSON.parse(savedState);
    });

    const navigate = useNavigate();

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
                    <li>
                        <button
                            onClick={() => onSeleccionarVista('home')}
                            className={`nav-button ${vistaActiva === 'home' ? 'active' : ''}`}
                        >
                            <HomeIcon />
                            {isOpen && <span className="nav-label">Home</span>}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onSeleccionarVista('profile')}
                            className={`nav-button ${vistaActiva === 'profile' ? 'active' : ''}`}
                        >
                            <PersonIcon />
                            {isOpen && <span className="nav-label">Mi Perfil</span>}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onSeleccionarVista('team')}
                            className={`nav-button ${vistaActiva === 'team' ? 'active' : ''}`}
                        >
                            <GroupIcon />
                            {isOpen && <span className="nav-label">Mi Equipo</span>}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onSeleccionarVista('tasks')}
                            className={`nav-button ${vistaActiva === 'tasks' ? 'active' : ''}`}
                        >
                            <AssignmentIcon />
                            {isOpen && <span className="nav-label">Tareas</span>}
                        </button>
                    </li>
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
