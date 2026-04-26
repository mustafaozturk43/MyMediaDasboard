import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'

import { afterEach, beforeAll, vi } from 'vitest'

import { db } from '../lib/storage/app-storage'

beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  HTMLMediaElement.prototype.pause = vi.fn()
  HTMLMediaElement.prototype.load = vi.fn()
})

afterEach(async () => {
  vi.useRealTimers()
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  HTMLMediaElement.prototype.pause = vi.fn()
  HTMLMediaElement.prototype.load = vi.fn()
  vi.unstubAllGlobals()
  await db.delete()
  await db.open()
})
