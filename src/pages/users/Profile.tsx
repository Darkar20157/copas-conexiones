"use users"

import { useEffect, useState } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import { Collage } from "../../components/collage/Collage";
import { Form } from "../../components/form/Form";
import axios from "axios";

// 🔹 Define el tipo de usuario (según los campos de tu API)
interface UserProfile {
  id: number;
  state: string;
  name: string;
  age: number;
  description: string;
  phone: string;
  photos?: string[]; // si tienes imágenes, agrega este campo
}

export const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = JSON.parse(localStorage.getItem("userId") || '');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/users/${userId}`);
        if (res.status !== 200) {
          throw new Error("Error al obtener usuario");
        }
        const data: UserProfile = await res.data;
        setUserProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
      {/* Si tu API devuelve fotos, pásalas, si no, puedes omitir */}
      <Collage photos={userProfile.photos || []} />

      {/* Aquí puedes pasar datos del usuario al formulario si lo requieres */}
      <Form user={userProfile} />
    </Container>
  );
};
