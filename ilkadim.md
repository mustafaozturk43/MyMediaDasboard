# İlk Adım

## İlk Prompt

Aşağıdaki metni Opencode içinde ilk mesaj olarak kullan:

```text
MyMedia projesini başlatıyoruz.

Önce zorunlu olarak project-context-primer skill’ini çalıştır.
Ardından brainstorming yaklaşımıyla gereksinimleri netleştir.
Bu aşamada kod yazma; önce ürün, platform kararı ve geliştirme planını çıkar.

Ürün vizyonu:
MyMedia; tablet, TV veya sabit ekranda çalışabilecek, tam ekran kiosk moduna uygun bir multimedya uygulaması olacak. Kullanıcı canlı radyo yayınlarını dinlerken ekranda dönen fotoğraf slaytı, canlı saat, hava durumu ve motive edici sözler görebilecek.

Ana kullanım amacı:
Evde, ofiste, dükkanda, bekleme alanında veya kişisel akıllı ekranda estetik ve işlevsel bir medya/radyo ekranı sunmak.

Ana özellikler:
1. Kullanıcının canlı radyo linkleri ekleyebilmesi, düzenleyebilmesi ve silebilmesi
2. Radyo listesinden seçim yapıp canlı yayını dinleyebilmesi
3. Radyo yayınının arka planda çalmaya devam etmesi
4. En fazla 5 fotoğraf yüklenebilmesi
5. Fotoğrafların otomatik slideshow şeklinde gösterilmesi
6. Canlı saat gösterimi
7. Hava durumu bilgisinin gösterilmesi
8. Hava durumu için şehir seçebilme
9. Motive edici sözlerin gösterilmesi
10. Motive sözlerin admin benzeri bir yönetim alanından eklenip düzenlenebilmesi
11. Uygulamanın tablet/TV ekranına uygun, sade ve modern bir arayüze sahip olması
12. Tam ekran kiosk moduna uygun tasarım

Platform kararı için şu seçenekleri değerlendir:
1. Responsive web app
2. Tablet odaklı web kiosk app
3. Android tablet uygulaması
4. Android TV uygulaması
5. Hibrit yaklaşım

Ürün ihtiyaçları:
- canlı radyo yayını çalma
- arka planda sesin devam etmesi
- en fazla 5 foto ile slideshow
- canlı saat
- hava durumu
- motive sözler
- kiosk / tam ekran kullanım
- sade, modern arayüz
- düşük bakım maliyeti
- hızlı MVP geliştirme

Bu aşamada üretmeni istediğim çıktılar:
1. Kısa ve net ürün tanımı
2. Hedef kullanıcı profilleri
3. Platform seçeneklerinin karşılaştırması
4. MVP için en doğru platform önerisi
5. Bu platformun neden önerildiği
6. MVP kapsamı
7. MVP dışı ama sonraki faza uygun özellikler
8. Kullanıcı senaryoları
9. Ekranlar / sayfalar / bileşenler listesi
10. Teknik mimari önerisi
11. Uygun teknoloji stack önerisi
12. Olası riskler ve belirsizlikler
13. Fazlara ayrılmış geliştirme planı
14. Sonraki faz için platform genişleme önerisi

Önemli kurallar:
- Önce planlama yap, kod yazma
- Belirsiz noktaları bana soru olarak sor
- Varsayım yaparsan açıkça belirt
- Düşük bakım maliyeti olan, sade ama şık bir çözüm öner
- Kiosk kullanımını öncelikli senaryo olarak değerlendir
- Net ve kararlı bir teknik öneri ver
```

---

## Adımlar

1. Proje klasöründe Opencode aç:

   ```bash
   cd /home/mozturk/projeler/mymedia
   opencode
   ```

2. Eğer session seçimi gelirse:
   - mevcut `mymedia` session varsa onu seç
   - yoksa yeni session aç

3. Agent kontrol et:
   - `/agents`
   - önce **Plan** agentını seç

4. Model kontrol et:
   - `/models`
   - mümkünse **OpenAI / gpt-5.4** seç

5. Yukarıdaki **İlk Prompt** metnini ilk mesaj olarak yapıştır.

6. Opencode’un döndürdüğü soruları cevaplayarak kapsamı netleştir.

7. İlk çıktı geldikten sonra özellikle şunları doğrula:
   - önerilen platform ne?
   - MVP özellikleri doğru mu?
   - admin alanı gerekli mi, yoksa basit ayar ekranı yeterli mi?
   - hava durumu için tek şehir mi, çoklu şehir mi?
   - radyo linkleri manuel mi girilecek, hazır liste de olacak mı?

8. Plan netleşince bir sonraki promptta şunu iste:
   - `writing-plans`
   - ardından `architecture-review`
   - henüz implementasyona geçmeden önce planı revize et

9. Plan onaylanınca:
   - `/agents`
   - **Build** agentına geç
   - implementasyona kontrollü şekilde başla

10. Kod yazımı bittikçe:

- test
- code review
- documentation sync
  adımlarını uygulat.

---

## Benim Önerim

MVP için en mantıklı başlangıç:

- **tablet odaklı web kiosk app**

Neden:

- en hızlı geliştirme
- düşük bakım maliyeti
- tablet ve TV tarayıcısında çalışabilir
- tam ekran kiosk deneyimine uygun
- daha sonra Android tablet / Android TV paketlemesine genişletilebilir
