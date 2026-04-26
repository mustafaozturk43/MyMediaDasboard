import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet default icon fix
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapPickerProps {
  initialLat: number
  initialLng: number
  onSelect: (lat: number, lng: number) => void
  onClose: () => void
}

function LocationMarker({ onSelect, position }: { onSelect: (lat: number, lng: number) => void, position: [number, number] }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position ? <Marker position={position} /> : null
}

export function MapPicker({ initialLat, initialLng, onSelect, onClose }: MapPickerProps) {
  const [tempPos, setTempPos] = useState<[number, number]>([initialLat || 41.0082, initialLng || 28.9784])

  const handleSelect = (lat: number, lng: number) => {
    setTempPos([lat, lng])
  }

  return (
    <div className="map-picker-modal">
      <div className="map-picker-container">
        <header className="map-picker-header">
          <h3>Konum Seç</h3>
          <button className="close-button" onClick={onClose} type="button">✕</button>
        </header>
        
        <div className="map-wrapper">
          <MapContainer 
            center={tempPos} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={tempPos} onSelect={handleSelect} />
          </MapContainer>
        </div>

        <footer className="map-picker-footer">
          <div className="coords-display">
            <span>Enlem: {tempPos[0].toFixed(6)}</span>
            <span>Boylam: {tempPos[1].toFixed(6)}</span>
          </div>
          <button 
            className="primary-button" 
            onClick={() => onSelect(tempPos[0], tempPos[1])}
            type="button"
          >
            Konumu Onayla
          </button>
        </footer>
      </div>
    </div>
  )
}
