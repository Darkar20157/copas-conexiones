import React, { useEffect, useState } from "react";
import { Box, Button, Container, Modal, Typography, CircularProgress } from "@mui/material";
import { getRoulettes } from "../../api/RouletteService";

type Option = { id: number; name: string; description: string };

export const Roulette: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<Option | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getRoulettes(0, 50);
        setOptions(res?.content?.data ?? []);
      } catch (err) {
        console.error("Error cargando opciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const COLORS = [
    "#e74c3c",
    "#3498db",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
    "#e67e22",
    "#1abc9c",
    "#f39c12",
  ];

  const generateGradient = (n: number) => {
    if (n === 0) return "transparent";
    const angle = 360 / n;
    const stops = options.map((_, i) => {
      const start = i * angle;
      const end = (i + 1) * angle;
      const color = COLORS[i % COLORS.length];
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  };

  const spinRoulette = () => {
    if (spinning || options.length === 0) return;

    const randomIndex = Math.floor(Math.random() * options.length);
    const anglePerOption = 360 / options.length;
    const stopAngle = 360 - randomIndex * anglePerOption - anglePerOption / 2;
    const extraTurns = 360 * (5 + Math.floor(Math.random() * 3));
    const newRotation = rotation + extraTurns + stopAngle;

    setSpinning(true);
    setRotation(newRotation);

    setTimeout(() => {
      setSelected(options[randomIndex]);
      setOpen(true);
      setSpinning(false);
    }, 4500);
  };

  const size = 400;
  const radius = size / 2;

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "80vh",
        color: "white",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 6 }}>
          <CircularProgress sx={{ color: "#e91e63" }} />
          <Typography>Cargando opciones...</Typography>
        </Box>
      ) : options.length === 0 ? (
        <Typography sx={{ mt: 6 }}>No hay opciones en la ruleta</Typography>
      ) : (
        <>
          {/* Puntero fijo */}
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderBottom: "30px solid #fff",
              position: "absolute",
              top: `calc(51.5% - ${radius + 20}px)`,
              transform: "rotate(180deg)",
              zIndex: 10,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
            }}
          />

          {/* Ruleta */}
          <Box
            sx={{
              position: "relative",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "6px solid #fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4.5s cubic-bezier(0.25,1,0.5,1)" : "none",
              background: generateGradient(options.length),
              overflow: "hidden",
            }}
          >
            {/* Textos corregidos */}
            {options.map((opt, i) => {
              const anglePerOption = 360 / options.length;
              // Ángulo del centro de la porción (empezando desde la parte superior)
              const centerAngle = (i * anglePerOption) + (anglePerOption / 2) - 90;
              
              // Convertir a radianes para cálculos
              const radians = (centerAngle * Math.PI) / 180;
              
              // Posición del texto (más cerca del borde para mejor legibilidad)
              const textRadius = radius * 0.75;
              const x = radius + Math.cos(radians) * textRadius;
              const y = radius + Math.sin(radians) * textRadius;
              
              // Calcular rotación del texto para que siga la orientación de la porción
              let textRotation = centerAngle + 90;
              
              // Si el texto quedaría boca abajo, rotarlo 180° para que sea legible
              if (textRotation > 90 && textRotation < 270) {
                textRotation += 180;
              }

              return (
                <Typography
                  key={opt.id}
                  sx={{
                    position: "absolute",
                    top: y,
                    left: x,
                    transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                    fontSize: options.length > 8 ? "0.7rem" : "0.9rem",
                    fontWeight: "bold",
                    color: "#fff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    maxWidth: `${(2 * Math.PI * textRadius) / options.length - 10}px`,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {opt.name}
                </Typography>
              );
            })}
          </Box>

          {/* Botón abajo */}
          <Button
            onClick={spinRoulette}
            variant="contained"
            disabled={spinning}
            sx={{
              mt: 6,
              px: 6,
              py: 1.4,
              borderRadius: "9999px",
              textTransform: "none",
              background: "linear-gradient(90deg, #e91e63, #9c27b0)",
              fontWeight: "bold",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            🎡 Girar
          </Button>
        </>
      )}

      {/* Modal de resultado */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#222",
            border: "2px solid #fff",
            borderRadius: 3,
            p: 4,
            width: 360,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#e91e63" }}>
            🎉 Ganador 🎉
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            {selected?.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {selected?.description}
          </Typography>

          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            sx={{ mt: 3, background: "linear-gradient(90deg, #e91e63, #9c27b0)" }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};