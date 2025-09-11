import {
    Box,
    Typography,
    CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { IUserProfile } from "./cardMatches.interfaces";

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
    return (
        <>
            <ContentSection>
                <Box>
                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ fontSize: 14, textAlign: "center" }}>
                        {props.name}
                    </Typography>
                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ fontSize: 14, textAlign: "center" }}>
                        Años {props.birthdate}
                    </Typography>
                </Box>
            </ContentSection>
        </>
    );
};
