import { Box } from "@mui/material";
import { Close, Star, Favorite, HelpOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { CardMatches } from "../../components/card-matches/CardMatches";
import type { IUserProfile } from "../../components/card-matches/cardMatches.interfaces";

export interface MatchCardPairProps {
  user1: IUserProfile;
  user2: IUserProfile;
  type_liked_1?: "no_me_gusta" | "me_gusta" | "me_encanta" | null;
  type_liked_2?: "no_me_gusta" | "me_gusta" | "me_encanta" | null;
  onAction?: (userId: string, action: "no_me_gusta" | "me_gusta" | "me_encanta") => void;
}

const IconWrapper = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 60,
  height: 60,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 2,
});

export const MatchCardPair: React.FC<MatchCardPairProps> = ({
  user1,
  user2,
  type_liked_1,
  type_liked_2,
  onAction,
}) => {
  let IconComponent = HelpOutline;
  let iconColor = "white";

  if (type_liked_1 == null || type_liked_2 == null) {
    IconComponent = HelpOutline;
    iconColor = "white";
  } else if (type_liked_1 === type_liked_2) {
    switch (type_liked_1) {
      case "me_gusta":
        IconComponent = Favorite;
        iconColor = "#42c767";
        break;
      case "me_encanta":
        IconComponent = Star;
        iconColor = "#ffd700";
        break;
      case "no_me_gusta":
        IconComponent = Close;
        iconColor = "#ff4458";
        break;
    }
  } else {
    IconComponent = Close;
    iconColor = "#ff4458";
  }

  return (
    <Box position="relative" display="flex" gap={2} justifyContent="center">
      <CardMatches
        user={user1}
        type={type_liked_1 ?? "no_me_gusta"}
        width={160}
        height={280}
        onSwipeLeft={(id) => onAction?.(id, "no_me_gusta")}
        onSwipeRight={(id) => onAction?.(id, "me_gusta")}
        onSuperLike={(id) => onAction?.(id, "me_encanta")}
      />
      <CardMatches
        user={user2}
        type={type_liked_2 ?? "no_me_gusta"}
        width={160}
        height={280}
        onSwipeLeft={(id) => onAction?.(id, "no_me_gusta")}
        onSwipeRight={(id) => onAction?.(id, "me_gusta")}
        onSuperLike={(id) => onAction?.(id, "me_encanta")}
      />
      <IconWrapper>
        <IconComponent style={{ fontSize: 32, color: iconColor }} />
      </IconWrapper>
    </Box>
  );
};
