import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Star,
  Thermometer,
  Wind,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { LocationResult, TempUnit, SpeedUnit, SavedLocation } from '../types';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  onSelectLocation: (loc: { name: string; country?: string; admin1?: string; latitude: number; longitude: number; timezone?: string }) => void;
  onUseGeolocation: () => void;
  isGeoLoading: boolean;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  onToggleTempUnit: () => void;
  onToggleSpeedUnit: () => void;
  savedLocations: SavedLocation[];
  onOpenSavedDrawer: () => void;
  currentLocationName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectLocation,
  onUseGeolocation,
  isGeoLoading,
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
  savedLocations,
  onOpenSavedDrawer,
  currentLocationName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchCities(query);
        setResults(res);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationResult) => {
    onSelectLocation({
      name: loc.name,
      country: loc.country,
      admin1: loc.admin1,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone,
    });
    setQuery('');
    setIsOpen(false);
  };

  const favoriteCount = savedLocations.filter((s) => s.isFavorite).length;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
              Weather Intelligence
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open-Meteo API</span>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md mx-2" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
              placeholder="Search city (e.g., Tokyo, London, Paris, New York)..."
              className="w-full pl-9 pr-20 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              id="city-search-input"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-12 p-1 text-slate-400 hover:text-slate-200"
                title="Clear search"
                id="clear-search-btn"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onUseGeolocation}
              disabled={isGeoLoading}
              title="Use my current GPS location"
              className="absolute right-1.5 p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/20 transition-all disabled:opacity-50"
              id="geo-location-btn"
            >
              {isGeoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Searching worldwide cities...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="py-1 divide-y divide-slate-800/60">
                  {results.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                      id={`location-result-${loc.id}`}
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-200 group-hover:text-sky-400 transition-colors">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-slate-400">
                  No cities found for &quot;{query}&quot;. Try another search.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Unit Toggles & Saved Cities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Temperature Unit Toggle */}
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1 transition-all"
            title="Toggle Temperature Unit (°C / °F)"
            id="temp-unit-toggle"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>°{tempUnit.toUpperCase()}</span>
          </button>

          {/* Speed Unit Toggle */}
          <button
            onClick={onToggleSpeedUnit}
            className="hidden sm:flex px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 items-center gap-1 transition-all"
            title="Toggle Wind Speed Unit"
            id="speed-unit-toggle"
          >
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>{speedUnit}</span>
          </button>

          {/* Saved Cities Button */}
          <button
            onClick={onOpenSavedDrawer}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 hover:from-sky-500/20 hover:to-indigo-500/20 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
            title="View saved and favorite cities"
            id="saved-cities-btn"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span className="hidden md:inline">Saved</span>
            <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {savedLocations.length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
