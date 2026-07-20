// local weather for HVAC calculations

export async function fetchCurrentWeather(location = 'default') {
  return {
    ok: true,
    location,
    data: null,
  };
}

export async function fetchWeatherForecast(location = 'default') {
  return {
    ok: true,
    location,
    forecast: [],
  };
}
