import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import AnalogFace from "./AnalogFace";

export default function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [setDate]);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ width: 300, height: 300 }}>
        <AnalogFace date={date} />
      </Box>

      <Typography variant="h3" color="text.secondary" align="center">
        {`${hours}:${minutes}:${seconds}`}
      </Typography>
    </Box>
  );
}
