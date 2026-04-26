import { createContext, useContext } from 'react'

import type { PlaybackState } from '../lib/audio/audio-player'
import type { AppSnapshot, AppSettings, Photo, Quote, Station } from '../lib/storage/types'

export interface WeatherState {
  status: 'idle' | 'loading' | 'ready' | 'error'
  errorMessage: string | null
}

export interface AppContextValue {
  snapshot: AppSnapshot
  playback: PlaybackState
  weather: WeatherState
  stationVolume: number
  addStation: (input: { name: string; streamUrl: string; logoUrl?: string; isFavorite?: boolean }) => Promise<Station>
  updateStation: (
    stationId: string,
    input: { name: string; streamUrl: string; logoUrl?: string; isFavorite?: boolean },
  ) => Promise<Station>
  removeStation: (stationId: string) => Promise<void>
  toggleStationFavorite: (stationId: string) => Promise<void>
  addPhoto: (file: File) => Promise<Photo>
  addPhotos: (files: File[]) => Promise<Photo[]>
  removePhoto: (photoId: string) => Promise<void>
  addQuote: (text: string) => Promise<Quote>
  updateQuote: (quoteId: string, text: string) => Promise<Quote>
  removeQuote: (quoteId: string) => Promise<void>
  updateSettings: (input: Partial<AppSettings>) => Promise<AppSettings>
  refreshWeather: () => Promise<void>
  playStation: (stationId: string) => Promise<void>
  stopPlayback: () => void
  setStationVolume: (volume: number) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('AppProvider eksik.')
  }

  return context
}
