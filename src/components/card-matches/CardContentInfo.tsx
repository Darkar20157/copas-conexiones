import { Box, Typography, CardContent } from "@mui/material";
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

// const TagsContainer = styled(Box)({
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 6,
//     marginTop: 8,
// });

// const HobbyChip = styled(Chip)({
//     backgroundColor: "rgba(255,255,255,0.2)",
//     color: "white",
//     fontSize: "0.75rem",
//     height: 24,
//     "& .MuiChip-label": { padding: "0 8px" },
// });

export const CardContentInfo: React.FC<IUserProfile> = (props) => (
    <ContentSection>
        <Box>
            <Typography variant="h5" component="h2" fontWeight="bold">
                {props.name}, {props.age}
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
                    wordBreak: "break-word", // 👈 clave
                }}
            >
                {props.description}
            </Typography>

        </Box>

        {/* <TagsContainer>
            {props.hobbies.slice(0, 4).map((hobby, index) => (
                <HobbyChip key={index} label={hobby} size="small" />
            ))}
            {props.hobbies.length > 4 && <HobbyChip label={`+${props.hobbies.length - 4}`} size="small" />}
        </TagsContainer> */}
    </ContentSection>
)