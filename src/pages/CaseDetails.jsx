import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Scale, FileText, CheckSquare, CreditCard, StickyNote, Activity, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { Badge } from '../components/ui/kit'
import { fmtMoney, fmtDate } from '../utils/format'

const tabs = [['overview', 'Overview', Scale], ['timeline', 'Timeline', Activity], ['docs', 'Hujjatlar', FileText], ['tasks', 'Vazifalar', CheckSquare], ['payments', 'To‘lovlar', CreditCard], ['notes', 'Qaydlar', StickyNote]]

export default function CaseDetails() {
  const { id } = useParams()
  const { cases, clients, payments, docs, toast } = useStore()
  const [tab, setTab] = useState('overview')
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Da’vo ariza loyihasini tayyorlash', done: true },
    { id: 2, text: 'Guvohlar bilan suhbat', done: true },
    { id: 3, text: 'Sudga hujjat topshirish', done: false },
    { id: 4, text: 'Mijoz bilan uchrashuv', done: false }
  ])
  const [nt, setNt] = useState('')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState(['Sudya qo‘shimcha dalil so‘radi — kadastr ma’lumotnomasi kerak.'])

  const k = cases.find((x) => x.id === id)
  if (!k) return <div className="card p-10 text-center"><p className="font-bold">Ish topilmadi</p><Link to="/cases" className="text-brand-600 text-sm font-bold">← Orqaga</Link></div>
  const cname = clients.find((c) => c.id === k.clientId)?.name || '—'
  const myPays = payments.filter((p) => p.caseId === id)
  const myDocs = docs.filter((d) => d.caseId === id)

  const timeline = [
    { d: k.start, t: 'Ish ochildi', s: 'Mijoz murojaati qabul qilindi' },
    { d: k.start, t: 'Shartnoma imzolandi', s: 'Yuridik xizmat shartnomasi' },
    { d: '2026-09-12', t: 'Da’vo ariza tayyorlandi', s: 'Sudga topshirishga tayyor' },
    { d: '2026-09-20', t: 'Sud majlisi belgilandi', s: k.court }
  ]

  return (
    <div className="space-y-4">
      <Link to="/cases" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-brand-600"><ArrowLeft size={15} /> Ishlar ro‘yxati</Link>
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">{k.id}</span>
          <Badge value={k.status} /><Badge value={k.priority} />
        </div>
        <h1 className="font-display text-[22px] font-extrabold mt-2 dark:text-white">{k.title}</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">{k.description || 'Tavsif kiritilmagan.'}</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {[['Mijoz', cname], ['Yurist', k.lawyer], ['Sud', k.court], ['Boshlangan', fmtDate(k.start)], ['Deadline', fmtDate(k.deadline)]].map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3"><p className="text-[11px] font-semibold text-slate-400">{l}</p><p className="text-[13px] font-bold dark:text-white truncate">{v}</p></div>
          ))}
        </div>
      </div>
      <div className="card p-2">
        <div className="flex gap-1 overflow-x-auto p-2">
          {tabs.map(([k2, l, Icon]) => (
            <button key={k2} onClick={() => setTab(k2)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${tab === k2 ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Icon size={15} /> {l}</button>
          ))}
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800">
          {tab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4"><h4 className="font-bold text-sm mb-2 dark:text-white">Ish tafsilotlari</h4>
                <div className="space-y-2 text-[13px]"><p><span className="text-slate-400">Summa: </span><b>{fmtMoney(k.amount)}</b></p><p><span className="text-slate-400">Status: </span><Badge value={k.status} /></p><p><span className="text-slate-400">Priority: </span><Badge value={k.priority} /></p></div></div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4"><h4 className="font-bold text-sm mb-2 dark:text-white">Progress</h4>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-500" /></div>
                <p className="text-xs text-slate-400 mt-2 font-semibold">65% bajarildi • {tasks.filter((t) => t.done).length}/{tasks.length} vazifa</p></div>
            </div>
          )}
          {tab === 'timeline' && (
            <div className="relative pl-6 space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {timeline.map((t, i) => (
                <div key={i} className="relative"><span className="absolute -left-6 top-1 w-[15px] h-[15px] rounded-full bg-brand-600 ring-4 ring-brand-100" />
                  <p className="text-sm font-bold dark:text-white">{t.t}</p><p className="text-xs text-slate-400">{t.s} • {fmtDate(t.d)}</p></div>
              ))}
            </div>
          )}
          {tab === 'docs' && (
            <div className="space-y-2.5">{myDocs.map((d) => <div key={d.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800"><span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xs font-extrabold">{d.type.toUpperCase()}</span><span className="flex-1 text-sm font-bold truncate dark:text-white">{d.name}</span><span className="text-xs text-slate-400">{d.size}</span></div>)}
              {myDocs.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Hujjat yo‘q</p>}</div>
          )}
          {tab === 'tasks' && (
            <div className="space-y-2.5">
              <div className="flex gap-2"><input value={nt} onChange={(e) => setNt(e.target.value)} className="input" placeholder="Yangi vazifa…" /><button className="btn-primary shrink-0" onClick={() => { if (!nt.trim()) return; setTasks([...tasks, { id: Date.now(), text: nt, done: false }]); setNt(''); toast('Vazifa qo‘shildi') }}><Plus size={16} /></button></div>
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                  <button onClick={() => setTasks(tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${t.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>{t.done && '✓'}</button>
                  <span className={`flex-1 text-sm font-medium ${t.done ? 'line-through text-slate-400' : 'dark:text-white'}`}>{t.text}</span>
                  <button onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}
          {tab === 'payments' && (
            <div className="space-y-2.5">{myPays.map((p) => <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50"><span className="flex-1 text-sm font-bold dark:text-white">{p.id} — {fmtMoney(p.amount)}</span><Badge value={p.status} /></div>)}
              {myPays.length === 0 && <p className="text-sm text-slate-400 text-center py-6">To‘lov yo‘q</p>}</div>
          )}
          {tab === 'notes' && (
            <div className="space-y-3"><div className="flex gap-2"><input value={note} onChange={(e) => setNote(e.target.value)} className="input" placeholder="Qayd yozing…" /><button className="btn-primary shrink-0" onClick={() => { if (!note.trim()) return; setNotes([note, ...notes]); setNote(''); toast('Qayd saqlandi') }}>Saqlash</button></div>
              {notes.map((n, i) => <div key={i} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-sm">{n}</div>)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
