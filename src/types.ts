export interface GeoResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  weatherCode: number;
  humidity: number;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipSum: number;
  windMax: number;
  sunrise: string;
  sunset: string;
  uvMax: number;
}

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  cloudCover: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  weatherCard?: WeatherData;
}

export type Intent =
  | "temperature"
  | "humidity"
  | "wind"
  | "feels_like"
  | "max_temp"
  | "min_temp"
  | "full";
