const HTTP_PROTOCOLS = new Set(['http:', 'https:'])

export function validateStationInput(input: { name: string; streamUrl: string }) {
  const name = input.name.trim()
  const streamUrl = input.streamUrl.trim()

  if (!name) {
    throw new Error('Istasyon adi zorunludur.')
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(streamUrl)
  } catch {
    throw new Error('Stream URL gecersiz.')
  }

  if (!HTTP_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error('Stream URL gecersiz.')
  }

  return {
    name,
    streamUrl,
  }
}

export function normalizeQuote(value: string) {
  const text = value.replace(/\s+/g, ' ').trim()

  if (!text) {
    throw new Error('Soz bos olamaz.')
  }

  return text
}

export function validatePhotoCount(count: number) {
  if (count > 5) {
    throw new Error('En fazla 5 fotograf yuklenebilir.')
  }

  return count
}
