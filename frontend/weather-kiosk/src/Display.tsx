import { Box } from "@mui/material";
import Clock from "./Clock";
import Weather from "./Weather";

export default function Display() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Left side - Clock */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Clock />
      </Box>

      {/* Right side - Weather */}
      <Box sx={{ flex: 1 }}>
        <Weather />
      </Box>
    </Box>
  );
}
