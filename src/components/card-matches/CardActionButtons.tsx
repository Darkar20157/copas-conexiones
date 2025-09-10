import { Box, IconButton } from "@mui/material"
import { Close, Star, Favorite } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

const ActionButtons = styled(Box)({
  position: "absolute",
  bottom: -30,
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

interface Props {
  onReject?: () => void
  onLike?: () => void
  onSuperLike?: () => void
}

export const CardActionButtons: React.FC<Props> = ({
  onReject,
  onLike,
  onSuperLike,
}) => (
  <ActionButtons>
    {onReject && (
      <ActionButton variant="reject" onClick={onReject}>
        <Close />
      </ActionButton>
    )}
    {onSuperLike && (
      <ActionButton variant="superlike" onClick={onSuperLike}>
        <Star />
      </ActionButton>
    )}
    {onLike && (
      <ActionButton variant="like" onClick={onLike}>
        <Favorite />
      </ActionButton>
    )}
  </ActionButtons>
)
