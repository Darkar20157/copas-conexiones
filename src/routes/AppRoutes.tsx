import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Matches } from "../pages/users/Matches";
import { Profile } from "../pages/users/Profile";
import { Events } from "../pages/users/Events";
import { BarNavigation } from "../components/bar-navigation/BarNavigation";
import { Navbar } from "../components/navbar/Navbar";

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/matches"></Navigate>}></Route>
                <Route path="/matches" element={<Matches/>}></Route>
                <Route path="/perfil" element={<Profile/>}></Route>
                <Route path="/eventos" element={<Events/>}></Route>
            </Routes>
            <BarNavigation/>
        </BrowserRouter>
        
    )
}