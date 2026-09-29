import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, Pencil, FileText, CreditCard, Scale, Activity, Plus } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { Badge, Modal, Field } from '../components/ui/kit'
import { initials, avatarColor, fmtMoney, fmtDate } from '../utils/format'

export default function ClientDetails() {
  const { id } = useParams()
  const { clients, setClients, cases, payments, docs, toast, audit } = useStore()
  const [tab, setTab] = useState('ishlar')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState(['Birinchi konsultatsiya o‘tkazildi. Mijoz hujjatlarni taqdim etdi.', 'Shartnoma loyihasi mijozga yuborildi.'])
  const [edit, setEdit] = useState(null)
  const navigate = useNavigate()
  const c = clients.find((x) => x.id === id)

  if (!c) return <div className="card p-10 text-center"><p className="font-bold">Mijoz topilmadi</p><Link to="/clients" className="text-brand-600 font-bold text-sm">← Orqaga</Link></div>

  const myCases = cases.filter((k) => k.clientId === id)
  const myPays = payments.filter((p) => p.clientId === id)
  const myDocs = docs.filter((d) => d.clientId === id)

  const saveNote = (field, val) => setClients((p) => p.map((x) => x.id === id ? { ...x, [field]: val } : x))

  return (
    <div className="space-y-4">
      <Link to="/clients" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-brand-600"><ArrowLeft size={15} /> Mijozlar ro‘yxati</Link>
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500" />
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <span className={`w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-extrabold ${avatarColor(c.name)}`}>{initials(c.name)}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-[22px] font-extrabold dark:text-white">{c.name}</h1>
              <Badge value={c.status} />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-[13px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {c.phone}</span>
              <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {c.email}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {c.address}</span>
            </div>
            <div className="flex gap-1.5 mt-2.5">{(c.tags || []).map((t) => <span key={t} className="text-[11px] font-bold bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-full">#{t}</span>)}</div>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="btn-ghost !px-3.5"><Phone size={16} /> Qo‘ng‘iroq</a>
            <button className="btn-primary !px-3.5" onClick={() => setEdit({ ...c })}><Pencil size={16} /> Tahrirlash</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {[
            ['Ishlar', myCases.length + ' ta', Scale], ['To‘lovlar', fmtMoney(myPays.reduce((a, p) => a + p.amount, 0)), CreditCard],
            ['Hujjatlar', myDocs.length + ' ta', FileText], ['Mijoz since', fmtDate(c.createdAt), Activity]
          ].map(([l, v, Icon]) => (
            <div key={l} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-brand-600 shadow-sm"><Icon size={16} /></span>
              <span><span className="block text-[11px] font-semibold text-slate-400">{l}</span><span className="block text-sm font-extrabold dark:text-white">{v}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-2">
        <div className="flex gap-1 overflow-x-auto p-2">
          {[['ishlar', 'Ishlar', Scale], ['tolov', 'To‘lovlar', CreditCard], ['hujjat', 'Hujjatlar', FileText], ['notes', 'Qaydlar', Pencil]].map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${tab === k ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <Icon size={15} /> {l}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          {tab === 'ishlar' && (
            <div className="space-y-2.5">
              {myCases.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Hozircha ishlar yo‘q</p>}
              {myCases.map((k) => (
                <Link key={k.id} to={`/cases/${k.id}`} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-300 hover:shadow-card transition">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Scale size={17} /></span>
                  <span className="flex-1 min-w-0"><span className="block text-sm font-bold truncate dark:text-white">{k.title}</span><span className="block text-xs text-slate-400">{k.id} • {k.court}</span></span>
                  <Badge value={k.status} />
                </Link>
              ))}
              <button onClick={() => navigate('/cases')} className="btn-ghost w-full !border-dashed"><Plus size={16} /> Yangi ish ochish</button>
            </div>
          )}
          {tab === 'tolov' && (
            <div className="space-y-2.5">
              {myPays.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="flex-1"><span className="block text-sm font-bold dark:text-white">{p.id} — {fmtMoney(p.amount)}</span><span className="block text-xs text-slate-400">{p.method} • {p.date ? fmtDate(p.date) : 'To‘lanmagan'}</span></span>
                  <Badge value={p.status} />
                </div>
              ))}
              {myPays.length === 0 && <p className="text-sm text-slate-400 text-center py-6">To‘lovlar yo‘q</p>}
            </div>
          )}
          {tab === 'hujjat' && (
            <div className="space-y-2.5">
              {myDocs.map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-extrabold text-xs">{d.type.toUpperCase()}</span>
                  <span className="flex-1 min-w-0"><span className="block text-sm font-bold truncate dark:text-white">{d.name}</span><span className="block text-xs text-slate-400">{d.category} • {d.size}</span></span>
                </div>
              ))}
              {myDocs.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Hujjatlar yo‘q</p>}
            </div>
          )}
          {tab === 'notes' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Yangi qayd yozing…" className="input" />
                <button className="btn-primary shrink-0" onClick={() => { if (!note.trim()) return; setNotes([note, ...notes]); setNote(''); toast('Qayd qo‘shildi') }}>Qo‘shish</button>
              </div>
              {notes.map((n, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">{n}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Mijozni tahrirlash" subtitle={edit?.id}>
        {edit && <div className="space-y-4">
          <Field label="F.I.Sh *"><input className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefon *"><input className="input" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></Field>
            <Field label="Email *"><input className="input" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></Field>
          </div>
          <Field label="Manzil"><input className="input" value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status">
              <select className="input" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                <option>Faol</option><option>Kutmoqda</option><option>Yakunlangan</option><option>Muammo</option>
              </select>
            </Field>
            <Field label="Teglar (vergul bilan)">
              <input className="input" value={(edit.tags || []).join(', ')} onChange={(e) => setEdit({ ...edit, tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
            </Field>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button className="btn-ghost" onClick={() => setEdit(null)}>Bekor qilish</button>
            <button className="btn-primary" onClick={() => {
              if (!edit.name.trim() || !edit.phone.trim() || !edit.email.trim()) return toast('Majburiy maydonlarni to‘ldiring', 'error')
              setClients((p) => p.map((x) => x.id === id ? edit : x))
              audit('Mijoz tahrirlandi', edit.name)
              setEdit(null)
              toast('Mijoz yangilandi')
            }}>Saqlash</button>
          </div>
        </div>}
      </Modal>
    </div>
  )
}
