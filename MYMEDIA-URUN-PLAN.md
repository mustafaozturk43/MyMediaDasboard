# MyMedia Urun Plan

## Context Loaded

**Project:** MyMedia - tablet/TV kiosk moduna uygun radyo ve multimedya ekranı  
**Stack:** Henüz seçilmemiş  
**Current Task:** Ürün kapsamı, platform kararı ve MVP planını netleştirme  
**Relevant Knowledge Entries Loaded:** Yok, `.agent/knowledge/INDEX.md` bulunamadı  
**Active Rules:** `code-hygiene`, `code-quality`, `safety`  
**Open Questions:** Web MVP'de `IndexedDB` yerine doğrudan SQLite kullanımı isteniyor, ancak düşük bakım için web tarafında `IndexedDB` daha uygundur.  
**Ready to proceed:** Evet, bu aşama planlama/brainstorming olduğu için kod yazmadan ilerlenebilir.

Not: `README.md` ve `.agent/CURRENT_TASK.md` bulunmadı. Mevcut bağlam `prd-taslak.md`, `ilkadim.md` ve kullanıcı isteğinden alındı.

## 1. Kısa Urun Tanimi

MyMedia; tablet, TV veya sabit ekranlarda tam ekran kiosk deneyimi sunan, canlı radyo yayını, fotoğraf slideshow, saat, hava durumu ve motive edici sözleri tek ekranda birleştiren düşük bakım maliyetli bir medya ekranıdır.

Ana amaç: Kullanıcının bir cihazı "sürekli açık ambiyans ve bilgi ekranı" olarak kullanabilmesi.

## 2. Hedef Kullanici

Birincil hedef kullanıcılar:

- Evde tablet veya TV ekranını radyo ve bilgi ekranı gibi kullanmak isteyen bireysel kullanıcı
- Ofis, bekleme alanı, resepsiyon, klinik veya küçük işletme sahibi
- Kafe, dükkân veya stüdyo gibi alanlarda sade bir ambiyans ekranı isteyen kullanıcı
- Teknik bilgisi sınırlı olan ama radyo linki, fotoğraf ve sözleri kolayca yönetmek isteyen kullanıcı

Öncelikli kullanım senaryosu:

- Cihaz sabit bir yerde durur.
- Uygulama tam ekran açık kalır.
- Radyo arka planda çalar.
- Ekranda slideshow, saat, hava durumu ve sözler görünür.
- Kullanıcı sadece gerektiğinde ayarlar/yönetim ekranına girer.

## 3. Platform Secenekleri

| Seçenek | Artılar | Eksiler | MVP Uygunluğu |
|---|---|---|---|
| Responsive web app | Telefon, tablet, desktop uyumlu; hızlı geliştirilir | Kiosk odağı zayıf kalabilir; TV deneyimi özel optimize edilmez | Orta |
| Tablet odaklı web kiosk app | Hızlı MVP; düşük bakım; tam ekran deneyime uygun; kolay deploy | Native kiosk kilitleme sınırlı; bazı tarayıcı ses davranışları değişebilir | Yüksek |
| Android tablet app | Daha iyi kiosk kontrolü; background audio daha yönetilebilir | Daha yüksek geliştirme ve bakım maliyeti; Play Store veya APK dağıtımı gerekir | Orta |
| Android TV app | TV kumandası, focus navigation ve büyük ekran için ideal | Daha fazla platform detayı; geliştirme süresi artar | MVP için düşük |
| Hibrit yaklaşım | Web ile hızlı başlar, sonra native wrapper yapılabilir | Baştan fazla planlanırsa karmaşıklaşabilir | Yüksek, ama fazlı olmalı |

## 4. En Dogru MVP Platform Onerisi

Önerim: **Web app tabanlı, Android tablet hedefli tablet odaklı web kiosk app**

Gerekçe:

- En düşük bakım maliyeti
- En hızlı MVP geliştirme
- Web app ve Android tablet hedefiyle uyumlu başlangıç
- Tablet ve dokunmatik ekran kullanımına doğal uyum
- TV tarayıcılarında da denenebilir
- Tek kod tabanı ile başlanır
- Daha sonra PWA, Android WebView wrapper veya Android tablet uygulamasına genişletilebilir
- Kiosk önceliği tasarım ve kullanım akışıyla sağlanır; native kiosk kilitleme ilk faza ertelenir

MVP için önerilen yaklaşım:

- Web uygulama tablet yatay ekran öncelikli tasarlanır.
- Desktop ve büyük TV ekranlarına responsive uyum sağlanır.
- Mobil telefon desteklenir ama ana hedef olmaz.
- Tam ekran butonu ve kiosk dostu layout eklenir.
- Cihaz tarafında tarayıcı kiosk modu veya Android tablet kiosk launcher ile kullanılabilir.

## 5. MVP Ozellikleri

MVP'ye dahil edilmesi önerilenler:

- Canlı radyo linki ekleme
- Radyo linki düzenleme
- Radyo linki silme
- Radyo listesinden istasyon seçip oynatma
- Radyo çalarken ana ekrandaki diğer içeriklerin çalışmaya devam etmesi
- En fazla 5 fotoğraf yükleme
- Fotoğrafları otomatik slideshow olarak gösterme
- Canlı saat gösterimi
- Tek şehir seçimiyle hava durumu gösterimi
- Motive edici sözleri gösterme
- Motive söz ekleme, düzenleme, silme
- Basit yönetim/ayar ekranı
- Tam ekran kiosk görünümü
- Tablet yatay ekran için optimize edilmiş ana ekran

MVP dışı bırakılması önerilenler:

- Kullanıcı hesabı
- Çoklu kullanıcı/tenant yapısı
- Hazır radyo kataloğu
- Android TV native app
- Gelişmiş admin paneli
- Uzaktan cihaz yönetimi
- Offline-first senkronizasyon
- Çoklu şehir hava durumu
- Zamanlanmış yayın akışı
- Video desteği

## 6. Ekranlar Listesi

MVP ekranları:

1. **Ana Kiosk Ekranı**
   - Slideshow alanı
   - Radyo oynatma durumu
   - Saat
   - Hava durumu
   - Motive söz
   - Ayarlar/yönetim giriş butonu

2. **Radyo Yönetimi**
   - Radyo listesi
   - Yeni radyo ekleme
   - Radyo adı ve stream URL düzenleme
   - Silme
   - Test/çal butonu

3. **Fotoğraf Yönetimi**
   - Maksimum 5 fotoğraf listesi
   - Fotoğraf yükleme
   - Fotoğraf silme
   - Slideshow sırası basitçe yükleme sırasına göre olabilir

4. **Motive Söz Yönetimi**
   - Söz listesi
   - Söz ekleme
   - Söz düzenleme
   - Söz silme

5. **Genel Ayarlar**
   - Şehir seçimi
   - Slideshow geçiş süresi
   - Söz değişim süresi
   - Tam ekran/kiosk modu başlatma
   - Varsayılan radyo seçimi

Opsiyonel ama MVP'de sade tutulabilecek ekran:

- **Kurulum İlk Açılış Ekranı**
  - İlk şehir
  - İlk radyo
  - İlk sözler
  - İlk fotoğraflar

## 7. Teknik Mimari

Önerilen MVP mimarisi: **Frontend ağırlıklı web app + tek cihaz odaklı yerel veri saklama**

En düşük bakım için ilk aşamada backend zorunlu olmayabilir.

### Mimari Oneri A: Local-first MVP

- Uygulama tarayıcıda çalışır.
- Radyo listesi, sözler ve ayarlar cihazda yerel olarak saklanır.
- Fotoğraflar cihazda yerel olarak saklanır.
- Hava durumu doğrudan frontend üzerinden public API ile çekilir veya basit proxy sonradan eklenir.
- Deploy statik hosting ile yapılır.

Artıları:

- Backend yok
- Düşük maliyet
- Hızlı geliştirme
- Tek cihaz kiosk kullanımına uygun

Eksileri:

- Veriler cihaz/browser bazlıdır
- Cihaz değişirse içerikler taşınmaz
- Tarayıcı storage limiti ve temizlenme riski vardır
- Tablet kilitliyken arka planda çalma web app tarafında garanti edilemez
- Hava durumu API key yönetimi frontend'de riskli olabilir

Uygulama kararı:

- Web MVP için düşük bakım maliyeti nedeniyle `IndexedDB` tercih edilir.
- Android tablet fazında gerekirse `SQLite` kullanılır.
- Kullanıcı beklentisindeki yerel kalıcılık korunur, ancak web tarafında doğrudan SQLite zorunlu tutulmaz.

### Mimari Oneri B: Basit backend/BaaS

- Frontend web app
- Supabase/Firebase gibi BaaS
- Fotoğraflar storage'da tutulur
- Radyo, söz, ayarlar veritabanında saklanır
- Hava durumu için serverless endpoint/proxy

Artıları:

- Veriler kalıcı ve taşınabilir
- API key gizlenebilir
- Sonradan çoklu cihaz desteğine uygun

Eksileri:

- Daha fazla bağımlılık
- Auth/erişim kontrolü düşünmek gerekir
- Bakım maliyeti local-first'e göre daha yüksek

Net önerim:

- MVP için **local-first web app** ile başla.
- Hava durumu için key gerektirmeyen ücretsiz servis kullan.
- Çoklu cihaz/senkronizasyon ihtiyacı netleşirse BaaS fazına geç.
- Android tablet kilit ekranında çalma ihtiyacı için sonraki fazda hybrid/native genişleme planla.

## 8. Teknoloji Stack Onerisi

MVP için önerilen stack:

- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **State:** React state + küçük bir store ihtiyacı olursa Zustand
- **Storage:** IndexedDB, tercihen Dexie
- **Audio:** Native HTMLAudioElement
- **Weather:** Open-Meteo gibi API key gerektirmeyen servis öncelikli
- **Deploy:** Netlify, Vercel veya statik hosting
- **PWA:** Sonraki mini fazda installable PWA

Android tablet genişleme fazı için:

- **Wrapper/Hybrid:** Capacitor veya Android WebView wrapper
- **Yerel veritabanı:** SQLite
- **Amaç:** kilit ekranında ses çalma, daha güçlü kiosk davranışı, cihaz entegrasyonu

Neden Next.js yerine Vite + React?

- Backend gerekmeyen MVP için daha sade
- Daha düşük karmaşıklık
- Statik deploy kolay
- Kiosk ekranı gibi client-heavy uygulama için yeterli
- Bakım maliyeti düşük

Ne zaman Next.js düşünülür?

- Server-side API/proxy zorunlu olursa
- Yönetim paneli büyürse
- Kullanıcı hesabı, auth ve server-side veri modeli eklenirse

## 9. Riskler ve Belirsizlikler

Başlıca riskler:

- Tarayıcılar otomatik ses başlatmayı engelleyebilir; kullanıcı ilk etkileşimi gerekebilir.
- "Arka planda çalma" web'de cihaz ve tarayıcıya göre değişebilir.
- Tablet ekran kapanırsa veya OS uygulamayı uyutursa ses kesilebilir.
- Tablet kilitliyken ses çalma beklentisi web MVP'de garanti edilemez.
- TV tarayıcılarında codec, audio stream ve layout uyumluluğu değişken olabilir.
- Radyo stream linkleri CORS, codec veya kesinti sorunları çıkarabilir.
- Fotoğrafları local storage'da tutmak cihaz/browser temizliği durumunda veri kaybına yol açabilir.
- Hava durumu API limiti, lisansı veya key yönetimi netleşmeli.
- Gerçek kiosk kilitleme web app ile değil cihaz/OS ayarıyla sağlanır.
- Yönetim alanı şifresiz olursa fiziksel erişimi olan herkes ayar değiştirebilir.

Varsayımlar:

- İlk sürüm tek cihaz kullanımına odaklanacak.
- Kullanıcı hesabı gerekmeyecek.
- Fotoğraflar cihaz üzerinde saklanabilir.
- Yönetim alanı public internetten değil, aynı cihaz üzerinden kullanılacak.
- Kiosk kilidi uygulama içinden değil, cihaz/tarayıcı ayarlarıyla desteklenecek.
- İlk sürümde tablet yatay ekran ana hedef olacak.
- Web app ve Android tablet birlikte hedeflenecek.
- Yönetim alanı için görünür bir ikon/resim butonu yeterli olacak.
- Tasarım dili minimal dijital saat ekranı olacak.
- Hava durumunda ücretsiz API uygunsa nem, rüzgar ve hissedilen sıcaklık gösterilecek.

## 10. Fazlara Ayrilmis Gelistirme Plani

### Faz 0: Urun Netlestirme

- Platform kararını kesinleştir
- MVP kapsamını dondur
- Veri saklama yaklaşımını seç
- Hava durumu API kararını ver
- Kiosk kullanım cihazlarını netleştir

Çıktı:

- Onaylı MVP kapsamı
- Uygulama akışları
- Teknik plan

### Faz 1: Ana Kiosk Deneyimi

- Ana ekran layout
- Saat bileşeni
- Slideshow gösterimi
- Motive söz gösterimi
- Basit responsive kiosk tasarım
- Tam ekran başlatma butonu

Çıktı:

- Radyo hariç çalışan kiosk ekran iskeleti

### Faz 2: Radyo Ozellikleri

- Radyo listesi
- Radyo ekleme/düzenleme/silme
- Radyo seçip çalma
- Çalma/durdurma durumu
- Stream hata durumu
- Uygulama açıkken kararlı arka plan ses davranışı

Çıktı:

- Kullanıcının manuel radyo linkleriyle canlı yayın dinleyebilmesi

### Faz 3: Yonetim Alani

- Fotoğraf yönetimi
- Motive söz yönetimi
- Genel ayarlar
- Şehir ayarı
- Slideshow/söz süre ayarları

Çıktı:

- Kullanıcının tüm MVP içeriğini yönetebilmesi

### Faz 4: Hava Durumu

- Şehir bazlı hava durumu entegrasyonu
- API hata/fallback durumu
- Son başarılı hava durumu bilgisini saklama
- Basit güncelleme periyodu

Çıktı:

- Kiosk ekranında canlı/yarı canlı hava durumu

### Faz 5: Kiosk Sertlestirme

- Büyük ekran ve tablet testleri
- Tam ekran davranışı
- Uyku/ekran açık kalma önerileri
- PWA install desteği
- Hata durumları ve boş durumlar
- Veri yedekleme/içe aktarma opsiyonu değerlendirilebilir
- Android tablet paketleme yaklaşımını netleştirme

Çıktı:

- Günlük kullanıma hazır MVP

### Faz 6: Sonraki Platform Genisleme

- Android tablet WebView wrapper veya Capacitor paketi
- Android TV özel arayüz/focus navigation
- Bulut senkronizasyon
- Hazır radyo katalogları
- Gelişmiş admin/auth
- Uzaktan cihaz yönetimi

## Acik Sorular ve Cevaplar

1. **İlk hedef cihaz:** Web app ve Android tablet.
2. **Offline açılış davranışı:** Evet, son kayıtlı fotoğraf, söz ve radyo verileri gösterilmeli. Yerel saklama kullanılmalı.
3. **Fotoğraf saklama:** Fotoğraflar yerel cihazda saklanmalı.
4. **Yönetim alanı güvenliği:** Şifreli alan gerekmiyor, basit ayarlar ekranı yeterli.
5. **Radyo veri girişi:** Radyo linkleri manuel girilecek. Sonraki aşamada JSON aktarımı düşünülebilir. Kullanıcı SQLite fikrini belirtti, ancak web MVP için düşük bakım nedeniyle `IndexedDB`, Android fazında `SQLite` daha uygun kabul edildi.
6. **Arka planda çalma beklentisi:** Tablet kilitliyken de çalması isteniyor. Bu, web MVP için riskli; Android tablet fazında daha gerçekçi şekilde karşılanabilir.
7. **Hava durumu kapsamı:** Ücretsiz API destekliyorsa sıcaklık, durum, nem, rüzgar ve hissedilen sıcaklık gösterilebilir.
8. **Ayarlar ekranına giriş:** Görünür bir ikon/resim butonu yeterli. Bu butona basılınca ayarlar ekranı açılır.
9. **Tasarım dili:** Minimal dijital saat ekranı.
10. **Cihaz kapsamı:** Kısa vadede tek cihaz. Çoklu cihaz senkronizasyonu MVP dışı.

## Guncellenmis Net Tavsiye

İlk MVP'yi **Vite + React + TypeScript tabanlı, tablet odaklı local-first web kiosk app** olarak başlatalım.

Karar özeti:

- İlk hedef platform: web app + Android tablet
- İlk uygulama türü: tablet odaklı web kiosk app
- Veri saklama: web MVP'de `IndexedDB`, Android fazında `SQLite`
- Fotoğraflar: yerel cihazda
- Yönetim alanı: basit ayarlar ekranı
- Hava durumu: ücretsiz API, tercihen Open-Meteo
- Tasarım: minimal dijital saat ekranı
- Cihaz kapsamı: kısa vadede tek cihaz

Bu yaklaşım hızlı geliştirme, düşük bakım maliyeti ve kiosk önceliğiyle en uyumlu çözümdür.
