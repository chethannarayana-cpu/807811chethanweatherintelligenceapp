import React from 'react';
import {
  Wind,
  Sun,
  Droplets,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Compass,
  Activity,
  Cloud,
} from 'lucide-react';
import {
  CurrentWeatherData,
  DailyWeatherData,
  AirQualityResponse,
  TempUnit,
  SpeedUnit,
} from '../types';
import {
  formatSpeed,
  getWindDirection,
  getAqiCategory,
  getUvCategory,
  formatVisibility,
  formatPressure,
  formatTemp,
  formatHour,
} from '../utils/units';

interface WeatherDetailsGridProps {
  current: CurrentWeatherData;
  daily?: DailyWeatherData;
  airQuality?: AirQualityResponse | null;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  current,
  daily,
  airQuality,
  tempUnit,
  speedUnit,
}) => {
  const windDir = getWindDirection(current.wind_direction_10m);
  const windGusts = current.wind_gusts_10m;

  const uv = current.uv_index ?? (daily?.uv_index_max ? daily.uv_index_max[0] : 0);
  const uvCat = getUvCategory(uv);

  const aqiVal = airQuality?.current?.us_aqi;
  const aqiCat = getAqiCategory(aqiVal);

  const sunriseStr = daily?.sunrise ? formatHour(daily.sunrise[0]) : '06:00 AM';
  const sunsetStr = daily?.sunset ? formatHour(daily.sunset[0]) : '08:00 PM';

  // Calculate daylight percentage
  let daylightPct = 50;
  if (daily?.sunrise && daily?.sunset) {
    try {
      const rise = new Date(daily.sunrise[0]).getTime();
      const set = new Date(daily.sunset[0]).getTime();
      const now = Date.now();
      if (now <= rise) daylightPct = 0;
      else if (now >= set) daylightPct = 100;
      else daylightPct = Math.round(((now - rise) / (set - rise)) * 100);
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* CARD 1: Wind & Compass Vector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Wind & Gusts</h4>
              <p className="text-[11px] text-slate-400">Directional vector & peak speed</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
            {windDir}
          </span>
        </div>

        <div className="py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl font-extrabold text-white">
              {formatSpeed(current.wind_speed_10m, speedUnit)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Peak Gusts: <strong className="text-slate-200">{formatSpeed(windGusts, speedUnit)}</strong>
            </div>
          </div>

          {/* Compass Rose Widget */}
          <div className="relative w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
            <div className="absolute text-[8px] font-bold text-slate-500 top-0.5">N</div>
            <div className="absolute text-[8px] font-bold text-slate-500 bottom-0.5">S</div>
            <div className="absolute text-[8px] font-bold text-slate-500 left-0.5">W</div>
            <div className="absolute text-[8px] font-bold text-slate-500 right-0.5">E</div>

            {/* Compass Pointer Needle */}
            <div
              className="w-1 h-10 bg-gradient-to-b from-rose-500 via-sky-400 to-slate-600 rounded-full transition-transform duration-700"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          Wind direction angle: {Math.round(current.wind_direction_10m)}° from North
        </div>
      </div>

      {/* CARD 2: UV Index Gauge */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">UV Solar Radiation</h4>
              <p className="text-[11px] text-slate-400">Sun safety & burn index</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${uvCat.color}`}>
            {uvCat.label}
          </span>
        </div>

        <div className="py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{uv.toFixed(1)}</span>
            <span className="text-xs text-slate-400">/ 12</span>
          </div>

          {/* UV Scale Meter */}
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden my-3 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-purple-600 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (uv / 12) * 100)}%` }}
            />
          </div>

          <div className="text-xs text-slate-300 line-clamp-2">{uvCat.advice}</div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          Max daily UV expected: {daily?.uv_index_max ? daily.uv_index_max[0].toFixed(1) : uv.toFixed(1)}
        </div>
      </div>

      {/* CARD 3: Air Quality Index (AQI) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Air Quality (US AQI)</h4>
              <p className="text-[11px] text-slate-400">Atmospheric cleanliness & particulate count</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${aqiCat.color}`}>
            {aqiCat.label}
          </span>
        </div>

        <div className="py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{aqiVal ?? '--'}</span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>

          <p className="text-xs text-slate-300 mt-2 line-clamp-2">{aqiCat.description}</p>

          {airQuality?.current?.pm2_5 !== undefined && (
            <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-400">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                PM2.5: <strong className="text-slate-200">{airQuality.current.pm2_5.toFixed(1)} µg/m³</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                PM10: <strong className="text-slate-200">{airQuality.current.pm10 ? airQuality.current.pm10.toFixed(1) : '--'} µg/m³</strong>
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          Open-Meteo Air Quality Monitoring
        </div>
      </div>

      {/* CARD 4: Humidity & Dew Point */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Humidity & Dew Point</h4>
              <p className="text-[11px] text-slate-400">Moisture & comfort saturation</p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="text-3xl font-extrabold text-white">{current.relative_humidity_2m}%</div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden my-3 border border-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${current.relative_humidity_2m}%` }}
            />
          </div>

          <div className="text-xs text-slate-300">
            Dew Point is currently around{' '}
            <strong className="text-white">
              {formatTemp(current.temperature_2m - (100 - current.relative_humidity_2m) / 5, tempUnit)}
            </strong>.
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          {current.relative_humidity_2m > 75 ? 'Humid & muggy atmosphere' : 'Comfortable dry air'}
        </div>
      </div>

      {/* CARD 5: Sun Cycle & Daylight */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sun Cycle & Daylight</h4>
              <p className="text-[11px] text-slate-400">Sunrise, sunset & progression</p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Sunrise</div>
                <div className="text-sm font-bold text-white">{sunriseStr}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">Sunset</div>
                <div className="text-sm font-bold text-white">{sunsetStr}</div>
              </div>
            </div>
          </div>

          {/* Daylight progress bar */}
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden my-2 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${daylightPct}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          {current.is_day ? 'Daylight active' : 'Nighttime hours'}
        </div>
      </div>

      {/* CARD 6: Cloud Cover & Pressure */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cloud Cover & Pressure</h4>
              <p className="text-[11px] text-slate-400">Sky coverage & surface pressure</p>
            </div>
          </div>
        </div>

        <div className="py-4 space-y-3">
          <div>
            <div className="text-xs text-slate-400">Cloud Coverage</div>
            <div className="text-2xl font-extrabold text-white">{current.cloud_cover}%</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Sea Level Pressure</div>
            <div className="text-base font-bold text-slate-200">
              {formatPressure(current.pressure_msl || current.surface_pressure, false)}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          Barometric pressure stability index
        </div>
      </div>
    </div>
  );
};
