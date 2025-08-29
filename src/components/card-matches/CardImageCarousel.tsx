import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import type { ICarouselImage } from "./cardMatches.interfaces";


const ImageContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "70%",
  aspectRatio: "4 / 5", // 👈 ratio fijo (puede ser 3/4, 9/16 según el estilo que quieras)
  overflow: "hidden",
  borderRadius: "12px",
});

const CarouselImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  overflow: "hidden",
  borderRadius: "12px", // opcional: bordes redondeados como tu Card
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
})

export const CardImageCarousel: React.FC<ICarouselImage> = ({ photos, currentImageIndex, nextImage, prevImage }) => (
  <ImageContainer>
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
    <CarouselImage src={'http://localhost:3000' + photos[currentImageIndex]} alt={`Foto ${currentImageIndex + 1}`} />
  </ImageContainer>
)
