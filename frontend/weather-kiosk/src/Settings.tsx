import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { MyLocation, Search } from "@mui/icons-material";
import { useSettings } from "./SettingsContext";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

interface GeocodingResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

// Generate time options in 15-minute intervals
const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const minutes = i * 15;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return {
    value: minutes,
    label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
  };
});

async function searchCity(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams();
  params.set("name", query);
  params.set("count", "5");
  params.set("language", "en");

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.results || [];
}

export default function Settings({ open, onClose }: SettingsProps) {
  const { settings, updateSettings } = useSettings();
  const [cityName, setCityName] = useState(settings.cityName);
  const [latitude, setLatitude] = useState(settings.latitude);
  const [longitude, setLongitude] = useState(settings.longitude);
  const [shiftToNight, setShiftToNight] = useState(settings.shiftToNight);
  const [shiftToDay, setShiftToDay] = useState(settings.shiftToDay);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);
    try {
      const results = await searchCity(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No cities found");
      }
    } catch {
      setError("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCity = (result: GeocodingResult) => {
    const displayName = result.admin1
      ? `${result.name}, ${result.admin1}`
      : `${result.name}, ${result.country}`;
    setCityName(displayName);
    setLatitude(result.latitude);
    setLongitude(result.longitude);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setGeolocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        // Reverse geocode to get city name
        try {
          const params = new URLSearchParams();
          params.set("latitude", lat.toString());
          params.set("longitude", lng.toString());

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?${params}&current=temperature_2m&timezone=auto`
          );
          const data = await response.json();
          if (data.timezone) {
            // Use timezone as a fallback city name
            const parts = data.timezone.split("/");
            setCityName(parts[parts.length - 1].replace(/_/g, " "));
          }
        } catch {
          setCityName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
        }

        setGeolocating(false);
      },
      (err) => {
        setError(`Location error: ${err.message}`);
        setGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = () => {
    updateSettings({
      cityName,
      latitude,
      longitude,
      shiftToNight,
      shiftToDay,
    });
    onClose();
  };

  const handleCancel = () => {
    setCityName(settings.cityName);
    setLatitude(settings.latitude);
    setLongitude(settings.longitude);
    setShiftToNight(settings.shiftToNight);
    setShiftToDay(settings.shiftToDay);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Location Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Location
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? <CircularProgress size={24} /> : <Search />}
              </Button>
              <Button
                variant="outlined"
                onClick={handleGeolocation}
                disabled={geolocating}
              >
                {geolocating ? (
                  <CircularProgress size={24} />
                ) : (
                  <MyLocation />
                )}
              </Button>
            </Box>

            {searchResults.length > 0 && (
              <Paper variant="outlined" sx={{ mb: 1 }}>
                <List dense>
                  {searchResults.map((result, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => handleSelectCity(result)}
                    >
                      <ListItemText
                        primary={result.name}
                        secondary={`${result.admin1 || ""} ${result.country}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}

            <TextField
              label="City Name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              fullWidth
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Shift to Day</InputLabel>
            <Select
              value={shiftToDay}
              label="Shift to Day"
              onChange={(e) => setShiftToDay(e.target.value as number)}
            >
              {timeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Shift to Night</InputLabel>
            <Select
              value={shiftToNight}
              label="Shift to Night"
              onChange={(e) => setShiftToNight(e.target.value as number)}
            >
              {timeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
