# Hermes — «Yurist agent» ni tashqi Hermes dashboard'da yaratish bo'yicha yo'riqnoma

> Muhim: Hermes — tashqi platforma. Men uning veb-dashboard'ini bevosita ochib,
> tugma bosib bera olmayman (brauzerim yo'q). Quyida 5 daqiqalik aniq qadamlar
> va LawCRM ichidagi tayyor ekvivalenti tasvirlangan.

## 1. Hermes dashboard'da agent yaratish (qo'lda, ~5 daqiqa)

1. Hermes dashboard'ga kiring → **Agents** → **Create agent**.
2. Nom: `Yurist agent`. Til: `O'zbek`. Model: mavjud eng kuchli chat modeli.
3. **Profile → Create profile**, nomi: `Yurist agent`. Shu profile'ni agentga biriktiring.
4. System prompt sifatida quyidagini qo'ying (LawCRM `AIAssistant` sahifasidagi
   prompt bilan bir xil):
   > Sen LawCRM — yuridik firma CRM'i ichida ishlaydigan «Yurist agent»san.
   > Mijozlar, ishlar, to'lovlar, deadlinelar bo'yicha aniq, qisqa javob ber.
   > Hech qachon uydirma raqam aytma; ma'lumot bo'lmasa «tizimda topilmadi» de.
   > Yakuniy mijozga platforma nomi (LawCRM/Hermes) haqida yozma.
5. **Skills / MCP**: quyidagi skill'larni ulang (nomlar Hermes'dagi nomga moslang):
   - `crm-search` — mijoz/ish/to'lov qidirish (LawCRM global search API)
   - `crm-calendar` — uchrashuv yaratish/o'qish (Google Calendar sync)
   - `telegram-notify` — xodimlarga Telegram xabarnoma (`server/telegram-proxy.mjs`)
   - `doc-generate` — hujjat shablonini to'ldirish (Contracts → Shablonlar)
6. **Memory / Session**: `session_memory = ON`, `long_term_memory = ON`,
   retention 90 kun; mijoz telefon/email bo'yicha xotirani ajratish.
7. **Cron**: har kuni 09:00 — «bugungi deadlinelar va sud majlislari dayjesti»;
   har dushanba 09:00 — «haftalik tushum hisoboti».
8. Telegram: Hermes'dagi Telegram integratsiyasiga `@madaliyevyurist_bot`
   tokenini ulang (tokenni hech qayerda ochiq saqlamang — faqat Hermes
   maxfiy ombori yoki server `.env`'da).

## 2. LawCRM ichidagi tayyor ekvivalent

`AI Legal Assistant` sahifasi (`/ai`) — **«Yurist agent» profili** allaqachon
sozlangan:
- **Skills** tab'ida MCP skillar ro'yxati (yoqish/o'chirish, localStorage'da saqlanadi);
- **Memory** tab'ida sessiya va uzoq muddatli xotira yozuvlari;
- **Cron** tab'ida rejalashtirilgan vazifalar (kunlik dayjest, haftalik hisobot);
- **Telegram** tab'ida bot ulanish statusi va test xabari;
- Chat CRM ma'lumotlari (mijozlar, ishlar, to'lovlar, bugungi uchrashuvlar)
  bo'yicha **real javob** beradi — uydirmaydi.

## 3. Meta (Instagram/Facebook) eslatmasi

App Review topshirish Hermes'dan emas, **Meta Developer Console**'dan
qo'lda qilinadi (biznes verifikatsiya + screencast). Bu loyiha doirasida
faqat reja va permissionlar ro'yxati berilgan — yuborishni biznes egasi
tasdiqlaydi. Test rejimida pilot akkauntlar (admin/developer/tester rollari)
bilan ishlanadi.
