import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import MapComponent from './components/MapInterface';
import Register from "./components/Register";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/map" element={<MapComponent />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
