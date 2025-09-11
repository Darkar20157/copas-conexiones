"use client"

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CardImageCarousel } from "./CardImageCarousel";
import { CardIndicators } from "./CardIndicators";
import { CardContentInfo } from "./CardContentInfo";
import type { ICardMatches } from "./cardMatches.interfaces";
import { CardActionButtons } from "./CardActionButtons";

// 🎨 Styled
const StyledCard = styled(Card)<{ $width?: number; $height?: number }>(
    ({ $width = 315, $height = 450 }) => ({
        width: $width,
        height: $height,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        cursor: "grab",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        "&:active": { cursor: "grabbing" },
    })
)

const MotionCard = motion(StyledCard)

export const CardMatchesAdmin: React.FC<ICardMatches> = ({
    user,
    type,
    width = 315,
    height = 450,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const cardRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    // Reset animation and image index when user changes
    useEffect(() => {
        setCurrentImageIndex(0)
        controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 })
    }, [user, controls]) // Cambiado de user?.id a user para detectar cualquier cambio en el objeto usuario


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
        <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <MotionCard
                ref={cardRef}
                $width={width}
                $height={height}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
            >
                {/* 🔹 Indicadores arriba */}
                <CardIndicators total={user.photos?.length ?? 0} current={currentImageIndex} />

                {/* 🔹 Carousel */}
                <CardImageCarousel
                    photos={user.photos}
                    currentImageIndex={currentImageIndex}
                    nextImage={nextImage}
                    prevImage={prevImage}
                />

                {/* 🔹 Info */}
                <CardContentInfo
                    {...user}
                />
            </MotionCard>
            <CardActionButtons type={type as "no_me_gusta" | "me_gusta" | "me_encanta"} />
        </Box>
    )
}
