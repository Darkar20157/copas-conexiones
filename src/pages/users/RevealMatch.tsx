import {
    Avatar,
    Container,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { getUserMatches } from "../../api/MatchesService";
import type { RevealMatch } from "../../interfaces/RevealMatch";
import { calculateAge } from "../../utils/utils";

const API_URL = import.meta.env.VITE_API_URL;

export const RevealMatches = () => {
    const [matches, setMatches] = useState<RevealMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<HTMLDivElement | null>(null);

    const fetchMatches = useCallback(
        async (pageToLoad: number) => {
            try {
                const userId = Number(localStorage.getItem("userId"));
                if (isNaN(userId)) throw new Error("User ID not found in localStorage");

                const res = await getUserMatches(userId, pageToLoad, 10);
                const newMatches = res.content?.data ?? [];

                if (newMatches.length === 0) {
                    setHasMore(false);
                } else {
                    setMatches((prev) => [...prev, ...newMatches]);
                }
            } catch (err) {
                console.error("Error cargando matches", err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchMatches(page);
    }, [page, fetchMatches]);

    // IntersectionObserver para lazy load
    useEffect(() => {
        if (!hasMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasMore]);

    return (
        <Container maxWidth="sm" sx={{ py: 2, minHeight: "100vh" }}>
            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: "16px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
            >
                {matches.length === 0 && !loading ? (
                    <Typography align="center" sx={{ p: 2 }}>
                        No tienes matches aún
                    </Typography>
                ) : (
                    matches.map((match, i) => (
                        <React.Fragment key={match.match_id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar
                                        alt={match.match_name}
                                        src={`${API_URL}${match.match_photos?.[0]}`}
                                        sx={{
                                            filter: !match.view_admin ? "blur(6px)" : "none",
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography
                                            className="font-semibold text-foreground"
                                            sx={{
                                                filter: !match.view_admin ? "blur(4px)" : "none",
                                                color: "white"
                                            }}
                                        >
                                            {match.match_name},{" "}
                                            {match.birthdate ? calculateAge(match.birthdate) : ""}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className="text-primary font-medium"
                                            sx={{
                                                marginTop: 1,
                                                opacity: 0.9,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                wordBreak: "break-word",
                                                filter: !match.view_admin ? "blur(4px)" : "none",
                                                color: "white"
                                            }}
                                        >
                                            {match.description ?? "Descripción oculta"}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {i < matches.length - 1 && (
                                <Divider variant="inset" component="li" />
                            )}
                        </React.Fragment>
                    ))
                )}
            </List>

            {/* Loader / trigger para IntersectionObserver */}
            {loading && (
                <Typography align="center" sx={{ p: 2 }}>
                    Cargando...
                </Typography>
            )}
            <div ref={observerRef} style={{ height: "20px" }} />
        </Container>
    );
};
