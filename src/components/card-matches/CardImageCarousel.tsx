import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Image as ImageIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import type { ICarouselImage } from "./cardMatches.interfaces";

const ImageContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "70%",
  aspectRatio: "4 / 5",
  overflow: "hidden",
  borderRadius: "12px 12px 0px 0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f0f0f0", // fondo gris claro para placeholder
});

const CarouselImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  overflow: "hidden",
  borderRadius: "12px 12px 0px 0px",
  transition: "transform 0.3s ease",
});

const NavigationButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0,0,0,0.3)",
  color: "white",
  zIndex: 2,
  "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
});

const API_URL = import.meta.env.VITE_API_URL;

export const CardImageCarousel: React.FC<ICarouselImage> = ({
  photos,
  currentImageIndex,
  nextImage,
  prevImage,
}) => {
  const hasPhotos = photos && photos.length > 0;

  return (
    <ImageContainer>
      {hasPhotos ? (
        <>
          {photos.length > 1 && (
            <>
              <NavigationButton sx={{ left: 8 }} onClick={prevImage} size="small">
                <ArrowBackIos fontSize="small" />
              </NavigationButton>
              <NavigationButton sx={{ right: 8 }} onClick={nextImage} size="small">
                <ArrowForwardIos fontSize="small" />
              </NavigationButton>
            </>
          )}
          <CarouselImage
            src={`${API_URL}${photos[currentImageIndex]}`}
            alt={`Foto ${currentImageIndex + 1}`}
          />
        </>
      ) : (
        <ImageIcon sx={{ fontSize: 60, color: "#ccc" }} />
      )}
    </ImageContainer>
  );
};
