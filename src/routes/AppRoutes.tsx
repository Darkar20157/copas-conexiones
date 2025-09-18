import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthStepper } from "../pages/registration/AuthStepper";
import { Matches } from "../pages/users/Matches";
import { Profile } from "../pages/users/Profile";
import { BarNavigation } from "../components/bar-navigation/BarNavigation";
import { Navbar } from "../components/navbar/Navbar";
import { Administration } from "../pages/users/Administration";
import { RevealMatches } from "../pages/users/RevealMatch";
import { Roulette } from "../pages/users/Roulette";
import { ConfigureRoulette } from "../pages/users/ConfigureRoulette";

export const AppRoutes: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {currentPath !== "/perfil" && currentPath !== "/auth" && <Navbar />}
            <main className="min-h-screen bg-gradient-to-b from-burgundy-900 via-purple-900 to-wine-900 text-white
                       pt-[30px] pb-[30px]">
                <Routes>
                    <Route path="/" element={<Navigate to="/auth" />} />
                    <Route path="/auth" element={<AuthStepper />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/reveal-matches" element={<RevealMatches />} />
                    <Route path="/admin" element={<Administration />} />
                    <Route path="/roulette" element={<Roulette />} />
                    <Route path="/roulette/configure" element={<ConfigureRoulette />} />
                    
                </Routes>
            </main>
            {currentPath !== "/auth" && <BarNavigation />}
        </>
    );
};
