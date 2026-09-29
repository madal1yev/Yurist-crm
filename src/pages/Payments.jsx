import { useMemo, useState } from 'react'
import { Search, Plus, Download, Eye, Trash2, Wallet, Hourglass, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Badge, Modal, Field, Empty, Confirm } from '../components/ui/kit'
import { fmtMoney, fmtDate, downloadFile, exportCSV } from '../utils/format'

export default function Payments() {
  const { payments, setPayments, clients, cases, toast, pushNotif, audit } = useStore()
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Barchasi')
  const [modal, setModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ clientId: '', caseId: '', amount: '', method: 'Bank o‘tkazma', status: 'Kutilmoqda', due: '' })

  const cname = (id) => clients.find((c) => c.id === id)?.name || '—'
  const filtered = useMemo(() => payments.filter((p) =>
    (p.id + ' ' + cname(p.clientId)).toLowerCase().includes(q.toLowerCase()) &&
    (status === 'Barchasi' || p.status === status)), [payments, q, status])

  const paid = payments.filter((p) => p.status === 'To‘langan').reduce((a, p) => a + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'Kutilmoqda').reduce((a, p) => a + p.amount, 0)
  const overdue = payments.filter((p) => p.status === 'Kechikkan').reduce((a, p) => a + p.amount, 0)

  const save = () => {
    if (!form.clientId || !form.amount) { toast('Mijoz va summa shart', 'error'); return }
    setPayments((p) => [{ id: `INV-${Math.floor(Math.random() * 9000) + 1000}`, date: form.status === 'To‘langan' ? new Date().toISOString().slice(0, 10) : null, ...form, amount: Number(form.amount) }, ...p])
    pushNotif({ type: 'payment', title: 'Yangi hisob yaratildi', text: `${fmtMoney(Number(form.amount))} — ${cname(form.clientId)}` })
    toast('Hisob yaratildi')
    setModal(false)
  }

  const markPaid = (p) => {
    setPayments((all) => all.map((x) => x.id === p.id ? { ...x, status: 'To‘langan', date: new Date().toISOString().slice(0, 10) } : x))
    audit('To‘lov qabul qilindi', `${p.id} — ${fmtMoney(p.amount)}`)
    toast('To‘lov qabul qilindi')
    setDetail(null)
  }

  const exportCSVrows = () => {
    if (!filtered.length) return false
    return exportCSV('tolovlar.csv', filtered.map((p) => ({ invoice: p.id, mijoz: cname(p.clientId), ish: p.caseId, summa: p.amount, usul: p.method, status: p.status })))
  }

  const downloadInvoice = (p) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${p.id}</title></head><body style="font-family:sans-serif;max-width:560px;margin:40px auto">` +
      `<h1>INVOICE ${p.id}</h1><p><b>LawCRM — Adolat Yuridik MCHJ</b></p><hr>` +
      `<p>Mijoz: <b>${cname(p.clientId)}</b><br>Ish: ${p.caseId}<br>Usul: ${p.method}<br>Muddat: ${fmtDate(p.due)}<br>Holati: ${p.status}</p>` +
      `<h2>${fmtMoney(p.amount)}</h2><hr><p style="color:#888">Chop etish: Ctrl+P → PDF sifatida saqlash</p></body></html>`
    downloadFile(`${p.id}.html`, html)
    audit('Invoice yuklab olindi', p.id)
    toast('Invoice yuklab olindi — chop etishda PDF saqlang')
  }

  const cards = [
    { l: 'Jami tushum', v: paid, icon: Wallet, c: 'bg-emerald-500' },
    { l: 'Kutilayotgan', v: pending, icon: Hourglass, c: 'bg-amber-500' },
    { l: 'To‘langan', v: payments.filter((p) => p.status === 'To‘langan').length + ' ta', icon: CheckCircle2, c: 'bg-blue-500' },
    { l: 'Qarzdorlik', v: overdue, icon: AlertTriangle, c: 'bg-red-500' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.payments.t')}</h1><p className="text-sm text-slate-500">{t('pg.payments.s')}</p></div>
        <div className="flex-1" />
        <button className="btn-ghost" onClick={() => {
          const ok = exportCSVrows()
          toast(ok ? 'Hisobot yuklab olindi' : 'Ma’lumot yo‘q', ok ? 'success' : 'error')
        }}><Download size={16} /> Hisobot</button>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={17} /> {t('btn.newInvoice')}</button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-hover p-4 sm:p-5">
            <div className={`w-10 h-10 rounded-2xl ${c.c} text-white flex items-center justify-center`}><c.icon size={19} /></div>
            <p className="text-xs font-medium text-slate-500 mt-2.5">{c.l}</p>
            <p className="font-display text-lg sm:text-xl font-extrabold dark:text-white">{typeof c.v === 'number' ? fmtMoney(c.v) : c.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-10" placeholder="Invoice ID yoki mijoz qidirish…" /></div>
          <div className="flex gap-2">{['Barchasi', 'To‘langan', 'Kutilmoqda', 'Kechikkan'].map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${status === s ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s}</button>
          ))}</div>
        </div>
        <div className="mt-3 overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[820px]">
            <thead><tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th className="th">Invoice</th><th className="th">Mijoz</th><th className="th">Case</th><th className="th">Summa</th><th className="th">Usul</th><th className="th">Status</th><th className="th">Sana</th><th className="th text-right">Amal</th>
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-brand-50/40 transition">
                  <td className="td font-mono text-xs font-bold text-brand-600">{p.id}</td>
                  <td className="td font-bold dark:text-white">{cname(p.clientId)}</td>
                  <td className="td text-slate-500 text-xs">{p.caseId}</td>
                  <td className="td font-extrabold dark:text-white">{fmtMoney(p.amount)}</td>
                  <td className="td text-slate-500">{p.method}</td>
                  <td className="td"><Badge value={p.status} /></td>
                  <td className="td text-slate-500">{p.date ? fmtDate(p.date) : fmtDate(p.due)}</td>
                  <td className="td"><div className="flex justify-end gap-1">
                    <button onClick={() => setDetail(p)} className="p-2 rounded-lg hover:bg-brand-100 hover:text-brand-700 text-slate-400"><Eye size={16} /></button>
                    <button onClick={() => setDel(p)} className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 text-slate-400"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty icon={<Wallet size={24} />} title="To‘lov topilmadi" text="Yangi hisob yarating." />}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Yangi hisob yaratish" subtitle="Invoice avtomatik generatsiya qilinadi">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mijoz *"><select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}><option value="">Tanlang…</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="Ish"><select className="input" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}><option value="">—</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Summa *"><input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="10000000" /></Field>
            <Field label="Usul"><select className="input" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>{['Bank o‘tkazma', 'Naqd', 'Click', 'Payme'].map((m) => <option key={m}>{m}</option>)}</select></Field>
            <Field label="Status"><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Kutilmoqda', 'To‘langan', 'Kechikkan'].map((s) => <option key={s}>{s}</option>)}</select></Field>
          </div>
          <Field label="Muddat"><input type="date" className="input" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></Field>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>Bekor</button><button className="btn-primary" onClick={save}>Yaratish</button></div>
        </div>
      </Modal>

      {/* invoice detail */}
      <AnimatePresence>
        {detail && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDetail(null)} />
            <motion.div initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-pop overflow-hidden">
              <div className="bg-gradient-to-br from-brand-700 to-indigo-700 text-white p-6">
                <div className="flex items-start justify-between"><div><p className="text-xs text-blue-200 font-bold">INVOICE</p><h3 className="font-display text-xl font-extrabold">{detail.id}</h3></div>
                <button onClick={() => setDetail(null)} className="p-2 rounded-xl bg-white/15 hover:bg-white/25"><X size={16} /></button></div>
                <p className="text-3xl font-extrabold mt-3 font-display">{fmtMoney(detail.amount)}</p>
                <div className="mt-1"><Badge value={detail.status} /></div>
              </div>
              <div className="p-6 space-y-2.5 text-sm">
                {[['Mijoz', cname(detail.clientId)], ['Ish', detail.caseId], ['Usul', detail.method], ['Yaratilgan', fmtDate(detail.due)], ['To‘langan', detail.date ? fmtDate(detail.date) : '—']].map(([l, v]) => (
                  <div key={l} className="flex justify-between"><span className="text-slate-400">{l}</span><b className="dark:text-white">{v}</b></div>
                ))}
                <div className="flex gap-2.5 pt-3">
                  {detail.status !== 'To‘langan' && <button className="btn-primary flex-1" onClick={() => markPaid(detail)}>To‘lovni qabul qilish</button>}
                  <button className="btn-ghost flex-1" onClick={() => downloadInvoice(detail)}><Download size={15} /> PDF</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Confirm open={!!del} onClose={() => setDel(null)} title="Hisobni o‘chirish" text={del?.id} onConfirm={() => { setPayments((p) => p.filter((x) => x.id !== del.id)); toast('Hisob o‘chirildi', 'info') }} />
    </div>
  )
}
