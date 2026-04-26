import {
  normalizeQuote,
  validatePhotoCount,
  validateStationInput,
} from './validation'

describe('station validation', () => {
  it('rejects an empty station name', () => {
    expect(() =>
      validateStationInput({
        name: '   ',
        streamUrl: 'https://stream.example.com/live.mp3',
      }),
    ).toThrow(/istasyon adi/i)
  })

  it('rejects an invalid stream url', () => {
    expect(() =>
      validateStationInput({
        name: 'Jazz FM',
        streamUrl: 'notaurl',
      }),
    ).toThrow(/stream url/i)
  })

  it('accepts a valid station payload', () => {
    expect(
      validateStationInput({
        name: 'Jazz FM',
        streamUrl: 'https://stream.example.com/live.mp3',
      }),
    ).toEqual({
      name: 'Jazz FM',
      streamUrl: 'https://stream.example.com/live.mp3',
    })
  })
})

describe('quote validation', () => {
  it('rejects an empty quote', () => {
    expect(() => normalizeQuote('   ')).toThrow(/soz/i)
  })

  it('normalizes whitespace for a valid quote', () => {
    expect(normalizeQuote('  Keep   going  ')).toBe('Keep going')
  })
})

describe('photo rules', () => {
  it('allows up to five photos', () => {
    expect(validatePhotoCount(5)).toBe(5)
  })

  it('rejects more than five photos', () => {
    expect(() => validatePhotoCount(6)).toThrow(/5/i)
  })
})
