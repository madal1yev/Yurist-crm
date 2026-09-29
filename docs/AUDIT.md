# LawCRM — Audit va tuzatish hisoboti

Tarix: 2026-09-29 · Repo: `C:\Users\New\Desktop\freebuff-yurist` · Stack: Vite 5 + React 18 + Tailwind (frontend-only)

> **Muhim cheklov.** Bu repo faqat frontend. Barcha ma'lumot brauzerdagi
> `localStorage` da saqlanadi. Bu **prototip / demo**, production tizim emas.
> Quyidagi kamchiliklar shu sababga bog'liq va server kelganda yopiladi.

---

## 1. Kritik (Critical) — yopildi

| # | Muammo | Holat |
|---|--------|-------|
| C1 | Telegram bot tokeni kod ichida (`src/services/telegram.js` da `import.meta.env` dan tashqarida qat'iy qiymat ko'rinardi) — brauzerda oshkor bo'lardi | ✅ `.env` ga ko'chirildi, `.gitignore` ga `.env*` qo'shildi, `.env.example` bo'sh qiymatlar bilan |
| C2 | Foydalanuvchi bot tokenini chatda yuborgan | ⚠️ **BotFather orqali `/revoke` qilib yangi token oling.** Eski token o'lik, deb hisoblang |
| C3 | Proxy `Access-Control-Allow-Origin: *` + autentifikatsiyasiz + so'rovchi bergan `chatId`ni qabul qilardi (tuzilma bozoriga tushsa — begona xabar yuborilishi mumkin) | ✅ `chatId` butunlay olib tashlandi (faqat serverdagi `ADMIN_CHAT_ID`), `PROXY_SECRET` (timing-safe), origin allowlist, IP rate-limit (20/min), 8 KB body limit, `127.0.0.1` binding |
| C4 | To'lov hisobotida `require_helper()` — undefined chaqiruv, tugma ishlamaydi, build'da sezilmaydi | ✅ `exportCSV` to'g'ridan-to'g'ri import qilindi |
| C5 | `FileBarChart3` lucide-react'da yo'q → butun build buzilgan | ✅ `FileText` bilan almashtirildi, build o'tdi |

## 2. Yuqori (High) — yopildi

| # | Muammo | Holat |
|---|--------|-------|
| H1 | "Tahrirlash" tugmalari toast("tez orada") — ishlamaydi | ✅ `ClientDetails`, `Team` (add/edit), `Clients` (edit) — haqiqiy modallar |
| H2 | "Ko'rish" (document preview) va "Yuklab olish" — stub | ✅ `Documents` da rasm `img`, PDF `iframe`, boshqa formatda yuklab olish + metadata ko'rsatish |
| H3 | Profil rasmi, tarif/billing — stub | ✅ `FileReader` bilan avatar persistensiya; tarifni almashtirish `lawcrm_plan` da saqlanadi + modal |
| H4 | Xabar yuborishda fayl biriktirish, qo'ng'iroq — stub | ✅ Fayl xabarga ilova qilinadi; audio/video qo'ng'iroq oynasi (simulyatsiya, taymer bilan) |
| H5 | "Eksport" tugmalari faqat xabar berardi | ✅ `Analytics` (daromad), `Payments`, `Clients` — haqiqiy CSV; `Payments` — invoice HTML fayl |
| H6 | To'lov moduli import qilmasdan `uid` ishlatardi | ✅ import tuzatildi, invoice yuklab olish qo'shildi |
| H7 | Yangi modullar bo'ylab markazlashmagan `audit()` yo'q edi | ✅ `Cases`, `Calendar`, `Team`, `Settings`, `Documents`, `Clients` — kritik amallar `auditLog` ga yoziladi |
| H8 | Kamaytirilgan ruxsat: hech qanday role/permission tekshiruvi | ⚠️ UI qatlamasi `Roles` sahifasi qo'shildi, lekin **server-side enforcement yo'q** — bu backend vazifasi |
| H9 | "Mijoz portali" fayl yuklash va so'rov yuborish stub edi | ✅ Fayl mijozga bog'lanadi (`clientId`) + audit + Telegram bildirishnoma; portal so'rovi `pushNotif` orqali yuristga tushadi |
| H10 | `system` mavzu tugmasi sizgan holda hech narsa qilmasdi | ✅ `prefers-color-scheme` ga ulanadi, o'zgarishda `matchMedia` event bilan real vaqtda yangilanadi |

## 3. O'rtacha (Medium)

| # | Muammo | Holat |
|---|--------|-------|
| M1 | Bitta til (UZ) — RU/TR yo'q | ✅ `src/i18n.jsx` (UZ/RU/TR) + Header selectori + navigatsiya, sahifa sarlavhalari, umumiy amallar tarjima qilindi. ⚠️ Modal ichidagi uzun matnlar (Forms) va ma'lumotlar (kategoriya/status nomlari) ba'zi joylarda UZ da qolgan — to'liq tarjima keyingi bosqich |
| M2 | Dark mode chuqur emas | ✅ `.td` matn rangi, Recharts o'q matnlari, tooltip, scrollbar, skeleton; barcha modullarda `dark:` variantlari tekshirildi |
| M3 | Bundle 500 kB+ (1 bo'lak) | ✅ `manualChunks`: charts 405 KB / index 213 KB / react 160 KB / motion 113 KB / icons 31 KB — ogohlantirish yo'qoldi |
| M4 | Yetishmayotgan modul(lar) | ✅ 13 ta yangi sahifa: Tasks, Leads, Contracts, Expenses, Reports, Notifications, Roles, AuditLog, Backup, AI Assistant, Client Portal, E-imzo, Workflow |
| M5 | AI assistant "quruq" edi | ✅ CRM ma'lumotlari (mijoz/ish/to'lov/ubrashuv) bo'yicha **faqat haqiqiy javob** beradi, skills/memory/cron/Telegram sozlamalari. ⚠️ Bu **rule-based**, LLM emas — haqiqiy model uchun server API kerak |
| M6 | "Yurist agent" tashqi tizimda | ⚠️ `docs/HERMES_SETUP.md` — qo'lda bajarish kerak (dashboard brauzeri/akkounti yo'q). Ichki ekvivalent tayyor |
| M7 | Global search yangi modullarni qamrab olmagan | ✅ `CommandPalette` — vazifa va murojaatlar ham qidiriladi (Ctrl+K) |
| M8 | Recharts `w-5.5` noto'g'ri utility-class | ✅ `h-5` bilan tuzatildi |
| M9 | `npm audit`: 4 zaiflik (3 moderate, 1 high) | ⚠️ Barchasi **dev-server** doirasida: `vite<=4.x` path traversal, `esbuild<=0.24.2` dev-server CORS, `react-router` open-redirect (SSR hydration). Fix `vite@8` / `react-router-dom@7.18.4` — **breaking**. Bu SPA'da ishlatilmaydi, shuning uchun qabul qilindi; upgrade alohida reja bo'lsin |
| M10 | Testlar yo'q (unit/E2E/lint/typecheck) | ⚠️ Faqat `npm run build` + dev-server smoke test (HTTP 200). Vitest/Playwright qo'shilmagan |
| M11 | `t()` kalitlari tekshiruvi | ✅ Avtomatik tekshiruv: 131 kalit, 3 tilda — **barcha `t('…')` chaqiruvlari mavjud** (skript bilan tekshirilgan) |

## 4. Past (Low)

- Git repositoriyasi mavjud emas / `git` binary topilmadi — versiya nazorati yo'q. Git o'rnatib, `git init` qilish tavsiya etiladi.
- Production backend (auth, DB, S3, audit immutability) yo'q.
- `Backup` sahifasi `lastBackup` ni localStorage da tutadi, haqiqiy fayl yuklamaydi.
- `Workflow` va `ESign` — lokal simulyatsiya, realelektron imzo (O'zbekiston Yagona O'zaro Aloqasi/KPU) integratsiyasi yo'q.
- `ClientPortal` — umumiy havola orqali ochiladigan demo; haqiqiy token-asosli sessiya kerak.
---

## 5. Tekshiruv natijasi

```
npm run build   → ✓ built in 19.20s   (chiqish: charts 405 / index 213 / react 160 / motion 113 / icons 31 KB)
npm audit       → 4 zaiflik (3 moderate, 1 high) — barchasi dev-server doirasida
node --check server/telegram-proxy.mjs → syntax OK
npm run dev     → http://localhost:5173/ → 200

Telegram proxy (test, dummy token bilan):
  GET  /api/health              → 200 {"ok":true,"secretRequired":true}
  POST /api/notify (secret'siz) → 401  ← autentifikatsiya ishlayapti
  POST /api/notify (secret bilan) → 400 ← Telegram API chaqirildi (dummy token, kutilgan)

i18n: 131 kalit × 3 til — barcha t('…') chaqiruvlari mavjud (avtomatik tekshiruv)
```

## 6. Keyingi bosqich (backend)

1. **Auth/tenant**: JWT + refresh, rol (admin/manager/lawyer/assistant), server-side permission tekshiruvi.
2. **DB**: Postgres + Prisma; `tenant_id` har jadvalda, RLS.
3. **Fayllar**: S3/MinIO (signed URL), virus skanerlash.
4. **Audit**: append-only jadval, hash zanjiri, export.
5. **Telegram**: o'z API orqali chaqirish (frontend'dan `VITE_TELEGRAM_PROXY_KEY` olib tashlash).
6. **AI**: server-side LLM chaqiruvi, retrieval mijoz/ish ma'lumotlari bo'yicha, audit log'ga yozib borish.
7. **Test**: Vitest (store/logika) + Playwright (asosiy oqimlar).
8. **CI/CD**: `npm run build` + `npm audit --omit=dev` gate; Vite 8 / React Router 7 upgrade rejasi.
