# MyMedia Implementation Plan

## 1. Objective

MyMedia MVP; tablet odakli, tam ekran kiosk kullanimina uygun bir web uygulamasi olarak gelistirilecektir. Uygulama tek cihaz icin calisacak, yerel veri saklayacak ve ana ekranda radyo, slideshow, saat, hava durumu ve motive sozleri birlikte gosterecektir.

Bu planin hedefi, dusuk bakim maliyetli ilk surumu net bir uygulama sirasiyla hazir hale getirmektir.

## 2. Confirmed Product Decisions

- Ilk hedef platform: web app + Android tablet
- MVP uygulama tipi: tablet odakli web kiosk app
- Kisa vadede tek cihaz desteklenecek
- Radyo linkleri manuel girilecek
- Fotograf sayisi en fazla 5 olacak
- Fotograf ve uygulama verileri cihazda yerel olarak saklanacak
- Yonetim alani icin sifresiz basit ayarlar ekrani yeterli olacak
- Tasarim dili minimal dijital saat ekranina yakin sade arayuz olacak
- Hava durumu icin ucretsiz API tercih edilecek
- Tablet kilitliyken ses calmaya devam etmesi arzu edilen hedeftir, ancak web MVP'de garanti edilmez

## 3. MVP Scope

MVP'ye dahil:

- Ana kiosk ekrani
- Canli radyo linki ekleme, duzenleme, silme
- Secilen radyoyu oynatma ve durdurma
- Radyo calarken ana ekran widget'larinin calismaya devam etmesi
- En fazla 5 fotograf yukleme ve slideshow gosterimi
- Canli saat gosterimi
- Tek sehir bazli hava durumu
- Motive soz gosterimi
- Motive soz ekleme, duzenleme, silme
- Basit ayarlar ekrani
- Yerel veri saklama ve son durumun yeniden yuklenmesi

MVP disi:

- Kullanici hesabı
- Coklu cihaz senkronizasyonu
- Android TV native uygulamasi
- Gelismis admin paneli
- Bulut storage
- Hazir radyo katalogu
- Uzaktan cihaz yonetimi

## 4. Delivery Strategy

Urun iki asamada ilerleyecek:

### Asama A: Web MVP

- Vite + React + TypeScript tabanli uygulama
- Tablet yatay ekran icin optimize kiosk arayuzu
- Yerel veri saklama icin `IndexedDB`
- Fotograf, radyo, soz ve ayarlarin cihazda tutulmasi
- Open-Meteo ile hava durumu gosterimi

### Asama B: Android Tablet Hardening

- Web uygulamanin PWA veya hybrid wrapper ile paketlenmesi
- Gerekirse `SQLite` entegrasyonu
- Kiosk davranisinin guclendirilmesi
- Kilit ekraninda audio davranisinin arastirilmasi ve mumkunse iyilestirilmesi

Bu plan kapsaminda kodlama yalnizca Asama A icin yapilacaktir.

## 5. Proposed Technical Architecture

## Frontend Layers

### UI Layer

Ana sorumluluklar:

- Kiosk layout'u gosterme
- Radyo player kontrolleri
- Saat ve hava durumu gosterimi
- Slideshow ve motive soz alanlari
- Ayarlar ve yonetim ekranlari

### State Layer

Kaynaklar:

- Uygulama tercihlerinin aktif bellek durumu
- Yerel veri kaynagindan yuklenen radyo, fotograf, soz ve ayarlar
- Hava durumu fetch sonucu
- Audio player durum bilgisi

Kural:

- Her veri tipinin tek yazma noktasi olacak
- Kalici veri store katmanindan guncellenecek
- UI dogrudan storage'a yazmayacak
- Audio playback state uygulama kabugunda tutulacak; ekran degisimi player instance'ini yok etmemeli

### Storage Layer

Yerel cihaz kaliciligi icin:

- `IndexedDB` ana veri kaynagi olacak
- Dexie veya benzeri hafif bir wrapper kullanilabilir

Saklanacak veri tipleri:

- Radio stations
- Quotes
- Photos metadata ve binary referansi
- App settings
- Last selected station
- Last weather snapshot ve timestamp

### Service Layer

- Weather service
- Audio player service
- Fullscreen/kiosk helper
- Storage access module

## 6. Data Model Outline

### Station

- `id`
- `name`
- `streamUrl`
- `isFavorite` opsiyonel, MVP'de kullanilmayabilir
- `createdAt`
- `updatedAt`

### Photo

- `id`
- `name`
- `mimeType`
- `blobRef`
- `createdAt`

### Quote

- `id`
- `text`
- `createdAt`
- `updatedAt`

### Settings

- `cityName`
- `latitude`
- `longitude`
- `slideshowIntervalSec`
- `quoteIntervalSec`
- `defaultStationId`
- `lastStationId`
- `weatherEnabled`

### Weather Cache

- `cityName`
- `temperature`
- `conditionCode`
- `windSpeed`
- `humidity`
- `feelsLike`
- `fetchedAt`

## 7. Screen Breakdown

### 1. Kiosk Screen

Icerik:

- Buyuk saat alani
- Slideshow alani
- Aktif radyo bilgisi
- Play/pause veya stop kontrolu
- Hava durumu ozeti
- Donen motive soz alani
- Ayarlar ikon butonu

Beklenen davranis:

- Uygulama acilisinda son durum yuklenir
- Varsa son secilen radyo veya varsayilan radyo hazir olur
- Slideshow ve saat her zaman calisir
- Veri eksikse bos durum gosterilir

### 2. Radio Management Screen

- Istasyon listesi
- Ekle formu
- Duzenle formu
- Sil aksiyonu
- URL dogrulama ve basit hata mesaji

### 3. Photo Management Screen

- Yüklenen 5 adede kadar fotograf listesi
- Yeni fotograf yukleme
- Silme
- Limit dolunca yeni yukleme engeli

### 4. Quote Management Screen

- Soz listesi
- Soz ekleme
- Soz duzenleme
- Soz silme

### 5. Settings Screen

- Sehir secimi veya sehir arama
- Slideshow suresi
- Soz donus suresi
- Varsayilan radyo secimi
- Tam ekran modu tetikleme

## 8. Functional Requirements

### Radio

- Kullanici manuel radyo URL'si ekleyebilmeli
- Gecersiz veya bos URL kaydedilmemeli
- Tek bir aktif playback instance olmali
- Stream hata verirse kullaniciya net bilgi gosterilmeli
- Uygulama ici gezinmede ses kesilmemeli

### Photos

- En fazla 5 fotograf yuklenebilmeli
- Desteklenmeyen dosya tipleri reddedilmeli
- Fotograf basina boyut siniri tanimlanmali
- Fotograflar yeniden yuklemede korunmali
- Slideshow veri yoksa fallback gorsel veya bos durum gostermeli

### Quotes

- Bos soz kaydi olusturulamamali
- En az bir soz varsa otomatik donus calismali
- Soz yoksa alan sakince bos kalmali veya placeholder gosterilmeli

### Weather

- Ucretsiz API kullanilmali
- Son basarili sonuc cache'lenmeli
- Tum weather isteklerinde timeout tanimlanmali
- Basarisiz isteklerde sinirli retry/backoff uygulanmali
- API erisilemezse son cache veya hata metni gosterilmeli
- Surekli tekrar deneme ile UI bloklanmamali

### Kiosk

- Ana ekran tablet yatay kullanim icin optimize olmali
- Tam ekran moduna gecis manuel tetiklenebilmeli
- Ayarlara ana ekrandaki gorunur ikonla girilmeli

## 9. Non-Functional Requirements

- Ilk yukleme sonrasi temel kiosk ekraninin hizli acilmasi
- Dusuk internet kosullarinda mevcut yerel veriyle calismaya devam etmesi
- UI'da kritik hatalarda tum ekranin coker gorunmemesi
- Tablet ekraninda dokunmatik kullanima uygun buyuk hedef alanlar
- Kod yapisinin Android tablet asamasina gecisi zorlastirmamasi

## 10. Failure Modes And Handling

### Stream Acilmiyor

- Audio error yakalanir
- Kullaniciya "Yayin acilamadi" mesaji gosterilir
- Uygulama geri kalan widget'larla calismaya devam eder

### Weather API Hatasi

- Son cache'li veri varsa gosterilir
- Yoksa hata yerine sade "Veri alinamadi" durumu gosterilir
- UI refresh loop'a girmez
- Timeout suresi asildiginda istek iptal edilir ve bir sonraki planli yenileme beklenir

### Bos Veri Durumu

- Ilk kurulumda radyo, fotograf veya soz yoksa bos durum kartlari gosterilir
- Uygulama coker gibi gorunmez

### Storage Read/Write Hatasi

- Islem bazli hata mesaji gosterilir
- Tek bir kayit hatasi tum uygulama state'ini bozmaz

## 11. Testing Strategy

Minimum test kapsamı:

- Storage katmani unit testleri
- Form validation testleri
- Kiosk screen kritik render testleri
- Radio state behavior testleri
- Weather mapper/service testleri

Manual dogrulama:

- Tablet yatay ekran davranisi
- Tam ekran butonu
- Sayfalar arasi geciste audio durumu
- Fotograf limitinin calismasi
- Offline yeniden acilis davranisi

## 12. Implementation Phases

### Faz 1: Project Setup

- Vite + React + TypeScript kurulumu
- Tailwind kurulumu
- Baslangic klasor yapisi
- Router ve sayfa iskeleti
- Temel tema ve layout sistemi

### Faz 2: Local Data Foundation

- IndexedDB setup
- Veri modelleri
- CRUD servisleri
- Seed/fallback veri yaklasimi gerekiyorsa minimal destek
- Fotograf boyut limiti ve storage hata davranisi

### Faz 3: Kiosk Screen

- Ana ekran layout
- Saat widget'i
- Slideshow component'i
- Quote rotator
- Settings giris butonu

### Faz 4: Radio Management And Playback

- Radio CRUD ekranı
- Audio player service
- Playback state yonetimi
- Hata durumlari
- Route degisikliklerinde player omrunun korunmasi

### Faz 5: Photo And Quote Management

- Photo upload and delete
- Quote CRUD
- Limit ve validation kurallari

### Faz 6: Weather And Settings

- Weather service entegrasyonu
- Sehir ayarlari
- Slideshow/quote interval ayarlari
- Varsayilan radyo secimi
- Timeout, retry ve cache yenileme politikasi

### Faz 7: Stabilization

- Bos durumlar
- Hata durumlar
- Basic responsive hardening
- Manual QA checklist

## 13. Open Technical Decisions

Bu asamada netlestirilmesi gereken ama implementasyonu durdurmayan kararlar:

- `Dexie` kullanilsin mi yoksa raw `IndexedDB` wrapper mi yazilsin?
- Hava durumu icin sehir arama hangi servisle yapilsin?
- Audio player durum yonetimi React context ile mi, basit store ile mi yapilsin?
- PWA destegi MVP sonuna mi, yoksa hemen kurulum asamasina mi alinsin?

## 14. Recommendation

Kodlamaya, web MVP sinirlarina sadik kalarak baslanmalidir.

Temel uygulama karari:

- Web tarafinda `IndexedDB`
- UI tarafinda Vite + React + TypeScript + Tailwind
- Ucretsiz weather service
- Kiosk ana ekran once
- Native Android veya `SQLite` genislemesi daha sonraki faz
