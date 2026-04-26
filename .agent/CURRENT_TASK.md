# Current Task

## What We're Building

MyMedia için tablet odaklı web kiosk MVP geliştiriliyor. Settings ekranı tab navbar yapısına dönüştürüldü; her bölüm (Radyo, Fotoğraflar, Sözler, Ayarlar, Durum) ayrı bir sekmede gösteriliyor.

## Status

In Progress

## Last Session Summary

2026-04-26 — Settings paneli 5 sekmeye (tab navbar) bölündü. Eski grid tabanlı yapı kaldırılıp `.settings-tab-layout`, `.settings-tab-nav`, `.settings-tab-btn`, `.settings-tab-pane`, `.settings-pane-header`, `.settings-form-card`, `.settings-empty-state`, `.settings-status-cards` CSS bileşenleri eklendi. Sekme geçişlerinde `tab-fade-in` animasyonu, badge sayaçları ve canlı yayın için pulse animasyonu eklendi. Mobil (<720px) için label'lar gizlenip yalnızca emoji ikonlar gösteriliyor. `npm run lint` ve `npm run build` başarılı.

## Next Steps

1. Android tablet hardening ve gerçek cihaz testleri yap.
2. Offline cache stratejisini ve stream hata gözlemlenebilirliğini güçlendir.

## Blockers

- Web MVP'de tablet kilitliyken arka planda ses çalmayı garanti etmek teknik olarak mümkün değil; bu Android tablet hardening fazına taşındı.
