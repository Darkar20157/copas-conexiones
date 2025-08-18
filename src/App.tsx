import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRoutes } from './routes/AppRoutes'
import { getAppTheme } from "./theme";
import './App.css'


const App: React.FC = () => {
  const theme = getAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes/>
    </ThemeProvider>
  )
}

export default App;
