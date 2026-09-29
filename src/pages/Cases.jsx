import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Trash2, CalendarClock, Flag } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Badge, Empty, Field } from '../components/ui/kit'
import { fmtMoney, fmtDate, uid, initials, avatarColor } from '../utils/format'

export default function Cases() {
  const { cases, setCases, clients, toast, pushNotif, audit } = useStore()
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Barchasi')
  const [view, setView] = useState('table')
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ title: '', clientId: '', lawyer: 'Abdulaziz Yusupov', court: '', deadline: '', status: 'Yangi', priority: 'Medium', amount: '' })

  const filtered = useMemo(() => cases.filter((c) =>
    (c.title + ' ' + c.id).toLowerCase().includes(q.toLowerCase()) &&
    (status === 'Barchasi' || c.status === status)), [cases, q, status])

  const cname = (id) => clients.find((c) => c.id === id)?.name || '—'

  const save = () => {
    if (form.title.trim().length < 4 || !form.clientId) { toast('Ish nomi va mijoz shart!', 'error'); return }
    const nc = { id: `LC-2026-${String(Math.floor(Math.random() * 800) + 100)}`, start: new Date().toISOString().slice(0, 10), description: '', amount: Number(form.amount) || 0, ...form }
    setCases((p) => [nc, ...p])
    audit('Ish ochildi', nc.id)
    pushNotif({ type: 'appointment', title: 'Yangi ish ochildi', text: form.title })
    toast('Yangi ish ochildi')
    setModal(false)
  }

  const statuses = ['Barchasi', 'Yangi', 'Jarayonda', 'Sudda', 'Kutilyapti', 'Yopilgan']

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.cases.t')}</h1>
        <p className="text-sm text-slate-500">{filtered.length} ta ish • {cases.filter((c) => c.priority === 'Urgent').length} ta urgent</p></div>
        <div className="flex-1" />
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {[['table', 'Jadval'], ['cards', 'Kartalar']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition ${view === v ? 'bg-white dark:bg-slate-900 shadow text-brand-700 dark:text-white' : 'text-slate-400'}`}>{l}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={17} /> {t('btn.newCase')}</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-10" placeholder="Ish nomi yoki ID bo‘yicha qidirish…" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statuses.map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${status === s ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>
        </div>

        {view === 'table' ? (
          <div className="mt-3 overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[900px]">
              <thead><tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <th className="th">Case ID</th><th className="th">Ish nomi</th><th className="th">Mijoz</th><th className="th">Status</th><th className="th">Priority</th><th className="th">Deadline</th><th className="th text-right">Amal</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-brand-50/40 dark:hover:bg-slate-800/40 transition">
                    <td className="td font-mono text-xs font-bold text-brand-600">{c.id}</td>
                    <td className="td"><Link to={`/cases/${c.id}`} className="font-bold hover:text-brand-600 dark:text-white block max-w-[260px] truncate">{c.title}</Link><span className="text-[11px] text-slate-400">{c.lawyer}</span></td>
                    <td className="td"><span className="inline-flex items-center gap-2"><span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${avatarColor(cname(c.clientId))}`}>{initials(cname(c.clientId))}</span><span className="font-medium">{cname(c.clientId)}</span></span></td>
                    <td className="td"><Badge value={c.status} /></td>
                    <td className="td"><Badge value={c.priority} /></td>
                    <td className="td text-slate-500 inline-flex items-center gap-1.5"><CalendarClock size={14} /> {fmtDate(c.deadline)}</td>
                    <td className="td text-right"><button onClick={() => setDel(c)} className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 text-slate-400"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <Empty icon={<Flag size={24} />} title="Ish topilmadi" text="Filtrni o‘zgartiring yoki yangi ish oching." />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 mt-4">
            {filtered.map((c) => (
              <Link key={c.id} to={`/cases/${c.id}`} className="card card-hover p-5 block border-t-4" style={{ borderTopColor: c.priority === 'Urgent' ? '#ef4444' : c.priority === 'High' ? '#f97316' : c.priority === 'Medium' ? '#2563eb' : '#cbd5e1' }}>
                <div className="flex items-center gap-2 mb-2"><span className="font-mono text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">{c.id}</span><span className="flex-1" /><Badge value={c.priority} /></div>
                <h3 className="font-bold text-[15px] leading-snug dark:text-white line-clamp-2">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{cname(c.clientId)} • {c.court}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Badge value={c.status} />
                  <span className="text-xs font-bold text-slate-500">{fmtMoney(c.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Yangi ish ochish" subtitle="Case avtomatik ID bilan yaratiladi">
        <div className="space-y-4">
          <Field label="Ish nomi *"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Shartnoma nizosi" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mijoz *">
              <select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                <option value="">Tanlang…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Sud"><input className="input" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} placeholder="Toshkent shahar sudi" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Status"><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Yangi', 'Jarayonda', 'Sudda', 'Kutilyapti', 'Yopilgan'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Priority"><select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{['Low', 'Medium', 'High', 'Urgent'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Deadline"><input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
          </div>
          <Field label="Summa (so‘m)"><input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="50000000" /></Field>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>Bekor</button><button className="btn-primary" onClick={save}>Yaratish</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title="Ishni o‘chirish" text={`${del?.id} o‘chiriladi.`}
        onConfirm={() => { setCases((p) => p.filter((c) => c.id !== del.id)); toast('Ish o‘chirildi', 'info') }} />
    </div>
  )
}
