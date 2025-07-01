import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AcUnitIcon from '@mui/icons-material/AcUnit';


export const Dashboard = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                ¡Bienvenido a tu TaskList!
            </Typography>
            <Button variant="contained" color="primary" onClick={() => alert('¡Botón clickeado!')}>
                Mi Primer Botón MUI
            </Button>
            <br /><br />
            <AcUnitIcon sx={{ fontSize: 40, color: 'lightblue' }} />
        </div>
    )
}
