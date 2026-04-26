# MyMedia – PRD Taslağı

## 1. Ürün Özeti
MyMedia; tablet, TV veya sabit ekranlarda çalışabilecek, tam ekran kiosk moduna uygun bir radyo ve görsel bilgi ekranı uygulamasıdır. Kullanıcı canlı radyo yayınlarını dinlerken ekranda fotoğraf slaytı, canlı saat, hava durumu ve motive edici sözler görebilir.

## 2. Problem
Kullanıcılar ev, ofis, dükkân veya bekleme alanlarında hem estetik hem işlevsel bir ekran deneyimi ister. Mevcut çözümler ya fazla karmaşıktır ya da radyo, slayt, saat, hava durumu ve motive sözler gibi ihtiyaçları tek bir sade arayüzde birleştirmez.

## 3. Hedef
İlk sürümde düşük bakım maliyetli, hızlı geliştirilebilir, kiosk kullanıma uygun bir MVP çıkarmak.

## 4. Hedef Kullanıcılar
- Evde sabit ekran kullanan bireysel kullanıcı
- Ofis resepsiyon / bekleme alanı yöneten kullanıcı
- Kafe / dükkân gibi mekânlarda ambiyans ekranı isteyen işletme sahibi
- Tablet veya TV ekranını akıllı gösterge paneline çevirmek isteyen kullanıcı

## 5. Temel Kullanım Senaryoları
1. Kullanıcı radyo linki ekler ve listeden bir istasyonu başlatır.
2. Radyo çalarken ekranda fotoğraf slaytı döner.
3. Kullanıcı ekrandan saat ve hava durumunu takip eder.
4. Ekranda belli aralıklarla motive edici sözler görünür.
5. Kullanıcı basit bir ayar/yönetim ekranından şehir, radyo listesi, fotoğraflar ve sözleri günceller.

## 6. MVP Özellikleri
- Canlı radyo linki ekleme / düzenleme / silme
- Radyo listesinden yayın seçip oynatma
- Arka planda ses çalma davranışı
- En fazla 5 foto yükleme
- Otomatik slideshow
- Canlı saat bileşeni
- Tek şehir bazlı hava durumu gösterimi
- Motive sözler gösterimi
- Basit ayarlar/yönetim ekranı
- Tablet uyumlu tam ekran kiosk arayüz

## 7. MVP Dışı / Sonraki Faz
- Çoklu şehir desteği
- Kategori bazlı radyo listeleri
- Hazır radyo katalog entegrasyonu
- Gelişmiş admin paneli
- Kullanıcı hesabı / çok kullanıcılı yapı
- Android TV native sürüm
- Offline fallback içerik
- Zamanlanmış tema / ekran düzeni

## 8. Platform Kararı
### Değerlendirilecek Seçenekler
- Responsive web app
- Tablet odaklı web kiosk app
- Android tablet app
- Android TV app
- Hibrit yaklaşım

### İlk Öneri
**MVP için tablet odaklı web kiosk app**

### Gerekçe
- en hızlı MVP geliştirme
- düşük bakım maliyeti
- kolay güncelleme ve dağıtım
- tablet ve bazı TV tarayıcılarında çalışma potansiyeli
- ileride Android tablet / Android TV paketlemeye uygun temel

## 9. Ekranlar
- Ana kiosk ekranı
- Radyo yönetim ekranı
- Fotoğraf yönetim ekranı
- Söz yönetim ekranı
- Genel ayarlar ekranı

## 10. Ana Bileşenler
- Radyo player
- Slideshow alanı
- Saat widget’ı
- Hava durumu widget’ı
- Motive söz kartı / ticker
- Ayarlar paneli

## 11. Teknik Mimari Önerisi
- Frontend ağırlıklı web uygulama
- Hafif backend veya BaaS tabanlı veri saklama
- Radyo linkleri, sözler, ayarlar ve medya metadata’sı için basit veri modeli
- Fotoğraflar için yerel veya bulut dosya saklama
- Hava durumu için harici API entegrasyonu

## 12. Stack Önerisi
### Öneri A
- Next.js
- React
- Tailwind CSS
- SQLite / PostgreSQL
- Prisma
- Basit object storage veya local upload

### Öneri B
- Vite + React
- Tailwind CSS
- Supabase
- Supabase Storage

## 13. Riskler ve Belirsizlikler
- Bazı cihazlarda arka planda ses davranışı kısıtlı olabilir
- TV tarayıcı uyumluluğu değişken olabilir
- Hava durumu API maliyeti / limitleri olabilir
- Radyo stream linklerinin sürekliliği garanti olmayabilir
- Gerçek admin panel yerine basit ayar ekranı MVP’de yeterli olabilir

## 14. Opencode’dan İstenecek Çıktılar
- net ürün tanımı
- platform karşılaştırması
- MVP platform önerisi
- kullanıcı akışları
- ekran kırılımı
- mimari öneri
- fazlı plan
- açık sorular listesi

## 15. Sonraki Adım
Opencode içinde önce `project-context-primer`, ardından `brainstorming`, sonra `writing-plans` ve `architecture-review` çalıştırılmalı. Kod aşamasına plan onayından sonra geçilmeli.
