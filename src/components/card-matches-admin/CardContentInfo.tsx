import {
    Box,
    Typography,
    CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

export const CardContentInfo: React.FC<IUserProfile> = (props) => {
    const { name, birthdate } = props;
    const age = calculateAge(birthdate);
    return (
        <>
            <ContentSection>
                <Box>
                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ fontSize: 14, textAlign: "center" }}>
                        {name}
                    </Typography>
                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ fontSize: 14, textAlign: "center" }}>
                        Años {age}
                    </Typography>
                </Box>
            </ContentSection>
        </>
    );
};
