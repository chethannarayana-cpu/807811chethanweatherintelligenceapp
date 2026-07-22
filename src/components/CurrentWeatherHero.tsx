import React from 'react';
import {
  MapPin,
  Clock,
  ArrowDown,
  ArrowUp,
  Droplets,
  Wind,
  Sun,
  Gauge,
  Star,
  RefreshCw,
} from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData, TempUnit, SpeedUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  formatTemp,
  formatSpeed,
  getWindDirection,
  formatPressure,
  formatDateShort,
} from '../utils/units';

interface CurrentWeatherHeroProps {
  cityName: string;
  country?: string;
  admin1?: string;
  current: CurrentWeatherData;
  daily?: DailyWeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  onRefresh: () => void;
  isRefreshing: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  cityName,
  country,
  admin1,
  current,
  daily,
  tempUnit,
  speedUnit,
  onRefresh,
  isRefreshing,
  isFavorite,
  onToggleFavorite,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weather_code, current.is_day);
  const Icon = codeInfo.icon;

  const maxTemp = daily?.temperature_2m_max ? daily.temperature_2m_max[0] : current.temperature_2m;
  const minTemp = daily?.temperature_2m_min ? daily.temperature_2m_min[0] : current.temperature_2m;

  const windDir = getWindDirection(current.wind_direction_10m);

  // Format local date
  const now = new Date();
  const dateStr = formatDateShort(now.toISOString());
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${codeInfo.cardBg} bg-gradient-to-br ${codeInfo.bgGradient} p-6 sm:p-8 text-slate-100 shadow-2xl backdrop-blur-xl transition-all duration-500`}
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {cityName}
            </h1>
            {country && (
              <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium">
                {[admin1, country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated {timeStr}, {dateStr}</span>
            <span className="text-slate-600">•</span>
            <span className="text-sky-400/90 font-semibold">{current.is_day ? 'Daytime' : 'Nighttime'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 rounded-xl transition-all disabled:opacity-50"
            title="Refresh current weather data"
            id="refresh-weather-btn"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Favorite Toggle Button */}
          <button
            onClick={onToggleFavorite}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
            }`}
            id="toggle-hero-favorite-btn"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
              }`}
            />
            <span>{isFavorite ? 'Saved' : 'Save City'}</span>
          </button>
        </div>
      </div>

      {/* Main Temperature & Visual Icon Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
        {/* Left Col: Temperature Display */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {formatTemp(current.temperature_2m, tempUnit).replace(/°[CF]/, '')}
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-sky-400 ml-1">
              °{tempUnit.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-bold text-slate-200 flex items-center gap-2">
              <span className={codeInfo.accentColor}>{codeInfo.label}</span>
            </div>
            <div className="text-sm text-slate-300 flex items-center gap-2">
              <span>Feels like <strong className="text-white">{formatTemp(current.apparent_temperature, tempUnit)}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="flex items-center text-rose-300 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <ArrowUp className="w-3 h-3 mr-0.5 text-rose-400" />
                High {formatTemp(maxTemp, tempUnit)}
              </span>
              <span className="flex items-center text-sky-300 font-semibold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                <ArrowDown className="w-3 h-3 mr-0.5 text-sky-400" />
                Low {formatTemp(minTemp, tempUnit)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Large Weather Icon Showcase */}
        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div className="relative p-6 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col items-center justify-center min-w-[180px] shadow-inner">
            <Icon className={`w-20 h-20 sm:w-24 sm:h-24 ${codeInfo.accentColor} drop-shadow-lg animate-pulse-slow`} />
            <span className="mt-2 text-xs font-medium text-slate-300 uppercase tracking-wider">
              {codeInfo.category} Conditions
            </span>
          </div>
        </div>
      </div>

      {/* Snapshot Weather Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6">
        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Humidity</div>
            <div className="text-base font-bold text-white">{current.relative_humidity_2m}%</div>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Wind</div>
            <div className="text-base font-bold text-white">
              {formatSpeed(current.wind_speed_10m, speedUnit)}
              <span className="text-xs text-sky-400 font-normal ml-1">({windDir})</span>
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">UV Index</div>
            <div className="text-base font-bold text-white">
              {(current.uv_index ?? (daily?.uv_index_max ? daily.uv_index_max[0] : 0)).toFixed(1)}
              <span className="text-[10px] text-amber-300 font-normal ml-1">
                {(current.uv_index ?? (daily?.uv_index_max ? daily.uv_index_max[0] : 0)) > 5 ? 'High' : 'Moderate'}
              </span>
            </div>
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Pressure</div>
            <div className="text-base font-bold text-white">
              {formatPressure(current.pressure_msl || current.surface_pressure, false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
