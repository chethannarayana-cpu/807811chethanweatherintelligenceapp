import React, { useState, useEffect, useCallback } from 'react';
import {
  ForecastResponse,
  AirQualityResponse,
  TempUnit,
  SpeedUnit,
  SavedLocation,
  WeatherIntelligence,
} from './types';
import {
  fetchWeatherData,
  fetchAirQualityData,
  reverseGeocodeLocation,
  getSavedLocations,
  saveLocation,
  toggleFavoriteLocation,
  removeSavedLocation,
  fetchAiWeatherInsights,
} from './services/weatherApi';
import { calculateWeatherIntelligence } from './utils/intelligenceEngine';
import { Header } from './components/Header';
import { SavedCitiesBar } from './components/SavedCitiesBar';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { WeatherIntelligenceSection } from './components/WeatherIntelligenceSection';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { SevenDayForecast } from './components/SevenDayForecast';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { SavedCitiesDrawer } from './components/SavedCitiesDrawer';
import { SkeletonLoader, ErrorState } from './components/SkeletonLoader';

export default function App() {
  // State variables
  const [currentLocation, setCurrentLocation] = useState<{
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }>({
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
  });

  const [weatherData, setWeatherData] = useState<ForecastResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null);
  const [intelligence, setIntelligence] = useState<WeatherIntelligence | null>(null);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TempUnit>('c');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh');

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Initialize saved locations from storage
  useEffect(() => {
    const list = getSavedLocations();
    setSavedLocations(list);
  }, []);

  // Main data fetch function
  const loadWeatherForLocation = useCallback(
    async (
      loc: { name: string; country?: string; admin1?: string; latitude: number; longitude: number; timezone?: string },
      isSilentRefresh = false
    ) => {
      if (!isSilentRefresh) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const [forecastRes, aqiRes] = await Promise.all([
          fetchWeatherData(loc.latitude, loc.longitude),
          fetchAirQualityData(loc.latitude, loc.longitude),
        ]);

        setWeatherData(forecastRes);
        setAirQuality(aqiRes);

        // Compute rule-based weather intelligence
        if (forecastRes.current) {
          const intel = calculateWeatherIntelligence(
            forecastRes.current,
            forecastRes.daily,
            loc.name
          );
          setIntelligence(intel);
        }

        // Reset AI briefing for new city so user can trigger AI report fresh
        setAiBriefing(null);
      } catch (err: any) {
        console.error('Error fetching weather:', err);
        setError(
          err?.message ||
            `Unable to fetch weather data for ${loc.name}. Please check your network connection and try again.`
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Load weather when currentLocation changes
  useEffect(() => {
    loadWeatherForLocation(currentLocation);
  }, [currentLocation, loadWeatherForLocation]);

  // Handle geolocation trigger
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const geoInfo = await reverseGeocodeLocation(lat, lon);
          const newLoc = {
            name: geoInfo.name,
            country: geoInfo.country,
            admin1: geoInfo.admin1,
            latitude: lat,
            longitude: lon,
          };
          setCurrentLocation(newLoc);
        } catch {
          setCurrentLocation({
            name: 'My GPS Location',
            latitude: lat,
            longitude: lon,
          });
        } finally {
          setIsGeoLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsGeoLoading(false);
        alert('Could not access your location. Please check browser permissions or search for a city manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // AI Briefing synthesis trigger
  const handleFetchAiBriefing = async () => {
    if (!weatherData) return;
    setIsAiLoading(true);
    try {
      const insight = await fetchAiWeatherInsights(currentLocation.name, weatherData);
      if (insight) {
        setAiBriefing(insight);
      } else {
        setAiBriefing(
          `• Atmospheric Summary: Active atmospheric circulation in ${currentLocation.name} with current temperatures around ${Math.round(
            weatherData.current?.temperature_2m || 0
          )}°C.\n• Outfit & Gear: Dress in comfortable layers and carry appropriate weather protection.\n• Activity & Travel: Maintain standard outdoor plans during daylight hours.`
        );
      }
    } catch (err) {
      console.error('AI synthesis error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Saved Cities Handlers
  const handleSelectLocation = (loc: {
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }) => {
    setCurrentLocation(loc);
  };

  const handleSaveCurrentCity = () => {
    const updated = saveLocation({
      name: currentLocation.name,
      country: currentLocation.country,
      admin1: currentLocation.admin1,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      timezone: currentLocation.timezone,
      isFavorite: true,
    });
    setSavedLocations(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteLocation(id);
    setSavedLocations(updated);
  };

  const handleRemoveSaved = (id: string) => {
    const updated = removeSavedLocation(id);
    setSavedLocations(updated);
  };

  const isCurrentSaved = savedLocations.some(
    (s) =>
      s.name.toLowerCase() === currentLocation.name.toLowerCase() ||
      (Math.abs(s.latitude - currentLocation.latitude) < 0.05 &&
        Math.abs(s.longitude - currentLocation.longitude) < 0.05)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      {/* App Header */}
      <Header
        onSelectLocation={handleSelectLocation}
        onUseGeolocation={handleUseGeolocation}
        isGeoLoading={isGeoLoading}
        tempUnit={tempUnit}
        speedUnit={speedUnit}
        onToggleTempUnit={() => setTempUnit((prev) => (prev === 'c' ? 'f' : 'c'))}
        onToggleSpeedUnit={() => setSpeedUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'))}
        savedLocations={savedLocations}
        onOpenSavedDrawer={() => setIsDrawerOpen(true)}
        currentLocationName={currentLocation.name}
      />

      {/* Quick Saved Cities Bar */}
      <SavedCitiesBar
        savedLocations={savedLocations}
        currentLocationName={currentLocation.name}
        onSelectSaved={(loc) => handleSelectLocation(loc)}
        onToggleFavorite={handleToggleFavorite}
        onRemoveSaved={handleRemoveSaved}
        onSaveCurrentLocation={handleSaveCurrentCity}
        isCurrentSaved={isCurrentSaved}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => loadWeatherForLocation(currentLocation)}
            onSearchFallback={() =>
              setCurrentLocation({
                name: 'London',
                country: 'United Kingdom',
                admin1: 'England',
                latitude: 51.5074,
                longitude: -0.1278,
              })
            }
          />
        ) : weatherData && weatherData.current ? (
          <>
            {/* 1. Hero Current Weather Card */}
            <CurrentWeatherHero
              cityName={currentLocation.name}
              country={currentLocation.country}
              admin1={currentLocation.admin1}
              current={weatherData.current}
              daily={weatherData.daily}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
              onRefresh={() => loadWeatherForLocation(currentLocation, true)}
              isRefreshing={isRefreshing}
              isFavorite={isCurrentSaved}
              onToggleFavorite={() => {
                if (isCurrentSaved) {
                  const saved = savedLocations.find(
                    (s) => s.name.toLowerCase() === currentLocation.name.toLowerCase()
                  );
                  if (saved) handleRemoveSaved(saved.id);
                } else {
                  handleSaveCurrentCity();
                }
              }}
            />

            {/* 2. Weather Intelligence & Smart Recommendations */}
            {intelligence && (
              <WeatherIntelligenceSection
                intelligence={intelligence}
                aiBriefing={aiBriefing}
                onFetchAiBriefing={handleFetchAiBriefing}
                isAiLoading={isAiLoading}
                cityName={currentLocation.name}
              />
            )}

            {/* 3. Hourly Forecast Chart & 24h Timeline */}
            {weatherData.hourly && (
              <HourlyForecastChart
                hourly={weatherData.hourly}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
              />
            )}

            {/* 4. 7-Day Forecast & Detailed Weather Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-12">
                {weatherData.daily && (
                  <SevenDayForecast
                    daily={weatherData.daily}
                    tempUnit={tempUnit}
                    speedUnit={speedUnit}
                  />
                )}
              </div>
            </div>

            {/* 5. Comprehensive Atmospheric Details Grid */}
            <div className="pt-2">
              <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
                <span>Detailed Atmospheric Metrics</span>
              </h3>
              <WeatherDetailsGrid
                current={weatherData.current}
                daily={weatherData.daily}
                airQuality={airQuality}
                tempUnit={tempUnit}
                speedUnit={speedUnit}
              />
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Weather Intelligence</span>
            <span>• Powered by Open-Meteo Public APIs</span>
          </div>
          <div>
            Free & Open-Source Global Weather Forecasting Engine
          </div>
        </div>
      </footer>

      {/* Saved Cities Slide-Over Drawer */}
      <SavedCitiesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedLocations={savedLocations}
        onSelectLocation={handleSelectLocation}
        onToggleFavorite={handleToggleFavorite}
        onRemoveLocation={handleRemoveSaved}
      />
    </div>
  );
}
