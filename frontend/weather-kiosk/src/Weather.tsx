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
  WaterDrop,
  Opacity,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { fetchWeather, WeatherData } from "./weatherApi";
import { useSettings } from "./SettingsContext";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

// Fixed colors for high/low temperatures
const HIGH_TEMP_COLOR = "#F57C00"; // Orange
const LOW_TEMP_COLOR = "#1976D2"; // Blue

function getPrecipitationIcon(probability: number, fontSize: number = 28) {
  const sx = { fontSize, color: "#42A5F5" };

  if (probability < 30) {
    // Low probability: outlined water drop
    return <Opacity sx={sx} />;
  } else if (probability < 60) {
    // Medium probability: filled water drop
    return <WaterDrop sx={sx} />;
  } else {
    // High probability: rain drops
    return <Grain sx={sx} />;
  }
}

function getWeatherIcon(code: number, size: "large" | "medium" = "large") {
  const fontSize = size === "large" ? 120 : 72;
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
      {/* Today's Weather - 5/8 height */}
      <Box
        sx={{
          flex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ color: "text.secondary", mb: 1 }}>
          {settings.cityName}
        </Typography>

        {/* Icon and Current Temperature - Side by Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {getWeatherIcon(weather.current.weatherCode)}
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            {Math.round(weather.current.temperature)}°
          </Typography>
        </Box>

        {/* High/Low/Precipitation - Horizontal Row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ArrowUpward sx={{ fontSize: 28, color: HIGH_TEMP_COLOR }} />
            <Typography variant="h4" sx={{ color: HIGH_TEMP_COLOR }}>
              {Math.round(weather.today.tempMax)}°
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ArrowDownward sx={{ fontSize: 28, color: LOW_TEMP_COLOR }} />
            <Typography variant="h4" sx={{ color: LOW_TEMP_COLOR }}>
              {Math.round(weather.today.tempMin)}°
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {getPrecipitationIcon(weather.today.precipitationProbability)}
            <Typography variant="h4" sx={{ color: "text.secondary" }}>
              {weather.today.precipitationProbability}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tomorrow's Weather - 3/8 height */}
      <Box
        sx={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "text.secondary", mb: 1 }}>
          Tomorrow
        </Typography>

        {/* Icon, Temperature, and Precipitation - Side by Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {getWeatherIcon(weather.tomorrow.weatherCode, "medium")}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ArrowUpward sx={{ fontSize: 28, color: HIGH_TEMP_COLOR }} />
              <Typography variant="h4" sx={{ color: HIGH_TEMP_COLOR }}>
                {Math.round(weather.tomorrow.tempMax)}°
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ArrowDownward sx={{ fontSize: 28, color: LOW_TEMP_COLOR }} />
              <Typography variant="h4" sx={{ color: LOW_TEMP_COLOR }}>
                {Math.round(weather.tomorrow.tempMin)}°
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {getPrecipitationIcon(weather.tomorrow.precipitationProbability)}
              <Typography variant="h4" sx={{ color: "text.secondary" }}>
                {weather.tomorrow.precipitationProbability}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
