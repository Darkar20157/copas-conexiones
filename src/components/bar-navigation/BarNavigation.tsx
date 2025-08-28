"use client"

import * as React from "react"
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PersonIcon from "@mui/icons-material/Person"
import { useNavigate, useLocation } from "react-router-dom"

export const BarNavigation = () => {
  const [value, setValue] = React.useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  // Sincroniza ruta con el valor actual
  React.useEffect(() => {
    if (location.pathname.startsWith("/matches")) setValue(0)
    else if (location.pathname.startsWith("/perfil")) setValue(1)
    else if (location.pathname.startsWith("/eventos")) setValue(2)
  }, [location.pathname])

  const handleNavigation = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (newValue === 0) navigate("/matches")
    if (newValue === 1) navigate("/perfil")
    if (newValue === 2) navigate("/eventos")
  }

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: "16px 16px 0 0", // esquinas redondeadas
        bgcolor: "#1E1E2F", // fondo oscuro
      }}
      elevation={8}
    >
      <BottomNavigation value={value} onChange={handleNavigation} showLabels sx={{ bgcolor: "transparent" }}>
        <BottomNavigationAction
          label="Matches"
          icon={<FavoriteIcon />}
          sx={{
            color: "#bbb",
            "&.Mui-selected": { color: "#ff4081" }, // activo
          }}
          onClick={() => navigate("/matches")}
        />
        <BottomNavigationAction
          label="Perfil"
          icon={<PersonIcon />}
          sx={{
            color: "#bbb",
            "&.Mui-selected": { color: "#ff4081" },
          }}
          onClick={() => navigate("/perfil")}
        />
      </BottomNavigation>
    </Paper>
  )
}
