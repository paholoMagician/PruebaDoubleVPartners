// src/dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navside } from './dashboard-components/Navside/Navside';
import { MiPerfil } from './dashboard-components/MiPerfil/MiPerfil';
import { MyTeam } from './dashboard-components/MyTeam/MyTeam';
import { Tareas } from './dashboard-components/Tareas/Tareas';

// Importa las funciones de login.services
import { hasValidToken, logoutUser, decodeJwtToken } from '../login/services/login.services';

import './Dashboard.css';
import { MyWorks } from './dashboard-components/My-Works/MyWorks';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [vistaActiva, setVistaActiva] = useState('home');
    const [userData, setUserData] = useState(null); // Estado para la data del usuario

    // Validación del token y decodificación al montar el componente
    useEffect(() => {
        if (!hasValidToken()) {
            navigate('/login', { replace: true });
        } else {
            const decodedData = decodeJwtToken();
            if (decodedData) {
                setUserData(decodedData);
                // console.log("Datos del usuario decodificados:", decodedData); // Puedes dejar este log para depuración
            } else {
                logoutUser();
                navigate('/login', { replace: true });
            }
        }
    }, [navigate]);

    const renderVista = () => {
        switch (vistaActiva) {
            case 'profile':
                return <MiPerfil userData={userData} />; // Pasa userData a MiPerfil
            case 'team':
                return <MyTeam userData={userData} />; // Pasa userData a MyTeam
            case 'tasks':
                return <Tareas userData={userData} />; // Pasa userData a Tareas
            case 'mytasks':
                return <MyWorks userData={userData} />; // Pasa userData a Mis Tareas
            case 'home':
            default:
                // Usamos userData.unique_name para el saludo, o userData.email si unique_name no existe
                return (
                    <div className='welcome-dashboard'>
                        <h2>Bienvenido al Dashboard, {userData ? userData.unique_name || userData.email : 'Usuario'}!</h2> {/* <--- ¡CORREGIDO! */}
                        <p>Aquí encontrarás un resumen de tus tareas y actividades.</p>
                    </div>
                );
        }
    };

    return (
        <section className='apps-view'>
            <div className='navside-contain'>
                {/* Pasa userData al Navside si necesitas mostrar el nombre de usuario allí */}
                <Navside onSeleccionarVista={setVistaActiva} vistaActiva={vistaActiva} userData={userData} />
            </div>
            <div className='app-containers'>
                {renderVista()}
            </div>
        </section>
    );
};