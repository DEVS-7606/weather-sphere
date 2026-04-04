import type {
  GeoResult,
  WeatherData,
  HourlyForecast,
  DailyForecast,
} from "@/domain/types";

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (query.trim().length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
  );
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: Record<string, unknown>) => ({
    name: r.name as string,
    admin1: (r.admin1 as string) ?? "",
    country: r.country as string,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
  }));
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  cityName: string,
  country: string,
): Promise<WeatherData> {
  const params = [
    `latitude=${lat}`,
    `longitude=${lon}`,
    `current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,surface_pressure,cloud_cover,precipitation`,
    `hourly=temperature_2m,weather_code,relative_humidity_2m,precipitation_probability`,
    `daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,sunrise,sunset,uv_index_max`,
    `timezone=auto`,
    `forecast_days=7`,
  ].join("&");

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const d = await res.json();

  const hourly: HourlyForecast[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  // Next 24 hours from current hour
  for (
    let i = currentHour;
    i < currentHour + 24 && i < d.hourly.time.length;
    i++
  ) {
    hourly.push({
      time: d.hourly.time[i],
      temp: d.hourly.temperature_2m[i],
      weatherCode: d.hourly.weather_code[i],
      humidity: d.hourly.relative_humidity_2m[i],
      precipitation: d.hourly.precipitation_probability[i],
    });
  }

  const daily: DailyForecast[] = d.daily.time.map((t: string, i: number) => ({
    date: t,
    maxTemp: d.daily.temperature_2m_max[i],
    minTemp: d.daily.temperature_2m_min[i],
    weatherCode: d.daily.weather_code[i],
    precipSum: d.daily.precipitation_sum[i],
    windMax: d.daily.wind_speed_10m_max[i],
    sunrise: d.daily.sunrise[i],
    sunset: d.daily.sunset[i],
    uvMax: d.daily.uv_index_max[i],
  }));

  return {
    city: cityName,
    country,
    latitude: lat,
    longitude: lon,
    temp: d.current.temperature_2m,
    feelsLike: d.current.apparent_temperature,
    humidity: d.current.relative_humidity_2m,
    windSpeed: d.current.wind_speed_10m,
    windDeg: d.current.wind_direction_10m,
    weatherCode: d.current.weather_code,
    pressure: d.current.surface_pressure,
    precipitation: d.current.precipitation,
    cloudCover: d.current.cloud_cover,
    visibility: 10, // Open-Meteo free tier doesn't provide visibility; default
    uvIndex: daily[0]?.uvMax ?? 0,
    maxTemp: daily[0]?.maxTemp ?? d.current.temperature_2m,
    minTemp: daily[0]?.minTemp ?? d.current.temperature_2m,
    sunrise: daily[0]?.sunrise ?? "",
    sunset: daily[0]?.sunset ?? "",
    hourly,
    daily,
  };
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const results = await searchCities(city);
  if (results.length === 0) throw new Error("City not found");
  const r = results[0];
  return fetchWeatherByCoords(r.latitude, r.longitude, r.name, r.country);
}

export async function fetchWeatherByLocation(): Promise<WeatherData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geo = await reverseGeocode(latitude, longitude);
          resolve(
            await fetchWeatherByCoords(
              latitude,
              longitude,
              geo.city,
              geo.country,
            ),
          );
        } catch (e) {
          reject(e);
        }
      },
      () => reject(new Error("Location permission denied")),
    );
  });
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<{ city: string; country: string }> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
  );
  const geo = await res.json();
  return {
    city: geo.city || geo.locality || "Unknown Location",
    country: geo.countryName || "",
  };
}

export async function fetchWeatherByLatLon(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const { city, country } = await reverseGeocode(lat, lon);
  return fetchWeatherByCoords(lat, lon, city, country);
}
