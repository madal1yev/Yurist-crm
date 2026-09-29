// Telegram integratsiyasi — token faqat ENV'dan olinadi, kodga yozilmaydi.
// Xavfsizlik: brauzerda tokenni ishlatish uni oshkor qiladi.
// Production'da server/telegram-proxy.mjs (backend) orqali yuboring.

const token = () => (import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '').trim()
const adminChat = () => (import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID || '').trim()
const useDirect = () => (import.meta.env.VITE_TELEGRAM_DIRECT || '0') === '1'
const proxyUrl = () => (import.meta.env.VITE_TELEGRAM_PROXY_URL || '').trim()
const proxyKey = () => (import.meta.env.VITE_TELEGRAM_PROXY_KEY || '').trim()

export const telegramConfigured = () => Boolean(token() && adminChat())

export async function sendTelegram(text, _chatId) {
  const to = adminChat()
  if (!token() || !to) throw new Error('Telegram sozlanmagan (.env)')
  if (!useDirect() && proxyUrl()) {
    const headers = { 'Content-Type': 'application/json' }
    if (proxyKey()) headers['x-proxy-secret'] = proxyKey()
    const r = await fetch(proxyUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, nonce: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` })
    })
    if (!r.ok) throw new Error('Proxy xatosi: ' + r.status)
    return true
  }
  if (!useDirect()) throw new Error('Direct yuborish o‘chiq — proxy yoki VITE_TELEGRAM_DIRECT=1 kerak')
  const r = await fetch(`https://api.telegram.org/bot${token()}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: to, text, parse_mode: 'HTML' })
  })
  const j = await r.json().catch(() => ({}))
  if (!j.ok) throw new Error(j.description || 'Telegram xatosi')
  return true
}

export async function checkTelegram() {
  if (!token()) return { ok: false, reason: 'Token yo‘q (.env ga VITE_TELEGRAM_BOT_TOKEN yozing)' }
  const r = await fetch(`https://api.telegram.org/bot${token()}/getMe`).then((x) => x.json()).catch(() => ({}))
  if (r.ok) return { ok: true, username: r.result.username }
  return { ok: false, reason: r.description || 'Bot bilan bog‘lanib bo‘lmadi' }
}

// Sayt ichidagi bildirishnoma + (sozlangan bo'lsa) Telegram'ga yuborish.
// Xatolik hech qachon UI'ni buzmaydi — jim log qilinadi.
export async function notifyStaff(text) {
  try {
    if (telegramConfigured() && useDirect()) await sendTelegram(text)
    else if (telegramConfigured() && proxyUrl()) await sendTelegram(text)
  } catch (e) {
    console.warn('[telegram]', e.message)
  }
}
