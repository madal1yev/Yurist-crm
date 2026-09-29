export const fmtMoney = (n) => {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('uz-UZ').format(Number(n)) + " so'm"
}
export const fmtCompact = (n) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' mlrd'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' mln'
  if (n >= 1000) return (n / 1000).toFixed(1) + ' ming'
  return String(n)
}
export const fmtDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
}
export const fmtDateTime = (iso) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
  } catch { return iso }
}
export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '•'

export const avatarColor = (name = '') => {
  const palette = [
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700'
  ]
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997
  return palette[h % palette.length]
}

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`

export function exportCSV(filename, rows) {
  if (!rows.length) return false
  const head = Object.keys(rows[0])
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = '\ufeff' + head.join(';') + '\n' + rows.map((r) => head.map((h) => esc(r[h])).join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  return true
}

export function downloadFile(filename, content, mime = 'text/html') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
