import React, { useRef, useState, useEffect, useContext } from 'react';
import Map, {Marker, NavigationControl, Popup, GeolocateControl, ScaleControl, FullscreenControl} from 'react-map-gl';
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

function MapComponent() {
    const navigate = useNavigate();
    const { isLoggedIn, userEmail, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const handleLogin = () => {
        navigate('/signin');
    };

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
                            <Button color="inherit" onClick={handleLogin}>Login</Button>
                        )}
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                <Map
                    mapboxAccessToken={config.mapboxToken}
                    initialViewState={{
                        longitude: -122.4,
                        latitude: 37.8,
                        zoom: 14,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/sakethganji/cl5nmraf7000214mqy8xtt6yr"
                >
                    <NavigationControl position='bottom-left' />
                    <FullscreenControl position='bottom-right' />
                    <GeolocateControl position='bottom-right' />

                </Map>
            </div>
        </>
    );
}

export default MapComponent;
