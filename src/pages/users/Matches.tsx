// pages/Matches.tsx (o donde esté tu página)
"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Button, Container, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CardMatches } from "../../components/card-matches/CardMatches";
import axios from "axios";
import { getUserServiceAvaibleForMatch } from "../../api/UserService";
import type { User } from "../../interfaces/User";
import Paper from "@mui/material/Paper";
import { MatchAnimation } from "../../components/animations/match-animation/MatchAnimation";
import { CardModalDetails } from "../../components/card-matches/CardModalDetails";

const API_URL = import.meta.env.VITE_API_URL;

export const Matches = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);


  //Modal
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const limit = 5;

  // Obtener userId desde localStorage (seguro)
  const userId: number | null =
    typeof window !== "undefined"
      ? (() => {
        try {
          const raw = localStorage.getItem("userId");
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          // si guardaste como number o string, lo normalizamos a number
          return typeof parsed === "number" ? parsed : Number(parsed);
        } catch {
          return null;
        }
      })()
      : null;

  const fetchUsers = useCallback(
    async (newOffset = 0) => {
      if (!userId) {
        setFinished(true);
        return;
      }

      // evita llamadas concurrentes
      if (loading) return;

      try {
        setLoading(true);
        const res = await getUserServiceAvaibleForMatch(userId, limit, newOffset);
        const fetched = res.content ?? [];

        // Si no hay más perfiles, marcar finished
        if (!fetched.length) {
          // Si es la primer petición y no hay nada
          if (newOffset === 0 && users.length === 0) {
            setFinished(true);
          } else {
            setFinished(true);
          }
          return;
        }

        // Concatenamos nuevos usuarios (evitamos duplicados por id)
        setUsers((prev) => {
          const ids = new Set(prev.map((u) => u.id));
          const unique = fetched.filter((u) => !ids.has(u.id));
          return [...prev, ...unique];
        });

        setOffset(newOffset);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId, limit, loading, users.length]
  );

  useEffect(() => {
    // primera carga
    fetchUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Registrar interacción en backend
  const sendMatch = async (swipedUserId: number, swipeType: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/matches/react`, {
        senderId: userId,
        receiverId: swipedUserId,
        reactionType: swipeType,
      });
      if (res.data?.match) {
        setShowMatchAnimation(true);
      }
    } catch (error) {
      console.error("❌ Error registrando match:", error);
    }
  };

  // Cuando el usuario actual es visto (lo removemos y, si es necesario, solicitamos más)
  const handleUserSeen = (swipedUserId: number) => {
    // Removemos el usuario del array (si existe)
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== swipedUserId);

      // Si ya no hay usuarios, pedimos la siguiente página
      if (updated.length === 0 && !finished) {
        fetchUsers(offset + limit);
      } else {
        // Si quedan pocos usuarios, adelantamos la paginación para tener más
        if (updated.length <= 2 && !finished) {
          fetchUsers(offset + limit);
        }
      }

      // Si llegamos a 0 definitivamente, marcamos finished
      if (updated.length === 0 && finished) {
        setFinished(true);
      }

      return updated;
    });
  };

  // Acciones de swipe
  const handleSwipeLeft = (swipedUserId: number) => {
    sendMatch(swipedUserId, "DISLIKE");
    handleUserSeen(swipedUserId);
  };

  const handleSwipeRight = (swipedUserId: number) => {
    sendMatch(swipedUserId, "LIKE");
    handleUserSeen(swipedUserId);
  };

  const handleSuperLike = (swipedUserId: number) => {
    sendMatch(swipedUserId, "LOVE");
    handleUserSeen(swipedUserId);
  };

  const currentUser = users[0]; // siempre mostramos el primer elemento del array

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "20vh",
      }}
    >
      {showMatchAnimation && (
        <MatchAnimation onClose={() => setShowMatchAnimation(false)} />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20vh",
          flexDirection: "column",
        }}
      >
        {loading && users.length === 0 ? (
          <p style={{ color: "white" }}>Cargando usuarios...</p>
        ) : finished && users.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 3, color: "white" }}>
            <h2>¡No hay más perfiles disponibles!</h2>
            <p>Has visto todos los perfiles disponibles.</p>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "primary.main",
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={() => {
                setUsers([]);
                setOffset(0);
                setFinished(false);
                fetchUsers(0);
              }}
            >
              Volver a empezar
            </Box>
          </Box>
        ) : currentUser ? (
          <CardMatches
            key={currentUser.id}
            user={{ ...currentUser, birthdate: currentUser.birthdate.toString() }}
            onSwipeLeft={() => handleSwipeLeft(currentUser.id)}
            onSwipeRight={() => handleSwipeRight(currentUser.id)}
            onSuperLike={() => handleSuperLike(currentUser.id)}
            setOpenModal={setOpenModal}
          />
        ) : (
          <p style={{ color: "white" }}>No hay usuarios por mostrar</p>
        )}
      </Box>
      {openModal && (
        <Dialog
          fullScreen={fullScreen}
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="responsive-dialog-title"
          // 👇 Forzar a usar Paper y poder darle estilos
          slots={{ paper: Paper }}
          slotProps={{
            paper: {
              sx: {
                background: "linear-gradient(135deg, #4b002d, #3b005e)",
                color: "var(--color-card-foreground)",
                borderRadius: "20px", 
                boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
                p: 2,
                transition: "all 0.3s ease-in-out",
              },
            },
          }}
        >
          <DialogContent>
            {currentUser && <CardModalDetails user={currentUser} />}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff4081",
                borderRadius: 20,
                textTransform: "none",
                px: 3,
                "&:hover": { backgroundColor: "#f50057" },
              }}
              onClick={() => setOpenModal(false)}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};
export default Matches;
