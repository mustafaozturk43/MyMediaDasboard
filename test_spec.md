# MyMedia Test Spec

## Scope

Bu test spesifikasyonu web MVP implementasyon dalgasi icin hazirlandi. Kapsam: proje iskeleti, kiosk ana ekran, yerel veri modeli, radyo/fotograf/soz yonetimi, weather entegrasyonu, audio state ve temel PWA/kiosk davranislari.

## Acceptance Criteria

### 1. App Shell

- Uygulama basarili sekilde acilmalidir.
- Ana rota kiosk ekranini gostermelidir.
- Ayarlar ikon butonu ana ekranda gorunmelidir.

### 2. Kiosk Screen

- Kiosk ekraninda saat alani gorunmelidir.
- Kiosk ekraninda radyo alani gorunmelidir.
- Kiosk ekraninda hava durumu alani gorunmelidir.
- Kiosk ekraninda motive soz alani gorunmelidir.
- Kiosk ekraninda slideshow alani gorunmelidir.

### 3. Local Data

- Uygulama ilk acilista yerel veriyi yuklemelidir.
- Veri yoksa guvenli varsayilan durumla acilmalidir.
- Ayarlar, radyo listesi, sozler ve fotograflar ayni yerel store uzerinden okunmalidir.

### 4. Photo Rules

- Fotograf limiti 5 olmalidir.
- Limit asiminda dogrulama hatasi uretilmelidir.

### 5. Quote Rules

- Bos quote kaydedilememelidir.
- Gecerli quote metni normalize edilerek saklanabilmelidir.

### 6. Station Rules

- Bos istasyon adi reddedilmelidir.
- Gecersiz stream URL reddedilmelidir.
- Gecerli istasyon nesnesi kabul edilmelidir.

### 7. Weather Rules

- Weather veri donusumu eksik alanlarda guvenli fallback uretmelidir.
- Weather fetch tarafi timeout ile sarilmalidir.

### 8. Radio Management And Playback

- Kullanici ayarlar ekranindan yeni radyo ekleyebilmelidir.
- Eklenen radyo kaydi local storage katmanina yazilabilmelidir.
- Kiosk ekrani son eklenen/var olan radyoyu gosterebilmelidir.
- Kullanici bir radyoyu oynatabildiginde aktif durum gorunmelidir.
- Route degisimi audio state bilgisini sifirlamamalidir.

### 9. Photo Management And Slideshow

- Kullanici ayarlar ekranindan fotograf yukleyebilmelidir.
- Fotograflar yerel store katmanina yazilabilmelidir.
- Kiosk ekraninda yuklenen fotograf sayisi ve aktif gorsel gosterilebilmelidir.
- Birden fazla fotograf varsa slideshow zamanla diger gorsele gecmelidir.
- 5 fotograf siniri asilinca hata gosterilmelidir.

### 10. Quote Management

- Kullanici ayarlar ekranindan motive soz ekleyebilmelidir.
- Bos motive soz reddedilmelidir.
- Kiosk ekranda yeni eklenen soz gorunmelidir.
- Birden fazla soz varsa quote interval suresine gore donmelidir.

### 11. General Settings And Weather

- Kullanici sehir, koordinat ve sure ayarlarini guncelleyebilmelidir.
- Ayarlar yerel store katmanina yazilmalidir.
- Weather etkinse kiosk ekraninda sicaklik, nem, ruzgar ve hissedilen sicaklik gorunmelidir.
- Weather fetch hatasi varsa son cache veya sade hata durumu gosterilmelidir.

### 12. Audio Error Handling

- Audio play basarisiz olursa kullaniciya net hata mesaji gosterilmelidir.

## Test Outline

### Unit Tests

```ts
describe('station validation', () => {
  it('rejects an empty station name')
  it('rejects an invalid stream url')
  it('accepts a valid station payload')
})

describe('quote validation', () => {
  it('rejects an empty quote')
  it('normalizes whitespace for a valid quote')
})

describe('photo rules', () => {
  it('allows up to five photos')
  it('rejects more than five photos')
})

describe('weather mapper', () => {
  it('maps full api data into the app model')
  it('returns safe defaults for missing optional fields')
})
```

### UI Tests

```ts
describe('App routes', () => {
  it('renders the kiosk screen on the root route')
})

describe('Kiosk screen', () => {
  it('renders the clock, radio, slideshow, weather and quote areas')
  it('shows the settings icon button')
})

describe('Radio management', () => {
  it('creates a station from the settings screen')
  it('shows the created station on the kiosk screen')
  it('marks a station as playing when playback starts')
  it('keeps the current playback state across route changes')
})

describe('Photo management', () => {
  it('uploads a photo from the settings screen and shows it on the kiosk screen')
  it('rotates to the next photo when the slideshow interval elapses')
  it('shows an error when the photo limit exceeds five')
})

describe('Quote management', () => {
  it('adds a quote from the settings screen and shows it on the kiosk screen')
  it('rotates to the next quote when the quote interval elapses')
})

describe('Settings and weather', () => {
  it('updates general settings and shows weather details on the kiosk screen')
  it('shows a fallback message when weather fetch fails without cache')
})

describe('Audio errors', () => {
  it('shows an error message when playback cannot start')
})
```

## Done Checklist

- [x] Acceptance criteria icin temel testler yazildi
- [x] Yeni testler implementasyon oncesi red durumda goruldu
- [x] Ilk implementasyon sonrasi testler green oldu
- [x] Mevcut testler kirilmadi
- [x] Ilk dalga coverage raporu alindi

Son dogrulama komutlari:

```bash
cd web
npm test
npm run lint
npm run build
```
