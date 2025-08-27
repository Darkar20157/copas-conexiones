"use client"

import { useState } from "react";

import TuneIcon from "@mui/icons-material/Tune";
import BrightnessMediumIcon from "@mui/icons-material/BrightnessMedium";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)  
    document.documentElement.classList.toggle("dark")
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="relative">
          {/* Forma curva del navbar */}
          <div
            className="bg-gradient-to-r from-burgundy-800/95 via-purple-800/95 to-wine-800/95 backdrop-blur-md"
            style={{
              clipPath: "ellipse(100% 100% at 50% 0%)",
              height: "100px",
              paddingBottom: "20px",
            }}
          >
            <div className="max-w-md mx-auto px-6 pt-4">
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={toggleDrawer}
                  className="p-2 text-white hover:bg-white/20 hover:text-pink-200 transition-colors rounded-md"
                  aria-label="Abrir menú"
                >
                  <TuneIcon />
                </button>

                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 transform rotate-45 flex items-center justify-center shadow-lg">
                    <FavoriteIcon width={20} className="text-white text-sm transform -rotate-45" />
                  </div>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-white hover:bg-white/20 hover:text-yellow-200 transition-colors rounded-md"
                  aria-label="Alternar modo oscuro"
                >
                  <BrightnessMediumIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={closeDrawer} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-burgundy-900 to-purple-900 border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="py-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Menú</h2>
            <button
              onClick={closeDrawer}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <a
              href="/matches"
              className="block text-white/80 hover:text-pink-200 transition-colors py-2 px-2 rounded-md hover:bg-white/10"
              onClick={closeDrawer}
            >
              Matches
            </a>
            <a
              href="/perfil"
              className="block text-white/80 hover:text-pink-200 transition-colors py-2 px-2 rounded-md hover:bg-white/10"
              onClick={closeDrawer}
            >
              Perfil
            </a>
            <a
              href="/eventos"
              className="block text-white/80 hover:text-pink-200 transition-colors py-2 px-2 rounded-md hover:bg-white/10"
              onClick={closeDrawer}
            >
              Eventos
            </a>
            <div className="border-t border-white/20 pt-4 mt-6">
              <a
                href="/configuracion"
                className="block text-white/80 hover:text-pink-200 transition-colors py-2 px-2 rounded-md hover:bg-white/10"
                onClick={closeDrawer}
              >
                Configuración
              </a>
              <a
                href="/ayuda"
                className="block text-white/80 hover:text-pink-200 transition-colors py-2 px-2 rounded-md hover:bg-white/10"
                onClick={closeDrawer}
              >
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}