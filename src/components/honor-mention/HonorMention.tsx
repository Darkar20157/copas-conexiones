import {
  Box,
  Typography,
} from "@mui/material";


// ---- Mención honorífica ----
export const HonorMention = () => {
    return (
        <Box
            mt={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                textAlign: "center",
            }}
        >
            <Box
                component="img"
                src="/assets/img/danny.jpg"
                alt="Danny Alejandro"
                sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1, border: "2px solid #fff" }}
            />
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
                Danny Alejandro
            </Typography>
            <Typography variant="body2" sx={{ color: "#ddd" }}>
                Desarrollador de aplicaciones
                daniel259922@gmail.com - 3204594935
            </Typography>
        </Box>
    );
};