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

function MapComponent() {
    const navigate = useNavigate();
    const { isLoggedIn, userEmail, logout } = useAuth();
    const [newPin, setNewPin] = useState(null);
    const [pins, setPins] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);

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
                            onClose={() => setSelectedPin(null)}
                            anchor="top"
                        >
                            <div>
                                <h4>{selectedPin.title}</h4>
                                <p>{selectedPin.description}</p>
                                <p>{selectedPin.username}</p>
                            </div>
                        </Popup>
                    )}

                    // popup
                    {newPin && (
                        <Popup
                            longitude={newPin.longitude}
                            latitude={newPin.latitude}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => setNewPin(null)}
                            anchor="left"
                        >
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <label>Title</label>
                                    <input onChange={(e) => setNewPin({ ...newPin, title: e.target.value })} />
                                    <label>Description</label>
                                    <textarea onChange={(e) => setNewPin({ ...newPin, description: e.target.value })} />
                                    <button type="submit">Add Pin</button>
                                </form>
                            </div>
                        </Popup>
                    )}
                </Map>
            </div>
        </>
    );
}

export default MapComponent;
