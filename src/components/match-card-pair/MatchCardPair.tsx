import { Box } from "@mui/material";
import { Close, Star, Favorite, HelpOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { CardMatchesAdmin } from "../card-matches-admin/CardMatchesAdmin";
import type { IUserProfile } from "../../components/card-matches/cardMatches.interfaces";

export interface MatchCardPairProps {
  id: number;
  view_admin: boolean;
  user1: IUserProfile;
  user2: IUserProfile;
  type_liked_1?: "no_me_gusta" | "me_gusta" | "me_encanta" | null;
  type_liked_2?: "no_me_gusta" | "me_gusta" | "me_encanta" | null;
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
}) => {
  let IconComponent = HelpOutline;
  let iconColor = "white";

  if (type_liked_1 == null || type_liked_2 == null) {
    IconComponent = HelpOutline;
    iconColor = "white";
  } else {
    // Ambos son iguales
    if (type_liked_1 === type_liked_2) {
      switch (type_liked_1) {
        case "me_gusta":
          IconComponent = Favorite;
          iconColor = "#42c767"; // verde
          break;
        case "me_encanta":
          IconComponent = Star;
          iconColor = "#ffd700"; // dorado
          break;
        case "no_me_gusta":
          IconComponent = Close;
          iconColor = "#ff4458"; // rojo
          break;
      }
    } else {
      // Casos combinados
      const combo = [type_liked_1, type_liked_2].sort().join("-");

      switch (combo) {
        case "me_encanta-me_gusta":
          IconComponent = Star;
          iconColor = "#ffd700"; // dorado
          break;

        case "me_gusta-no_me_gusta":
        case "me_encanta-no_me_gusta":
        case "me_gusta-me_encanta-no_me_gusta": // por seguridad si entran mezclados
          IconComponent = Close;
          iconColor = "#ff4458"; // rojo
          break;

        default:
          IconComponent = Close;
          iconColor = "#ff4458";
      }
    }
  }

  return (
    <Box position="relative" display="flex" gap={2} justifyContent="center">
      <CardMatchesAdmin
        user={user1}
        type={type_liked_1 ?? undefined}
        width={160}
        height={280}
      />
      <CardMatchesAdmin
        user={user2}
        type={type_liked_2 ?? undefined}
        width={160}
        height={280}
      />
      <IconWrapper>
        <IconComponent style={{ fontSize: 32, color: iconColor }} />
      </IconWrapper>
    </Box>
  );
};

