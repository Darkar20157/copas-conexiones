import {
    Box,
    Typography,
    CardContent,
    IconButton
} from "@mui/material"; 
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { IUserProfile } from "./cardMatches.interfaces";
import { calculateAge } from "../../utils/utils";

const ContentSection = styled(CardContent)({
    height: "30%",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
});

export const CardContentInfo: React.FC<IUserProfile & { setOpenModal: (open: boolean) => void }> = (props) => {
    const { name, birthdate, description, setOpenModal } = props;

    const age = calculateAge(birthdate);

    return (
        <>
            <ContentSection>
                <Box>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        {name}, {age}
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
                                ml: 1, // pequeño margen a la izquierda
                            }}
                            onClick={() => setOpenModal(true)}
                        >
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: 1,
                            opacity: 0.9,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
            </ContentSection>
        </>
    );
};
