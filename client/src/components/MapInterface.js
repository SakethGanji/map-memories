import React, { useRef, useState, useEffect, useContext } from 'react';
import Map from 'react-map-gl'; // eslint-disable-line import/no-webpack-loader-syntax
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

const accessToken = config.mapboxToken;

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
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                />
            </div>
        </>
    );
}

export default MapComponent;
