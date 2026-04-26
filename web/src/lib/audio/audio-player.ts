import type { Station } from '../storage/types'

export interface PlaybackState {
  activeStationId: string | null
  status: 'idle' | 'playing' | 'error'
  errorMessage: string | null
}

class AudioPlayer {
  private audio: HTMLAudioElement | null = null

  async play(station: Pick<Station, 'streamUrl'>) {
    if (!this.audio) {
      this.audio = new Audio()
      this.audio.preload = 'none'
    }

    this.audio.src = station.streamUrl
    await this.audio.play()
  }

  stop() {
    if (!this.audio) {
      return
    }

    this.audio.pause()
    this.audio.removeAttribute('src')
    this.audio.load()
  }

  setVolume(volume: number) {
    if (!this.audio) {
      this.audio = new Audio()
      this.audio.preload = 'none'
    }

    this.audio.volume = volume
  }
}

export const audioPlayer = new AudioPlayer()
