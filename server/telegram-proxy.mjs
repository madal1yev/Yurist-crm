// Telegram notifikasiya proxy'si — bot tokenini brauzerga chiqarmaslik uchun.
//
// Ishga tushirish (PowerShell):
//   $env:BOT_TOKEN="<botfather token>"; $env:ADMIN_CHAT_ID="<chat id>"; $env:PROXY_SECRET="<uzun tasodifiy satr>"; node server/telegram-proxy.mjs
// CRM .env:
//   VITE_TELEGRAM_PROXY_URL=http://127.0.0.1:8787/api/notify
//   VITE_TELEGRAM_PROXY_KEY=<bir xil PROXY_SECRET>   (faqat dev/proxy-mode uchun)
//
// Xavfsizlik qoidalari:
//  * chatId har doim serverdagi ADMIN_CHAT_ID — mijoz so'rovdan chat id yubora olmaydi.
//  * PROXY_SECRET production'da majburiy (NODE_ENV=production bo'lsa serversiz to'xtaydi).
//  * CORS ochiq '*' emas, faqat ALLOWED_ORIGIN.
//  * So'rov hajmi cheklangan, IP bo'yicha rate-limit bor.
// Qo'shimcha dependency yo'q — faqat Node.
import http from 'node:http'
import { timingSafeEqual, randomBytes } from 'node:crypto'

const BOT = (process.env.BOT_TOKEN || '').trim()
const PORT = Number(process.env.PORT || 8787)
const HOST = (process.env.HOST || '127.0.0.1').trim()
const ADMIN_CHAT_ID = (process.env.ADMIN_CHAT_ID || '').trim()
const SECRET = (process.env.PROXY_SECRET || '').trim()
const RATE_LIMIT = Number(process.env.RATE_LIMIT || 20) // daqiqada
const BODY_LIMIT = 8192
const IS_PROD = process.env.NODE_ENV === 'production'
const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173').trim()

const fail = (msg) => { console.error(`[telegram-proxy] ${msg}`); process.exit(1) }
if (!BOT) fail('BOT_TOKEN env kerak.')
if (!ADMIN_CHAT_ID) fail('ADMIN_CHAT_ID env kerak (bot bilan yozgan chat id).')
if (IS_PROD && SECRET.length < 24) fail('PROXY_SECRET kamida 24 ta belgi bo‘lishi kerak (production).')
if (!SECRET) console.warn('[telegram-proxy] PROXY_SECRET yo‘q — faqat lokal ishlash uchun. Production’da yo‘q bo‘lishi xavfsiz emas.')

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const safeEqual = (a, b) => {
  const ba = Buffer.from(String(a)); const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

const hits = new Map()
setInterval(() => {
  const now = Date.now()
  for (const [ip, v] of hits) if (now - v.start > 60_000) hits.delete(ip)
}, 30_000).unref()

const json = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' })
  res.end(JSON.stringify(obj))
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin
  if (origin && origin !== ALLOWED_ORIGIN) return json(res, 403, { ok: false, error: 'origin taqiqlangan' })
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-proxy-secret')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.method === 'GET' && req.url === '/api/health') return json(res, 200, { ok: true, chatConfigured: true, secretRequired: Boolean(SECRET) })

  if (req.method !== 'POST' || req.url !== '/api/notify') return json(res, 404, { ok: false, error: 'not found' })

  const ip = req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const rec = hits.get(ip) || { start: now, count: 0 }
  if (now - rec.start > 60_000) { rec.start = now; rec.count = 0 }
  rec.count += 1
  hits.set(ip, rec)
  if (rec.count > RATE_LIMIT) return json(res, 429, { ok: false, error: 'rate limit' })

  if (SECRET && !safeEqual(req.headers['x-proxy-secret'] || '', SECRET)) return json(res, 401, { ok: false, error: 'unauthorized' })

  let body = ''
  let over = false
  for await (const chunk of req) {
    body += chunk
    if (body.length > BODY_LIMIT) { over = true; break }
  }
  if (over) return json(res, 413, { ok: false, error: 'body too large' })

  try {
    const { text, nonce } = JSON.parse(body || '{}')
    if (!text) throw new Error('text shart')
    const idem = nonce ? String(nonce).slice(0, 64) : randomBytes(6).toString('hex')
    const tg = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: escapeHtml(String(text)).slice(0, 4000),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    }).then((r) => r.json())
    if (!tg.ok) throw new Error(tg.description || 'telegram error')
    json(res, 200, { ok: true, messageId: tg.result?.message_id, nonce: idem })
  } catch (e) {
    json(res, 400, { ok: false, error: e.message })
  }
})

server.listen(PORT, HOST, () => console.log(`[telegram-proxy] http://${HOST}:${PORT}/api/notify`))
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { server.close(() => process.exit(0)) })
