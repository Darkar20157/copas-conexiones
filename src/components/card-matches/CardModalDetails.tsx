import { Box } from "@mui/material"
import { CardImageCarousel } from "./CardImageCarousel"
import type { User } from "../../interfaces/User"
import { useState } from "react";
import { CardContentDetail } from "./CardContentDetail";

export const CardModalDetails = ({ user }: { user: User }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 🔹 Carousel navigation
    const nextImage = () => {
        if (!user?.photos?.length) return
        setCurrentImageIndex((prev) =>
            prev === (user?.photos?.length ?? 0) - 1 ? 0 : prev + 1
        )
    }

    const prevImage = () => {
        if (!user?.photos?.length) return
        setCurrentImageIndex((prev) =>
            prev === 0 ? (user?.photos?.length ?? 0) - 1 : prev - 1
        )
    }

    return (
        <Box>
            {/* 🔹 Carousel */}
            <CardImageCarousel
                photos={user.photos}
                currentImageIndex={currentImageIndex}
                nextImage={nextImage}
                prevImage={prevImage}
            />
            <CardContentDetail {...{...user, birthdate: user.birthdate.toString()}} />
        </Box>
    )
}