import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./App.css";
import Display from "./Display";
import { SettingsProvider, useSettings } from "./SettingsContext";

function ThemedApp() {
  const { isNightMode } = useSettings();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isNightMode ? "dark" : "light",
        },
      }),
    [isNightMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Display />
    </ThemeProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  );
}

export default App;
