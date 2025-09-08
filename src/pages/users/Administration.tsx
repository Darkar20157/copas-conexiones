import { useEffect, useState } from "react";
import { Container, Box, Typography, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { MatchCardPair } from "../../components/match-card-pair/MatchCardPair";
import type { MatchCardPairProps } from "../../components/match-card-pair/MatchCardPair";

const API_URL = import.meta.env.VITE_API_URL;

interface MatchFromAPI {
  id: string;
  create_date: string;
  update_date: string;
  user_match_1: string;
  user_match_2: string;
  date_match: string | null;
  type_liked_1: "no_me_gusta" | "me_gusta" | "me_encanta" | null;
  type_liked_2: "no_me_gusta" | "me_gusta" | "me_encanta" | null;
  user1_name: string;
  user2_name: string;
  user1_photos?: string[];
  user2_photos?: string[];
  user1_age?: number;
  user2_age?: number;
  user1_description?: string;
  user2_description?: string;
}

export const Administration = () => {
  const [matches, setMatches] = useState<MatchCardPairProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const userId = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("userId") || "null")
    : null;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/matches`, {
          params: { limit, offset: (page - 1) * limit },
        });

        setTotal(res.data.length + (page - 1) * limit);

        // 🔹 Aquí mapear correctamente type_liked_1 y type_liked_2
        const formattedMatches: MatchCardPairProps[] = res.data.map((match: MatchFromAPI) => ({
          user1: {
            id: match.user_match_1,
            name: match.user1_name,
            age: match.user1_age || 0,
            description: match.user1_description || "",
            photos: match.user1_photos || [],
          },
          user2: {
            id: match.user_match_2,
            name: match.user2_name,
            age: match.user2_age || 0,
            description: match.user2_description || "",
            photos: match.user2_photos || [],
          },
          type_liked_1: match.type_liked_1,
          type_liked_2: match.type_liked_2,
        }));

        setMatches(formattedMatches);
      } catch (err: any) {
        console.error("❌ Error cargando matches:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [page, limit, userId]);

  const totalPages = Math.ceil(total / limit);

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
      <Typography variant="h5" gutterBottom>
        Administración de Matches
      </Typography>

      {matches.length === 0 && <Typography>No hay matches disponibles</Typography>}

      {matches.map((match, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <MatchCardPair {...match} />
        </Box>
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
      sx={{
        background: page === 1 ? "grey" : "linear-gradient(90deg, #7b5cff, #42c767)",
        color: "white",
        fontWeight: "bold",
        "&:hover": {
          background: page === 1 ? "grey" : "linear-gradient(90deg, #42c767, #7b5cff)",
        },
      }}
    >
      Anterior
    </Button>

    <Typography sx={{ minWidth: 100, textAlign: "center" }}>
      Página {page} de {totalPages}
    </Typography>

    <Button
      disabled={page === totalPages}
      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      sx={{
        background: page === totalPages ? "grey" : "linear-gradient(90deg, #7b5cff, #42c767)",
        color: "white",
        fontWeight: "bold",
        "&:hover": {
          background: page === totalPages ? "grey" : "linear-gradient(90deg, #42c767, #7b5cff)",
        },
      }}
    >
      Siguiente
    </Button>
  </Box>
)}
    </Container>
  );
};
