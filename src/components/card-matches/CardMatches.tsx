"use client"

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CardImageCarousel } from "./CardImageCarousel";
import { CardIndicators } from "./CardIndicators";
import { CardContentInfo } from "./CardContentInfo";
import { CardActionButtons } from "./CardActionButtons";
import type { ICardMatches } from "./cardMatches.interfaces";

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

export const CardMatches: React.FC<ICardMatches> = ({
  user,
  type,
  width = 315,
  height = 450,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  setOpenModal,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const controls = useAnimation()

  // Reset animation and image index when user changes
  useEffect(() => {
    setCurrentImageIndex(0)
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 })
  }, [user, controls]) // Cambiado de user?.id a user para detectar cualquier cambio en el objeto usuario

  // 🔹 Swipe handlers
  const swipeRight = () => {
    controls
      .start({
        x: 500,
        rotate: 20,
        opacity: 0,
        transition: { duration: 0.4 },
      })
      .then(() => {
        if (onSwipeRight) {
          onSwipeRight(user?.id || 0);
        }
      });
  }

  const swipeLeft = () => {
    controls
      .start({
        x: -500,
        rotate: -20,
        opacity: 0,
        transition: { duration: 0.4 },
      })
      .then(() => {
        if (onSwipeLeft) {
          onSwipeLeft(user?.id || 0);
        }
      });
  }

  const swipeUp = () => {
    controls
      .start({
        y: -500,
        rotate: 0,
        opacity: 0,
        transition: { duration: 0.4 },
      })
      .then(() => {
        if (onSuperLike) {
          onSuperLike(user?.id || 0);
        }
      });
  }

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

  // 🔹 Drag / Touch events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    const threshold = 100

    if (Math.abs(dragOffset.x) > threshold) {
      const dragOffsetX = dragOffset.x;
      if (dragOffsetX > 0) {
        swipeRight();
      } else {
        swipeLeft();
      }
    }

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => handleMouseUp()

  return (
    <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
      <MotionCard
        ref={cardRef}
        $width={width}
        $height={height}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_e, info) => {
          if (info.offset.x > 100) swipeRight()
          else if (info.offset.x < -100) swipeLeft()
        }}
        animate={controls}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
          setOpenModal={setOpenModal}
        />
      </MotionCard>

      {/* 🔹 Botones de acción */}
      {/* 🔹 Botones de acción dinámicos */}
      {!type && (
        <CardActionButtons
          onReject={swipeLeft}
          onLike={swipeRight}
          onSuperLike={swipeUp}
        />
      )}

      {type === "no_me_gusta" && (
        <CardActionButtons
          onReject={swipeLeft}
          onLike={undefined}
          onSuperLike={undefined}
        />
      )}

      {type === "me_gusta" && (
        <CardActionButtons
          onReject={undefined}
          onLike={swipeRight}
          onSuperLike={undefined}
        />
      )}

      {type === "me_encanta" && (
        <CardActionButtons
          onReject={undefined}
          onLike={undefined}
          onSuperLike={swipeUp}
        />
      )}
    </Box>
  )
}
