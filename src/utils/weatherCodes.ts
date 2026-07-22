import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Sparkles,
  LucideIcon
} from 'lucide-react';

export interface WeatherCodeInfo {
  label: string;
  icon: LucideIcon;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';
}

export function getWeatherCodeInfo(code: number, isDay: number = 1): WeatherCodeInfo {
  const night = isDay === 0;

  switch (code) {
    case 0:
      return {
        label: night ? 'Clear Night' : 'Clear Sky',
        icon: Sun,
        bgGradient: night
          ? 'from-slate-950 via-indigo-950 to-slate-900'
          : 'from-amber-500/10 via-sky-500/10 to-indigo-500/10',
        cardBg: night ? 'bg-indigo-950/40 border-indigo-900/50' : 'bg-amber-500/5 border-amber-500/20',
        accentColor: night ? 'text-indigo-400' : 'text-amber-500',
        category: 'clear',
      };

    case 1:
      return {
        label: night ? 'Mostly Clear' : 'Mainly Clear',
        icon: CloudSun,
        bgGradient: night
          ? 'from-slate-950 via-slate-900 to-indigo-950'
          : 'from-sky-400/10 via-blue-500/10 to-amber-500/10',
        cardBg: 'bg-sky-500/5 border-sky-500/20',
        accentColor: 'text-sky-500',
        category: 'clear',
      };

    case 2:
      return {
        label: 'Partly Cloudy',
        icon: CloudSun,
        bgGradient: 'from-blue-500/10 via-sky-500/10 to-slate-500/10',
        cardBg: 'bg-blue-500/5 border-blue-500/20',
        accentColor: 'text-sky-500',
        category: 'cloudy',
      };

    case 3:
      return {
        label: 'Overcast',
        icon: Cloud,
        bgGradient: 'from-slate-600/10 via-slate-500/10 to-gray-600/10',
        cardBg: 'bg-slate-500/5 border-slate-500/20',
        accentColor: 'text-slate-400',
        category: 'cloudy',
      };

    case 45:
    case 48:
      return {
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        icon: CloudFog,
        bgGradient: 'from-slate-500/10 via-teal-500/10 to-gray-500/10',
        cardBg: 'bg-teal-500/5 border-teal-500/20',
        accentColor: 'text-teal-400',
        category: 'fog',
      };

    case 51:
    case 53:
    case 55:
      return {
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        icon: CloudDrizzle,
        bgGradient: 'from-cyan-500/10 via-blue-500/10 to-slate-500/10',
        cardBg: 'bg-cyan-500/5 border-cyan-500/20',
        accentColor: 'text-cyan-400',
        category: 'rain',
      };

    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        icon: CloudHail,
        bgGradient: 'from-cyan-400/10 via-blue-600/10 to-indigo-500/10',
        cardBg: 'bg-cyan-600/5 border-cyan-500/20',
        accentColor: 'text-cyan-300',
        category: 'rain',
      };

    case 61:
      return {
        label: 'Slight Rain',
        icon: CloudRain,
        bgGradient: 'from-blue-600/10 via-sky-500/10 to-slate-600/10',
        cardBg: 'bg-blue-500/5 border-blue-500/20',
        accentColor: 'text-blue-400',
        category: 'rain',
      };

    case 63:
      return {
        label: 'Moderate Rain',
        icon: CloudRain,
        bgGradient: 'from-blue-700/10 via-cyan-600/10 to-slate-700/10',
        cardBg: 'bg-blue-600/5 border-blue-500/20',
        accentColor: 'text-blue-500',
        category: 'rain',
      };

    case 65:
      return {
        label: 'Heavy Rain',
        icon: CloudRain,
        bgGradient: 'from-blue-800/15 via-indigo-900/15 to-slate-900/15',
        cardBg: 'bg-blue-700/10 border-blue-600/30',
        accentColor: 'text-blue-600',
        category: 'rain',
      };

    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        icon: CloudHail,
        bgGradient: 'from-indigo-600/10 via-cyan-500/10 to-blue-700/10',
        cardBg: 'bg-indigo-500/5 border-indigo-500/20',
        accentColor: 'text-indigo-400',
        category: 'rain',
      };

    case 71:
    case 73:
    case 75:
      return {
        label: code === 71 ? 'Slight Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        icon: CloudSnow,
        bgGradient: 'from-sky-300/10 via-indigo-300/10 to-blue-200/10',
        cardBg: 'bg-sky-400/5 border-sky-400/20',
        accentColor: 'text-sky-300',
        category: 'snow',
      };

    case 77:
      return {
        label: 'Snow Grains',
        icon: Sparkles,
        bgGradient: 'from-blue-200/10 via-slate-300/10 to-sky-300/10',
        cardBg: 'bg-slate-300/5 border-slate-300/20',
        accentColor: 'text-sky-200',
        category: 'snow',
      };

    case 80:
    case 81:
    case 82:
      return {
        label: code === 80 ? 'Light Rain Showers' : code === 81 ? 'Rain Showers' : 'Violent Rain Showers',
        icon: CloudRain,
        bgGradient: 'from-blue-600/10 via-sky-600/10 to-slate-700/10',
        cardBg: 'bg-blue-500/5 border-blue-500/20',
        accentColor: 'text-blue-400',
        category: 'rain',
      };

    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        icon: CloudSnow,
        bgGradient: 'from-blue-400/10 via-indigo-400/10 to-sky-300/10',
        cardBg: 'bg-blue-400/5 border-blue-400/20',
        accentColor: 'text-sky-300',
        category: 'snow',
      };

    case 95:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        bgGradient: 'from-purple-900/15 via-indigo-900/15 to-slate-900/15',
        cardBg: 'bg-purple-900/10 border-purple-600/30',
        accentColor: 'text-amber-400',
        category: 'storm',
      };

    case 96:
    case 99:
      return {
        label: 'Thunderstorm & Hail',
        icon: CloudLightning,
        bgGradient: 'from-purple-950/20 via-rose-950/15 to-slate-950/20',
        cardBg: 'bg-purple-950/20 border-purple-500/30',
        accentColor: 'text-amber-400',
        category: 'storm',
      };

    default:
      return {
        label: 'Partly Cloudy',
        icon: CloudSun,
        bgGradient: 'from-blue-500/10 via-sky-500/10 to-slate-500/10',
        cardBg: 'bg-blue-500/5 border-blue-500/20',
        accentColor: 'text-sky-400',
        category: 'cloudy',
      };
  }
}
