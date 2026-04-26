# MyMedia

MyMedia, tablet ve sabit ekranlar icin gelistirilen tam ekran kiosk odakli bir radyo ve multimedya panosudur.

## Mevcut MVP Durumu

`web/` altinda calisan React tabanli istemci sunlari icerir:

- Manuel radyo ekleme, duzenleme ve silme
- Radyo playback baslatma/durdurma ve hata gostergesi
- En fazla 5 fotograf yukleme, silme ve slideshow
- Motive soz ekleme, duzenleme, silme ve otomatik rotasyon
- Canli saat
- Sehir/koordinat tabanli hava durumu, cache ve fallback davranisi
- Genel ayarlar
- PWA manifest ve temel service worker kaydi
- Tam ekran kiosk butonu ve wake lock denemesi

## Teknoloji Stack

- Vite
- React
- TypeScript
- React Router
- Dexie / IndexedDB
- Lucide React
- Vitest + Testing Library

## Veri Saklama

- Radyo, fotograf, motive soz, ayarlar ve weather cache tarayicinin `IndexedDB` alaninda tutulur.
- Hava durumu Open-Meteo uzerinden cekilir; API key veya env variable gerekmez.
- Tablet kilitliyken audio playback web MVP'de garanti edilmez; Android tablet hardening fazina birakilmistir.

## Gelistirme

```bash
cd web
npm install
npm run dev
```

## Kalite Kontrolleri

```bash
cd web
npm test
npm run lint
npm run build
```

## Sonraki Adimlar

- Android tablet hardening
- Daha guclu offline cache stratejisi
- PWA install deneyiminin genisletilmesi
- Theme/layout secenekleri
