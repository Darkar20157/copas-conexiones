import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Slider,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import type { StepIconProps } from "@mui/material/StepIcon";
import Check from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";

// ---- Custom Connector ----
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: "#eaeaf0",
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundImage:
      "linear-gradient(95deg, rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundImage:
      "linear-gradient(95deg, rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
  },
}));

// ---- Custom Step Icons ----
const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <PhoneIphoneIcon />,
    2: <PersonIcon />,
    3: <DescriptionIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <Check /> : icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

// ---- Steps ----
const steps = ["Número de celular", "Registro", "Confirmación"];

export const AuthStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(23);
  const [description, setDescription] = useState("");
  const maxChars = 200;

  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 0) {
      // 🔍 Simulación: validar si el número existe
      const userExists = phone === "999999999"; // ej. número fijo para prueba
      if (userExists) {
        navigate("/matches");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Paso 1: Número de celular */}
      {activeStep === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #742774, #3a0ca3)" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "var(--purple-200)" }}>
            Ingresa tu número de celular
          </Typography>
          <TextField
            fullWidth
            label="Número de celular"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mt: 2, input: { color: "white" } }}
            InputLabelProps={{ style: { color: "var(--purple-200)" } }}
          />
        </Paper>
      )}

      {/* Paso 2: Registro */}
      {activeStep === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #742774, #3a0ca3)" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "var(--purple-200)" }}>
            Completa tu registro
          </Typography>
          <Stack spacing={3} mt={2}>
            <TextField
              fullWidth
              label="Nombres"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: "var(--purple-200)" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <Box>
              <Typography gutterBottom sx={{ color: "var(--purple-200)" }}>
                Edad
              </Typography>
              <Slider
                min={18}
                max={50}
                value={age}
                onChange={(_, val) => setAge(val as number)}
                valueLabelDisplay="auto"
                sx={{ color: "var(--burgundy-500)" }}
              />
            </Box>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              maxRows={6}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) setDescription(e.target.value);
              }}
              helperText={`${description.length}/${maxChars} caracteres`}
              InputLabelProps={{ style: { color: "var(--purple-200)" } }}
              InputProps={{ style: { color: "white" } }}
            />
          </Stack>
        </Paper>
      )}

      {/* Paso 3: Confirmación */}
      {activeStep === 2 && (
        <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #742774, #3a0ca3)" }}>
          <Typography variant="h6" gutterBottom>
            ¡Registro completo! 🎉
          </Typography>
          <Typography>Bienvenido, {name}. Ahora puedes ir a Matches.</Typography>
        </Paper>
      )}

      {/* Botones de navegación */}
      <Stack direction="row" spacing={2} mt={3} justifyContent="center">
        {activeStep > 0 && (
          <Button variant="outlined" onClick={handleBack} sx={{ color: "white", borderColor: "white" }}>
            Atrás
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              backgroundImage:
                "linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
              color: "white",
              px: 4,
            }}
          >
            Siguiente
          </Button>
        )}
      </Stack>
    </Box>
  );
};
