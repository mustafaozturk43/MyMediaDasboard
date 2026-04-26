# MyMedia Web App

MyMedia web app, tablet ve sabit ekranlarda tam ekran kiosk deneyimi icin hazirlanan React tabanli istemcidir.

## Ozellikler

- Kiosk ana ekrani: saat, slideshow, radyo paneli, hava durumu ve motive soz
- Ayarlar ekrani: radyo, fotograf, soz ve genel ayar yonetimi
- Dexie/IndexedDB ile local-first veri saklama
- Open-Meteo ile API key gerektirmeyen hava durumu
- PWA manifest, temel service worker, tam ekran butonu ve wake lock denemesi
- Seed radyo ve motive soz verileri

## Teknoloji Stack

- Vite
- React
- TypeScript
- React Router
- Dexie / IndexedDB
- Vitest + Testing Library
- Lucide React

## Kurulum

```bash
npm install
npm run dev
```

## Kalite Kontrolleri

```bash
npm test
npm run lint
npm run build
```

## Notlar

- Uygulama verileri tarayicinin yerel storage alaninda tutulur.
- Tablet kilitliyken audio playback web MVP'de garanti edilmez; Android tablet hardening fazinda ele alinacak.
- Hava durumu icin env variable veya API key gerekmez.
