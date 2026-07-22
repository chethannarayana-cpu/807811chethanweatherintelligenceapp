import { TempUnit, SpeedUnit } from '../types';

export function formatTemp(celsius: number, unit: TempUnit): string {
  if (isNaN(celsius)) return '--';
  const val = unit === 'f' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(val)}°${unit.toUpperCase()}`;
}

export function formatTempRaw(celsius: number, unit: TempUnit): number {
  if (isNaN(celsius)) return 0;
  return Math.round(unit === 'f' ? (celsius * 9) / 5 + 32 : celsius);
}

export function formatSpeed(kmh: number, unit: SpeedUnit): string {
  if (isNaN(kmh)) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  } else if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirection(deg: number): string {
  if (isNaN(deg)) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function formatPrecipitation(mm: number, isImperial: boolean): string {
  if (isNaN(mm)) return '0';
  if (isImperial) {
    const inches = mm * 0.0393701;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatVisibility(meters: number, isImperial: boolean): string {
  if (isNaN(meters)) return 'N/A';
  const km = meters / 1000;
  if (isImperial) {
    const miles = km * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatPressure(hpa: number, isImperial: boolean): string {
  if (isNaN(hpa)) return 'N/A';
  if (isImperial) {
    return `${(hpa * 0.02953).toFixed(2)} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

export function formatHour(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return timeStr;
  }
}

export function formatDayName(dateStr: string, isShort = false): string {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { weekday: isShort ? 'short' : 'long' });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function getAqiCategory(aqi: number | undefined): { label: string; color: string; textColor: string; description: string } {
  if (!aqi || isNaN(aqi)) {
    return { label: 'Unknown', color: 'bg-slate-500', textColor: 'text-slate-400', description: 'No data available' };
  }
  if (aqi <= 50) {
    return { label: 'Good', color: 'bg-emerald-500', textColor: 'text-emerald-500', description: 'Air quality is satisfactory and poses little or no risk.' };
  }
  if (aqi <= 100) {
    return { label: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-500', description: 'Air quality is acceptable for most people.' };
  }
  if (aqi <= 150) {
    return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-500', description: 'Members of sensitive groups may experience health effects.' };
  }
  if (aqi <= 200) {
    return { label: 'Unhealthy', color: 'bg-rose-500', textColor: 'text-rose-500', description: 'Some members of the general public may experience health effects.' };
  }
  if (aqi <= 300) {
    return { label: 'Very Unhealthy', color: 'bg-purple-600', textColor: 'text-purple-500', description: 'Health alert: The risk of health effects is increased for everyone.' };
  }
  return { label: 'Hazardous', color: 'bg-red-800', textColor: 'text-red-600', description: 'Health warning of emergency conditions.' };
}

export function getUvCategory(uv: number | undefined): { label: string; color: string; textColor: string; advice: string } {
  if (uv === undefined || isNaN(uv)) {
    return { label: 'Low', color: 'bg-emerald-500', textColor: 'text-emerald-500', advice: 'No protection needed.' };
  }
  if (uv <= 2) {
    return { label: 'Low', color: 'bg-emerald-500', textColor: 'text-emerald-500', advice: 'Low danger. Enjoy the outdoors safely.' };
  }
  if (uv <= 5) {
    return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-500', advice: 'Wear sunglasses & SPF 30+ sunscreen if outside.' };
  }
  if (uv <= 7) {
    return { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-500', advice: 'Cover up, wear hat & sunglasses, seek shade 10am-4pm.' };
  }
  if (uv <= 10) {
    return { label: 'Very High', color: 'bg-rose-600', textColor: 'text-rose-500', advice: 'Extra protection required. Avoid sun during peak hours.' };
  }
  return { label: 'Extreme', color: 'bg-purple-700', textColor: 'text-purple-600', advice: 'Avoid sun exposure. Unprotected skin burns quickly.' };
}
