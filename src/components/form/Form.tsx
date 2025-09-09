import { useState } from "react";
import {
  Grid,
  TextField,
  Paper,
  Button,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import type { User } from "../../interfaces/User";
import type { Dayjs } from "dayjs";
import { GenderLabels } from "../../translate/GenderLabels";
import type { Gender } from "../../types/Gender";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_URL;

export const Form = ({ user }: { user: User }) => {
  const [name, setName] = useState(user.name);
  const [description, setDescription] = useState(user.description);
  const [birthdate, setBirthdate] = useState<Dayjs | null>(
    user.birthdate ? dayjs(user.birthdate) : null
  );
  const [gender, setGender] = useState<Gender | "">(
    (user.gender as Gender) || ""
  );

  const maxChars = 200;

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length <= maxChars) {
      setDescription(event.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : null,
          gender,
        }),
      });

      if (!response.ok) {
        throw new Error("Error actualizando usuario");
      }
      await response.json();
      alert("Usuario actualizado correctamente 🚀");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el usuario ❌");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(135deg, var(--burgundy-900), var(--purple-800))",
        color: "white",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Nombre */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Nombre"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: "var(--purple-200)" } }}
              InputProps={{
                style: {
                  color: "white",
                  borderRadius: 12,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--burgundy-500)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--purple-400)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--wine-500)",
                  },
                },
              }}
            />
          </Grid>

          {/* Fecha de nacimiento */}
          <Grid size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de nacimiento"
                value={birthdate}
                onChange={(newValue) => setBirthdate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputLabelProps: { style: { color: "var(--purple-200)" } },
                    InputProps: {
                      style: { color: "white", borderRadius: 12 },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Género */}
          <Grid size={12}>
            <InputLabel
              id="gender-label"
              sx={{ color: "var(--purple-200)", mb: 1 }}
            >
              Género
            </InputLabel>
            <Select
              labelId="gender-label"
              fullWidth
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              sx={{
                color: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--burgundy-500)",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background:
                      "linear-gradient(180deg, var(--purple-800), var(--burgundy-800))",
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
          </Grid>

          {/* Descripción */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              maxRows={6}
              value={description}
              onChange={handleDescriptionChange}
              helperText={`${description.length}/${maxChars} caracteres`}
              InputLabelProps={{ style: { color: "var(--purple-200)" } }}
              InputProps={{
                style: {
                  color: "white",
                  borderRadius: 12,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--burgundy-500)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--purple-400)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--wine-500)",
                  },
                },
                "& .MuiFormHelperText-root": {
                  color: "var(--wine-400)",
                },
              }}
            />
          </Grid>

          {/* Botón */}
          <Grid size={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, var(--burgundy-500), var(--purple-600))",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, var(--burgundy-600), var(--purple-700))",
                },
              }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};