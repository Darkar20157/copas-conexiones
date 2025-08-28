import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRoutes } from './routes/AppRoutes';
import { getAppTheme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import './App.css';

const App: React.FC = () => {
  const theme = getAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
