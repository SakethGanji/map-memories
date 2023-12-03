import React, { useRef, useState, useEffect, useContext } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import config from '../config';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import {useNavigate} from "react-router-dom";

mapboxgl.accessToken = config.mapboxToken;

function MapComponent() {
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    const navigate = useNavigate();
    const { isLoggedIn, userEmail, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        return () => map.remove();
    }, []);
    return (
        <>
            <div style={{ position: 'relative', height: '100vh' }}>
                <AppBar position="absolute" sx={{ zIndex: 1300 }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Map Memories
                        </Typography>
                        {isLoggedIn ? (
                            <>
                                <Typography variant="h6" sx={{ marginRight: 2 }}>
                                    {userEmail}
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <Button color="inherit">Login</Button>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100%' }} />
        </>
    );
}

export default MapComponent;
