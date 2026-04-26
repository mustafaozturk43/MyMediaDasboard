import type { Quote, Station } from './types'

function timestamp() {
  return new Date().toISOString()
}

export function createSeedStations(): Station[] {
  const createdAt = timestamp()

  return [
    {
      id: 'seed-groove-salad',
      name: 'Groove Salad',
      streamUrl: 'https://ice6.somafm.com/groovesalad-128-mp3',
      logoUrl: '/radio-logos/groove-salad.svg',
      isFavorite: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-drone-zone',
      name: 'Drone Zone',
      streamUrl: 'https://ice2.somafm.com/dronezone-128-mp3',
      logoUrl: '/radio-logos/drone-zone.svg',
      isFavorite: true,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-secret-agent',
      name: 'Secret Agent',
      streamUrl: 'https://ice2.somafm.com/secretagent-128-mp3',
      logoUrl: '/radio-logos/secret-agent.svg',
      isFavorite: false,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-illstreet',
      name: 'Illinois Street Lounge',
      streamUrl: 'https://ice6.somafm.com/illstreet-128-mp3',
      logoUrl: '/radio-logos/illstreet.svg',
      isFavorite: false,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-lush',
      name: 'Lush',
      streamUrl: 'https://ice2.somafm.com/lush-128-mp3',
      logoUrl: '/radio-logos/lush.svg',
      isFavorite: false,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-deep-space-one',
      name: 'Deep Space One',
      streamUrl: 'https://ice6.somafm.com/deepspaceone-128-mp3',
      logoUrl: '/radio-logos/deep-space-one.svg',
      isFavorite: true,
      createdAt,
      updatedAt: createdAt,
    },
  ]
}

export function createSeedQuotes(): Quote[] {
  const createdAt = timestamp()

  return [
    {
      id: 'seed-quote-1',
      text: 'Sakin ritim, temiz zihin.',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-quote-2',
      text: 'Bugun yavaslamak da bir ilerlemedir.',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'seed-quote-3',
      text: 'Her ekran biraz huzur verebilir.',
      createdAt,
      updatedAt: createdAt,
    },
  ]
}
