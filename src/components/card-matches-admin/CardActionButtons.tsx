import { Box, IconButton } from "@mui/material"
import { Close, Star, Favorite } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

const ActionButtons = styled(Box)({
  position: "absolute",
  bottom: -35,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 16,
  zIndex: 3,
})

const ActionButton = styled(IconButton)<{ variant: "reject" | "like" | "superlike" }>(({ variant }) => ({
  width: 56,
  height: 56,
  backgroundColor:
    variant === "reject" ? "#ff4458" :
    variant === "like" ? "#42c767" :
    "#1ec71e",
  color: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  "&:hover": {
    backgroundColor:
      variant === "reject" ? "#e63946" :
      variant === "like" ? "#2d9cdb" :
      "#ffd700",
    transform: "scale(1.1)",
  },
  transition: "all 0.3s ease",
}))

export const CardActionButtons: React.FC<{ type: "no_me_gusta" | "me_gusta" | "me_encanta" }> = ({
  type,
}) => (
  <ActionButtons>
    {type === "no_me_gusta" && (
      <ActionButton variant="reject">
        <Close />
      </ActionButton>
    )}
    {type === "me_encanta" && (
      <ActionButton variant="superlike">
        <Star />
      </ActionButton>
    )}
    {type === "me_gusta" && (
      <ActionButton variant="like">
        <Favorite />
      </ActionButton>
    )}
  </ActionButtons>
)
