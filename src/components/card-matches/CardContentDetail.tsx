import {
    Box,
    Typography,
    CardContent,
    Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { IUserProfile } from "./cardMatches.interfaces";
import { calculateAge, translateGender } from "../../utils/utils";
import type { Gender } from "../../types/Gender";

const ContentSection = styled(CardContent)({
    height: "30%",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "0px 0px 12px 12px",
});

export const CardContentDetail: React.FC<IUserProfile> = (props) => {
    const { name, birthdate, gender, description } = props;

    const age = calculateAge(birthdate);
    const genderTranslated = translateGender(gender as Gender);

    return (
        <>
            <ContentSection>
                <Box>
                    {/* Nombre + Edad + Chip alineados */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            fontWeight="bold"
                            sx={{
                                flex: 1, // ocupa todo el espacio libre
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {name}, {age}
                        </Typography>

                        <Chip
                            label={genderTranslated}
                            variant="outlined"
                            sx={{
                                color: "white",
                                borderColor: "white",
                                fontSize: "0.75rem",
                                height: 24,
                            }}
                        />
                    </Box>

                    {/* Descripción */}
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: 1,
                            opacity: 0.9,
                            overflow: "hidden",
                            display: "-webkit-box",
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