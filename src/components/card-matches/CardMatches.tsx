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
const StyledCard = styled(Card)(() => ({
  width: "100%",
  maxWidth: 400,
  height: 450,
  borderRadius: 20,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  cursor: "grab",
  transition: "transform 0.3s ease, opacity 0.3s ease",
  "&:active": { cursor: "grabbing" },
}))

const MotionCard = motion(StyledCard)

export const CardMatches: React.FC<ICardMatches> = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
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
      .then(() => onSwipeRight(user?.id || ""));
  }

  const swipeLeft = () => {
    controls
      .start({
        x: -500,
        rotate: -20,
        opacity: 0,
        transition: { duration: 0.4 },
      })
      .then(() => onSwipeLeft(user?.id || ""))
  }

  const swipeUp = () => {
    controls
      .start({
        y: -500,
        rotate: 0,
        opacity: 0,
        transition: { duration: 0.4 },
      })
      .then(() => onSuperLike(user?.id || ""))
  }

  // 🔹 Carousel navigation
  const nextImage = () => {
    if (!user?.photos?.length) return
    setCurrentImageIndex((prev) =>
      prev === user?.photos?.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!user?.photos?.length) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? user?.photos?.length - 1 : prev - 1
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
        <CardIndicators total={user.photos.length} current={currentImageIndex} />

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

      {/* 🔹 Botones de acción */}
      <CardActionButtons
        onReject={swipeLeft}
        onLike={swipeRight}
        onSuperLike={swipeUp}
      />
    </Box>
  )
}
