import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const ImageIndicators = styled(Box)({
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    display: "flex",
    gap: 4,
    zIndex: 2,
});

const Indicator = styled(Box)<{ active: boolean }>(({ active }) => ({
    flex: 1,
    height: 3,
    backgroundColor: active ? "#fff" : "rgba(255,255,255,0.3)",
    borderRadius: 2,
    transition: "background-color 0.3s ease",
}));

export const CardIndicators = ({ total, current }: { total?: number; current: number }) => (
    <ImageIndicators>
        {Array.from({ length: total ?? 0 }).map((_, index) => (
            <Indicator key={index} active={index === current} />
        ))}
    </ImageIndicators>
)