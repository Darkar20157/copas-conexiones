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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MatchCardPair } from "../../components/match-card-pair/MatchCardPair";
import type { MatchCardPairProps } from "../../components/match-card-pair/MatchCardPair";
import { getMatches, updateMatchView } from "../../api/MatchesService";
import { calculateAge } from "../../utils/dateUtils";
import type { ApiResponse } from "../../interfaces/ApiResponse";

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
  const [matches, setMatches] = useState<MatchCardPairProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // estado para filtro
  const [filter, setFilter] = useState<"all" | "seen" | "not_seen">("all");

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
              birthdate: calculateAge(match.user1_birthdate).toString(),
              description: match.user1_description || "",
              photos: match.user1_photos || [],
              gender: "",
            },
            user2: {
              id: match.user2_id,
              name: match.user2_name,
              birthdate: calculateAge(match.user2_birthdate).toString(),
              description: match.user2_description || "",
              photos: match.user2_photos || [],
              gender: "",
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
          sx={{color: "white"}}
        >
        Vistos
        </Button>

        <Button
          variant={filter === "not_seen" ? "contained" : "outlined"}
          startIcon={<VisibilityOffIcon />}
          onClick={() => setFilter("not_seen")}
          sx={{color: "white"}}
        >
        No Vistos
        </Button>

        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          onClick={() => setFilter("all")}
          sx={{color: "white"}}
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
          <CardActions sx={{ justifyContent: "center" }}>
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
    </Container>
  );
};
