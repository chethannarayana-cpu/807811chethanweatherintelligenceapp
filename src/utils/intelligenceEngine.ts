import { CurrentWeatherData, DailyWeatherData, WeatherIntelligence, ActivityScore } from '../types';
import { getWeatherCodeInfo } from './weatherCodes';

export function calculateWeatherIntelligence(
  current: CurrentWeatherData,
  daily?: DailyWeatherData,
  locationName: string = 'your location'
): WeatherIntelligence {
  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m;
  const precip = current.precipitation;
  const codeInfo = getWeatherCodeInfo(current.weather_code, current.is_day);
  const uv = current.uv_index ?? (daily?.uv_index_max ? daily.uv_index_max[0] : 0);

  // 1. Clothing & Gear Checklist
  const clothingTips: string[] = [];
  if (temp < 0) {
    clothingTips.push('Heavy winter coat, thermal gloves, wool hat & scarf');
  } else if (temp < 10) {
    clothingTips.push('Warm jacket, sweater, and closed-toe shoes');
  } else if (temp < 18) {
    clothingTips.push('Light jacket or fleece pullover with jeans/pants');
  } else if (temp < 26) {
    clothingTips.push('Breathable cotton t-shirt, light trousers or jeans');
  } else if (temp < 33) {
    clothingTips.push('Light linen/cotton clothes, shorts, and sunglasses');
  } else {
    clothingTips.push('Ultra-breathable summer wear, sunhat, and hydration bottle');
  }

  if (precip > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(current.weather_code)) {
    clothingTips.push('Waterproof raincoat, boots & sturdy umbrella');
  } else if (daily?.precipitation_probability_max && daily.precipitation_probability_max[0] > 40) {
    clothingTips.push('Keep a compact umbrella in your bag just in case');
  }

  if (uv >= 5) {
    clothingTips.push('Apply SPF 30+ sunscreen and wear UV protection sunglasses');
  }

  // 2. Outdoor Activities Scoring (0 to 100)
  const activityScores: ActivityScore[] = [];

  // Running / Jogging
  let runScore = 100;
  if (temp < 5 || temp > 28) runScore -= Math.abs(temp - 18) * 3;
  if (humidity > 80) runScore -= 15;
  if (wind > 25) runScore -= 20;
  if (precip > 0) runScore -= 40;
  if (current.weather_code >= 95) runScore = 0;
  runScore = Math.max(0, Math.min(100, Math.round(runScore)));

  activityScores.push({
    name: 'Running & Jogging',
    score: runScore,
    rating: runScore > 80 ? 'Excellent' : runScore > 60 ? 'Good' : runScore > 40 ? 'Moderate' : 'Poor',
    icon: 'Activity',
    tip: runScore > 75 ? 'Optimal temperature and wind conditions for a run.' : runScore > 50 ? 'Manageable pace, stay hydrated.' : 'Consider an indoor treadmill session.',
  });

  // Cycling
  let bikeScore = 100;
  if (wind > 20) bikeScore -= (wind - 20) * 2.5;
  if (precip > 0) bikeScore -= 50;
  if (temp < 5 || temp > 32) bikeScore -= 25;
  bikeScore = Math.max(0, Math.min(100, Math.round(bikeScore)));

  activityScores.push({
    name: 'Outdoor Cycling',
    score: bikeScore,
    rating: bikeScore > 80 ? 'Excellent' : bikeScore > 60 ? 'Good' : bikeScore > 40 ? 'Moderate' : 'Poor',
    icon: 'Bike',
    tip: wind > 25 ? 'Strong headwinds detected; exercise caution on open routes.' : 'Great day for a ride.',
  });

  // Stargazing / Night sky
  let starScore = 100 - current.cloud_cover;
  if (current.is_day) starScore = 0;
  if (precip > 0) starScore = 0;
  starScore = Math.max(0, Math.min(100, Math.round(starScore)));

  activityScores.push({
    name: 'Stargazing & Astronomy',
    score: starScore,
    rating: starScore > 80 ? 'Excellent' : starScore > 50 ? 'Moderate' : 'Unfavorable',
    icon: 'Moon',
    tip: current.is_day ? 'Available after dusk.' : starScore > 70 ? 'Clear skies ahead for telescope viewing.' : 'Clouds may obstruct night view.',
  });

  // Gardening / Lawn Care
  let gardenScore = 85;
  if (precip > 5) gardenScore -= 30; // heavy rain
  if (temp < 2 || temp > 35) gardenScore -= 35;
  gardenScore = Math.max(0, Math.min(100, Math.round(gardenScore)));

  activityScores.push({
    name: 'Gardening & Plants',
    score: gardenScore,
    rating: gardenScore > 75 ? 'Excellent' : gardenScore > 50 ? 'Good' : 'Poor',
    icon: 'Flower2',
    tip: precip > 0 ? 'Natural rain is watering your soil today.' : temp > 30 ? 'Water early in morning or late evening.' : 'Ideal conditions for outdoor gardening.',
  });

  // 3. Health & Environmental Warnings
  const healthWarnings: WeatherIntelligence['healthWarnings'] = [];

  if (uv >= 6) {
    healthWarnings.push({
      type: 'uv',
      title: `High UV Exposure (${uv.toFixed(1)})`,
      description: 'Sunburn risk is high between 11 AM and 4 PM. Apply sunscreen generously.',
      severity: uv >= 8 ? 'alert' : 'warning',
    });
  }

  if (wind >= 35) {
    healthWarnings.push({
      type: 'wind',
      title: `Strong Wind Gusts (${Math.round(wind)} km/h)`,
      description: 'Watch for falling tree branches or unstable light structures.',
      severity: wind >= 50 ? 'alert' : 'warning',
    });
  }

  if (temp >= 33) {
    healthWarnings.push({
      type: 'temp',
      title: `Heat Caution (${Math.round(temp)}°C / Feels like ${Math.round(apparentTemp)}°C)`,
      description: 'High thermal index. Drink water regularly and take indoor cooling breaks.',
      severity: temp >= 37 ? 'alert' : 'warning',
    });
  } else if (temp <= 0) {
    healthWarnings.push({
      type: 'temp',
      title: `Freezing Temperature (${Math.round(temp)}°C)`,
      description: 'Frost risk. Dress in thermal layers to protect exposed skin.',
      severity: 'warning',
    });
  }

  if (humidity >= 85) {
    healthWarnings.push({
      type: 'rain',
      title: 'High Humidity & Muggy Air',
      description: 'Moisture content is elevated, which can make air feel warmer and heavy.',
      severity: 'info',
    });
  }

  // 4. Commute & Travel Advice
  let commuteAdvice = 'Road conditions are dry and clear. Standard commute expected.';
  if (current.weather_code >= 95) {
    commuteAdvice = 'Severe thunderstorm risk! Drive with headlights on and maintain extra safety distance.';
  } else if ([61, 63, 65, 80, 81, 82].includes(current.weather_code)) {
    commuteAdvice = 'Wet roads and spray reduced visibility. Allow 10-15 extra minutes for travel.';
  } else if ([71, 73, 75, 85, 86].includes(current.weather_code)) {
    commuteAdvice = 'Slippery icy/snow roads possible. Ensure snow tires and cautious braking.';
  } else if ([45, 48].includes(current.weather_code)) {
    commuteAdvice = 'Dense fog detected. Use low-beam fog lights and reduce driving speed.';
  }

  // Summary headline
  let summary = `${codeInfo.label} in ${locationName} with temperatures around ${Math.round(temp)}°C (feels like ${Math.round(apparentTemp)}°C). `;
  if (runScore > 75) {
    summary += 'Overall conditions are pleasant for outdoor activities.';
  } else if (precip > 0) {
    summary += 'Expect active precipitation throughout parts of the day.';
  } else {
    summary += 'Weather remains stable with mild breeze.';
  }

  return {
    summary,
    clothingTips,
    activityScores,
    healthWarnings,
    commuteAdvice,
    bestTimeOutdoor: temp > 28 ? 'Early morning before 10 AM or after sunset' : 'Mid-afternoon (1 PM - 5 PM)',
  };
}
