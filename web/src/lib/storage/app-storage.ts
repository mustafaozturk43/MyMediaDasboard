import Dexie, { type Table } from 'dexie'

import { createSeedQuotes, createSeedStations } from './seed-data'
import type { AppSettings, AppSnapshot, Photo, Quote, Station, WeatherCache } from './types'

const defaultSettings: AppSettings = {
  cityName: 'Istanbul',
  latitude: 41.0082,
  longitude: 28.9784,
  slideshowIntervalSec: 12,
  quoteIntervalSec: 10,
  defaultStationId: null,
  lastStationId: null,
  weatherUpdateIntervalMin: 30,
  weatherEnabled: true,
  panelVisibility: {
    slideshow: true,
    radio: true,
    weather: true,
    quote: true,
  },
}

class MyMediaDatabase extends Dexie {
  stations!: Table<Station>
  photos!: Table<Photo>
  quotes!: Table<Quote>
  settings!: Table<AppSettings, string>
  weatherCache!: Table<WeatherCache, string>

  constructor() {
    super('mymedia')

    this.version(1).stores({
      stations: 'id, name, streamUrl, updatedAt',
      photos: 'id, createdAt',
      quotes: 'id, updatedAt',
      settings: 'cityName',
      weatherCache: 'cityName, fetchedAt',
    })
  }
}

export const db = new MyMediaDatabase()

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function mergeSettingsWithDefaults(settings?: Partial<AppSettings>): AppSettings {
  return {
    ...defaultSettings,
    ...settings,
  }
}

export function emptyAppSnapshot(): AppSnapshot {
  return {
    stations: [],
    photos: [],
    quotes: [],
    settings: mergeSettingsWithDefaults(),
    weatherCache: null,
  }
}

export async function loadAppSnapshot(): Promise<AppSnapshot> {
  let [stations, quotes] = await Promise.all([db.stations.toArray(), db.quotes.toArray()])
  const [photos, settings, weatherCache] = await Promise.all([
    db.photos.toArray(),
    db.settings.toCollection().first(),
    db.weatherCache.orderBy('fetchedAt').last(),
  ])

  if (stations.length === 0) {
    const seedStations = createSeedStations()
    await db.stations.bulkAdd(seedStations)
    stations = seedStations
  }

  if (quotes.length === 0) {
    const seedQuotes = createSeedQuotes()
    await db.quotes.bulkAdd(seedQuotes)
    quotes = seedQuotes
  }

  return {
    stations,
    photos,
    quotes,
    settings: mergeSettingsWithDefaults(settings),
    weatherCache: weatherCache ?? null,
  }
}

export async function createStation(
  input: Pick<Station, 'name' | 'streamUrl'> & Partial<Pick<Station, 'logoUrl' | 'isFavorite'>>,
): Promise<Station> {
  const timestamp = new Date().toISOString()
  const station: Station = {
    id: createId(),
    name: input.name,
    streamUrl: input.streamUrl,
    logoUrl: input.logoUrl ?? null,
    isFavorite: input.isFavorite ?? false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await db.stations.add(station)

  return station
}

export async function updateStation(
  stationId: string,
  input: Pick<Station, 'name' | 'streamUrl'> & Partial<Pick<Station, 'logoUrl' | 'isFavorite'>>,
): Promise<Station> {
  const existingStation = await db.stations.get(stationId)

  if (!existingStation) {
    throw new Error('Istasyon bulunamadi.')
  }

  const station: Station = {
    ...existingStation,
    name: input.name,
    streamUrl: input.streamUrl,
    logoUrl: input.logoUrl ?? existingStation.logoUrl,
    isFavorite: input.isFavorite ?? existingStation.isFavorite,
    updatedAt: new Date().toISOString(),
  }

  await db.stations.put(station)

  return station
}

export async function deleteStation(stationId: string): Promise<void> {
  await db.stations.delete(stationId)
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Fotograf okunamadi.'))
    }

    reader.onerror = () => {
      reject(new Error('Fotograf okunamadi.'))
    }

    reader.readAsDataURL(file)
  })
}

export async function createPhoto(file: File): Promise<Photo> {
  const timestamp = new Date().toISOString()
  const blobRef = await readFileAsDataUrl(file)
  const photo: Photo = {
    id: createId(),
    name: file.name,
    mimeType: file.type,
    blobRef,
    createdAt: timestamp,
  }

  await db.photos.add(photo)

  return photo
}

export async function countPhotos(): Promise<number> {
  return db.photos.count()
}

export async function deletePhoto(photoId: string): Promise<void> {
  await db.photos.delete(photoId)
}

export async function createQuote(text: string): Promise<Quote> {
  const timestamp = new Date().toISOString()
  const quote: Quote = {
    id: createId(),
    text,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await db.quotes.add(quote)

  return quote
}

export async function updateQuote(quoteId: string, text: string): Promise<Quote> {
  const existingQuote = await db.quotes.get(quoteId)

  if (!existingQuote) {
    throw new Error('Soz bulunamadi.')
  }

  const quote: Quote = {
    ...existingQuote,
    text,
    updatedAt: new Date().toISOString(),
  }

  await db.quotes.put(quote)

  return quote
}

export async function deleteQuote(quoteId: string): Promise<void> {
  await db.quotes.delete(quoteId)
}

export async function saveSettings(settings: AppSettings): Promise<AppSettings> {
  await db.settings.clear()
  await db.settings.put(settings)
  return settings
}

export async function saveWeatherCache(cache: WeatherCache): Promise<WeatherCache> {
  await db.weatherCache.clear()
  await db.weatherCache.put(cache)
  return cache
}
