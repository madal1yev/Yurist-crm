import { useMemo, useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, MapPin, Trash2 } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Field, Confirm } from '../components/ui/kit'
import { uid } from '../utils/format'

const typeColor = { 'Uchrashuv': 'bg-blue-500', 'Sud': 'bg-violet-500', 'Deadline': 'bg-red-500', 'Qo‘ng‘iroq': 'bg-emerald-500' }

export default function CalendarPage() {
  const { events, setEvents, clients, cases, toast, audit } = useStore()
  const { t } = useLang()
  const [view, setView] = useState('month')
  const [cursor, setCursor] = useState(new Date(2026, 8, 29))
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ title: '', clientId: '', caseId: '', date: '2026-09-29', start: '10:00', end: '11:00', type: 'Uchrashuv', location: '', notes: '' })

  const y = cursor.getFullYear(), m = cursor.getMonth()
  const firstDay = (new Date(y, m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const evByDay = useMemo(() => {
    const map = {}
    events.forEach((e) => { (map[e.date] = map[e.date] || []).push(e) })
    return map
  }, [events])

  const monthName = cursor.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })

  const save = () => {
    if (form.title.trim().length < 3) { toast('Sarlavha kiriting', 'error'); return }
    setEvents((p) => [...p, { id: uid('ev'), ...form }])
    audit('Tadbir yaratildi', form.title)
    toast('Tadbir yaratildi')
    setModal(false)
  }

  const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.calendar.t')}</h1><p className="text-sm text-slate-500 capitalize">{monthName} • {events.length} ta tadbir</p></div>
        <div className="flex-1" />
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {[['month', 'Oy'], ['week', 'Hafta'], ['day', 'Kun']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition ${view === v ? 'bg-white dark:bg-slate-900 shadow text-brand-700 dark:text-white' : 'text-slate-400'}`}>{l}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={17} /> {t('btn.newEvent')}</button>
      </div>

      <div className="card p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setCursor(new Date(y, m - 1, 1))} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50"><ChevronLeft size={17} /></button>
          <h2 className="font-display font-bold capitalize dark:text-white px-2">{monthName}</h2>
          <button onClick={() => setCursor(new Date(y, m + 1, 1))} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50"><ChevronRight size={17} /></button>
          <button onClick={() => setCursor(new Date(2026, 8, 29))} className="ml-1 text-xs font-bold text-brand-600 hover:underline">Bugun</button>
          <div className="flex-1" />
          <div className="hidden sm:flex gap-3 text-[11.5px] font-bold text-slate-500">
            {Object.entries(typeColor).map(([k, v]) => <span key={k} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${v}`} />{k}</span>)}
          </div>
        </div>

        {(view === 'month') && (
          <div>
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">{weekDays.map((d) => <p key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</p>)}</div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((d, i) => {
                const ds = d ? `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : null
                const evs = ds ? (evByDay[ds] || []) : []
                const isToday = ds === '2026-09-29'
                return (
                  <div key={i} className={`min-h-[76px] sm:min-h-[104px] rounded-2xl border p-1.5 transition ${d ? 'border-slate-100 dark:border-slate-800 hover:border-brand-300 bg-white dark:bg-slate-900' : 'border-transparent'} ${isToday ? '!border-brand-500 ring-2 ring-brand-500/20' : ''}`}>
                    {d && <>
                      <p className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-lg ${isToday ? 'bg-brand-600 text-white' : 'text-slate-500'}`}>{d}</p>
                      <div className="space-y-1 mt-1">
                        {evs.slice(0, 3).map((e) => (
                          <div key={e.id} onClick={() => setDel(e)} title={e.title}
                            className={`text-[10px] sm:text-[10.5px] font-bold text-white rounded-lg px-1.5 py-1 truncate cursor-pointer hover:opacity-80 ${typeColor[e.type] || 'bg-slate-400'}`}>
                            {e.start} {e.title}
                          </div>
                        ))}
                        {evs.length > 3 && <p className="text-[10px] font-bold text-brand-600 pl-1">+{evs.length - 3} ta yana</p>}
                      </div>
                    </>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view !== 'month' && (
          <div className="space-y-2.5">
            {(view === 'day' ? events.filter((e) => e.date === '2026-09-29') : [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8)).map((e) => (
              <div key={e.id} className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-card transition">
                <span className={`w-1.5 self-stretch rounded-full ${typeColor[e.type] || 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white">{e.title}</p>
                  <p className="text-xs text-slate-400 flex flex-wrap gap-x-3 mt-0.5"><span>{e.date} • {e.start}–{e.end}</span>{e.location && <span className="inline-flex items-center gap-1"><MapPin size={11} />{e.location}</span>}</p>
                </div>
                <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-500">{e.type}</span>
                <button onClick={() => setDel(e)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Yangi tadbir" subtitle="Uchrashuv, sud yoki deadline qo‘shing">
        <div className="space-y-4">
          <Field label="Sarlavha *"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Sud majlisi" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Mijoz"><select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}><option value="">—</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="Ish"><select className="input" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}><option value="">—</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Sana"><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Boshlanish"><input type="time" className="input" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
            <Field label="Tugash"><input type="time" className="input" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tur"><select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{Object.keys(typeColor).map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Manzil"><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ofis / Sud / Zoom" /></Field>
          </div>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>Bekor</button><button className="btn-primary" onClick={save}>Saqlash</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title="Tadbirni o‘chirish" text={del?.title} onConfirm={() => { setEvents((p) => p.filter((e) => e.id !== del.id)); toast('Tadbir o‘chirildi', 'info') }} />
    </div>
  )
}
