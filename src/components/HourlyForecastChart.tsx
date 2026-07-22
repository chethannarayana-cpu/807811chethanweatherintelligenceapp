import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Thermometer, CloudRain, Wind, Sun, Clock } from 'lucide-react';
import { HourlyWeatherData, TempUnit, SpeedUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatHour, formatTempRaw, formatSpeed } from '../utils/units';

interface HourlyForecastChartProps {
  hourly: HourlyWeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

type HourlyTab = 'temp' | 'precip' | 'wind' | 'uv';

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({
  hourly,
  tempUnit,
  speedUnit,
}) => {
  const [activeTab, setActiveTab] = useState<HourlyTab>('temp');

  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Slice next 24 hours
  const next24 = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const rawTemp = hourly.temperature_2m[idx];
    const displayTemp = formatTempRaw(rawTemp, tempUnit);
    const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;
    const windSpeed = hourly.wind_speed_10m[idx];
    const uv = hourly.uv_index ? hourly.uv_index[idx] : 0;
    const weatherCode = hourly.weather_code[idx];
    const isDay = hourly.is_day ? hourly.is_day[idx] : 1;

    return {
      timeStr,
      timeLabel: idx === 0 ? 'Now' : formatHour(timeStr),
      temp: displayTemp,
      rawTemp,
      precipProb,
      windSpeed,
      windFormatted: formatSpeed(windSpeed, speedUnit),
      uv,
      weatherCode,
      isDay,
    };
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">24-Hour Timeline & Trends</h3>
            <p className="text-xs text-slate-400">Hourly breakdown of key atmospheric metrics</p>
          </div>
        </div>

        {/* Chart Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'temp'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-hourly-temp-btn"
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp (°{tempUnit.toUpperCase()})</span>
          </button>

          <button
            onClick={() => setActiveTab('precip')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'precip'
                ? 'bg-sky-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-hourly-precip-btn"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitation (%)</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'wind'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-hourly-wind-btn"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Speed</span>
          </button>

          <button
            onClick={() => setActiveTab('uv')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'uv'
                ? 'bg-purple-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-hourly-uv-btn"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV Index</span>
          </button>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'precip' ? (
            <BarChart data={next24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-sky-500/30 p-2.5 rounded-xl text-xs text-slate-200 shadow-xl">
                        <div className="font-bold text-sky-400">{data.timeLabel}</div>
                        <div>Rain Chance: <strong>{data.precipProb}%</strong></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="precipProb" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart
              data={next24}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs text-slate-200 shadow-xl">
                        <div className="font-bold text-sky-400">{data.timeLabel}</div>
                        {activeTab === 'temp' && (
                          <div>Temperature: <strong>{data.temp}°{tempUnit.toUpperCase()}</strong></div>
                        )}
                        {activeTab === 'wind' && (
                          <div>Wind Speed: <strong>{data.windFormatted}</strong></div>
                        )}
                        {activeTab === 'uv' && (
                          <div>UV Index: <strong>{data.uv.toFixed(1)}</strong></div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={activeTab === 'temp' ? 'temp' : activeTab === 'wind' ? 'windSpeed' : 'uv'}
                stroke={activeTab === 'temp' ? '#f59e0b' : activeTab === 'wind' ? '#06b6d4' : '#a855f7'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={
                  activeTab === 'temp'
                    ? 'url(#tempGradient)'
                    : activeTab === 'wind'
                    ? 'url(#windGradient)'
                    : 'url(#uvGradient)'
                }
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Horizontal Hourly Cards Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-2 scrollbar-thin scrollbar-thumb-slate-700">
        {next24.map((hour, idx) => {
          const info = getWeatherCodeInfo(hour.weatherCode, hour.isDay);
          const Icon = info.icon;

          return (
            <div
              key={idx}
              className={`shrink-0 w-24 p-3 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-200 ring-1 ring-sky-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-400 mb-1">
                {hour.timeLabel}
              </div>

              <div className="my-2 flex justify-center">
                <Icon className={`w-7 h-7 ${info.accentColor}`} />
              </div>

              <div className="text-sm font-extrabold text-white">
                {hour.temp}°
              </div>

              {hour.precipProb > 0 && (
                <div className="text-[10px] text-sky-400 font-semibold mt-1 flex items-center justify-center gap-0.5">
                  <CloudRain className="w-2.5 h-2.5" />
                  <span>{hour.precipProb}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
