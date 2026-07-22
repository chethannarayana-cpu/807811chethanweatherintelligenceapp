import React from 'react';
import { Calendar, CloudRain, Wind, Sunrise, Sunset, Sun } from 'lucide-react';
import { DailyWeatherData, TempUnit, SpeedUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  formatTemp,
  formatDayName,
  formatDateShort,
  formatSpeed,
  formatHour,
} from '../utils/units';

interface SevenDayForecastProps {
  daily: DailyWeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  daily,
  tempUnit,
  speedUnit,
}) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate week min and max to scale visual temperature bars
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const tempRange = Math.max(1, weekMax - weekMin);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">7-Day Extended Outlook</h3>
          <p className="text-xs text-slate-400">Daily forecast, temperature spectrum & rain probability</p>
        </div>
      </div>

      {/* Daily Cards List */}
      <div className="divide-y divide-slate-800/60">
        {daily.time.map((dateStr, idx) => {
          const code = daily.weather_code[idx];
          const info = getWeatherCodeInfo(code, 1);
          const Icon = info.icon;

          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const precipProb = daily.precipitation_probability_max
            ? daily.precipitation_probability_max[idx]
            : 0;
          const maxWind = daily.wind_speed_10m_max ? daily.wind_speed_10m_max[idx] : 0;
          const uvMax = daily.uv_index_max ? daily.uv_index_max[idx] : 0;
          const sunrise = daily.sunrise ? daily.sunrise[idx] : '';
          const sunset = daily.sunset ? daily.sunset[idx] : '';

          // Calculate percentage width for min/max temperature bar relative to overall week scale
          const leftPercent = Math.max(0, ((minTemp - weekMin) / tempRange) * 100);
          const widthPercent = Math.max(8, ((maxTemp - minTemp) / tempRange) * 100);

          return (
            <div
              key={dateStr}
              className="py-3.5 hover:bg-slate-800/30 px-2 rounded-2xl transition-colors grid grid-cols-12 gap-2 sm:gap-4 items-center"
            >
              {/* Day & Date (Cols 1-3) */}
              <div className="col-span-4 sm:col-span-3">
                <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  {formatDayName(dateStr)}
                  {idx === 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-normal">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{formatDateShort(dateStr)}</div>
              </div>

              {/* Weather Condition Icon & Label (Cols 4-6) */}
              <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                <Icon className={`w-6 h-6 shrink-0 ${info.accentColor}`} />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200">{info.label}</div>
                  {precipProb > 0 && (
                    <div className="text-[10px] text-sky-400 flex items-center gap-1">
                      <CloudRain className="w-3 h-3" />
                      <span>{precipProb}% rain</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Temp Range Bar & Min/Max Temps (Cols 7-12) */}
              <div className="col-span-4 sm:col-span-6 flex items-center justify-end sm:justify-between gap-2 sm:gap-4">
                <span className="text-xs font-medium text-slate-400 w-12 text-right">
                  {formatTemp(minTemp, tempUnit)}
                </span>

                {/* Visual spectrum bar */}
                <div className="hidden sm:block flex-1 bg-slate-950 h-2.5 rounded-full relative overflow-hidden border border-slate-800">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-12 text-left">
                  {formatTemp(maxTemp, tempUnit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
