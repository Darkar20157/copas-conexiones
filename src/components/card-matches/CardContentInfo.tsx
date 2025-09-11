import { useState } from "react";
import {
    Box,
    Typography,
    CardContent,
    IconButton,
    Dialog,
    DialogContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { IUserProfile } from "./cardMatches.interfaces";
import { calculateAge } from "../../utils/dateUtils";

const ContentSection = styled(CardContent)({
    height: "30%",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
});

export const CardContentInfo: React.FC<IUserProfile> = (props) => {
    const [open, setOpen] = useState(false);

    const age = calculateAge(props.birthdate);

    return (
        <>
            <ContentSection>
                <Box>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        {props.name}, {age}
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
                                ml: 1, // pequeño margen a la izquierda
                            }}
                            onClick={() => setOpen(true)}
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
                        {props.description}
                    </Typography>
                </Box>
            </ContentSection>

            {/* 🔹 Modal con info completa */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullScreen
                PaperProps={{
                    sx: {
                        bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                    },
                }}
            >
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        textAlign: "center",
                        p: 4,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {props.name}, {age}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Género: {props.gender}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ mt: 2, maxWidth: 500, whiteSpace: "pre-line" }}
                    >
                        {props.description}
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};
