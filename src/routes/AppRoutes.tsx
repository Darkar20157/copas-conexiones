import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthStepper } from "../pages/registration/AuthStepper";
import { Matches } from "../pages/users/Matches";
import { Profile } from "../pages/users/Profile";
import { BarNavigation } from "../components/bar-navigation/BarNavigation";
import { Navbar } from "../components/navbar/Navbar";

export const AppRoutes: React.FC = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    return (
        <BrowserRouter>
        {currentPath !== '/perfil' && currentPath !== '/auth' && <Navbar />}
            <main className="min-h-screen bg-gradient-to-b from-burgundy-900 via-purple-900 to-wine-900 text-white
                       pt-[30px] pb-[30px]">
                <Routes>
                    <Route path="/" element={<Navigate to="/auth" />} />
                    <Route path="/auth" element={<AuthStepper />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/perfil" element={<Profile />} />
                </Routes>
            </main>
            {currentPath !== '/auth' && <BarNavigation setCurrentPath={setCurrentPath} />}
        </BrowserRouter>
    );
};
