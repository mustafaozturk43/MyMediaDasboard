import { fetchWeatherWithTimeout, mapWeatherResponse } from './weather'

describe('weather mapper', () => {
  it('maps full api data into the app model', () => {
    expect(
      mapWeatherResponse({
        cityName: 'Istanbul',
        current: {
          temperature_2m: 21.5,
          weather_code: 2,
          wind_speed_10m: 11.2,
          relative_humidity_2m: 58,
          apparent_temperature: 22.1,
        },
      }),
    ).toEqual({
      cityName: 'Istanbul',
      temperature: 21.5,
      conditionCode: 2,
      windSpeed: 11.2,
      humidity: 58,
      feelsLike: 22.1,
    })
  })

  it('returns safe defaults for missing optional fields', () => {
    expect(
      mapWeatherResponse({
        cityName: 'Ankara',
        current: {
          temperature_2m: 14,
          weather_code: 0,
        },
      }),
    ).toEqual({
      cityName: 'Ankara',
      temperature: 14,
      conditionCode: 0,
      windSpeed: null,
      humidity: null,
      feelsLike: null,
    })
  })
})

describe('weather fetch', () => {
  it('passes an abort signal to fetch and resolves the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))

    vi.stubGlobal('fetch', fetchMock)

    const response = await fetchWeatherWithTimeout('https://api.example.com/weather', 1000)

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/weather', {
      signal: expect.any(AbortSignal),
    })

    vi.unstubAllGlobals()
  })
})
