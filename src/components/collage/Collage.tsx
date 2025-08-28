import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, ImageList, ImageListItem, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}

function getGridSize(index: number, total: number) {
  if (total === 1) return { cols: 4, rows: 2.5 };
  if (total === 2) return { cols: 2, rows: 2.5 };
  if (total === 3) {
    if (index === 0) return { cols: 4, rows: 2.5 };
    return { cols: 2, rows: 1.5 };
  }
  if (total === 4) return { cols: 2, rows: 1.5 };
  if (index % 5 === 0) return { cols: 2, rows: 1.5 };
  return { cols: 2, rows: 1.5 };
}

export const Collage: React.FC<{ photos: string[] }> = ({ photos: initialPhotos }) => {
  const [photos, setPhotos] = useState<string[]>(initialPhotos ?? []);

  const normalizePhotos = (photosFromDb: string[]) =>
    photosFromDb.map((p) => (p.startsWith("http") ? p : `http://localhost:3000${p}`));

  useEffect(() => {
    setPhotos(initialPhotos ? normalizePhotos(initialPhotos) : []);
  }, [initialPhotos]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 6) {
      alert("Máximo 6 fotos");
      // reset input
      event.currentTarget.value = "";
      return;
    }

    // Leer userId robustamente desde localStorage (maneja comillas si existen)
    const raw = localStorage.getItem("userId");
    let userId: string | null = null;
    if (!raw) {
      alert("No hay usuario logueado");
      event.currentTarget.value = "";
      return;
    }
    try {
      userId = JSON.parse(raw); // si estaba guardado como JSON
    } catch {
      userId = raw.replace(/"/g, ""); // fallback eliminar comillas sobrantes
    }
    if (!userId) {
      alert("No hay usuario logueado");
      event.currentTarget.value = "";
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/users/upload/photos/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // server devuelve path (ej: /uploads/filename.jpg)
      const path: string = res.data.path;
      const fullPath = path.startsWith("http") ? path : `http://localhost:3000${path}`;

      setPhotos((prev) => [...prev, fullPath]);
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("Error subiendo foto");
    } finally {
      // permitir volver a subir el mismo archivo (resetea input)
      event.currentTarget.value = "";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      {photos.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dashed #ccc",
            borderRadius: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No hay fotos (Max. 6 fotos)
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={1}>
          <Grid size={12}>
            <ImageList sx={{ width: "100%", height: "50vh" }} variant="quilted" cols={4} rowHeight={121}>
              {photos.map((photo: string, index: number) => {
                const { cols, rows } = getGridSize(index, photos.length);
                return (
                  <ImageListItem key={`${photo}-${index}`} cols={cols} rows={rows}>
                    <img
                      {...srcset(photo, 121, rows, cols)}
                      alt={`photo-${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
                      loading="lazy"
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={1} sx={{ mt: 3 }}>
        <Grid size={12}>
          <Button component="label" variant="contained" fullWidth startIcon={<CloudUploadIcon />}>
            Agregar Foto
            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleUpload} />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
