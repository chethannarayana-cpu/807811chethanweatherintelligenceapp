import { LocationResult, ForecastResponse, AirQualityResponse, SavedLocation } from '../types';

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Search cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to search locations');
  }

  const data = await res.json();
  if (!data.results) return [];

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation,
    feature_code: item.feature_code,
    country_code: item.country_code,
    admin1: item.admin1,
    country: item.country,
    timezone: item.timezone,
    population: item.population,
  }));
}

/**
 * Fetch Weather Forecast from Open-Meteo Forecast API
 */
export async function fetchWeatherData(lat: number, lon: number): Promise<ForecastResponse> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index',
    'is_day',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_direction_10m_dominant',
  ].join(',');

  const url = `${FORECAST_BASE}?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch weather forecast');
  }

  return await res.json();
}

/**
 * Fetch Air Quality from Open-Meteo Air Quality API
 */
export async function fetchAirQualityData(lat: number, lon: number): Promise<AirQualityResponse | null> {
  try {
    const url = `${AIR_QUALITY_BASE}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Reverse geocode latitude/longitude to name using bigdatacloud open API
 */
export async function reverseGeocodeLocation(lat: number, lon: number): Promise<{ name: string; country?: string; admin1?: string }> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        name: city,
        country: data.countryName,
        admin1: data.principalSubdivision,
      };
    }
  } catch {
    // fallback
  }
  return { name: 'My Location' };
}

/**
 * Saved / Favorite Cities Storage Helper
 */
const STORAGE_KEY = 'weather_intelligence_saved_cities';

export function getSavedLocations(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return getDefaultLocations();
}

export function saveLocation(loc: Omit<SavedLocation, 'id' | 'addedAt'>): SavedLocation[] {
  const currentList = getSavedLocations();
  const id = `${loc.latitude.toFixed(2)}_${loc.longitude.toFixed(2)}`;
  
  const existingIdx = currentList.findIndex((item) => item.id === id || (item.name === loc.name && item.country === loc.country));
  
  let updatedList: SavedLocation[] = [];
  if (existingIdx >= 0) {
    // update
    updatedList = [...currentList];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...loc,
      addedAt: Date.now(),
    };
  } else {
    // add new
    const newSaved: SavedLocation = {
      ...loc,
      id,
      addedAt: Date.now(),
    };
    updatedList = [newSaved, ...currentList].slice(0, 12); // keep top 12
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }
  return updatedList;
}

export function toggleFavoriteLocation(id: string): SavedLocation[] {
  const currentList = getSavedLocations();
  const updatedList = currentList.map((item) => {
    if (item.id === id) {
      return { ...item, isFavorite: !item.isFavorite };
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }
  return updatedList;
}

export function removeSavedLocation(id: string): SavedLocation[] {
  const currentList = getSavedLocations();
  const updatedList = currentList.filter((item) => item.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }
  return updatedList;
}

export function getDefaultLocations(): SavedLocation[] {
  return [
    {
      id: 'london_uk',
      name: 'London',
      country: 'United Kingdom',
      admin1: 'England',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London',
      isFavorite: true,
      addedAt: Date.now(),
    },
    {
      id: 'tokyo_jp',
      name: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
      timezone: 'Asia/Tokyo',
      isFavorite: true,
      addedAt: Date.now() - 1000,
    },
    {
      id: 'new_york_us',
      name: 'New York',
      country: 'United States',
      admin1: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
      isFavorite: true,
      addedAt: Date.now() - 2000,
    },
    {
      id: 'sydney_au',
      name: 'Sydney',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
      timezone: 'Australia/Sydney',
      isFavorite: false,
      addedAt: Date.now() - 3000,
    },
  ];
}

/**
 * Fetch AI Insights from Express backend endpoint if available
 */
export async function fetchAiWeatherInsights(
  cityName: string,
  weatherData: ForecastResponse
): Promise<string | null> {
  try {
    const res = await fetch('/api/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName, weatherData }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.insight || null;
    }
  } catch {
    // Fallback to client rule-based summary
  }
  return null;
}
