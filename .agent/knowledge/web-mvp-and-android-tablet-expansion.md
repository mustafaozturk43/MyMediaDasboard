---
type: decision
topic: Web MVP and Android tablet expansion
date: 2026-04-26
tags: [mymedia, architecture, web, android-tablet, storage, kiosk]
---

## Summary

MyMedia ilk olarak tablet odakli web kiosk app olarak gelistirilecek. Yerel kalicilik web MVP'de `IndexedDB` ile saglanacak; Android tablet odakli gelisme ve kilit-ekran audio davranisi sonraki fazda hybrid/native genisleme ile ele alinacak.

## Context

Urun planlama asamasinda platform, veri saklama ve kiosk davranisi netlestirildi. Kullanici hem web app hem Android tablet hedefini belirtti; ayni zamanda dusuk bakim maliyeti ve hizli MVP teslimi istendi.

## Decision / Finding

- MVP platformu tablet odakli web kiosk app olarak secildi.
- Ilk hedef cihazlar web app ve Android tablet olarak belirlendi.
- Web MVP tek cihaz odakli olacak.
- Radyo, soz, ayarlar ve fotograflar cihazda yerel olarak tutulacak.
- Web MVP'de kalicilik icin `IndexedDB` kullanilacak.
- Kullanici SQLite istedigini belirtti, ancak bu karar Android tablet fazina tasindi.
- Android tablet hardening veya hybrid wrapper fazinda `SQLite` degerlendirilecek.
- Yonetim alani sifresiz basit ayarlar ekrani olarak kalacak.
- Hava durumu icin ucretsiz servis tercih edilecek; `Open-Meteo` aday servis olarak not edildi.
- Tablet kilitliyken ses calmaya devam etmesi urun istegi olarak kaydedildi, ancak web MVP'de garanti edilmemesi acik risk olarak kabul edildi.

## Rationale

Web MVP secimi, en dusuk bakim maliyeti ve en hizli gelistirme suresini sagliyor. Web tarafinda SQLite kullanmak mimariyi gereksiz karmasiklastiracagindan, tarayiciya uygun yerel kalicilik cozumune gecildi. Android tablet fazi, kiosk sertlestirme ve kilit-ekran audio ihtiyaci gibi web sinirlarini asmak icin ayrildi.

## Consequences

- Kodlama ilk olarak web MVP sinirlarina gore yapilacak.
- Arka planda ses calmasi icin kabul kriterleri web'de sinirli tutulacak.
- Android tablet genislemesi icin mevcut mimarinin ayrik service/storage katmanlariyla kurulmasi gerekir.
- Coklu cihaz senkronizasyonu ve bulut veri yapisi MVP disinda kalacak.

## References
- `/home/mozturk/projeler/mymedia/MYMEDIA-URUN-PLAN.md`
- `/home/mozturk/projeler/mymedia/implementation_plan.md`
- `/home/mozturk/projeler/mymedia/.agent/reviews/architecture-review-implementation-plan.md`
