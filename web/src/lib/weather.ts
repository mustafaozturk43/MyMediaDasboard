export interface WeatherApiPayload {
  cityName: string
  current: {
    temperature_2m: number
    weather_code: number
    wind_speed_10m?: number
    relative_humidity_2m?: number
    apparent_temperature?: number
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

export interface DailyForecastItem {
  date: string
  conditionCode: number
  temperatureMax: number
  temperatureMin: number
}

export interface WeatherViewModel {
  cityName: string
  temperature: number
  conditionCode: number
  windSpeed: number | null
  humidity: number | null
  feelsLike: number | null
  forecast: DailyForecastItem[]
}

export interface GeoPosition {
  latitude: number
  longitude: number
}

export function mapWeatherResponse(payload: WeatherApiPayload): WeatherViewModel {
  const forecast: DailyForecastItem[] = []

  if (payload.daily) {
    const days = Math.min(payload.daily.time.length, 3)

    for (let i = 0; i < days; i++) {
      forecast.push({
        date: payload.daily.time[i],
        conditionCode: payload.daily.weather_code[i],
        temperatureMax: payload.daily.temperature_2m_max[i],
        temperatureMin: payload.daily.temperature_2m_min[i],
      })
    }
  }

  return {
    cityName: payload.cityName,
    temperature: payload.current.temperature_2m,
    conditionCode: payload.current.weather_code,
    windSpeed: payload.current.wind_speed_10m ?? null,
    humidity: payload.current.relative_humidity_2m ?? null,
    feelsLike: payload.current.apparent_temperature ?? null,
    forecast,
  }
}

export function buildWeatherUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'weather_code',
      'wind_speed_10m',
      'relative_humidity_2m',
      'apparent_temperature',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
    ].join(','),
    forecast_days: '3',
    timezone: 'auto',
  })

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

export async function fetchCurrentWeather(cityName: string, latitude: number, longitude: number) {
  const response = await fetchWeatherWithTimeout(buildWeatherUrl(latitude, longitude))

  if (!response.ok) {
    throw new Error('Weather istegi basarisiz.')
  }

  const payload = (await response.json()) as Omit<WeatherApiPayload, 'cityName'>

  return mapWeatherResponse({
    cityName,
    current: payload.current,
    daily: payload.daily,
  })
}

export async function fetchWeatherWithTimeout(url: string, timeoutMs = 6000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function getConditionLabel(code: number): string {
  if ([0].includes(code)) return 'Acik'
  if ([1].includes(code)) return 'Cogunlukla acik'
  if ([2].includes(code)) return 'Parcali bulutlu'
  if ([3].includes(code)) return 'Kapali'
  if ([45, 48].includes(code)) return 'Sisli'
  if ([51, 53, 55].includes(code)) return 'Ciseleme'
  if ([56, 57].includes(code)) return 'Dondurucu ciseleme'
  if ([61, 63, 65].includes(code)) return 'Yagmurlu'
  if ([66, 67].includes(code)) return 'Dondurucu yagmur'
  if ([71, 73, 75, 77].includes(code)) return 'Kar yagisli'
  if ([80, 81, 82].includes(code)) return 'Saganak yagis'
  if ([85, 86].includes(code)) return 'Kar firtinasi'
  if ([95].includes(code)) return 'Gok gurultulu firtina'
  if ([96, 99].includes(code)) return 'Dolu'
  return 'Bilinmiyor'
}

export function requestGeolocation(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tarayici konum desteklemiyor.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(`Konum alinamadi: ${error.message}`))
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300_000,
      },
    )
  })
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=tr&format=json`

  try {
    const response = await fetchWeatherWithTimeout(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`,
      5000,
    )

    if (response.ok) {
      const data = (await response.json()) as {
        address?: { city?: string; town?: string; village?: string; province?: string; state?: string; county?: string }
      }
      const addr = data.address

      if (addr) {
        return addr.city || addr.town || addr.village || addr.county || addr.province || addr.state || 'Bilinmiyor'
      }
    }
  } catch {
    void url
  }

  return 'Bilinmiyor'
}
