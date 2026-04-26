export interface Station {
  id: string
  name: string
  streamUrl: string
  logoUrl: string | null
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Photo {
  id: string
  name: string
  mimeType: string
  blobRef: string
  createdAt: string
}

export interface Quote {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

export interface DailyForecast {
  date: string
  conditionCode: number
  temperatureMax: number
  temperatureMin: number
}

export interface WeatherCache {
  cityName: string
  temperature: number
  conditionCode: number
  windSpeed: number | null
  humidity: number | null
  feelsLike: number | null
  forecast: DailyForecast[]
  fetchedAt: string
}

export interface AppSettings {
  cityName: string
  latitude: number
  longitude: number
  slideshowIntervalSec: number
  quoteIntervalSec: number
  defaultStationId: string | null
  lastStationId: string | null
  weatherUpdateIntervalMin: number
  weatherEnabled: boolean
  panelVisibility: {
    slideshow: boolean
    radio: boolean
    weather: boolean
    quote: boolean
  }
}

export interface AppSnapshot {
  stations: Station[]
  photos: Photo[]
  quotes: Quote[]
  settings: AppSettings
  weatherCache: WeatherCache | null
}
