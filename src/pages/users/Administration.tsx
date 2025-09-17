import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  DialogActions,
  Dialog,
  DialogContent,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MatchCardPair } from "../../components/match-card-pair/MatchCardPair";
import type { MatchCardPairProps } from "../../components/match-card-pair/MatchCardPair";
import { getMatches, updateMatchView } from "../../api/MatchesService";
import type { ApiResponse } from "../../interfaces/ApiResponse";
import { CardModalDetails } from "../../components/card-matches/CardModalDetails";
import type { IUserProfile } from "../../components/card-matches/cardMatches.interfaces";
import type { User } from "../../interfaces/User";

const mapReaction = (reaction: "LIKE" | "LOVE" | "DISLIKE" | null) => {
  switch (reaction) {
    case "LIKE":
      return "me_gusta";
    case "LOVE":
      return "me_encanta";
    case "DISLIKE":
      return "no_me_gusta";
    default:
      return null;
  }
};

export const Administration = () => {
  //Listar matches
  const [matches, setMatches] = useState<MatchCardPairProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<(User | null)[]>([]);

  //Paginar los usuarios
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // estado para filtro
  const [filter, setFilter] = useState<"all" | "seen" | "not_seen">("all");

  //Modal
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await getMatches(page - 1, limit, undefined);
        setTotal(res.content?.total || 0);
        const formattedMatches = (res.content?.data || []).map(
          (match): MatchCardPairProps => ({
            id: match.id,
            view_admin: match.view_admin,
            user1: {
              id: match.user1_id,
              name: match.user1_name,
              birthdate: match.user1_birthdate.toString(),
              description: match.user1_description || "",
              photos: match.user1_photos || [],
              gender: match.user1_gender,
            },
            user2: {
              id: match.user2_id,
              name: match.user2_name,
              birthdate: match.user2_birthdate.toString(),
              description: match.user2_description || "",
              photos: match.user2_photos || [],
              gender: match.user2_gender,
            },
            type_liked_1: mapReaction(
              match.user1_reaction as "LIKE" | "LOVE" | "DISLIKE" | null
            ),
            type_liked_2: mapReaction(
              match.user2_reaction as "LIKE" | "LOVE" | "DISLIKE" | null
            ),
          })
        );

        setMatches(formattedMatches);
      } catch (err) {
        const error = err as ApiResponse<null>;
        if (error.status === 400) {
          setError(error.details || "Error desconocido");
        } else {
          setError(error.message || "Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  const toggleSeen = async (matchId: number, currentValue: boolean) => {
    try {
      await updateMatchView(matchId, !currentValue);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, view_admin: !currentValue } : m
        )
      );
    } catch (err) {
      console.error("Error actualizando view_admin", err);
    }
  };

  const handleOpenModal = (user1: IUserProfile, user2: IUserProfile) => {
    const user1Final: User = { ...user1, state: "", phone: "", birthdate: new Date(user1.birthdate), gender: user1.gender };
    const user2Final: User = { ...user2, state: "", phone: "", birthdate: new Date(user2.birthdate), gender: user2.gender };
    setCurrentUser([user1Final, user2Final]);
    setOpenModal(true);
  };

  // aplicar filtro
  const filteredMatches = matches.filter((m) => {
    if (filter === "seen") return m.view_admin;
    if (filter === "not_seen") return !m.view_admin;
    return true; // "all"
  });

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
        Administración de Matches
      </Typography>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={filter === "seen" ? "contained" : "outlined"}
          startIcon={<VisibilityIcon />}
          onClick={() => setFilter("seen")}
          sx={{ color: "white" }}
        >
          Vistos
        </Button>

        <Button
          variant={filter === "not_seen" ? "contained" : "outlined"}
          startIcon={<VisibilityOffIcon />}
          onClick={() => setFilter("not_seen")}
          sx={{ color: "white" }}
        >
          No Vistos
        </Button>

        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          onClick={() => setFilter("all")}
          sx={{ color: "white" }}
        >
          Todos
        </Button>
      </Box>

      {filteredMatches.length === 0 && (
        <Typography sx={{ color: "white" }}>
          No hay matches disponibles
        </Typography>
      )}

      {filteredMatches.map((match, index) => (
        <Card
          key={index}
          sx={{
            mb: 4,
            background: `
              linear-gradient(
                135deg, 
                var(--burgundy-500), 
                var(--purple-600), 
                var(--wine-500)
              )
            `,
            color: "white",
          }}
        >
          <CardContent>
            <MatchCardPair {...match} />
          </CardContent>
          <CardActions sx={{ justifyContent: "center", marginTop: 2 }}>
            <Button
              variant="contained"
              color={"primary"}
              onClick={() => handleOpenModal(match.user1, match.user2)}
            >
              Detalles
            </Button>
            <Button
              variant="contained"
              color={match.view_admin ? "success" : "error"}
              startIcon={
                match.view_admin ? <VisibilityIcon /> : <VisibilityOffIcon />
              }
              onClick={() => toggleSeen(match.id, match.view_admin)}
            >
              {match.view_admin ? "Visto" : "No visto"}
            </Button>
          </CardActions>
        </Card>
      ))}

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Anterior
          </Button>

          <Typography sx={{ minWidth: 100, textAlign: "center" }}>
            Página {page} de {totalPages}
          </Typography>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Siguiente
          </Button>
        </Box>
      )}

      {openModal && (
        <Dialog
          fullScreen={fullScreen}
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="responsive-dialog-title"
          slots={{ paper: Paper }}
          scroll="paper" // 👈 habilita scroll en el contenido
          slotProps={{
            paper: {
              sx: {
                background: "linear-gradient(135deg, #4b002d, #3b005e)",
                color: "var(--color-card-foreground)",
                borderRadius: "20px",
                boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
                p: 2,
                transition: "all 0.3s ease-in-out",
                maxHeight: "70vh", // o "80vh"
                overflowY: "auto",
              },
            },
          }}
        >
          <DialogContent dividers>
            {currentUser[0] && (
              <Box sx={{marginBottom: 2, marginTop: 2}}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }} gutterBottom>
                  Detalles del Match Usuario 1
                </Typography>
                <CardModalDetails user={currentUser[0]} />
              </Box>
            )}
            {currentUser[1] && (
              <Box sx={{marginBottom: 2, marginTop: 2}}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }} gutterBottom>
                  Detalles del Match Usuario 2
                </Typography>
                <CardModalDetails user={currentUser[1]} />
              </Box>
            )}
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
