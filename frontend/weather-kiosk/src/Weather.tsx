import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  WbSunny,
  Cloud,
  CloudQueue,
  Grain,
  Thunderstorm,
  AcUnit,
  Foggy,
  Umbrella,
} from "@mui/icons-material";
import { fetchWeather, getTemperatureColor, WeatherData } from "./weatherApi";
import { useSettings } from "./SettingsContext";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

function getWeatherIcon(code: number, size: "large" | "medium" = "large") {
  const fontSize = size === "large" ? 80 : 48;
  const sx = { fontSize };

  // WMO Weather interpretation codes
  // https://open-meteo.com/en/docs
  if (code === 0) return <WbSunny sx={{ ...sx, color: "#FFB300" }} />;
  if (code <= 3) return <CloudQueue sx={{ ...sx, color: "#78909C" }} />;
  if (code <= 48) return <Foggy sx={{ ...sx, color: "#90A4AE" }} />;
  if (code <= 57) return <Grain sx={{ ...sx, color: "#64B5F6" }} />;
  if (code <= 67) return <Cloud sx={{ ...sx, color: "#546E7A" }} />;
  if (code <= 77) return <AcUnit sx={{ ...sx, color: "#81D4FA" }} />;
  if (code <= 82) return <Grain sx={{ ...sx, color: "#42A5F5" }} />;
  if (code >= 95) return <Thunderstorm sx={{ ...sx, color: "#5C6BC0" }} />;
  return <Cloud sx={{ ...sx, color: "#78909C" }} />;
}

export default function Weather() {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchWeather(settings.latitude, settings.longitude);
        setWeather(data);
        setError(null);
      } catch {
        setError("Failed to load weather");
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [settings.latitude, settings.longitude]);

  if (error) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!weather) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      {/* Today's Weather - Top Half */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
          {settings.cityName}
        </Typography>
        {getWeatherIcon(weather.current.weatherCode)}
        <Typography
          variant="h1"
          sx={{
            fontWeight: "bold",
            color: getTemperatureColor(weather.current.temperature),
            mt: 1,
          }}
        >
          {Math.round(weather.current.temperature)}°
        </Typography>
        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
          <Typography
            variant="h5"
            sx={{ color: getTemperatureColor(weather.today.tempMax) }}
          >
            {Math.round(weather.today.tempMax)}°
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: getTemperatureColor(weather.today.tempMin) }}
          >
            {Math.round(weather.today.tempMin)}°
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
          <Umbrella sx={{ fontSize: 20, color: "#42A5F5" }} />
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {weather.today.precipitationProbability}%
          </Typography>
        </Box>
      </Box>

      {/* Tomorrow's Weather - Bottom Half */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
          Tomorrow
        </Typography>
        {getWeatherIcon(weather.tomorrow.weatherCode, "medium")}
        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
          <Typography
            variant="h4"
            sx={{ color: getTemperatureColor(weather.tomorrow.tempMax) }}
          >
            {Math.round(weather.tomorrow.tempMax)}°
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: getTemperatureColor(weather.tomorrow.tempMin) }}
          >
            {Math.round(weather.tomorrow.tempMin)}°
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
          <Umbrella sx={{ fontSize: 18, color: "#42A5F5" }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {weather.tomorrow.precipitationProbability}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
