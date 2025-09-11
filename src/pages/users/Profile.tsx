"use client";

import { useEffect, useState } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import { Collage } from "../../components/collage/Collage";
import { Form } from "../../components/form/Form";

import { getUserService } from "../../api/UserService"; // <-- Importa tu servicio
import type { ApiResponse } from "../../interfaces/ApiResponse";
import type { User } from "../../interfaces/User";

export const Profile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtén el userId desde localStorage
  const userId = JSON.parse(localStorage.getItem("userId") || "null");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res: ApiResponse<User> = await getUserService(userId);
        setUserProfile(res.content || null);
      } catch (err) {
        const error = err as ApiResponse<null>;

        if (error.status === 400) {
          alert(`${error.details}`);
        } else {
          alert(error.message || "Error inesperado en login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setError("Usuario no encontrado en localStorage");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <Typography>No se encontró el usuario</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Si tu API devuelve fotos */}
      <Collage photos={userProfile.photos || []} />

      {/* Pasamos el user al formulario */}
      <Form user={userProfile} />
    </Container>
  );
};
