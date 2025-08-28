import { useState } from 'react';
import {
  Grid,
  TextField,
  Slider,
  Typography,
  Paper,
  Button,
} from '@mui/material';

import type { User } from '../../interfaces/User';

export const Form = ({ user }: { user: User }) => {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [description, setDescription] = useState(user.description);
  const maxChars = 200;

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= maxChars) {
      setDescription(event.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Formulario enviado 🚀");
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, var(--burgundy-900), var(--purple-800))",
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

          {/* Edad */}
          <Grid size={12}>
            <Typography gutterBottom sx={{ color: "var(--purple-200)", fontWeight: 500 }}>
              Edad
            </Typography>
            <Slider
              min={18}
              max={50}
              value={age}
              onChange={(e, newValue) => setAge(newValue as number)}
              valueLabelDisplay="auto"
              sx={{
                color: "var(--burgundy-500)",
                "& .MuiSlider-thumb": {
                  backgroundColor: "white",
                  border: "2px solid var(--burgundy-600)",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "var(--wine-500)",
                },
              }}
            />
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
                background: "linear-gradient(135deg, var(--burgundy-500), var(--purple-600))",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(135deg, var(--burgundy-600), var(--purple-700))",
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
