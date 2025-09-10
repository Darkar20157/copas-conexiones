// components/MatchAnimation.tsx
import { useEffect } from "react";
import Lottie from "lottie-react";
import { Box } from "@mui/material";
import animationData from "../../../assets/animations/match.json";
import matchSound from "../../../assets/sounds/heart.mp3";

interface MatchAnimationProps {
  onClose: () => void;
}

export const MatchAnimation = ({ onClose }: MatchAnimationProps) => {
  useEffect(() => {
    const audio = new Audio(matchSound);
    audio.volume = 0.2;
    audio.play().catch((error) => console.log("Error playing audio:", error));
    const timer = setTimeout(() => {
      onClose(); // ocultamos después de 3 seg
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <Lottie animationData={animationData} loop={false} style={{ width: 300, height: 300 }} />
    </Box>
  );
};
