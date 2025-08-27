"use client"

import { useState } from "react"
import { Box, Container } from "@mui/material"
import { CardMatches } from "../../components/card-matches/CardMatches";

// Datos de ejemplo
const mockUsers = [
    {
        id: "1",
        name: "Danny Alejandro",
        age: 23,
        photos: [
            "/assets/img/yo1.jpeg",
            "/assets/img/yo2.jpeg",
        ],
        description:
            "Amante de los viajes y la fotografía. Me encanta descubrir nuevos lugares y culturas. Siempre lista para una nueva aventura.",
        hobbies: ["Fotografía", "Viajes", "Yoga", "Cocina", "Senderismo"],
    },
    {
        id: "2",
        name: "Carlos",
        age: 28,
        photos: [
            "https://imgs.search.brave.com/AFGxrmZWhyQ-Mulc7_K2Q607ZJi5gKtX5cRnUj1i2OA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE3/ODkwNTY2Ny9waG90/by9hdXN0aW4tdGV4/YXMtY2FybG9zLXNh/aW56LW9mLXNwYWlu/LWFuZC1mZXJyYXJp/LWxvb2tzLW9uLWlu/LXRoZS1wYWRkb2Nr/LWR1cmluZy1wcmV2/aWV3cy1haGVhZC5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/Wm54c041NlF5Sjhq/ejhwbnk5RU5uUmVt/LUt6a0dYb2lCSkRh/R1JvM1Jqbz0",
            "https://imgs.search.brave.com/PCzwvFMN0lLgVjMVZSkU9GG80BB58-qCvneMb_Wx1sA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE3/MzA3MTMwOS9waG90/by9zaW5nYXBvcmUt/c2luZ2Fwb3JlLWNh/cmxvcy1zYWluei1v/Zi1zcGFpbi1hbmQt/ZmVycmFyaS13YWxr/cy1pbi10aGUtcGFk/ZG9jay1kdXJpbmct/cHJldmlld3MuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPW5E/WXFQSmd4Y1BVcEx2/VWJjQmRSZHF4SnlC/dTFSdkJFWF9yVmZL/aHAzSTQ9",
        ],
        description:
            "Músico y chef aficionado. Creo que la vida es mejor con buena música y mejor comida. ¿Te animas a cocinar juntos?",
        hobbies: ["Música", "Cocina", "Deportes", "Lectura"],
    },
    {
        id: "3",
        name: "Sofia",
        age: 23,
        photos: [
            "https://imgs.search.brave.com/eKsBr6OnJh4faYgFBR6tD95P49LY0T2WdUrAK-AilhA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE4/MTg5NzcxMy9waG90/by9vdmllZG8tc3Bh/aW4tcHJpbmNlc3Mt/c29maWEtb2Ytc3Bh/aW4tYXJyaXZlcy10/by10aGUtY2FtcG9h/bW9yLXRoZWF0cmUt/YWhlYWQtb2YtdGhl/LXByaW5jZXNhLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1u/dFduTzhubXdCWmM4/aEs1RDBiYVp5S01x/cld3cmNoVzIzWldF/NmQ3eGxNPQ",
            "https://imgs.search.brave.com/Zoq9PpGjgJog0ovPNT73IK4ddPEFOYzX3hD_-b1ZTkI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE4/OTgwMzYwMC9waG90/by9tYWRyaWQtc3Bh/aW4tcHJpbmNlc3Mt/c29mJUMzJUFEYS1v/Zi1zcGFpbi1hdHRl/bmRzLXRoZS1hd2Fy/ZHMtY2VyZW1vbnkt/Zm9yLXRoZS1waG90/b2dyYXBoeS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9Nnlj/ajFfc3NzZ0duWk5x/SExURXVjNjZ5T2o3/TVppaml1N3VaVkVL/cWNxND0",
        ],
        description:
            "Artista y escritora. Encuentro inspiración en los pequeños momentos de la vida. Busco a alguien que aprecie el arte y las conversaciones profundas.",
        hobbies: ["Arte", "Escritura", "Café", "Museos", "Literatura"],
    },
]

export const Matches = () => {
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [users, setUsers] = useState(mockUsers);

    const [finished, setFinished] = useState(false);

    const handleSwipeLeft = (userId: string) => {
        console.log(`Rechazado userId: ${userId}`);
        // Eliminar el usuario actual del array
        const updatedUsers = [...users];
        updatedUsers.splice(currentUserIndex, 1);
        
        if (updatedUsers.length === 0) {
            setFinished(true);
            return;
        }
        
        setUsers(updatedUsers);
        // No incrementamos currentUserIndex porque ahora el siguiente usuario estará en la misma posición
    }

    const handleSwipeRight = (userId: string) => {
        console.log(`Le gusta userId: ${userId}`);
        // Eliminar el usuario actual del array
        const updatedUsers = [...users];
        updatedUsers.splice(currentUserIndex, 1);
        
        if (updatedUsers.length === 0) {
            setFinished(true);
            return;
        }
        
        setUsers(updatedUsers);
    }

    const handleSuperLike = (userId: string) => {
        console.log(`Super like userId: ${userId}`);
        // Eliminar el usuario actual del array
        const updatedUsers = [...users];
        updatedUsers.splice(currentUserIndex, 1);
        
        if (updatedUsers.length === 0) {
            setFinished(true);
            return;
        }
        
        setUsers(updatedUsers);
    }

    // Ya no necesitamos la función nextUser porque estamos eliminando usuarios del array


    const currentUser = users[currentUserIndex];

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
                {finished ? (
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
                                setUsers(mockUsers); // Restaurar los usuarios originales
                                setCurrentUserIndex(0);
                                setFinished(false);
                            }}
                        >
                            Volver a empezar
                        </Box>
                    </Box>
                ) : currentUser ? (
                    <>
                        {/* Añadido key para forzar recreación del componente */}
                        <CardMatches
                            key={currentUser.id}
                            user={currentUser}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                            onSuperLike={handleSuperLike}
                        />
                    </>
                ) : null}
            </Box>
        </Container>
    )
}
