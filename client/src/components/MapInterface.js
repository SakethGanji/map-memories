import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl';
import config from '../config';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from "@mui/material/TextField";

function MapComponent() {
    const navigate = useNavigate();
    const { isLoggedIn, userEmail, logout } = useAuth();
    const [newPin, setNewPin] = useState(null);
    const [pins, setPins] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const handleLogin = () => {
        navigate('/signin');
    };

    useEffect(() => {
        const fetchPins = async () => {
            try {
                const res = await axios.get("http://localhost:5000/post/");
                const validPins = res.data.filter(pin =>
                    pin.latitude >= -90 && pin.latitude <= 90 &&
                    pin.longitude >= -180 && pin.longitude <= 180
                );
                setPins(validPins);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPins();
    }, []);

    const handleMapClick = (e) => {
        const longitude = e.lngLat.lng;
        const latitude = e.lngLat.lat;
        setNewPin({
            longitude,
            latitude,
            username: userEmail,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/post/", newPin);
            setPins([...pins, res.data]);
            setNewPin(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkerClick = (pin) => {
        setSelectedPin(pin);
    };
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/post/${selectedPin._id}`, selectedPin);
            // Update the pin in your state
            setPins(pins.map(pin => pin._id === selectedPin._id ? res.data : pin));
            setIsEditing(false);
            setSelectedPin(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/post/${selectedPin._id}`);
            // Remove the pin from your state
            setPins(pins.filter(pin => pin._id !== selectedPin._id));
            setSelectedPin(null);
        } catch (err) {
            console.error(err);
        }
    };


    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

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
                    onDblClick={handleMapClick}
                >
                    <NavigationControl position='bottom-left' />
                    <FullscreenControl position='bottom-right' />
                    <GeolocateControl position='bottom-right' />
                    // displays the markers
                    {pins.map(pin => (
                        <Marker
                            key={pin._id}
                            longitude={pin.longitude}
                            latitude={pin.latitude}
                            onClick={() => handleMarkerClick(pin)}
                        >
                            {/* Marker Content */}
                        </Marker>
                    ))}

                    {selectedPin && (
                        <Popup
                            longitude={selectedPin.longitude}
                            latitude={selectedPin.latitude}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => {
                                setSelectedPin(null);
                                setIsEditing(false);
                            }}
                            anchor="top"
                            style={{ minWidth: '210px', minHeight: '100px' }}
                        >
                            {isEditing ? (
                                // Edit Mode
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label="Title"
                                        value={selectedPin.title || ''}
                                        onChange={(e) => setSelectedPin({ ...selectedPin, title: e.target.value })}
                                        margin="normal"
                                        fullWidth
                                    />

                                    <TextField
                                        label="Description"
                                        multiline
                                        rows={4}
                                        value={selectedPin.description || ''}
                                        onChange={(e) => setSelectedPin({ ...selectedPin, description: e.target.value })}
                                        margin="normal"
                                        fullWidth
                                    />

                                    <CardActions>
                                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
                                        <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </CardActions>
                                </Box>
                            ) : (
                                // Display Mode
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {selectedPin.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedPin.description}
                                    </Typography>
                                    <CardActions>
                                        <Button variant="contained" color="success" onClick={() => setIsEditing(true)}>Edit</Button>
                                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                                    </CardActions>
                                </CardContent>
                            )}
                        </Popup>
                    )}


                    {selectedPin && (
                        <Popup
                            longitude={selectedPin.longitude}
                            latitude={selectedPin.latitude}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => {
                                setSelectedPin(null);
                                setIsEditing(false);
                            }}
                            anchor="top"
                            style={{ minWidth: '210px', minHeight: '100px' }}
                        >
                            {isEditing ? (
                                // Edit Mode
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label="Title"
                                        value={selectedPin.title || ''}
                                        onChange={(e) => setSelectedPin({ ...selectedPin, title: e.target.value })}
                                        margin="normal"
                                        fullWidth
                                    />

                                    <TextField
                                        label="Description"
                                        multiline
                                        rows={4}
                                        value={selectedPin.description || ''}
                                        onChange={(e) => setSelectedPin({ ...selectedPin, description: e.target.value })}
                                        margin="normal"
                                        fullWidth
                                    />

                                    <CardActions>
                                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
                                        <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </CardActions>
                                </Box>
                            ) : (
                                // Display Mode
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {selectedPin.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedPin.description}
                                    </Typography>
                                    <CardActions>
                                        <Button variant="contained" color="success" onClick={() => setIsEditing(true)}>Edit</Button>
                                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                                    </CardActions>
                                </CardContent>
                            )}
                        </Popup>
                    )}


                    // popup

                    {newPin && (
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Popup
                                longitude={newPin.longitude}
                                latitude={newPin.latitude}
                                closeButton={true}
                                closeOnClick={false}
                                onClose={() => setNewPin(null)}
                                anchor="left"
                            >
                                <div>
                                    <TextField
                                        label="Title"
                                        value={newPin.title || ''}
                                        onChange={(e) => setNewPin({ ...newPin, title: e.target.value })}
                                        margin="normal"
                                        fullWidth
                                    />

                                    <TextField
                                        label="Description"
                                        multiline
                                        rows={4}
                                        value={newPin.description || ''}
                                        onChange={(e) => setNewPin({ ...newPin, description: e.target.value })}
                                        margin="normal"
                                        fullWidth
                                    />
                                    <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                        >
                                            Add Pin
                                        </Button>
                                    </Box>
                                </div>
                            </Popup>
                        </Box>
                    )}
                </Map>
            </div>
        </>
    );
}

export default MapComponent;
