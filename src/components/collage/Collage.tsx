import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  ImageList,
  ImageListItem,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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

  const getUserId = () => {
    const raw = localStorage.getItem("userId");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw.replace(/"/g, "");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 6) {
      alert("Máximo 6 fotos");
      event.currentTarget.value = "";
      return;
    }

    const userId = getUserId();
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

      const updatedPhotos: string[] = res.data.photos.map((p: string) =>
        p.startsWith("http") ? p : `http://localhost:3000${p}`
      );

      setPhotos(updatedPhotos);
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("Error subiendo foto");
    } finally {
      event.currentTarget.value = "";
    }
  };

  const handleDelete = async (photo: string) => {
    const userId = getUserId();
    if (!userId) {
      alert("No hay usuario logueado");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:3000/api/users/delete/photos/${userId}`,
        { data: { photo } } // pasamos cuál foto eliminar
      );

      const updatedPhotos: string[] = res.data.photos.map((p: string) =>
        p.startsWith("http") ? p : `http://localhost:3000${p}`
      );

      setPhotos(updatedPhotos);
    } catch (err) {
      console.error("Error eliminando foto:", err);
      alert("Error eliminando foto");
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
              <AnimatePresence>
                {photos.map((photo: string, index: number) => {
                  const { cols, rows } = getGridSize(index, photos.length);
                  return (
                    <motion.div
                      key={`${photo}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        rotate: 90,
                        transition: { duration: 0.4, ease: "easeInOut" },
                      }}
                      style={{ gridColumnEnd: `span ${cols}`, gridRowEnd: `span ${rows}` }}
                    >
                      <ImageListItem
                        cols={cols}
                        rows={rows}
                        sx={{ position: "relative" }}
                      >
                        <img
                          {...srcset(photo, 121, rows, cols)}
                          alt={`photo-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 20,
                          }}
                          loading="lazy"
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": { backgroundColor: "rgba(255,0,0,0.8)" },
                          }}
                          onClick={() => handleDelete(photo)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
