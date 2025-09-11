import { useEffect, useState } from "react";
import { Container, Box, Typography, CircularProgress, Button } from "@mui/material";
import { MatchCardPair } from "../../components/match-card-pair/MatchCardPair";
import type { MatchCardPairProps } from "../../components/match-card-pair/MatchCardPair";
import { getMatches } from "../../api/MatchesService";
import { calculateAge } from "../../utils/dateUtils";

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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await getMatches(page - 1, limit, false);
        setTotal(res.content?.total || 0);

        const formattedMatches = (res.content?.data || []).map((match): MatchCardPairProps => ({
          user1: {
            id: match.user1_id,
            name: match.user1_name,
            birthdate: calculateAge(match.user1_birthdate).toString(),
            description: match.user1_description || "",
            photos: match.user1_photos || [],
            gender: ""
          },
          user2: {
            id: match.user2_id,
            name: match.user2_name,
            birthdate: calculateAge(match.user2_birthdate).toString(),
            description: match.user2_description || "",
            photos: match.user2_photos || [],
            gender: ""
          },
          type_liked_1: mapReaction(match.user1_reaction as "LIKE" | "LOVE" | "DISLIKE" | null),
          type_liked_2: mapReaction(match.user2_reaction as "LIKE" | "LOVE" | "DISLIKE" | null),
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
  }, [page, limit]);

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
