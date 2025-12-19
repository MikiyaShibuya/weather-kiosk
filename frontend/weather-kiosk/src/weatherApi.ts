export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
  };
  today: {
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationProbability: number;
  };
  tomorrow: {
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationProbability: number;
  };
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams();
  params.set("latitude", latitude.toString());
  params.set("longitude", longitude.toString());
  params.set("current", "temperature_2m,weather_code");
  params.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  params.set("timezone", "Asia/Tokyo");
  params.set("forecast_days", "2");

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data: OpenMeteoResponse = await response.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
    },
    today: {
      weatherCode: data.daily.weather_code[0],
      tempMax: data.daily.temperature_2m_max[0],
      tempMin: data.daily.temperature_2m_min[0],
      precipitationProbability: data.daily.precipitation_probability_max[0],
    },
    tomorrow: {
      weatherCode: data.daily.weather_code[1],
      tempMax: data.daily.temperature_2m_max[1],
      tempMin: data.daily.temperature_2m_min[1],
      precipitationProbability: data.daily.precipitation_probability_max[1],
    },
  };
}
