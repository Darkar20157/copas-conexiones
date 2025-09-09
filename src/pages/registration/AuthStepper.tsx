import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";

import type { StepIconProps } from "@mui/material/StepIcon";
import Check from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DescriptionIcon from "@mui/icons-material/Description";

import { loginService, registerService } from "../../api/AuthService";
import type { Login } from "../../interfaces/Login";
import FullScreenLoader from "../../components/full-screen-loading/FullScreenLoading";
import type { Register } from "../../interfaces/Register";
import { HonorMention } from "../../components/honor-mention/HonorMention";
import type { ApiResponse } from "../../interfaces/ApiResponse";
import type { Dayjs } from "dayjs";
import { GenderLabels } from "../../translate/GenderLabels";
import type { Gender } from "../../types/Gender";

// ---- Custom Connector ----
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: "#eaeaf0",
    ...theme.applyStyles?.("dark", {
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

  //Inicializaciones
  const maxChars = 200;
  const navigate = useNavigate();

  // States que interactuan con la interface
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // States que van al backend
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState<Dayjs | null>(null);
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState<Gender | "">("");


  //Handle para volver de step
  const handleBack = () => setActiveStep((prev) => prev - 1);

  //Handle para cambiar el state del password y asi cambiar el icono
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  //Handle para ir al siguiente step
  const handleNext = async () => {
    if (activeStep === 0) {
      //Login
      await handleStepLogin();
    } else if (activeStep === 1) {
      //Register
      await handleStepRegister();
    } else {
      //Next Step
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleStepLogin = async () => {
    setLoading(true);
    const login: Login = { phone, password };
    try {
      const res = await loginService(login);
      if (res.success) {
        localStorage.setItem("userId", JSON.stringify(res.content?.id));
        setTimeout(() => {
          navigate("/matches");
          return;
        }, 1000);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      const error = err as ApiResponse<null>;

      if (error.status === 404) {
        alert("Eres un usuario nuevo? Regístrate!");
        setActiveStep((prev) => prev + 1);
      } else if (error.status === 401) {
        alert(error.message + ": La contraseña es incorrecta");
      } else {
        alert(error.message || "Error inesperado en login");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleStepRegister = async () => {
    try {
      setLoading(true);
      if (!birthdate) {
        alert("Debes ingresar tu fecha de nacimiento");
        return;
      }
      const birthdateString = birthdate.format("YYYY-MM-DD");
      const register: Register = { name, birthdate: birthdateString, description, phone, gender, password };
      const res = await registerService(register);
      if (res.success) {
        setActiveStep((prev) => prev + 1);
        localStorage.setItem("userId", JSON.stringify(res.content?.id));
        setTimeout(() => {
          navigate("/matches");
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      const error = err as ApiResponse<null>;
      alert(error.message || "Error al registrar");
      setLoading(false);
    }
  }

  return (
    <>
      <FullScreenLoader open={loading} />
      <Box sx={{ width: "100%", p: 4 }}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": { color: "var(--purple-200)" },
                  "& .MuiStepLabel-label.Mui-active": { color: "var(--purple-200)" },
                  "& .MuiStepLabel-label.Mui-completed": { color: "var(--purple-200)" },
                }}
                StepIconComponent={ColorlibStepIcon}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido de cada paso */}
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
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 2, input: { color: "white" } }}
              InputLabelProps={{ style: { color: "var(--purple-200)" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={2} mt={3} justifyContent="center">
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack} sx={{ color: "white", borderColor: "white" }}>
                  Atrás
                </Button>
              )}
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
            </Stack>

            {/* Mención honorífica */}
            <HonorMention />
          </Paper>
        )}

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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha de nacimiento"
                    openTo="year"
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputLabelProps: { style: { color: "var(--purple-200)" }, shrink: true },
                        InputProps: { style: { color: "white" } },
                        inputProps: { "aria-label": "fecha de nacimiento" },
                        sx: {
                          "& .MuiInputBase-input": { color: "white" },
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                          "& label": { color: "var(--purple-200)" },
                        },
                      },
                    }}
                    onChange={(newValue: Dayjs | null) => setBirthdate(newValue)}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
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
              <InputLabel id="demo-select-small-label" sx={{ color: "white" }}>Género</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "linear-gradient(180deg, var(--purple-800), var(--burgundy-800))",
                      color: "white",
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {Object.entries(GenderLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Stack direction="row" spacing={2} mt={3} justifyContent="center">
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack} sx={{ color: "white", borderColor: "white" }}>
                  Atrás
                </Button>
              )}
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
            </Stack>

            {/* Mención honorífica */}
            <HonorMention />
          </Paper>
        )}

        {activeStep === 2 && (
          <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #742774, #3a0ca3)" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "var(--purple-200)" }}>
              ¡Registro completo! 🎉
            </Typography>
            <Typography sx={{ color: "var(--purple-200)" }}>Bienvenido, {name}. Ahora puedes ir a Matches.</Typography>

            <Stack direction="row" spacing={2} mt={3} justifyContent="center">
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack} sx={{ color: "white", borderColor: "white" }}>
                  Atrás
                </Button>
              )}
            </Stack>

            {/* Mención honorífica */}
            <HonorMention />
          </Paper>
        )}
      </Box>
    </>
  );
};
