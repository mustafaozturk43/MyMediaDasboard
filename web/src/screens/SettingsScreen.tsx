import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useAppContext } from '../app/AppContext'
import { MapPicker } from '../components/MapPicker'

type SettingsTab = 'radyo' | 'fotograflar' | 'sozler' | 'ayarlar' | 'durum'

const TABS: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'radyo', label: 'Radyo', icon: '📻' },
  { id: 'fotograflar', label: 'Fotoğraflar', icon: '🖼️' },
  { id: 'sozler', label: 'Sözler', icon: '💬' },
  { id: 'ayarlar', label: 'Hava Durumu', icon: '🌤️' },
  { id: 'durum', label: 'Durum', icon: '📡' },
]

export function SettingsScreen() {
  const {
    addPhoto,
    addPhotos,
    addQuote,
    addStation,
    playback,
    refreshWeather,
    removePhoto,
    removeQuote,
    removeStation,
    snapshot,
    updateQuote,
    updateSettings,
    updateStation,
  } = useAppContext()

  const [activeTab, setActiveTab] = useState<SettingsTab>('radyo')

  const [name, setName] = useState('')
  const [streamUrl, setStreamUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [editingStationId, setEditingStationId] = useState<string | null>(null)
  const [quoteText, setQuoteText] = useState('')
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [photoErrorMessage, setPhotoErrorMessage] = useState<string | null>(null)
  const [quoteErrorMessage, setQuoteErrorMessage] = useState<string | null>(null)
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [cityName, setCityName] = useState(snapshot.settings.cityName)
  const [latitude, setLatitude] = useState(String(snapshot.settings.latitude))
  const [longitude, setLongitude] = useState(String(snapshot.settings.longitude))
  const [slideshowIntervalSec, setSlideshowIntervalSec] = useState(String(snapshot.settings.slideshowIntervalSec))
  const [quoteIntervalSec, setQuoteIntervalSec] = useState(String(snapshot.settings.quoteIntervalSec))
  const [weatherUpdateIntervalMin, setWeatherUpdateIntervalMin] = useState(String(snapshot.settings.weatherUpdateIntervalMin))
  const [weatherEnabled, setWeatherEnabled] = useState(snapshot.settings.weatherEnabled)
  const [isLocating, setIsLocating] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [panelVisibility, setPanelVisibility] = useState(snapshot.settings.panelVisibility ?? {
    slideshow: true,
    radio: true,
    weather: true,
    quote: true,
  })

  async function handlePanelVisibilityToggle(panel: keyof typeof panelVisibility) {
    const next = { ...panelVisibility, [panel]: !panelVisibility[panel] }
    setPanelVisibility(next)
    await updateSettings({ panelVisibility: next })
  }

  const activeStationName =
    snapshot.stations.find((station) => station.id === playback.activeStationId)?.name ?? null

  async function handleStationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSaving(true)

    try {
      if (editingStationId) {
        await updateStation(editingStationId, { name, streamUrl, logoUrl, isFavorite })
      } else {
        await addStation({ name, streamUrl, logoUrl, isFavorite })
      }

      setName('')
      setStreamUrl('')
      setLogoUrl('')
      setIsFavorite(false)
      setEditingStationId(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Radyo kaydedilemedi.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleStationEdit(stationId: string) {
    const station = snapshot.stations.find((item) => item.id === stationId)

    if (!station) {
      return
    }

    setEditingStationId(station.id)
    setName(station.name)
    setStreamUrl(station.streamUrl)
    setLogoUrl(station.logoUrl ?? '')
    setIsFavorite(station.isFavorite)
    setErrorMessage(null)
  }

  async function handleLoadRadios() {
    setIsSaving(true)
    setErrorMessage(null)
    setSettingsFeedback(null)
    try {
      const res = await fetch('/radio-data/radyolink.json')
      if (!res.ok) throw new Error('radyolink.json dosyası bulunamadı.')
      const data = await res.json()
      
      let added = 0
      for (const radio of data) {
        const exists = snapshot.stations.find(s => s.streamUrl === radio.LINK)
        if (!exists) {
          await addStation({
            name: radio.ADI || 'Bilinmeyen Radyo',
            streamUrl: radio.LINK,
            logoUrl: radio.IMAGE || '',
            isFavorite: false
          })
          added++
        }
      }
      setSettingsFeedback(`${added} adet radyo başarıyla yüklendi.`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Radyolar yüklenirken hata oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    setPhotoErrorMessage(null)

    try {
      if (files.length === 1) {
        const [file] = files

        if (file) {
          await addPhoto(file)
        }
      } else {
        await addPhotos(files)
      }
      event.target.value = ''
    } catch (error) {
      setPhotoErrorMessage(error instanceof Error ? error.message : 'Fotograf yuklenemedi.')
    }
  }

  async function handleQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuoteErrorMessage(null)

    try {
      if (editingQuoteId) {
        await updateQuote(editingQuoteId, quoteText)
      } else {
        await addQuote(quoteText)
      }

      setQuoteText('')
      setEditingQuoteId(null)
    } catch (error) {
      setQuoteErrorMessage(error instanceof Error ? error.message : 'Soz kaydedilemedi.')
    }
  }

  function handleQuoteEdit(quoteId: string) {
    const quote = snapshot.quotes.find((item) => item.id === quoteId)

    if (!quote) {
      return
    }

    setEditingQuoteId(quote.id)
    setQuoteText(quote.text)
    setQuoteErrorMessage(null)
  }

  async function fetchCityName(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        { headers: { 'Accept-Language': 'tr' } }
      )
      const data = await response.json()
      // Öncelik: şehir, ilçe, kasaba, köy, eyalet
      return data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.address?.province || data.address?.state || ''
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return ''
    }
  }

  function handleDetectLocation() {
    setIsLocating(true)
    setSettingsFeedback(null)

    if (!navigator.geolocation) {
      setSettingsFeedback('Tarayıcı konum bilgisini desteklemiyor.')
      setIsLocating(false)
      return
    }

    // Güvenli bağlam (HTTPS/Localhost) kontrolü uyarısı
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.warn('Geolocation genellikle sadece HTTPS veya localhost üzerinden çalışır.')
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLatitude(String(lat.toFixed(6)))
        setLongitude(String(lng.toFixed(6)))
        
        const city = await fetchCityName(lat, lng)
        if (city) setCityName(city)

        setSettingsFeedback('Konum ve şehir bilgisi başarıyla alındı.')
        setIsLocating(false)
      },
      (error) => {
        let msg = 'Konum alınamadı.'
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin veya adresi manuel girin.'
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Konum bilgisi mevcut değil.'
        } else if (error.code === error.TIMEOUT) {
          msg = 'Konum isteği zaman aşımına uğradı.'
        }

        setSettingsFeedback(msg)
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function handleSettingsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSettingsFeedback(null)

    await updateSettings({
      cityName: cityName.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      slideshowIntervalSec: Number(slideshowIntervalSec),
      quoteIntervalSec: Number(quoteIntervalSec),
      weatherUpdateIntervalMin: Number(weatherUpdateIntervalMin),
      weatherEnabled,
    })

    await refreshWeather()
    setSettingsFeedback('Ayarlar kaydedildi.')
  }

  return (
    <main className="settings-shell settings-shell-vibrant">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">MyMedia Studio</p>
          <div className="brand-title-row">
            <img alt="MyMedia logosu" className="brand-logo" src="/logo.png" />
            <h1>İçerik Yönetimi</h1>
          </div>
          <p className="hero-copy">Radyoları, görselleri, motive sözleri ve kiosk davranışını tek yerden yönet.</p>
        </div>
        <div className="hero-actions">
          <Link className="secondary-button icon-button" to="/">
            Ana ekrana dön
          </Link>
        </div>
      </header>

      <div className="settings-tab-layout">
        {/* Tab Navbar */}
        <nav className="settings-tab-nav" aria-label="Ayar sekmeleri">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              className={`settings-tab-btn${activeTab === tab.id ? ' settings-tab-btn--active' : ''}`}
              onClick={() => { setActiveTab(tab.id) }}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <span className="settings-tab-icon">{tab.icon}</span>
              <span className="settings-tab-label">{tab.label}</span>
              {tab.id === 'radyo' && snapshot.stations.length > 0 && (
                <span className="settings-tab-badge">{snapshot.stations.length}</span>
              )}
              {tab.id === 'fotograflar' && snapshot.photos.length > 0 && (
                <span className="settings-tab-badge">{snapshot.photos.length}</span>
              )}
              {tab.id === 'sozler' && snapshot.quotes.length > 0 && (
                <span className="settings-tab-badge">{snapshot.quotes.length}</span>
              )}
              {tab.id === 'durum' && playback.activeStationId && (
                <span className="settings-tab-badge settings-tab-badge--live">●</span>
              )}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="settings-tab-content">

          {/* Radyo Sekmesi */}
          {activeTab === 'radyo' && (
            <div className="settings-tab-pane" role="tabpanel" aria-labelledby="settings-tab-radyo">
              <div className="settings-pane-header">
                <div>
                  <h2 className="settings-pane-title">Radyo Kütüphanesi</h2>
                  <p className="settings-pane-desc">Yayın istasyonlarını ekle, düzenle veya kaldır.</p>
                </div>
                <div className="settings-pane-header-actions">
                  <button 
                    className="secondary-button" 
                    onClick={handleLoadRadios} 
                    disabled={isSaving}
                    type="button"
                    title="Hazır radyoları radyolink.json dosyasından yükle"
                  >
                    📻 Radyoları Yükle
                  </button>
                  <label className="visibility-switch" title="Ana sayfada göster/gizle">
                    <input
                      checked={panelVisibility.radio}
                      onChange={() => void handlePanelVisibilityToggle('radio')}
                      type="checkbox"
                    />
                    <span className="visibility-switch-track" />
                    <span className="visibility-switch-label">{panelVisibility.radio ? 'Görünür' : 'Gizli'}</span>
                  </label>
                  <span className="pill">{snapshot.stations.length} kanal</span>
                </div>
              </div>
              
              {settingsFeedback && activeTab === 'radyo' && (
                <div style={{ margin: '1rem 2rem 0' }}>
                  <p className="feedback success-feedback">{settingsFeedback}</p>
                </div>
              )}

              <div className="settings-pane-body">
                <div className="settings-form-card">
                  <p className="settings-form-card-title">
                    {editingStationId ? '✏️ İstasyonu Düzenle' : '➕ Yeni İstasyon Ekle'}
                  </p>
                  <form className="settings-form" onSubmit={handleStationSubmit}>
                    <label className="field">
                      <span>Radyo adı</span>
                      <input value={name} onChange={(event) => { setName(event.target.value) }} placeholder="TRT Radyo 1" />
                    </label>

                    <label className="field">
                      <span>Stream URL</span>
                      <input
                        value={streamUrl}
                        onChange={(event) => { setStreamUrl(event.target.value) }}
                        placeholder="https://stream.example.com/live.mp3"
                      />
                    </label>

                    <label className="field">
                      <span>Logo URL</span>
                      <input
                        placeholder="https://example.com/logo.png"
                        value={logoUrl}
                        onChange={(event) => { setLogoUrl(event.target.value) }}
                      />
                    </label>

                    <label className="checkbox-field">
                      <input checked={isFavorite} onChange={(event) => { setIsFavorite(event.target.checked) }} type="checkbox" />
                      <span>Favorilere ekle</span>
                    </label>

                    {errorMessage ? <p className="feedback error-feedback">{errorMessage}</p> : null}

                    <div className="action-row">
                      <button className="primary-button" disabled={isSaving} type="submit">
                        {editingStationId ? 'Radyoyu güncelle' : isSaving ? 'Kaydediliyor…' : 'Radyoyu kaydet'}
                      </button>
                      {editingStationId ? (
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setEditingStationId(null)
                            setName('')
                            setStreamUrl('')
                            setLogoUrl('')
                            setIsFavorite(false)
                          }}
                          type="button"
                        >
                          Vazgeç
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>

                <div className="settings-entity-section">
                  <p className="settings-entity-section-label">Kayıtlı İstasyonlar</p>
                  <div className="station-settings-grid">
                    {snapshot.stations.length === 0 ? (
                      <div className="settings-empty-state">
                        <span className="settings-empty-icon">📻</span>
                        <p>Henüz kayıtlı radyo yok.</p>
                        <p className="settings-empty-hint">Yukarıdaki formu kullanarak ilk istasyonunu ekle.</p>
                      </div>
                    ) : (
                      snapshot.stations.map((station) => (
                        <div
                          className={`station-settings-card${editingStationId === station.id ? ' station-settings-card--editing' : ''}`}
                          key={station.id}
                        >
                          {/* Logo / placeholder ikon */}
                          <div className="station-settings-logo">
                            {station.logoUrl ? (
                              <img
                                alt={station.name}
                                className="station-settings-logo-img"
                                src={station.logoUrl}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                              />
                            ) : (
                              <span className="station-settings-logo-fallback">📻</span>
                            )}
                          </div>

                          {/* İstasyon adı */}
                          <p className="station-settings-name">
                            {station.name}
                            {station.isFavorite ? <span className="station-settings-fav">⭐</span> : null}
                          </p>

                          {/* Aksiyon butonları */}
                          <div className="station-settings-actions">
                            <button
                              className="station-settings-btn"
                              id={`station-edit-${station.id}`}
                              onClick={() => { handleStationEdit(station.id) }}
                              title="Düzenle"
                              type="button"
                            >
                              ✏️ Düzenle
                            </button>
                            <button
                              className="station-settings-btn station-settings-btn--danger"
                              id={`station-delete-${station.id}`}
                              onClick={() => void removeStation(station.id)}
                              title="Sil"
                              type="button"
                            >
                              🗑️ Sil
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fotoğraflar Sekmesi */}
          {activeTab === 'fotograflar' && (
            <div className="settings-tab-pane" role="tabpanel" aria-labelledby="settings-tab-fotograflar">
              <div className="settings-pane-header">
                <div>
                  <h2 className="settings-pane-title">Fotoğraf Galerisi</h2>
                  <p className="settings-pane-desc">Slayt gösterisi için fotoğraf yükle veya kaldır.</p>
                </div>
                <div className="settings-pane-header-actions">
                  <label className="visibility-switch" title="Ana sayfada göster/gizle">
                    <input
                      checked={panelVisibility.slideshow}
                      onChange={() => void handlePanelVisibilityToggle('slideshow')}
                      type="checkbox"
                    />
                    <span className="visibility-switch-track" />
                    <span className="visibility-switch-label">{panelVisibility.slideshow ? 'Görünür' : 'Gizli'}</span>
                  </label>
                  <span className="pill">{snapshot.photos.length} / 5</span>
                </div>
              </div>

              <div className="settings-pane-body">
                <div className="settings-form-card">
                  <p className="settings-form-card-title">📁 Fotoğraf Yükle</p>
                  <label className="field settings-form">
                    <span>Fotoğraf seç (çoklu seçim desteklenir)</span>
                    <input accept="image/*" multiple onChange={handlePhotoChange} type="file" />
                  </label>
                  {photoErrorMessage ? <p className="feedback error-feedback">{photoErrorMessage}</p> : null}
                </div>

                <div className="settings-entity-section">
                  <p className="settings-entity-section-label">Yüklü Fotoğraflar</p>
                  <div className="photo-settings-grid">
                    {snapshot.photos.length === 0 ? (
                      <div className="settings-empty-state">
                        <span className="settings-empty-icon">🖼️</span>
                        <p>Henüz fotoğraf yüklenmedi.</p>
                        <p className="settings-empty-hint">Slayt gösterisi için en fazla 5 fotoğraf ekleyebilirsin.</p>
                      </div>
                    ) : (
                      snapshot.photos.map((photo) => (
                        <div className="photo-settings-card" key={photo.id}>
                          <img alt={photo.name} className="photo-settings-img" src={photo.blobRef} />
                          <p className="photo-settings-name">{photo.name}</p>
                          <button
                            className="photo-settings-btn photo-settings-btn--danger"
                            onClick={() => void removePhoto(photo.id)}
                            title="Sil"
                            type="button"
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="settings-divider" />

                <div className="settings-form-card">
                  <p className="settings-form-card-title">⏱️ Slayt Zamanlaması</p>
                  <form className="settings-form" onSubmit={handleSettingsSubmit}>
                    <label className="field">
                      <span>Slayt geçiş süresi (saniye)</span>
                      <input value={slideshowIntervalSec} onChange={(event) => { setSlideshowIntervalSec(event.target.value) }} placeholder="12" />
                    </label>
                    <button className="secondary-button" type="submit">Süreyi Güncelle</button>
                    {settingsFeedback && activeTab === 'fotograflar' && <p className="feedback success-feedback">{settingsFeedback}</p>}
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Sözler Sekmesi */}
          {activeTab === 'sozler' && (
            <div className="settings-tab-pane" role="tabpanel" aria-labelledby="settings-tab-sozler">
              <div className="settings-pane-header">
                <div>
                  <h2 className="settings-pane-title">Motivasyon Sözleri</h2>
                  <p className="settings-pane-desc">Kiosk'ta dönen ilham verici sözleri yönet.</p>
                </div>
                <div className="settings-pane-header-actions">
                  <label className="visibility-switch" title="Ana sayfada göster/gizle">
                    <input
                      checked={panelVisibility.quote}
                      onChange={() => void handlePanelVisibilityToggle('quote')}
                      type="checkbox"
                    />
                    <span className="visibility-switch-track" />
                    <span className="visibility-switch-label">{panelVisibility.quote ? 'Görünür' : 'Gizli'}</span>
                  </label>
                  <span className="pill">{snapshot.quotes.length} söz</span>
                </div>
              </div>

              <div className="settings-pane-body">
                <div className="settings-form-card">
                  <p className="settings-form-card-title">
                    {editingQuoteId ? '✏️ Sözü Düzenle' : '➕ Yeni Söz Ekle'}
                  </p>
                  <form className="settings-form" onSubmit={handleQuoteSubmit}>
                    <label className="field">
                      <span>Motivasyon sözü</span>
                      <input value={quoteText} onChange={(event) => { setQuoteText(event.target.value) }} placeholder="İlham verici bir söz yazın…" />
                    </label>

                    {quoteErrorMessage ? <p className="feedback error-feedback">{quoteErrorMessage}</p> : null}

                    <div className="action-row">
                      <button className="primary-button" type="submit">
                        {editingQuoteId ? 'Sözü güncelle' : 'Sözü kaydet'}
                      </button>
                      {editingQuoteId ? (
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setEditingQuoteId(null)
                            setQuoteText('')
                          }}
                          type="button"
                        >
                          Vazgeç
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>

                <div className="settings-entity-section">
                  <p className="settings-entity-section-label">Kayıtlı Sözler</p>
                  <div className="entity-list">
                    {snapshot.quotes.length === 0 ? (
                      <div className="settings-empty-state">
                        <span className="settings-empty-icon">💬</span>
                        <p>Henüz motivasyon sözü yok.</p>
                        <p className="settings-empty-hint">Kiosk'ta görünmesini istediğin sözleri ekle.</p>
                      </div>
                    ) : (
                      snapshot.quotes.map((quote) => (
                        <div className="entity-card" key={quote.id}>
                          <div>
                            <strong>{quote.text}</strong>
                          </div>
                          <div className="entity-actions">
                            <button className="ghost-button" onClick={() => { handleQuoteEdit(quote.id) }} type="button">
                              Düzenle
                            </button>
                            <button className="ghost-button danger-button" onClick={() => void removeQuote(quote.id)} type="button">
                              Sil
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="settings-divider" />

                <div className="settings-form-card">
                  <p className="settings-form-card-title">⏱️ Söz Zamanlaması</p>
                  <form className="settings-form" onSubmit={handleSettingsSubmit}>
                    <label className="field">
                      <span>Söz dönüş süresi (saniye)</span>
                      <input value={quoteIntervalSec} onChange={(event) => { setQuoteIntervalSec(event.target.value) }} placeholder="10" />
                    </label>
                    <button className="secondary-button" type="submit">Süreyi Güncelle</button>
                    {settingsFeedback && activeTab === 'sozler' && <p className="feedback success-feedback">{settingsFeedback}</p>}
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Ayarlar Sekmesi */}
          {activeTab === 'ayarlar' && (
            <div className="settings-tab-pane" role="tabpanel" aria-labelledby="settings-tab-ayarlar">
              <div className="settings-pane-header">
                <div>
                  <h2 className="settings-pane-title">Hava Durumu</h2>
                  <p className="settings-pane-desc">Konum, hava durumu ve güncelleme tercihlerini düzenle.</p>
                </div>
                <div className="settings-pane-header-actions">
                  <label className="visibility-switch" title="Ana sayfada göster/gizle">
                    <input
                      checked={panelVisibility.weather}
                      onChange={() => void handlePanelVisibilityToggle('weather')}
                      type="checkbox"
                    />
                    <span className="visibility-switch-track" />
                    <span className="visibility-switch-label">{panelVisibility.weather ? 'Görünür' : 'Gizli'}</span>
                  </label>
                  <span className="pill">Kiosk</span>
                </div>
              </div>

              <div className="settings-pane-body">
                <div className="settings-form-card">
                  <form className="settings-form" onSubmit={handleSettingsSubmit}>
                    <div className="settings-field-group">
                      <div className="settings-form-card-title-row">
                        <p className="settings-form-card-title">🌍 Konum & Hava Durumu</p>
                        <div className="location-quick-actions">
                          <button 
                            className="text-action-button" 
                            disabled={isLocating}
                            onClick={handleDetectLocation}
                            type="button"
                          >
                            {isLocating ? '📡 Aranıyor...' : '📍 Konumumu Bul'}
                          </button>
                          <button 
                            className="text-action-button" 
                            onClick={() => setShowMapPicker(true)}
                            type="button"
                          >
                            🗺️ Haritadan Seç
                          </button>
                        </div>
                      </div>

                      <label className="field">
                        <span>Şehir adı</span>
                        <input value={cityName} onChange={(event) => { setCityName(event.target.value) }} placeholder="İstanbul" />
                      </label>

                      <div className="settings-field-row">
                        <label className="field">
                          <span>Enlem</span>
                          <input value={latitude} onChange={(event) => { setLatitude(event.target.value) }} placeholder="41.0082" />
                        </label>

                        <label className="field">
                          <span>Boylam</span>
                          <input value={longitude} onChange={(event) => { setLongitude(event.target.value) }} placeholder="28.9784" />
                        </label>
                      </div>

                      <label className="checkbox-field">
                        <input checked={weatherEnabled} onChange={(event) => { setWeatherEnabled(event.target.checked) }} type="checkbox" />
                        <span>Hava durumu panelini etkinleştir</span>
                      </label>

                      <label className="field">
                        <span>Güncelleme Sıklığı</span>
                        <select 
                          className="settings-select"
                          value={weatherUpdateIntervalMin} 
                          onChange={(e) => setWeatherUpdateIntervalMin(e.target.value)}
                        >
                          <option value="5">5 Dakika</option>
                          <option value="15">15 Dakika</option>
                          <option value="30">30 Dakika</option>
                          <option value="60">1 Saat</option>
                          <option value="240">4 Saat</option>
                        </select>
                      </label>
                    </div>

                    {showMapPicker && (
                      <MapPicker 
                        initialLat={Number(latitude) || 41.0082} 
                        initialLng={Number(longitude) || 28.9784} 
                        onClose={() => setShowMapPicker(false)}
                        onSelect={async (lat, lng) => {
                          setLatitude(lat.toFixed(6))
                          setLongitude(lng.toFixed(6))
                          
                          const city = await fetchCityName(lat, lng)
                          if (city) setCityName(city)
                          
                          setShowMapPicker(false)
                          setSettingsFeedback('Haritadan konum ve şehir seçildi.')
                        }}
                      />
                    )}

                    {settingsFeedback && activeTab === 'ayarlar' && <p className="feedback success-feedback">{settingsFeedback}</p>}

                    <div className="action-row">
                      <button className="primary-button" type="submit">
                        Hava Durumu Ayarlarını Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Durum Sekmesi */}
          {activeTab === 'durum' && (
            <div className="settings-tab-pane" role="tabpanel" aria-labelledby="settings-tab-durum">
              <div className="settings-pane-header">
                <div>
                  <h2 className="settings-pane-title">Yayın Durumu</h2>
                  <p className="settings-pane-desc">Gerçek zamanlı oynatıcı ve sistem durumu.</p>
                </div>
                <span className={`pill${playback.activeStationId ? ' pill--live' : ''}`}>
                  {playback.activeStationId ? '● Canlı' : 'Beklemede'}
                </span>
              </div>

              <div className="settings-pane-body">
                <div className="settings-status-cards">
                  <div className="settings-status-card">
                    <div className="settings-status-card-icon">📻</div>
                    <div>
                      <p className="settings-status-card-label">Aktif İstasyon</p>
                      <p className="settings-status-card-value">
                        {activeStationName ?? 'Yayın yok'}
                      </p>
                    </div>
                    {playback.activeStationId && (
                      <span className="settings-live-orb" aria-label="Canlı yayın" />
                    )}
                  </div>

                  <div className="settings-status-card">
                    <div className="settings-status-card-icon">📡</div>
                    <div>
                      <p className="settings-status-card-label">Radyo Kütüphanesi</p>
                      <p className="settings-status-card-value">{snapshot.stations.length} istasyon</p>
                    </div>
                  </div>

                  <div className="settings-status-card">
                    <div className="settings-status-card-icon">🖼️</div>
                    <div>
                      <p className="settings-status-card-label">Fotoğraf Galerisi</p>
                      <p className="settings-status-card-value">{snapshot.photos.length} / 5 fotoğraf</p>
                    </div>
                  </div>

                  <div className="settings-status-card">
                    <div className="settings-status-card-icon">💬</div>
                    <div>
                      <p className="settings-status-card-label">Motivasyon Sözleri</p>
                      <p className="settings-status-card-value">{snapshot.quotes.length} söz</p>
                    </div>
                  </div>

                  <div className="settings-status-card">
                    <div className="settings-status-card-icon">🌤️</div>
                    <div>
                      <p className="settings-status-card-label">Hava Durumu</p>
                      <p className="settings-status-card-value">
                        {snapshot.settings.weatherEnabled ? `Aktif — ${snapshot.settings.cityName}` : 'Devre dışı'}
                      </p>
                    </div>
                  </div>
                </div>

                {playback.errorMessage ? (
                  <div className="settings-form-card" style={{ marginTop: '20px' }}>
                    <p className="settings-form-card-title">⚠️ Hata</p>
                    <p className="feedback error-feedback">{playback.errorMessage}</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
