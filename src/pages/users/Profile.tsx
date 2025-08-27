"use client"

import { useState } from "react";
import { Container } from "@mui/material";
import { Collage } from "../../components/collage/Collage";
import { Form } from "../../components/form/Form";

const mockUsers = {
    id: "1",
    name: "Danny Alejandro",
    age: 23,
    photos: [
        "/assets/img/yo1.jpeg",
        "/assets/img/yo2.jpeg",
        "/assets/img/yo1.jpeg",
        "/assets/img/yo2.jpeg",
        "/assets/img/yo2.jpeg",
    ],
    description:
        "Amante de los viajes y la fotografía. Me encanta descubrir nuevos lugares y culturas. Siempre listo para una nueva aventura.",
    hobbies: ["Fotografía", "Viajes", "Yoga", "Cocina", "Senderismo"],
}

export const Profile = () => {
    const [userProfile, setUserProfile] = useState(mockUsers);
    return (
        <Container maxWidth="sm" sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            gap: 4
        }}>
            <Collage photos={userProfile.photos} />
            <Form />
        </Container>
    );
}