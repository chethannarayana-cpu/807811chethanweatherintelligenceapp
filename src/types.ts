export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index?: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  uv_index: number[];
  is_day: number[];
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: CurrentWeatherData;
  hourly_units?: Record<string, string>;
  hourly?: HourlyWeatherData;
  daily_units?: Record<string, string>;
  daily?: DailyWeatherData;
}

export interface AirQualityResponse {
  latitude: number;
  longitude: number;
  current?: {
    time: string;
    us_aqi?: number;
    pm10?: number;
    pm2_5?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
    european_aqi?: number;
  };
}

export type TempUnit = 'c' | 'f';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';
export type DistanceUnit = 'km' | 'mi';

export interface SavedLocation {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isFavorite: boolean;
  addedAt: number;
}

export interface ActivityScore {
  name: string;
  score: number; // 0 to 100
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Unfavorable';
  icon: string;
  tip: string;
}

export interface WeatherIntelligence {
  summary: string;
  clothingTips: string[];
  activityScores: ActivityScore[];
  healthWarnings: {
    type: 'uv' | 'wind' | 'temp' | 'aqi' | 'rain';
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'alert';
  }[];
  commuteAdvice: string;
  bestTimeOutdoor: string;
}
