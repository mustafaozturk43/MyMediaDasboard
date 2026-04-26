import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { AppContext } from './AppContext'
import type { WeatherState } from './AppContext'
import { audioPlayer, type PlaybackState } from '../lib/audio/audio-player'
import {
  countPhotos,
  createPhoto,
  createQuote,
  createStation,
  deletePhoto,
  deleteQuote,
  deleteStation,
  emptyAppSnapshot,
  loadAppSnapshot,
  mergeSettingsWithDefaults,
  saveSettings,
  saveWeatherCache,
  updateQuote as persistQuoteUpdate,
  updateStation as persistStationUpdate,
} from '../lib/storage/app-storage'
import { fetchCurrentWeather, requestGeolocation, reverseGeocode } from '../lib/weather'
import type { AppSnapshot, AppSettings, Photo } from '../lib/storage/types'
import { normalizeQuote, validatePhotoCount, validateStationInput } from '../lib/validation'

export function AppProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(emptyAppSnapshot)
  const isMountedRef = useRef(true)
  const [stationVolume, setStationVolumeState] = useState(0.72)
  const [playback, setPlayback] = useState<PlaybackState>({
    activeStationId: null,
    status: 'idle',
    errorMessage: null,
  })
  const [weather, setWeather] = useState<WeatherState>({
    status: 'idle',
    errorMessage: null as string | null,
  })

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    function mergeById<T extends { id: string }>(incomingItems: T[], currentItems: T[]) {
      const mergedMap = new Map<string, T>()

      for (const incomingItem of incomingItems) {
        mergedMap.set(incomingItem.id, incomingItem)
      }

      for (const currentItem of currentItems) {
        mergedMap.set(currentItem.id, currentItem)
      }

      return [...mergedMap.values()]
    }

    loadAppSnapshot()
      .then((nextSnapshot) => {
        if (!cancelled) {
          setSnapshot((currentSnapshot) => ({
            stations: mergeById(nextSnapshot.stations, currentSnapshot.stations),
            photos: mergeById(nextSnapshot.photos, currentSnapshot.photos),
            quotes: mergeById(nextSnapshot.quotes, currentSnapshot.quotes),
            settings: nextSnapshot.settings,
            weatherCache: currentSnapshot.weatherCache ?? nextSnapshot.weatherCache,
          }))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSnapshot(emptyAppSnapshot())
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const addStation = useCallback(async (input: { name: string; streamUrl: string; logoUrl?: string; isFavorite?: boolean }) => {
    const validStation = validateStationInput(input)
    const station = await createStation({
      ...validStation,
      logoUrl: input.logoUrl?.trim() || null,
      isFavorite: input.isFavorite ?? false,
    })

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      stations: [station, ...currentSnapshot.stations],
    }))

    return station
  }, [])

  const updateStation = useCallback(async (stationId: string, input: { name: string; streamUrl: string; logoUrl?: string; isFavorite?: boolean }) => {
    const validStation = validateStationInput(input)
    const station = await persistStationUpdate(stationId, {
      ...validStation,
      logoUrl: input.logoUrl?.trim() || null,
      isFavorite: input.isFavorite,
    })

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      stations: currentSnapshot.stations.map((item) => (item.id === stationId ? station : item)),
    }))

    return station
  }, [])

  const removeStation = useCallback(async (stationId: string) => {
    await deleteStation(stationId)
    audioPlayer.stop()

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      stations: currentSnapshot.stations.filter((station) => station.id !== stationId),
      settings: {
        ...currentSnapshot.settings,
        defaultStationId:
          currentSnapshot.settings.defaultStationId === stationId
            ? null
            : currentSnapshot.settings.defaultStationId,
        lastStationId:
          currentSnapshot.settings.lastStationId === stationId ? null : currentSnapshot.settings.lastStationId,
      },
    }))

    setPlayback((currentPlayback) =>
      currentPlayback.activeStationId === stationId
        ? {
            activeStationId: null,
            status: 'idle',
            errorMessage: null,
          }
        : currentPlayback,
    )
  }, [])

  const toggleStationFavorite = useCallback(async (stationId: string) => {
    const station = snapshot.stations.find((item) => item.id === stationId)

    if (!station) {
      return
    }

    const nextStation = await persistStationUpdate(stationId, {
      name: station.name,
      streamUrl: station.streamUrl,
      logoUrl: station.logoUrl,
      isFavorite: !station.isFavorite,
    })

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      stations: currentSnapshot.stations.map((item) => (item.id === stationId ? nextStation : item)),
    }))
  }, [snapshot.stations])

  const addPhoto = useCallback(async (file: File) => {
    const existingPhotoCount = await countPhotos()

    validatePhotoCount(existingPhotoCount + 1)

    if (!file.type.startsWith('image/')) {
      throw new Error('Yalnizca fotograf dosyalari yuklenebilir.')
    }

    const photo = await createPhoto(file)

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      photos: [...currentSnapshot.photos, photo],
    }))

    return photo
  }, [])

  const addPhotos = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      return []
    }

    const existingPhotoCount = await countPhotos()
    validatePhotoCount(existingPhotoCount + files.length)

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        throw new Error('Yalnizca fotograf dosyalari yuklenebilir.')
      }
    }

    const photos: Photo[] = []

    for (const file of files) {
      photos.push(await createPhoto(file))
    }

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      photos: [...currentSnapshot.photos, ...photos],
    }))

    return photos
  }, [])

  const removePhoto = useCallback(async (photoId: string) => {
    await deletePhoto(photoId)

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      photos: currentSnapshot.photos.filter((photo) => photo.id !== photoId),
    }))
  }, [])

  const addQuote = useCallback(async (text: string) => {
    const normalizedText = normalizeQuote(text)
    const quote = await createQuote(normalizedText)

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      quotes: [quote, ...currentSnapshot.quotes],
    }))

    return quote
  }, [])

  const updateQuote = useCallback(async (quoteId: string, text: string) => {
    const normalizedText = normalizeQuote(text)
    const quote = await persistQuoteUpdate(quoteId, normalizedText)

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      quotes: currentSnapshot.quotes.map((item) => (item.id === quoteId ? quote : item)),
    }))

    return quote
  }, [])

  const removeQuote = useCallback(async (quoteId: string) => {
    await deleteQuote(quoteId)

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      quotes: currentSnapshot.quotes.filter((quote) => quote.id !== quoteId),
    }))
  }, [])

  const updateSettings = useCallback(async (input: Partial<AppSettings>) => {
    const nextSettings = mergeSettingsWithDefaults({
      ...snapshot.settings,
      ...input,
    })

    await saveSettings(nextSettings)
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      settings: nextSettings,
    }))

    return nextSettings
  }, [snapshot.settings])

  const refreshWeather = useCallback(async () => {
    if (!snapshot.settings.weatherEnabled) {
      if (isMountedRef.current) {
        setWeather({
          status: 'idle',
          errorMessage: null,
        })
      }

      return
    }

    if (isMountedRef.current) {
      setWeather({
        status: 'loading',
        errorMessage: null,
      })
    }

    let latitude = snapshot.settings.latitude
    let longitude = snapshot.settings.longitude
    let cityName = snapshot.settings.cityName

    try {
      const position = await requestGeolocation()
      latitude = position.latitude
      longitude = position.longitude

      try {
        const detectedCity = await reverseGeocode(latitude, longitude)

        if (detectedCity && detectedCity !== 'Bilinmiyor') {
          cityName = detectedCity
        }
      } catch {
        // keep settings cityName
      }
    } catch {
      // geolocation failed — use manual settings coordinates
    }

    try {
      const nextWeather = await fetchCurrentWeather(cityName, latitude, longitude)

      const cache = await saveWeatherCache({
        ...nextWeather,
        fetchedAt: new Date().toISOString(),
      })

      if (isMountedRef.current) {
        setSnapshot((currentSnapshot) => ({
          ...currentSnapshot,
          weatherCache: cache,
        }))

        setWeather({
          status: 'ready',
          errorMessage: null,
        })
      }
    } catch {
      if (isMountedRef.current) {
        setWeather({
          status: 'error',
          errorMessage: snapshot.weatherCache ? null : 'Veri alinamadi',
        })
      }
    }
  }, [snapshot.settings.cityName, snapshot.settings.latitude, snapshot.settings.longitude, snapshot.settings.weatherEnabled, snapshot.weatherCache])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshWeather()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [refreshWeather])

  const playStation = useCallback(async (stationId: string) => {
    const station = snapshot.stations.find((item) => item.id === stationId)

    if (!station) {
      setPlayback({
        activeStationId: null,
        status: 'error',
        errorMessage: 'Secilen radyo bulunamadi.',
      })
      return
    }

    try {
      audioPlayer.setVolume(stationVolume)
      await audioPlayer.play(station)
      setPlayback({
        activeStationId: stationId,
        status: 'playing',
        errorMessage: null,
      })
    } catch {
      setPlayback({
        activeStationId: null,
        status: 'error',
        errorMessage: 'Yayin baslatilamadi.',
      })
    }
  }, [snapshot.stations, stationVolume])

  const stopPlayback = useCallback(() => {
    audioPlayer.stop()
    setPlayback({
      activeStationId: null,
      status: 'idle',
      errorMessage: null,
    })
  }, [])

  const setStationVolume = useCallback((volume: number) => {
    const normalizedVolume = Math.max(0, Math.min(1, volume))
    setStationVolumeState(normalizedVolume)
    audioPlayer.setVolume(normalizedVolume)
  }, [])

  const value = useMemo(
    () => ({
      snapshot,
      playback,
      weather,
      stationVolume,
      addStation,
      updateStation,
      removeStation,
      toggleStationFavorite,
      addPhoto,
      addPhotos,
      removePhoto,
      addQuote,
      updateQuote,
      removeQuote,
      updateSettings,
      refreshWeather,
      playStation,
      stopPlayback,
      setStationVolume,
    }),
    [
      addPhoto,
      addPhotos,
      addQuote,
      addStation,
      playback,
      playStation,
      refreshWeather,
      removePhoto,
      removeQuote,
      removeStation,
      snapshot,
      stationVolume,
      stopPlayback,
      setStationVolume,
      toggleStationFavorite,
      updateQuote,
      updateSettings,
      updateStation,
      weather,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
