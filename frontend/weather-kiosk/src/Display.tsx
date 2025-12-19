import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import Clock from "./Clock";
import Weather from "./Weather";
import Settings from "./Settings";

export default function Display() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* Settings Button */}
      <IconButton
        onClick={() => setSettingsOpen(true)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          opacity: 0.5,
          "&:hover": { opacity: 1 },
        }}
      >
        <SettingsIcon />
      </IconButton>

      {/* Left side - Clock */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Clock />
      </Box>

      {/* Right side - Weather */}
      <Box sx={{ flex: 1 }}>
        <Weather />
      </Box>

      {/* Settings Modal */}
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
}
