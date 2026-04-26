import { render, screen, within } from '@testing-library/react'
import { act } from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { AppContext, type AppContextValue } from './app/AppContext'
import App from './App'
import { KioskScreen } from './screens/KioskScreen'

describe('App routes', () => {
  it('renders the kiosk screen on the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/hava durumu/i)).toBeInTheDocument()
  })
})

describe('Kiosk screen', () => {
  it('renders the clock, radio, slideshow, weather and quote areas', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText(/^canli saat$/i)).toBeInTheDocument()
    expect(screen.getByText(/^radyo$/i)).toBeInTheDocument()
    expect(screen.getByText(/^slideshow$/i)).toBeInTheDocument()
    expect(screen.getByText(/^hava durumu$/i)).toBeInTheDocument()
    expect(screen.getByText(/^motive soz$/i)).toBeInTheDocument()
    expect(await screen.findByText(/veri bekleniyor/i)).toBeInTheDocument()
  })
})

describe('Radio management', () => {
  it('creates a station from the settings screen and shows it on the kiosk screen', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/radyo adi/i), 'Lounge FM')
    await user.type(screen.getByLabelText(/stream url/i), 'https://stream.example.com/lounge.mp3')
    await user.click(screen.getByRole('button', { name: /radyoyu kaydet/i }))
    await user.click(screen.getByRole('link', { name: /ana ekrana don/i }))

    expect(await screen.findByRole('button', { name: /lounge fm/i })).toBeInTheDocument()
  })

  it('marks a station as playing when playback starts and keeps the state across route changes', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/radyo adi/i), 'Night Jazz')
    await user.type(screen.getByLabelText(/stream url/i), 'https://stream.example.com/night-jazz.mp3')
    await user.click(screen.getByRole('button', { name: /radyoyu kaydet/i }))
    await user.click(screen.getByRole('link', { name: /ana ekrana don/i }))
    await user.click(await screen.findByRole('button', { name: /night jazz/i }))

    expect(screen.getByText(/simdi caliyor/i)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/hava durumu/i))

    expect(await screen.findByText(/aktif yayin: night jazz/i)).toBeInTheDocument()
  })

  it('edits and deletes a station from the settings screen', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/radyo adi/i), 'Retro FM')
    await user.type(screen.getByLabelText(/stream url/i), 'https://stream.example.com/retro.mp3')
    await user.click(screen.getByRole('button', { name: /radyoyu kaydet/i }))
    const stationTitle = await screen.findByText('Retro FM')
    const stationCard = stationTitle.closest('.entity-card')

    if (!(stationCard instanceof HTMLElement)) {
      throw new Error('Station card not found')
    }

    await user.click(within(stationCard).getByRole('button', { name: /duzenle/i }))
    await user.clear(screen.getByLabelText(/radyo adi/i))
    await user.type(screen.getByLabelText(/radyo adi/i), 'Retro Deluxe')
    await user.click(screen.getByRole('button', { name: /radyoyu guncelle/i }))

    const updatedStationTitle = await screen.findByText('Retro Deluxe')
    const updatedStationCard = updatedStationTitle.closest('.entity-card')

    if (!(updatedStationCard instanceof HTMLElement)) {
      throw new Error('Updated station card not found')
    }

    await user.click(within(updatedStationCard).getByRole('button', { name: /sil/i }))

    expect(screen.queryByText('Retro Deluxe')).not.toBeInTheDocument()
  })
})

describe('Photo management', () => {
  it('uploads a photo from the settings screen and shows it on the kiosk screen', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    const photoInput = screen.getByLabelText(/fotograf yukle/i)
    const photoFile = new File(['fake-image'], 'sunrise.png', { type: 'image/png' })

    await user.upload(photoInput, photoFile)

    expect(await screen.findByText('sunrise.png')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /ana ekrana don/i }))

    expect(await screen.findByText(/1 fotograf hazir/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /sunrise.png/i })).toBeInTheDocument()
  })

  it('rotates to the next photo when the slideshow interval elapses', async () => {
    vi.useFakeTimers()

    const contextValue: AppContextValue = {
      snapshot: {
        stations: [],
        photos: [
          {
            id: 'photo-1',
            name: 'day.png',
            mimeType: 'image/png',
            blobRef: 'data:image/png;base64,day',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'photo-2',
            name: 'night.png',
            mimeType: 'image/png',
            blobRef: 'data:image/png;base64,night',
            createdAt: new Date().toISOString(),
          },
        ],
        quotes: [],
        settings: {
          cityName: 'Istanbul',
          latitude: 41.0082,
          longitude: 28.9784,
          slideshowIntervalSec: 1,
          quoteIntervalSec: 10,
          defaultStationId: null,
          lastStationId: null,
          weatherUpdateIntervalMin: 30,
          weatherEnabled: true,
          panelVisibility: { slideshow: true, radio: true, weather: true, quote: true },
        },
        weatherCache: null,
      },
      playback: {
        activeStationId: null,
        status: 'idle',
        errorMessage: null,
      },
      weather: {
        status: 'idle',
        errorMessage: null,
      },
      stationVolume: 0.7,
      addStation: vi.fn(),
      updateStation: vi.fn(),
      removeStation: vi.fn(),
      toggleStationFavorite: vi.fn(),
      addPhoto: vi.fn(),
      addPhotos: vi.fn(),
      removePhoto: vi.fn(),
      addQuote: vi.fn(),
      updateQuote: vi.fn(),
      removeQuote: vi.fn(),
      updateSettings: vi.fn(),
      refreshWeather: vi.fn(),
      playStation: vi.fn(),
      setStationVolume: vi.fn(),
      stopPlayback: vi.fn(),
    }

    render(
      <MemoryRouter>
        <AppContext.Provider value={contextValue}>
          <KioskScreen />
        </AppContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('img', { name: /day.png/i })).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByRole('img', { name: /night.png/i })).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('shows an error when the photo limit exceeds five', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    const photoInput = screen.getByLabelText(/fotograf yukle/i)

    for (let index = 0; index < 5; index += 1) {
      await user.upload(
        photoInput,
        new File([`photo-${index}`], `photo-${index}.png`, { type: 'image/png' }),
      )
    }

    await user.upload(photoInput, new File(['photo-6'], 'photo-6.png', { type: 'image/png' }))

    expect(await screen.findByText(/en fazla 5 fotograf/i)).toBeInTheDocument()
  })

  it('removes a photo from the settings screen', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    const photoInput = screen.getByLabelText(/fotograf yukle/i)

    await user.upload(photoInput, new File(['fake-image'], 'delete-me.png', { type: 'image/png' }))
    expect(await screen.findByText('delete-me.png')).toBeInTheDocument()

    const photoCard = screen.getByText('delete-me.png').closest('.entity-card')

    if (!(photoCard instanceof HTMLElement)) {
      throw new Error('Photo card not found')
    }

    await user.click(within(photoCard).getByRole('button', { name: /sil/i }))

    expect(await screen.findByText(/Henuz fotograf yuklenmedi/)).toBeInTheDocument()
  })
})

describe('Quote management', () => {
  it('adds a quote from the settings screen and shows it on the kiosk screen', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/motive soz/i), '  Bugun harika olacak  ')
    await user.click(screen.getByRole('button', { name: /sozu kaydet/i }))
    await user.click(screen.getByRole('link', { name: /ana ekrana don/i }))

    expect(await screen.findByText(/Bugun harika olacak/)).toBeInTheDocument()
  })

  it('rotates to the next quote when the quote interval elapses', async () => {
    vi.useFakeTimers()

    const contextValue: AppContextValue = {
      snapshot: {
        stations: [],
        photos: [],
        quotes: [
          {
            id: 'quote-1',
            text: 'Ilk soz',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'quote-2',
            text: 'Ikinci soz',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        settings: {
          cityName: 'Istanbul',
          latitude: 41.0082,
          longitude: 28.9784,
          slideshowIntervalSec: 12,
          quoteIntervalSec: 1,
          defaultStationId: null,
          lastStationId: null,
          weatherUpdateIntervalMin: 30,
          weatherEnabled: true,
          panelVisibility: { slideshow: true, radio: true, weather: true, quote: true },
        },
        weatherCache: null,
      },
      playback: {
        activeStationId: null,
        status: 'idle',
        errorMessage: null,
      },
      weather: {
        status: 'idle',
        errorMessage: null,
      },
      stationVolume: 0.7,
      addStation: vi.fn(),
      updateStation: vi.fn(),
      removeStation: vi.fn(),
      toggleStationFavorite: vi.fn(),
      addPhoto: vi.fn(),
      addPhotos: vi.fn(),
      removePhoto: vi.fn(),
      addQuote: vi.fn(),
      updateQuote: vi.fn(),
      removeQuote: vi.fn(),
      updateSettings: vi.fn(),
      refreshWeather: vi.fn(),
      playStation: vi.fn(),
      setStationVolume: vi.fn(),
      stopPlayback: vi.fn(),
    }

    render(
      <MemoryRouter>
        <AppContext.Provider value={contextValue}>
          <KioskScreen />
        </AppContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByText(/Ilk soz/)).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByText(/Ikinci soz/)).toBeInTheDocument()
  })

  it('edits and deletes a quote from the settings screen', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/motive soz/i), 'Eski soz')
    await user.click(screen.getByRole('button', { name: /sozu kaydet/i }))
    const quoteCard = await screen.findByText('Eski soz')
    const quoteEntity = quoteCard.closest('.entity-card')

    if (!(quoteEntity instanceof HTMLElement)) {
      throw new Error('Quote card not found')
    }

    await user.click(within(quoteEntity).getByRole('button', { name: /duzenle/i }))
    await user.clear(screen.getByLabelText(/motive soz/i))
    await user.type(screen.getByLabelText(/motive soz/i), 'Yeni soz')
    await user.click(screen.getByRole('button', { name: /sozu guncelle/i }))

    expect(await screen.findByText('Yeni soz')).toBeInTheDocument()

    const updatedQuoteCard = await screen.findByText('Yeni soz')
    const updatedQuoteEntity = updatedQuoteCard.closest('.entity-card')

    if (!(updatedQuoteEntity instanceof HTMLElement)) {
      throw new Error('Updated quote card not found')
    }

    await user.click(within(updatedQuoteEntity).getByRole('button', { name: /sil/i }))

    expect(screen.queryByText('Yeni soz')).not.toBeInTheDocument()
  })
})

describe('Settings and weather', () => {
  it('updates general settings and shows weather details on the kiosk screen', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 19.5,
            weather_code: 1,
            wind_speed_10m: 7.4,
            relative_humidity_2m: 63,
            apparent_temperature: 20.2,
          },
        }),
      }),
    )

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.clear(screen.getByLabelText(/sehir adi/i))
    await user.type(screen.getByLabelText(/sehir adi/i), 'Izmir')
    await user.clear(screen.getByLabelText(/enlem/i))
    await user.type(screen.getByLabelText(/enlem/i), '38.4237')
    await user.clear(screen.getByLabelText(/boylam/i))
    await user.type(screen.getByLabelText(/boylam/i), '27.1428')
    await user.clear(screen.getByLabelText(/slideshow suresi/i))
    await user.type(screen.getByLabelText(/slideshow suresi/i), '8')
    await user.clear(screen.getByLabelText(/soz donus suresi/i))
    await user.type(screen.getByLabelText(/soz donus suresi/i), '6')
    await user.click(screen.getByRole('button', { name: /hava durumu ayarlarını kaydet/i }))
    await user.click(screen.getByRole('link', { name: /ana ekrana don/i }))

    expect(await screen.findByText(/(Istanbul)?Izmir/)).toBeInTheDocument()
    expect(await screen.findByText(/19.5°C/)).toBeInTheDocument()
    expect(screen.getByText(/Nem: 63%/)).toBeInTheDocument()
    expect(screen.getByText(/Ruzgar: 7.4 km\/s/)).toBeInTheDocument()
    expect(screen.getByText(/Hissedilen: 20.2°C/)).toBeInTheDocument()
  })

  it('shows a fallback message when weather fetch fails without cache', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Veri alinamadi/)).toBeInTheDocument()
  })
})

describe('Audio errors', () => {
  it('shows an error message when playback cannot start', async () => {
    const user = userEvent.setup()

    HTMLMediaElement.prototype.play = vi.fn().mockRejectedValueOnce(new Error('blocked'))

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/radyo adi/i), 'Error FM')
    await user.type(screen.getByLabelText(/stream url/i), 'https://stream.example.com/error.mp3')
    await user.click(screen.getByRole('button', { name: /radyoyu kaydet/i }))
    await user.click(screen.getByRole('link', { name: /ana ekrana don/i }))
    await user.click(await screen.findByRole('button', { name: /error fm/i }))

    expect(await screen.findByText(/Yayin baslatilamadi/)).toBeInTheDocument()
  })
})
