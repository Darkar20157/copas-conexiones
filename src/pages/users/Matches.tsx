"use client"

import { useEffect, useState } from "react"
import { Box, Container } from "@mui/material"
import { CardMatches } from "../../components/card-matches/CardMatches"
import axios from "axios"

export const Matches = () => {
    const [users, setUsers] = useState<any[]>([])
    const [currentUserIndex, setCurrentUserIndex] = useState(0)
    const [offset, setOffset] = useState(0)
    const [finished, setFinished] = useState(false)
    const [loading, setLoading] = useState(false)
    const limit = 5

    // Cargar usuarios desde backend con axios
    const fetchUsers = async (newOffset: number) => {
        try {
            setLoading(true);
            const userId = JSON.parse(localStorage.getItem("userId") || "{}");
            const res = await axios.get(`http://localhost:3000/api/users`, {
                params: { userId, limit, offset: newOffset },
            })
            const data = res.data
            if (data.length === 0) {
                setFinished(true)
                return
            }
            setUsers(prev => [...prev, ...data]) // concatenar usuarios
        } catch (error) {
            console.error("Error cargando usuarios:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers(0) // cargar los primeros 5 al iniciar
    }, [])

    const handleUserSeen = (userId: string) => {
        // Quitar usuario actual
        const updatedUsers = [...users]
        updatedUsers.splice(currentUserIndex, 1)

        // Si ya no hay usuarios cargados → terminar
        if (updatedUsers.length === 0) {
            setFinished(true)
            return
        }

        setUsers(updatedUsers)

        // 🔑 Lazy load: cuando el usuario ya vio 4 de 5 → traer 5 nuevos
        if ((updatedUsers.length % limit) === (limit - 1)) {
            const nextOffset = offset + limit
            setOffset(nextOffset)
            fetchUsers(nextOffset)
        }
    }

    const handleSwipeLeft = (userId: string) => {
        handleUserSeen(userId)
    }

    const handleSwipeRight = (userId: string) => {
        console.log(`Le gusta userId: ${userId}`)
        handleUserSeen(userId)
    }

    const handleSuperLike = (userId: string) => {
        console.log(`Superlike a userId: ${userId}`)
        handleUserSeen(userId)
    }

    const currentUser = users[currentUserIndex]

    return (
        <Container maxWidth="sm" sx={{
            py: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "20vh"
        }}>
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
                ) : finished ? (
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
                                setUsers([])
                                setCurrentUserIndex(0)
                                setOffset(0)
                                setFinished(false)
                                fetchUsers(0)
                            }}
                        >
                            Volver a empezar
                        </Box>
                    </Box>
                ) : currentUser ? (
                    <CardMatches
                        key={currentUser.id}
                        user={currentUser}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        onSuperLike={handleSuperLike}
                    />
                ) : null}
            </Box>
        </Container>
    )
}
