import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3 as ClockIcon,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Heart,
  Home,
  Info,
  LayoutGrid,
  MapPin,
  Menu,
  Mic,
  Pause,
  Play,
  Plus,
  QrCode,
  Quote,
  Radio,
  Search,
  Settings2,
  Sun,
  Thermometer,
  TrendingUp,
  UserCircle,
  Volume2,
  Wind,
} from 'lucide-react'

import { useAppContext } from '../app/AppContext'
import { getConditionLabel } from '../lib/weather'
import type { LucideIcon } from 'lucide-react'

function resolveWeatherIcon(conditionCode: number): LucideIcon {
  if ([0, 1].includes(conditionCode)) return Sun
  if ([2, 3].includes(conditionCode)) return Cloud
  if ([45, 48].includes(conditionCode)) return CloudFog
  if ([51, 53, 55, 56, 57].includes(conditionCode)) return CloudDrizzle
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(conditionCode)) return CloudRain
  if ([71, 73, 75, 77, 85, 86].includes(conditionCode)) return CloudSnow
  if ([95, 96, 99].includes(conditionCode)) return CloudLightning
  return Cloud
}

const turkishDayNames = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi']

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface WakeLockSentinelLike {
  release: () => Promise<void>
}

const timeFormatter = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return {
    date: dateFormatter.format(now),
    time: timeFormatter.format(now),
  }
}

function useDefaultLogoOnError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget

  image.onerror = null
  image.src = '/logo.png'
  image.classList.add('default-logo-image')
}

export function KioskScreen() {
  const {
    playback,
    playStation,
    setStationVolume,
    snapshot,
    stationVolume,
    stopPlayback,
    toggleStationFavorite,
    weather,
  } = useAppContext()
  const clock = useClock()
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false)
  const [isWeatherDetailsOpen, setIsWeatherDetailsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720)
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null)

  const activeQuote = useMemo(() => {
    if (snapshot.quotes.length === 0) {
      return 'Motive soz eklenince burada gorunecek.'
    }

    return snapshot.quotes[quoteIndex % snapshot.quotes.length]?.text ?? snapshot.quotes[0].text
  }, [quoteIndex, snapshot.quotes])
  const featuredStation = useMemo(() => {
    const sortedStations = [...snapshot.stations].sort((leftStation, rightStation) => {
      if (leftStation.isFavorite !== rightStation.isFavorite) {
        return Number(rightStation.isFavorite) - Number(leftStation.isFavorite)
      }

      return rightStation.updatedAt.localeCompare(leftStation.updatedAt)
    })

    if (playback.activeStationId) {
      return sortedStations.find((station) => station.id === playback.activeStationId) ?? sortedStations[0]
    }

    return sortedStations[0]
  }, [playback.activeStationId, snapshot.stations])
  const visibleStations = useMemo(() => {
    return [...snapshot.stations]
      .sort((leftStation, rightStation) => {
        if (leftStation.isFavorite !== rightStation.isFavorite) {
          return Number(rightStation.isFavorite) - Number(leftStation.isFavorite)
        }

        return rightStation.updatedAt.localeCompare(leftStation.updatedAt)
      })
      .slice(0, 10)
  }, [snapshot.stations])
  const activePhotoIndex = snapshot.photos.length === 0 ? 0 : slideshowIndex % snapshot.photos.length

  useEffect(() => {
    if (snapshot.photos.length <= 1 || isSlideshowPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setSlideshowIndex((currentIndex) => (currentIndex + 1) % snapshot.photos.length)
    }, snapshot.settings.slideshowIntervalSec * 1000)

    return () => window.clearInterval(timer)
  }, [isSlideshowPaused, snapshot.photos.length, snapshot.settings.slideshowIntervalSec])

  useEffect(() => {
    if (snapshot.quotes.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setQuoteIndex((currentIndex) => (currentIndex + 1) % snapshot.quotes.length)
    }, snapshot.settings.quoteIntervalSec * 1000)

    return () => window.clearInterval(timer)
  }, [snapshot.quotes.length, snapshot.settings.quoteIntervalSec])

  const activePhoto = snapshot.photos[activePhotoIndex] ?? null
  const weatherUpdatedAt = snapshot.weatherCache
    ? new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(snapshot.weatherCache.fetchedAt))
    : null
  const weatherIcon = useMemo(() => {
    return resolveWeatherIcon(snapshot.weatherCache?.conditionCode ?? -1)
  }, [snapshot.weatherCache?.conditionCode])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPromptEvent(event as BeforeInstallPromptEvent)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 720)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    async function requestWakeLock() {
      const wakeLock = (navigator as Navigator & {
        wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> }
      }).wakeLock

      if (!wakeLock) {
        return
      }

      try {
        const sentinel = await wakeLock.request('screen')
        wakeLockRef.current = sentinel
      } catch {
        wakeLockRef.current = null
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        void requestWakeLock()
      }
    }

    void requestWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (wakeLockRef.current) {
        void wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    }
  }, [])

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await document.documentElement.requestFullscreen()
  }

  async function installApp() {
    if (!installPromptEvent) {
      return
    }

    await installPromptEvent.prompt()
    await installPromptEvent.userChoice
    setInstallPromptEvent(null)
  }

  function showPreviousPhoto() {
    if (snapshot.photos.length === 0) {
      return
    }

    setSlideshowIndex((currentIndex) => (currentIndex - 1 + snapshot.photos.length) % snapshot.photos.length)
  }

  function showNextPhoto() {
    if (snapshot.photos.length === 0) {
      return
    }

    setSlideshowIndex((currentIndex) => (currentIndex + 1) % snapshot.photos.length)
  }

  if (isMobile) {
    return (
      <main className="mobile-app-shell">
        <header className="mobile-header">
          <Menu size={24} />
          <span className="mobile-header-title">Dashboard Variant 1: Card Layout</span>
          <UserCircle size={28} />
        </header>

        <section className="mobile-content-stack">
          {featuredStation ? (
            <article className="mobile-card mobile-radio-card">
              <div className="mobile-radio-logo-shell">
                {featuredStation.logoUrl ? (
                  <img alt="" onError={useDefaultLogoOnError} src={featuredStation.logoUrl} />
                ) : (
                  <Radio size={24} />
                )}
              </div>
              <div className="mobile-radio-info">
                <strong>{featuredStation.name}</strong>
                <p>Şu an çalan: {playback.status === 'playing' ? 'Canlı Yayın' : 'Yayına hazır'}</p>
              </div>
              <div className="mobile-radio-actions">
                <div className="on-air-badge">
                  <span className="pulse-dot" />
                  ON AIR
                </div>
                <button
                  className="mobile-play-btn"
                  onClick={() => {
                    if (playback.activeStationId === featuredStation.id && playback.status === 'playing') {
                      stopPlayback()
                    } else {
                      void playStation(featuredStation.id)
                    }
                  }}
                  type="button"
                >
                  {playback.activeStationId === featuredStation.id && playback.status === 'playing' ? 'Durdur' : 'Dinle'}
                </button>
              </div>
            </article>
          ) : null}

          <div className="mobile-info-row">
            <article className="mobile-card mobile-time-card">
              <div className="mobile-icon-circle">
                <Clock size={20} />
              </div>
              <div className="mobile-time-info">
                <strong>{clock.time.substring(0, 5)}</strong>
                <span>{clock.date.split(' ').slice(1).join(' ')}</span>
              </div>
            </article>

            <article className="mobile-card mobile-weather-card">
              <div className="mobile-icon-circle weather-icon-accent">
                {(() => {
                  const WeatherIcon = weatherIcon
                  return <WeatherIcon size={20} />
                })()}
              </div>
              <div className="mobile-weather-info">
                <strong>{snapshot.weatherCache ? `${Math.round(snapshot.weatherCache.temperature)}°C` : '--°C'}</strong>
                <span>{snapshot.weatherCache ? `${snapshot.weatherCache.cityName}, ${getConditionLabel(snapshot.weatherCache.conditionCode)}` : 'Konum alınıyor'}</span>
              </div>
            </article>
          </div>

          <div className="mobile-search-bar">
            <Search className="search-icon-dim" size={18} />
            <input placeholder="Google'da ara veya URL yazın" readOnly type="text" />
            <Mic size={18} />
            <QrCode size={18} />
          </div>

          {snapshot.photos.length > 0 ? (
            <div className="mobile-photo-scroller">
              {snapshot.photos.map((photo) => (
                <img alt={photo.name} className="mobile-photo-thumb" key={photo.id} src={photo.blobRef} />
              ))}
            </div>
          ) : null}

          <article className="mobile-card mobile-shortcuts-card">
            <div className="shortcuts-grid">
              <div className="shortcut-item">
                <div className="shortcut-icon-box"><img alt="Google" src="https://www.google.com/favicon.ico" /></div>
                <span>Google</span>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-icon-box"><img alt="YouTube" src="https://www.youtube.com/favicon.ico" /></div>
                <span>YouTube</span>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-icon-box"><img alt="Facebook" src="https://www.facebook.com/favicon.ico" /></div>
                <span>Facebook</span>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-icon-box"><TrendingUp size={20} /></div>
                <span>Borsa</span>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-icon-box"><img alt="Wikipedia" src="https://www.wikipedia.org/favicon.ico" /></div>
                <span>Wikipedia</span>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-icon-box add-btn-accent"><Plus size={20} /></div>
                <span>Ekle</span>
              </div>
            </div>
          </article>

          <article className="mobile-card mobile-finance-card">
            <div className="finance-ticker-top">
              <span className="finance-kicker">SON DAKİKA</span>
              <p className="finance-headline">Merkez Bankası faiz kararını açıkladı</p>
            </div>
            <div className="finance-ticker-grid">
              <div className="ticker-col">
                <span className="ticker-label">BIST 100</span>
                <strong className="ticker-value">9.876,54</strong>
                <span className="ticker-trend trend-up">↑%1,25</span>
              </div>
              <div className="ticker-col">
                <span className="ticker-label">USD / TRY</span>
                <strong className="ticker-value">30,1450</strong>
                <span className="ticker-trend trend-up">↑%0,18</span>
              </div>
            </div>
          </article>

          <div className="mobile-ad-placeholder">
            <div className="ad-content">
              <div className="ad-icon-bg" />
              <span>REKLAM ALANI 728 x 90</span>
            </div>
          </div>
        </section>

        <nav className="mobile-bottom-nav">
          <button className="nav-btn nav-btn-active" type="button"><Home size={22} /></button>
          <button className="nav-btn" type="button"><Clock size={22} /></button>
          <button className="nav-btn" type="button"><Bookmark size={22} /></button>
          <Link className="nav-btn" to="/settings"><LayoutGrid size={22} /></Link>
        </nav>
      </main>
    )
  }

  return (
    <main className="kiosk-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Tam ekran medya kiosk</p>
          <div className="brand-title-row">
            <img alt="MyMedia logosu" className="brand-logo" src="/logo.png" />
            <h1>MyMedia</h1>
          </div>
          <p className="hero-copy">Canli radyo, atmosferik gorseller ve bilgi kartlari tek sakin ekranda.</p>
        </div>
        <div className="hero-actions">
          <button className="secondary-button icon-button" onClick={() => void toggleFullscreen()} type="button">
            {isFullscreen ? 'Pencereden cik' : 'Tam ekran'}
          </button>
          {installPromptEvent ? (
            <button className="secondary-button icon-button" onClick={() => void installApp()} type="button">
              Uygulamayi yukle
            </button>
          ) : null}
          <Link aria-label="Ayarlar" className="settings-button" to="/settings">
            <Settings2 size={20} />
          </Link>
        </div>
      </header>

      <section className="kiosk-grid">
        <article className="panel panel-clock">
          <p className="panel-label">Canli Saat</p>
          <div className="clock-card-content">
            <div className="clock-icon-orbit">
              <div className="clock-icon-shell">
                <ClockIcon />
              </div>
            </div>
            <div className="clock-info">
              <strong className="clock-value">{clock.time}</strong>
              <div className="calendar-chip">
                <CalendarDays size={18} />
                <span>{clock.date}</span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel panel-slideshow">
          <p className="panel-label">Slideshow</p>
          {snapshot.settings.panelVisibility.slideshow ? (
          <div className="slideshow-stack">
            <div className="slideshow-meta-row">
              <div className="panel-empty">
              {snapshot.photos.length > 0 ? `${snapshot.photos.length} fotograf hazir` : 'Henuz fotograf eklenmedi'}
              </div>
              <div className="entity-actions">
                <button className="ghost-button icon-circle-button slideshow-control-button slideshow-control-prev" onClick={showPreviousPhoto} type="button">
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="ghost-button icon-circle-button slideshow-control-button slideshow-control-toggle"
                  onClick={() => setIsSlideshowPaused((currentValue) => !currentValue)}
                  type="button"
                >
                  {isSlideshowPaused ? <Play size={18} /> : <Pause size={18} />}
                </button>
                <button className="ghost-button icon-circle-button slideshow-control-button slideshow-control-next" onClick={showNextPhoto} type="button">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            {activePhoto ? (
              <img alt={activePhoto.name} className="slideshow-image" src={activePhoto.blobRef} />
            ) : null}
          </div>
          ) : (
            <div className="panel-hidden-placeholder">🖼️ Slayt gösterisi gizli</div>
          )}
        </article>

        <article className="panel panel-radio">
          <p className="panel-label">Radyo</p>
          {snapshot.settings.panelVisibility.radio ? (
            <div className="radio-stack">
            {visibleStations.length === 0 ? (
              <div className="panel-empty radio-panel-empty">Henuz radyo eklenmedi</div>
            ) : null}
            {featuredStation ? (
              <div className="media-card">
                <div className="media-card-glow" />
                <div className="media-player-head">
                  <div className="media-cover-wrap">
                    <div className="radio-logo-shell media-cover">
                      {featuredStation.logoUrl ? (
                        <img alt={`${featuredStation.name} logosu`} className="radio-logo-image" onError={useDefaultLogoOnError} src={featuredStation.logoUrl} />
                      ) : (
                        <img alt="Varsayilan MyMedia logosu" className="radio-logo-image default-logo-image" src="/logo.png" />
                      )}
                    </div>
                    <span className="live-orb" />
                  </div>
                  <div className="media-title-block">
                    <span className="media-kicker">Now playing</span>
                    <strong>{featuredStation.name}</strong>
                    <p className="radio-status">
                      {playback.activeStationId === featuredStation.id && playback.status === 'playing'
                        ? 'Simdi caliyor'
                        : 'Yayina hazir'}
                    </p>
                  </div>
                  <button
                    className={`ghost-button icon-circle-button media-favorite-button ${featuredStation.isFavorite ? 'favorite-active' : ''}`}
                    onClick={() => void toggleStationFavorite(featuredStation.id)}
                    type="button"
                  >
                    <Heart fill={featuredStation.isFavorite ? 'currentColor' : 'none'} size={18} />
                  </button>
                </div>
                <div className="media-wave" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                {playback.errorMessage ? <p className="error-feedback">{playback.errorMessage}</p> : null}
                <div className="player-controls">
                  <button
                    className="primary-button player-toggle-button media-play-button"
                    onClick={() => {
                      if (playback.activeStationId === featuredStation.id && playback.status === 'playing') {
                        stopPlayback()
                        return
                      }

                      void playStation(featuredStation.id)
                    }}
                    type="button"
                  >
                    {playback.activeStationId === featuredStation.id && playback.status === 'playing' ? <Pause size={18} /> : <Play size={18} />}
                    <span>
                      {playback.activeStationId === featuredStation.id && playback.status === 'playing'
                        ? 'Durdur'
                        : 'Oynat'}
                    </span>
                  </button>
                  <label className="volume-control">
                    <Volume2 size={18} />
                    <input
                      aria-label="Ses seviyesi"
                      max="1"
                      min="0"
                      onChange={(event) => setStationVolume(Number(event.target.value))}
                      step="0.01"
                      type="range"
                      value={stationVolume}
                    />
                  </label>
                </div>
              </div>
            ) : null}
            {visibleStations.length > 0 ? (
              <div className="station-grid">
                {visibleStations.map((station) => {
                  const isActive = playback.activeStationId === station.id && playback.status === 'playing'

                  return (
                    <button
                      className={`station-chip ${isActive ? 'station-chip-active' : ''}`}
                      key={station.id}
                      onClick={() => {
                        void playStation(station.id)
                      }}
                      type="button"
                    >
                      <div className="station-chip-media">
                        <div className="station-chip-logo">
                          {station.logoUrl ? (
                            <img alt={`${station.name} logosu`} className="station-chip-logo-image" onError={useDefaultLogoOnError} src={station.logoUrl} />
                          ) : (
                            <img alt="Varsayilan MyMedia logosu" className="station-chip-logo-image default-logo-image" src="/logo.png" />
                          )}
                        </div>
                        <div className="station-chip-copy">
                          <strong>{station.name}</strong>
                          <span>{station.isFavorite ? 'Favori' : 'Canli radyo'}</span>
                        </div>
                      </div>
                      {station.isFavorite ? <Heart className="favorite-chip-icon" fill="currentColor" size={16} /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
          ) : (
            <div className="panel-hidden-placeholder">📻 Radyo paneli gizli</div>
          )}
        </article>

        <article className="panel panel-weather">
          <p className="panel-label weather-panel-label">Hava Durumu</p>
          {snapshot.settings.panelVisibility.weather ? (
          <>
          {snapshot.weatherCache ? (
            <div className="weather-dashboard">
              <div className="weather-hero-row">
                <div className="weather-icon-shell weather-icon-shell-large">
                  {(() => {
                    const WeatherIcon = weatherIcon
                    return <WeatherIcon size={48} />
                  })()}
                </div>
                <div className="weather-hero-info">
                  <strong className="weather-temperature">{`${Math.round(snapshot.weatherCache.temperature)}°`}</strong>
                  <span className="weather-condition-label">{getConditionLabel(snapshot.weatherCache.conditionCode)}</span>
                </div>
              </div>
              <div className="weather-location-bar">
                <MapPin size={14} />
                <span>{snapshot.weatherCache.cityName || snapshot.settings.cityName || 'Bilinmeyen Konum'}</span>
                {weatherUpdatedAt ? <span className="weather-time-badge">{weatherUpdatedAt}</span> : null}
              </div>
              <div className="weather-metric-strip">
                <div className="weather-stat">
                  <Thermometer size={16} />
                  <div className="weather-stat-text">
                    <span>Hissedilen</span>
                    <strong>{`${snapshot.weatherCache.feelsLike ?? '-'}°C`}</strong>
                  </div>
                </div>
                <div className="weather-stat">
                  <Droplets size={16} />
                  <div className="weather-stat-text">
                    <span>Nem</span>
                    <strong>{`${snapshot.weatherCache.humidity ?? '-'}%`}</strong>
                  </div>
                </div>
                <div className="weather-stat">
                  <Wind size={16} />
                  <div className="weather-stat-text">
                    <span>Ruzgar</span>
                    <strong>{`${snapshot.weatherCache.windSpeed ?? '-'} km/s`}</strong>
                  </div>
                </div>
              </div>
              <button className="weather-detail-button" onClick={() => setIsWeatherDetailsOpen(true)} type="button">
                <Info size={14} />
                <span>Tum detaylar</span>
              </button>
              {snapshot.weatherCache.forecast.length > 0 ? (
                <div className="weather-forecast-strip">
                  {snapshot.weatherCache.forecast.map((day) => {
                    const ForecastIcon = resolveWeatherIcon(day.conditionCode)
                    const dayDate = new Date(day.date)
                    const isToday = new Date().toDateString() === dayDate.toDateString()
                    const dayLabel = isToday ? 'Bugun' : turkishDayNames[dayDate.getDay()]

                    return (
                      <div className="forecast-day" key={day.date}>
                        <span className="forecast-day-label">{dayLabel}</span>
                        <div className="forecast-day-icon">
                          <ForecastIcon size={18} />
                        </div>
                        <div className="forecast-day-temps">
                          <strong>{`${Math.round(day.temperatureMax)}°`}</strong>
                          <span>{`${Math.round(day.temperatureMin)}°`}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="weather-empty-state">
              <div className="weather-icon-shell weather-icon-shell-large weather-icon-placeholder">
                <Cloud size={42} />
              </div>
              <p>{weather.errorMessage ?? 'Konum aliniyor...'}</p>
            </div>
          )}
          </>
          ) : (
            <div className="panel-hidden-placeholder">🌤️ Hava durumu gizli</div>
          )}
        </article>

        <article className="panel panel-quote">
          <p className="panel-label">Motive Soz</p>
          {snapshot.settings.panelVisibility.quote ? (
          <div className="quote-card-content">
            <div className="quote-icon-shell">
              <Quote size={28} />
            </div>
            <blockquote className="quote-display">{activeQuote}</blockquote>
          </div>
          ) : (
            <div className="panel-hidden-placeholder">💬 Motivasyon sözleri gizli</div>
          )}
        </article>
      </section>
      {isWeatherDetailsOpen && snapshot.weatherCache ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsWeatherDetailsOpen(false)}>
          <div aria-modal="true" className="weather-modal" role="dialog" onClick={(event) => event.stopPropagation()}>
            <div className="weather-modal-head">
              <div>
                <p className="weather-kicker">Hava durumu detaylari</p>
                <h2>{snapshot.settings.cityName}</h2>
              </div>
              <button className="ghost-button icon-circle-button" onClick={() => setIsWeatherDetailsOpen(false)} type="button">
                ×
              </button>
            </div>
            <div className="weather-modal-grid">
              <div className="weather-metric-pill">
                <Thermometer size={18} />
                <span>Sicaklik</span>
                <strong>{`${snapshot.weatherCache.temperature.toFixed(1)}°C`}</strong>
              </div>
              <div className="weather-metric-pill">
                <Thermometer size={18} />
                <span>Hissedilen</span>
                <strong>{`${snapshot.weatherCache.feelsLike ?? '-'}°C`}</strong>
              </div>
              <div className="weather-metric-pill">
                <Droplets size={18} />
                <span>Nem</span>
                <strong>{`${snapshot.weatherCache.humidity ?? '-'}%`}</strong>
              </div>
              <div className="weather-metric-pill">
                <Wind size={18} />
                <span>Ruzgar</span>
                <strong>{`${snapshot.weatherCache.windSpeed ?? '-'} km/s`}</strong>
              </div>
            </div>
            <p className="weather-refresh-note">
              {weatherUpdatedAt ? `${weatherUpdatedAt} itibariyla guncel` : 'Veriler periyodik olarak guncellenir'}
            </p>
          </div>
        </div>
      ) : null}
    </main>
  )
}
