import { emptyAppSnapshot, mergeSettingsWithDefaults } from './app-storage'

describe('local data', () => {
  it('returns a safe default state when no stored data exists', () => {
    expect(emptyAppSnapshot()).toEqual({
      photos: [],
      quotes: [],
      settings: {
        cityName: 'Istanbul',
        latitude: 41.0082,
        longitude: 28.9784,
        slideshowIntervalSec: 12,
        quoteIntervalSec: 10,
        defaultStationId: null,
        lastStationId: null,
        weatherEnabled: true,
      },
      stations: [],
      weatherCache: null,
    })
  })

  it('merges partial settings with defaults', () => {
    expect(
      mergeSettingsWithDefaults({
        cityName: 'Izmir',
        latitude: 38.4237,
        longitude: 27.1428,
      }),
    ).toEqual({
      cityName: 'Izmir',
      latitude: 38.4237,
      longitude: 27.1428,
      slideshowIntervalSec: 12,
      quoteIntervalSec: 10,
      defaultStationId: null,
      lastStationId: null,
      weatherEnabled: true,
    })
  })
})
