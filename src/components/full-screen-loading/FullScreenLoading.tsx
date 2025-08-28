// src/components/FullScreenLoader.tsx
import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface FullScreenLoaderProps {
  open: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default FullScreenLoader;
