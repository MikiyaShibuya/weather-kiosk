import { useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./App.css";
import Display from "./Display";
import { SettingsProvider, useSettings } from "./SettingsContext";

function ThemedApp() {
  const { isNightMode } = useSettings();

  // Prevent screen from turning off using Wake Lock API
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake Lock not supported or failed
      }
    };

    requestWakeLock();

    // Re-acquire wake lock when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLock?.release();
    };
  }, []);

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
